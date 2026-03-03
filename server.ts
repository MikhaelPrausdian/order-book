import express from "express";
import { createServer as createViteServer } from "vite";
import mysql from "mysql2/promise";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mysqlPool: any = null;

async function initDb() {
  mysqlPool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'order_book',
    port: parseInt(process.env.DB_PORT || '3306'),
    connectTimeout: 10000,
    waitForConnections: true,
    connectionLimit: 10
  });

  // Test connection
  const conn = await mysqlPool.getConnection();
  conn.release();
  console.log("✅ Connected to MySQL Database:", process.env.DB_NAME || 'order_book');

  const queries = [
    `CREATE TABLE IF NOT EXISTS products (
      id INT PRIMARY KEY AUTO_INCREMENT,
      title VARCHAR(255) NOT NULL,
      isbn VARCHAR(50) UNIQUE NOT NULL,
      publisher VARCHAR(255) NOT NULL,
      level VARCHAR(50) NOT NULL,
      price INT NOT NULL,
      image_url TEXT,
      description TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS orders (
      id VARCHAR(50) PRIMARY KEY,
      school_name VARCHAR(255) NOT NULL,
      pic_name VARCHAR(255) NOT NULL,
      position VARCHAR(255),
      whatsapp VARCHAR(50) NOT NULL,
      email VARCHAR(255) NOT NULL,
      total_books INT NOT NULL,
      total_revenue INT NOT NULL,
      status VARCHAR(50) DEFAULT 'Receiving',
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS order_items (
      id INT PRIMARY KEY AUTO_INCREMENT,
      order_id VARCHAR(50) NOT NULL,
      product_id INT NOT NULL,
      quantity INT NOT NULL,
      price INT NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    )`,
    `CREATE TABLE IF NOT EXISTS settings (
      \`key\` VARCHAR(50) PRIMARY KEY,
      value TEXT
    )`
  ];

  for (const q of queries) await mysqlPool.query(q);
  try { await mysqlPool.query("ALTER TABLE products ADD COLUMN description TEXT"); } catch (e) {} // Ignore if exists
  await mysqlPool.query("INSERT IGNORE INTO settings (\`key\`, value) VALUES ('header_title', 'Empowering Schools through Quality Literacy Programs.')");

  // Seed initial products
  const [[{ count }]]: any = await mysqlPool.query("SELECT COUNT(*) as count FROM products");
  if (count === 0) {
    const initialProducts = [
      ["Wonder", "978-014-136-544-1", "Penguin UK", "Intermediate", 145000, "https://picsum.photos/seed/wonder/400/600"],
      ["National Geographic Kids: Sharks", "978-142-631-104-2", "National Geographic", "Beginner", 95000, "https://picsum.photos/seed/sharks/400/600"],
      ["Step into Reading: Dinosaur Babies", "978-037-582-200-3", "Step into Reading", "Beginner", 65000, "https://picsum.photos/seed/dino/400/600"],
      ["The Magic School Bus", "978-981-412-345-4", "Scholastic MY", "Intermediate", 110000, "https://picsum.photos/seed/bus/400/600"],
      ["Adventures in Science", "978-981-123-456-5", "World Scientific", "Advanced", 210000, "https://picsum.photos/seed/science/400/600"],
      ["DK Eyewitness: Ancient Egypt", "978-024-134-567-6", "DK UK", "Advanced", 175000, "https://picsum.photos/seed/egypt/400/600"]
    ];
    const insertQ = "INSERT INTO products (title, isbn, publisher, level, price, image_url) VALUES (?, ?, ?, ?, ?, ?)";
    for (const p of initialProducts) await mysqlPool.query(insertQ, p);
  }
}

async function startServer() {
  await initDb();
  
  const app = express();
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Helper to run queries
  const query = async (sql: string, params: any[] = []) => {
    const [results] = await mysqlPool.query(sql, params);
    return results;
  };

  app.get("/api/products", async (req, res) => {
    try {
      const products = await query("SELECT * FROM products");
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.post("/api/orders", async (req, res) => {
    const { schoolInfo, items, totalBooks, totalRevenue } = req.body;
    const orderId = "ORD-" + Math.random().toString(36).substring(2, 11).toUpperCase();

    try {
      const conn = await mysqlPool.getConnection();
      await conn.beginTransaction();
      try {
        await conn.query("INSERT INTO orders (id, school_name, pic_name, position, whatsapp, email, total_books, total_revenue) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", 
          [orderId, schoolInfo.schoolName, schoolInfo.picName, schoolInfo.position, schoolInfo.whatsapp, schoolInfo.email, totalBooks, totalRevenue]);
        for (const item of items) await conn.query("INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)", [orderId, item.id, item.quantity, item.price]);
        await conn.commit();
      } catch (e) { await conn.rollback(); throw e; }
      finally { conn.release(); }

      // Send Email Notification to Admin
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        try {
          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS
            }
          });

          const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Send to the admin's own email
            subject: `Pesanan Baru: ${orderId} dari ${schoolInfo.schoolName}`,
            html: `
              <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                <h2 style="color: #f97316;">Pesanan Baru Masuk!</h2>
                <p>Ada pesanan buku baru yang masuk melalui website.</p>
                
                <table style="width: 100%; max-width: 600px; border-collapse: collapse; margin-top: 20px;">
                  <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Order ID</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${orderId}</td></tr>
                  <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Sekolah</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${schoolInfo.schoolName}</td></tr>
                  <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>PIC</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${schoolInfo.picName} (${schoolInfo.position || 'PIC'})</td></tr>
                  <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>WhatsApp</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${schoolInfo.whatsapp}</td></tr>
                  <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Email Pemesan</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${schoolInfo.email}</td></tr>
                  <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Total Buku</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${totalBooks} buku</td></tr>
                  <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Total Harga</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; color: #f97316;">Rp ${totalRevenue.toLocaleString('id-ID')}</td></tr>
                </table>
                
                <p style="margin-top: 30px;">Silakan login ke Admin Panel di website untuk melihat detail pesanan dan mencetak invoice.</p>
              </div>
            `
          };

          // Send email asynchronously so it doesn't block the response
          transporter.sendMail(mailOptions).catch(err => console.error("Failed to send email notification:", err));
        } catch (emailErr) {
          console.error("Email configuration error:", emailErr);
        }
      }

      res.json({ success: true, orderId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  app.get("/api/admin/stats", async (req, res) => {
    try {
      const orderCount: any = await query("SELECT COUNT(*) as count FROM orders");
      const revenueSum: any = await query("SELECT SUM(total_revenue) as sum FROM orders");
      const productCount: any = await query("SELECT COUNT(*) as count FROM products");
      const recentOrders: any = await query("SELECT * FROM orders ORDER BY created_at DESC LIMIT 5");

      res.json({
        totalOrders: orderCount[0].count,
        totalRevenue: revenueSum[0].sum || 0,
        activeProducts: productCount[0].count,
        recentOrders
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  app.get("/api/admin/orders", async (req, res) => {
    try {
      const orders: any = await query("SELECT * FROM orders ORDER BY created_at DESC");
      for (let order of orders) {
        const items: any = await query(`
          SELECT oi.quantity, oi.price, p.title, p.isbn 
          FROM order_items oi 
          JOIN products p ON oi.product_id = p.id 
          WHERE oi.order_id = ?
        `, [order.id]);
        order.items = items;
      }
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  app.patch("/api/admin/orders/:id", async (req, res) => {
    const { id } = req.params;
    const { status, notes } = req.body;
    try {
      if (status !== undefined && notes !== undefined) await query("UPDATE orders SET status = ?, notes = ? WHERE id = ?", [status, notes, id]);
      else if (status !== undefined) await query("UPDATE orders SET status = ? WHERE id = ?", [status, id]);
      else if (notes !== undefined) await query("UPDATE orders SET notes = ? WHERE id = ?", [notes, id]);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to update order" });
    }
  });

  app.get("/api/admin/products", async (req, res) => {
    try {
      const products = await query("SELECT * FROM products");
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.patch("/api/admin/products/:id", async (req, res) => {
    const { id } = req.params;
    const { title, isbn, publisher, level, price, image_url, description } = req.body;
    try {
      await query("UPDATE products SET title = ?, isbn = ?, publisher = ?, level = ?, price = ?, image_url = ?, description = ? WHERE id = ?", [title, isbn, publisher, level, price, image_url, description, id]);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: "ISBN must be unique" });
    }
  });

  app.post("/api/admin/products", async (req, res) => {
    const { title, isbn, publisher, level, price, image_url, description } = req.body;
    try {
      await query("INSERT INTO products (title, isbn, publisher, level, price, image_url, description) VALUES (?, ?, ?, ?, ?, ?, ?)", 
        [title, isbn, publisher, level, price, image_url || '', description]);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: "ISBN must be unique" });
    }
  });

  app.post("/api/admin/products/bulk", async (req, res) => {
    const { products } = req.body;
    if (!Array.isArray(products)) return res.status(400).json({ error: "Invalid data format" });

    try {
      const conn = await mysqlPool.getConnection();
      await conn.beginTransaction();
      try {
        const queryStr = `
          INSERT INTO products (title, isbn, publisher, level, price, image_url) 
          VALUES (?, ?, ?, ?, ?, ?) 
          ON DUPLICATE KEY UPDATE 
          title=VALUES(title), publisher=VALUES(publisher), level=VALUES(level), price=VALUES(price)
        `;
        for (const p of products) {
          await conn.query(queryStr, [p.title, p.isbn, p.publisher, p.level || 'Beginner', p.price || 0, p.image_url || '']);
        }
        await conn.commit();
      } catch (e) { await conn.rollback(); throw e; }
      finally { conn.release(); }
      res.json({ success: true, count: products.length });
    } catch (error: any) {
      console.error(error);
      res.status(400).json({ error: "Failed to bulk insert products. Check for duplicate ISBNs." });
    }
  });

  app.delete("/api/admin/products/:id", async (req, res) => {
    const { id } = req.params;
    try {
      await query("DELETE FROM order_items WHERE product_id = ?", [id]);
      await query("DELETE FROM products WHERE id = ?", [id]);
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  app.get("/api/settings", async (req, res) => {
    try {
      const settings: any = await query("SELECT * FROM settings");
      const settingsMap = settings.reduce((acc: any, curr: any) => {
        acc[curr.key] = curr.value;
        return acc;
      }, {});
      res.json(settingsMap);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  app.post("/api/settings", async (req, res) => {
    try {
      for (const [key, value] of Object.entries(req.body)) {
        await mysqlPool.query("INSERT INTO settings (`key`, value) VALUES (?, ?) ON DUPLICATE KEY UPDATE value = ?", [key, value, value]);
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to update settings" });
    }
  });

  app.post("/api/admin/login", async (req, res) => {
    const { password } = req.body;
    try {
      const settings: any = await query("SELECT value FROM settings WHERE `key` = 'admin_password'");
      const adminPassword = settings.length > 0 ? settings[0].value : 'admin123';
      if (password === adminPassword) {
        res.json({ success: true });
      } else {
        res.status(401).json({ error: "Invalid password" });
      }
    } catch (error) {
      res.status(500).json({ error: "Login failed" });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => res.sendFile(path.join(__dirname, "dist", "index.html")));
  }

  const PORT = parseInt(process.env.PORT || "3000");
  app.listen(PORT, "0.0.0.0", () => console.log(`Server running on http://localhost:${PORT}`));
}

startServer().catch(console.error);
