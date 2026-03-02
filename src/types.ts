export interface Product {
  id: number;
  title: string;
  isbn: string;
  publisher: string;
  level: string;
  price: number;
  image_url: string;
  description?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface SchoolInfo {
  schoolName: string;
  picName: string;
  position: string;
  whatsapp: string;
  email: string;
}

export interface Order {
  id: string;
  school_name: string;
  pic_name: string;
  position: string;
  whatsapp: string;
  email: string;
  total_books: number;
  total_revenue: number;
  status: string;
  notes: string;
  created_at: string;
}

export interface AdminStats {
  totalOrders: number;
  totalRevenue: number;
  activeProducts: number;
  recentOrders: Order[];
}
