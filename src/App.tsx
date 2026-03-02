import React, { useState, useEffect } from 'react';
import { ShoppingCart, LogIn, Search, Filter, Plus, Minus, Trash2, CheckCircle2, LayoutDashboard, Package, ClipboardList, Settings as SettingsIcon, LogOut, X, ChevronRight, ChevronLeft, ChevronsLeft, ChevronsRight, Menu, Edit2, User, ShieldCheck, Upload, FileSpreadsheet, Printer, Mail, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import * as XLSX from 'xlsx';
import { Product, CartItem, SchoolInfo, Order, AdminStats } from './types';

// --- Components ---

const ConfirmOrderModal = ({ isOpen, onClose, onConfirm }: { isOpen: boolean, onClose: () => void, onConfirm: () => void }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[70] flex items-center justify-center p-4"
      >
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center"
        >
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="w-8 h-8 text-orange-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Confirm Order</h3>
          <p className="text-slate-500 text-sm mb-6">Are you sure you want to submit this order? Please double check your school information and items.</p>
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={onConfirm}
              className="flex-1 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-200"
            >
              Yes, Submit
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const Header = ({ onLogoClick, cartCount, onCartClick, settings }: { onLogoClick: () => void, cartCount: number, onCartClick: () => void, settings: any }) => (
  <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
    <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
      <div className="flex items-center gap-3 cursor-pointer group" onClick={onLogoClick}>
        <img 
          src="/logoW.jpeg" 
          className="w-10 h-10 rounded-full shadow-sm border border-orange-100 group-hover:scale-110 transition-transform"
          alt="Harvest Logo"
        />
        <div>
          <h1 className="font-bold text-slate-900 leading-none group-hover:text-orange-600 transition-colors">Harvest Edukasi</h1>
          <p className="text-[10px] uppercase tracking-widest text-orange-600 font-bold mt-1">Literacy Program</p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <button 
          onClick={onCartClick}
          className="relative p-2 text-slate-600 hover:text-orange-600 transition-colors"
        >
          <ShoppingCart className="w-6 h-6" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </div>
  </header>
);

const Hero = ({ settings }: { settings: any }) => (
  <div className="relative h-[150px] md:h-[200px] lg:h-[250px] overflow-hidden rounded-2xl mt-4 shadow-xl">
    <img 
      src={settings.hero_image || "https://picsum.photos/seed/harvest/1920/600?blur=2"} 
      className="absolute inset-0 w-full h-full object-cover"
      alt="Hero"
      referrerPolicy="no-referrer"
    />
    <div className="absolute inset-0 bg-black/40 flex items-center px-6 md:px-12">
      <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white max-w-md leading-tight">
        {settings.header_title || "Empowering Schools through Quality Literacy Programs."}
      </h2>
    </div>
  </div>
);

const SchoolInfoForm = ({ info, setInfo, showWarning }: { info: SchoolInfo, setInfo: (info: SchoolInfo) => void, showWarning: boolean }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInfo({ ...info, [e.target.name]: e.target.value });
  };

  return (
    <div id="school-info-form" className={`bg-white p-8 rounded-2xl shadow-sm border transition-colors ${showWarning ? 'border-red-300 ring-4 ring-red-50' : 'border-slate-100'}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${showWarning ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'}`}>
            <ClipboardList className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">School Information</h3>
        </div>
        {showWarning && (
          <span className="text-xs font-bold text-red-500 bg-red-50 px-3 py-1 rounded-full animate-pulse">
            {(!info.schoolName || !info.picName || !info.whatsapp || !info.email) 
              ? "Please fill in all required fields" 
              : "Please enter a valid email address containing '@'"}
          </span>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">School Name <span className="text-red-500">*</span></label>
          <input 
            type="text" name="schoolName" value={info.schoolName} onChange={handleChange}
            placeholder="e.g. SD Nusantara Jakarta"
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">PIC Name <span className="text-red-500">*</span></label>
          <input 
            type="text" name="picName" value={info.picName} onChange={handleChange}
            placeholder="Full Name"
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Position</label>
          <input 
            type="text" name="position" value={info.position} onChange={handleChange}
            placeholder="e.g. Principal, Librarian"
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Whatsapp Number <span className="text-red-500">*</span></label>
          <div className="flex w-full bg-slate-50 border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-orange-500 transition-all overflow-hidden">
            <span className="px-4 py-2.5 bg-slate-100 border-r border-slate-200 text-slate-500 font-bold">+62</span>
            <input 
              type="text" name="whatsapp" value={info.whatsapp.replace(/^\+62/, '')} onChange={(e) => setInfo({ ...info, whatsapp: '+62' + e.target.value.replace(/\D/g, '') })}
              placeholder="82216145678"
              className="w-full px-4 py-2.5 bg-transparent outline-none"
            />
          </div>
        </div>
        <div className="md:col-span-2 space-y-1.5">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Email Address <span className="text-red-500">*</span></label>
          <input 
            type="email" name="email" value={info.email} onChange={handleChange}
            placeholder="school@example.com"
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
          />
        </div>
      </div>
    </div>
  );
};

interface BookCardProps {
  product: Product;
  onAdd: (p: Product) => void;
  onUpdate: (id: number, delta: number, absolute?: boolean) => void;
  cartItem?: CartItem;
}

const QuantityInput = ({ quantity, onUpdate, className }: { quantity: number, onUpdate: (val: number) => void, className?: string }) => {
  const [val, setVal] = useState(quantity.toString());

  useEffect(() => {
    setVal(quantity.toString());
  }, [quantity]);

  return (
    <input 
      type="text" 
      value={val}
      onChange={(e) => {
        const newVal = e.target.value.replace(/\D/g, '');
        setVal(newVal);
        const parsed = parseInt(newVal);
        if (!isNaN(parsed) && parsed > 0) {
          onUpdate(parsed);
        }
      }}
      onBlur={() => {
        if (!val || parseInt(val) <= 0) {
          setVal(quantity.toString());
        }
      }}
      className={`text-center font-bold bg-transparent outline-none ${className}`}
    />
  );
};

const BookCard = ({ product, onAdd, onUpdate, cartItem }: BookCardProps) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group flex flex-col overflow-hidden">
    {product.image_url && (
      <div className="w-full h-48 bg-slate-100 overflow-hidden flex items-center justify-center">
        <img
          src={product.image_url}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
      </div>
    )}
    <div className="p-5 flex flex-col h-full justify-between flex-1">
      <div>
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded uppercase tracking-wider">{product.publisher}</span>
          <span className="text-[10px] font-bold bg-orange-100 text-orange-600 px-2 py-0.5 rounded uppercase tracking-wider">{product.level}</span>
        </div>
        <div className="text-[10px] text-slate-400 font-mono mb-1">ISBN: {product.isbn}</div>
        <h4 className="font-bold text-slate-900 group-hover:text-orange-600 transition-colors text-lg leading-tight">{product.title}</h4>
        {product.description && (
          <p className="text-sm text-slate-500 mt-2 line-clamp-3">{product.description}</p>
        )}
        <p className="text-orange-600 font-bold mt-3 text-base">Rp {product.price.toLocaleString('id-ID')}</p>
      </div>
      <div className="flex justify-end mt-4">
        {cartItem ? (
          <div className="flex items-center gap-3 bg-orange-50 px-2 py-1.5 rounded-xl border border-orange-100">
            <button onClick={() => onUpdate(product.id, -1)} className="p-1 bg-white text-orange-600 rounded-lg hover:bg-orange-100 transition-colors shadow-sm">
              <Minus className="w-4 h-4" />
            </button>
            <QuantityInput 
              quantity={cartItem.quantity} 
              onUpdate={(val) => onUpdate(product.id, val, true)}
              className="w-12 text-sm text-orange-600"
            />
            <button onClick={() => onUpdate(product.id, 1)} className="p-1 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors shadow-sm">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button 
            onClick={() => onAdd(product)}
            className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white rounded-xl font-bold text-sm hover:bg-orange-600 transition-all active:scale-95 shadow-lg shadow-orange-200"
          >
            <Plus className="w-4 h-4" />
            Add to Cart
          </button>
        )}
      </div>
    </div>
  </div>
);


const CartDrawer = ({ isOpen, onClose, items, onUpdate, onSubmit, schoolInfo }: { isOpen: boolean, onClose: () => void, items: CartItem[], onUpdate: (id: number, delta: number, absolute?: boolean) => void, onSubmit: () => void, schoolInfo: SchoolInfo }) => {
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const isValid = schoolInfo.schoolName && schoolInfo.picName && schoolInfo.whatsapp && schoolInfo.email && schoolInfo.email.includes('@') && items.length > 0;

  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirmSubmit = () => {
    setIsConfirming(true);
  };

  const finalSubmit = () => {
    setIsConfirming(false);
    onSubmit();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
          />
          <motion.div 
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-6 h-6 text-orange-600" />
                <h2 className="text-xl font-bold text-slate-900">Your Cart</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
                    <ShoppingCart className="w-10 h-10" />
                  </div>
                  <p className="font-medium">Your cart is empty</p>
                </div>
              ) : (
                items.map(item => (
                  <div key={item.id} className="flex gap-4">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-900 truncate">{item.title}</h4>
                      <p className="text-sm text-slate-500">Rp {item.price.toLocaleString('id-ID')}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-2 bg-slate-50 rounded-lg border border-slate-200 p-1">
                          <button onClick={() => onUpdate(item.id, -1)} className="p-1 hover:bg-white rounded transition-colors">
                            <Minus className="w-3 h-3" />
                          </button>
                          <QuantityInput 
                            quantity={item.quantity} 
                            onUpdate={(val) => onUpdate(item.id, val, true)}
                            className="w-12 text-xs text-slate-900"
                          />
                          <button onClick={() => onUpdate(item.id, 1)} className="p-1 hover:bg-white rounded transition-colors">
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button onClick={() => onUpdate(item.id, 0, true)} className="text-red-500 hover:text-red-600 p-1">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Total Order Value</span>
                <span className="text-2xl font-bold text-orange-600">Rp {total.toLocaleString('id-ID')}</span>
              </div>
              <button 
                disabled={!isValid}
                onClick={handleConfirmSubmit}
                className={`w-full py-4 rounded-2xl font-bold text-lg shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${
                  isValid 
                  ? 'bg-orange-500 text-white hover:bg-orange-600 shadow-orange-200' 
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                Submit Order
                <ChevronRight className="w-5 h-5" />
              </button>
              {!isValid && items.length > 0 && (
                <p className="text-[10px] text-center text-slate-400 font-medium uppercase tracking-wider">Please complete school information to submit</p>
              )}
              
              <div className="mt-6 bg-slate-900 rounded-2xl p-6 text-center text-white shadow-xl">
                <p className="text-base font-bold mb-1">Need help?</p>
                <p className="text-sm text-slate-400 mb-4">Contact our team Harvest Edukasi for assistance with your order</p>
                <div className="flex flex-col items-center gap-3 text-sm font-medium">
                  <a href="mailto:harvestedukasi@gmail.com" className="flex items-center gap-2 hover:text-orange-400 transition-colors">
                    <Mail className="w-4 h-4" />
                    harvestedukasi@gmail.com
                  </a>
                  <a href="https://wa.me/6285175083278" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-orange-400 transition-colors">
                    <MessageCircle className="w-4 h-4" />
                    085175083278
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Confirmation Modal */}
          <ConfirmOrderModal 
            isOpen={isConfirming} 
            onClose={() => setIsConfirming(false)} 
            onConfirm={finalSubmit} 
          />
        </>
      )}
    </AnimatePresence>
  );
};

// --- Admin Components ---

const AdminSidebar = ({ activeTab, setActiveTab, onLogout, isOpen, onClose }: { activeTab: string, setActiveTab: (t: string) => void, onLogout: () => void, isOpen: boolean, onClose: () => void }) => {
  const menu = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Manage Products', icon: Package },
    { id: 'orders', label: 'Manage Orders', icon: ClipboardList },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
          />
        )}
      </AnimatePresence>

      <div className={`w-64 bg-slate-900 text-white h-screen fixed left-0 top-0 flex flex-col z-50 transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/logoW.jpeg" 
              className="w-8 h-8 rounded-full"
              alt="Harvest Logo"

            />
            <span className="font-bold tracking-tight">Admin Panel</span>
          </div>
          <button onClick={onClose} className="lg:hidden p-2 hover:bg-slate-800 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {menu.map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); onClose(); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id 
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-900/20' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

// --- Admin Components ---

const BulkAddModal = ({ isOpen, onClose, onRefresh }: { isOpen: boolean, onClose: () => void, onRefresh: () => void }) => {
  const [bulkData, setBulkData] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadMethod, setUploadMethod] = useState<'paste' | 'file'>('paste');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[][];
      
      // Convert to TSV string for the textarea
      const tsv = data.map(row => row.join('\t')).join('\n');
      setBulkData(tsv);
      setUploadMethod('paste'); // Switch back to paste view to let user review
    };
    reader.readAsBinaryString(file);
  };

  const handleBulkSubmit = async () => {
    if (!bulkData.trim()) return;
    setIsProcessing(true);

    // Parse TSV (Excel paste)
    const lines = bulkData.trim().split('\n');
    const products = lines.map(line => {
      const [isbn, title, publisher, level, price] = line.split('\t');
      return {
        title: title?.trim(),
        isbn: isbn?.trim(),
        publisher: publisher?.trim(),
        level: level?.trim() || 'Beginner',
        price: parseInt(price?.replace(/[^0-9]/g, '') || '0')
      };
    }).filter(p => p.title && p.isbn);

    if (products.length === 0) {
      alert('No valid products found. Make sure you copy from Excel (ISBN, Title, Publisher, Level, Price)');
      setIsProcessing(false);
      return;
    }

    try {
      const res = await fetch('/api/admin/products/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products })
      });

      if (res.ok) {
        alert(`Successfully added ${products.length} products!`);
        setBulkData('');
        onRefresh();
        onClose();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to bulk add products');
      }
    } catch (error) {
      alert('An error occurred during bulk add');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[70] flex items-center justify-center p-4"
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Bulk Add Products</h3>
                <p className="text-slate-500 text-xs mt-1">Upload an Excel file or paste data directly.</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="flex gap-4 mb-4">
              <button 
                onClick={() => setUploadMethod('paste')}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${uploadMethod === 'paste' ? 'bg-orange-100 text-orange-600' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
              >
                Paste Data
              </button>
              <button 
                onClick={() => setUploadMethod('file')}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${uploadMethod === 'file' ? 'bg-orange-100 text-orange-600' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
              >
                Upload Excel File
              </button>
            </div>

            {uploadMethod === 'paste' ? (
              <>
                <div className="mb-2 text-xs text-slate-500 font-medium">
                  Format: <span className="font-bold text-slate-700">ISBN, Title, Publisher, Level, Price</span> (Tab separated)
                </div>
                <textarea 
                  value={bulkData}
                  onChange={(e) => setBulkData(e.target.value)}
                  placeholder="Paste Excel data here...&#10;Example:&#10;978-014-136-544-1	Wonder	Penguin UK	Intermediate	145000"
                  className="w-full h-64 p-4 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs outline-none focus:ring-2 focus:ring-orange-500 transition-all mb-6"
                />
              </>
            ) : (
              <div className="w-full h-64 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center mb-6 bg-slate-50 relative">
                <FileSpreadsheet className="w-12 h-12 text-slate-400 mb-4" />
                <p className="text-sm font-bold text-slate-600 mb-1">Click to upload Excel file</p>
                <p className="text-xs text-slate-400">.xlsx, .xls, .csv</p>
                <p className="text-[10px] text-slate-400 mt-4 max-w-xs text-center">Ensure columns are ordered: ISBN, Title, Publisher, Level, Price</p>
                <input 
                  type="file" 
                  accept=".xlsx, .xls, .csv"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            )}

            <div className="flex gap-3">
              <button 
                onClick={onClose}
                className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleBulkSubmit}
                disabled={isProcessing || !bulkData.trim()}
                className="flex-2 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isProcessing ? 'Processing...' : `Add Products`}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const AdminProducts = ({ products, onRefresh }: { products: Product[], onRefresh: () => void }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({ title: '', isbn: '', publisher: '', level: 'Beginner', price: 0, image_url: '', description: '' });
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductForm({ ...productForm, image_url: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (editingProduct) {
      setProductForm({
        title: editingProduct.title,
        isbn: editingProduct.isbn,
        publisher: editingProduct.publisher,
        level: editingProduct.level,
        price: editingProduct.price,
        image_url: editingProduct.image_url || '',
        description: editingProduct.description || ''
      });
      setIsModalOpen(true);
    } else {
      setProductForm({ title: '', isbn: '', publisher: '', level: 'Beginner', price: 0, image_url: '', description: '' });
    }
  }, [editingProduct]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingProduct ? `/api/admin/products/${editingProduct.id}` : '/api/admin/products';
    const method = editingProduct ? 'PATCH' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productForm)
    });

    if (res.ok) {
      setIsModalOpen(false);
      setEditingProduct(null);
      setProductForm({ title: '', isbn: '', publisher: '', level: 'Beginner', price: 0 });
      onRefresh();
    } else {
      const data = await res.json();
      alert(data.error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
        if (res.ok) {
          onRefresh();
        } else {
          const data = await res.json();
          alert(data.error || 'Failed to delete product');
        }
      } catch (error) {
        alert('An error occurred while deleting the product');
      }
    }
  };

  const filtered = products.filter(p => p.title.toLowerCase().includes(search.toLowerCase()) || p.isbn.includes(search));
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedProducts = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-4 md:p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center justify-between md:justify-start gap-4">
          <div className="flex gap-2">
            <button 
              onClick={() => {
                setEditingProduct(null);
                setProductForm({ title: '', isbn: '', publisher: '', level: 'Beginner', price: 0 });
                setIsModalOpen(true);
              }}
              className="px-4 py-2 bg-orange-500 text-white rounded-xl font-bold text-sm hover:bg-orange-600 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </button>
            <button 
              onClick={() => setIsBulkModalOpen(true)}
              className="px-4 py-2 bg-slate-800 text-white rounded-xl font-bold text-sm hover:bg-slate-700 transition-all flex items-center gap-2"
            >
              <ClipboardList className="w-4 h-4" />
              Bulk Add
            </button>
          </div>
          <div className="px-3 py-1.5 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-bold uppercase">
            Total: {products.length}
          </div>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" placeholder="Search products..." 
            value={search} onChange={e => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none w-full"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">ISBN</th>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Publisher</th>
              <th className="px-6 py-4">Level</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedProducts.map(p => (
              <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-mono text-xs text-slate-500">{p.isbn}</td>
                <td className="px-6 py-4 font-bold text-slate-900">{p.title}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{p.publisher}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded uppercase">{p.level}</span>
                </td>
                <td className="px-6 py-4 font-bold text-slate-900">Rp {p.price.toLocaleString('id-ID')}</td>
                <td className="px-6 py-4 text-right flex justify-end gap-2">
                  <button 
                    onClick={() => setEditingProduct(p)}
                    className="p-2 text-slate-400 hover:text-orange-600 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(p.id)}
                    className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="p-4 border-t border-slate-100 flex items-center justify-end gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="p-2 text-slate-400 hover:text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 text-slate-400 hover:text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-bold text-slate-700 mx-2">
              {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 text-slate-400 hover:text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="p-2 text-slate-400 hover:text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <BulkAddModal 
        isOpen={isBulkModalOpen} 
        onClose={() => setIsBulkModalOpen(false)} 
        onRefresh={onRefresh} 
      />

      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
            >
              <h3 className="text-xl font-bold text-slate-900 mb-6">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Title</label>
                  <input required type="text" value={productForm.title} onChange={e => setProductForm({...productForm, title: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">ISBN</label>
                  <input required type="text" value={productForm.isbn} onChange={e => setProductForm({...productForm, isbn: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Publisher</label>
                    <input required type="text" value={productForm.publisher} onChange={e => setProductForm({...productForm, publisher: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Level</label>
                    <select value={productForm.level} onChange={e => setProductForm({...productForm, level: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500">
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Price (Rp)</label>
                  <input required type="number" value={productForm.price} onChange={e => setProductForm({...productForm, price: parseInt(e.target.value)})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Image (URL or Upload)</label>
                  <div className="flex gap-2">
                    <input type="text" value={productForm.image_url} onChange={e => setProductForm({...productForm, image_url: e.target.value})} placeholder="https://..." className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500" />
                    <label className="cursor-pointer px-4 py-2 bg-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-300 transition-colors flex items-center justify-center">
                      Upload
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Description</label>
                  <textarea value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} placeholder="Book description..." rows={3} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => { setIsModalOpen(false); setEditingProduct(null); }} className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all">Cancel</button>
                  <button type="submit" className="flex-1 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-200">{editingProduct ? 'Update' : 'Add Product'}</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AdminOrders = ({ orders, onRefresh }: { orders: any[], onRefresh: () => void }) => {
  const [orderSearch, setOrderSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const statusColors: Record<string, string> = {
    'Receiving': 'bg-slate-100 text-slate-600',
    'Invoicing': 'bg-blue-100 text-blue-600',
    'Processing': 'bg-amber-100 text-amber-600',
    'Packing': 'bg-indigo-100 text-indigo-600',
    'Delivery': 'bg-emerald-100 text-emerald-600',
  };

  const toTitleCase = (str: string) => {
    return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  };

  const filteredOrders = orders.filter(order => 
    order.school_name.toLowerCase().includes(orderSearch.toLowerCase()) || 
    order.pic_name.toLowerCase().includes(orderSearch.toLowerCase())
  );

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const printInvoice = (order: any) => {
    const invoiceWindow = window.open('', '_blank');
    if (!invoiceWindow) return;
    
    const itemsHtml = order.items?.map((item: any) => `
      <tr>
        <td>
          <div style="color: #64748b; margin-bottom: 4px;">${item.isbn}</div>
          <div>${item.title}</div>
        </td>
        <td class="center">${item.quantity}</td>
        <td class="center">Piece</td>
        <td class="right">${item.price.toLocaleString('id-ID', { minimumFractionDigits: 2 })}</td>
        <td class="center">0%</td>
        <td class="right">${(item.price * item.quantity).toLocaleString('id-ID', { minimumFractionDigits: 2 })}</td>
      </tr>
    `).join('') || '';

    const orderDate = new Date(order.created_at);
    const dueDate = new Date(orderDate);
    dueDate.setDate(dueDate.getDate() + 7); // 7 days (1 week) due date

    invoiceWindow.document.write(`
      <html>
        <head>
          <title>Invoice - ${order.id}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
            body {
              font-family: 'Inter', sans-serif;
              padding: 40px;
              color: #333;
              font-size: 12px;
              line-height: 1.5;
            }
            .header {
              display: flex;
              justify-content: space-between;
              margin-bottom: 40px;
            }
            .logo-container {
              display: flex;
              align-items: center;
              gap: 10px;
            }
            .logo-icon {
              width: 40px;
              height: 40px;
              background-color: #f97316;
              border-radius: 8px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: bold;
              font-size: 24px;
            }
            .logo-text {
              font-size: 28px;
              font-weight: 800;
              letter-spacing: -1px;
            }
            .logo-text span.orange { color: #f97316; }
            .logo-text span.black { color: #1e293b; }
            .logo-sub {
              font-size: 10px;
              letter-spacing: 2px;
              color: #f97316;
              text-transform: uppercase;
              font-weight: 700;
              margin-top: -4px;
            }
            .invoice-title {
              font-size: 28px;
              color: #1e3a8a;
              font-weight: 600;
              text-align: right;
              margin-bottom: 20px;
            }
            .meta-table {
              width: 100%;
              text-align: right;
              border-collapse: collapse;
            }
            .meta-table td {
              padding: 2px 0 2px 20px;
            }
            .meta-table td:first-child {
              color: #64748b;
            }
            .info-section {
              display: flex;
              justify-content: space-between;
              margin-bottom: 30px;
              gap: 40px;
            }
            .info-box {
              flex: 1;
            }
            .info-title {
              font-weight: 600;
              border-bottom: 2px solid #cbd5e1;
              padding-bottom: 8px;
              margin-bottom: 12px;
              color: #1e293b;
            }
            .info-name {
              color: #1e3a8a;
              font-weight: 600;
              margin-bottom: 8px;
            }
            .items-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 40px;
            }
            .items-table th {
              background-color: #334155;
              color: white;
              text-align: left;
              padding: 12px;
              font-weight: 500;
            }
            .items-table td {
              background-color: #f8fafc;
              padding: 12px;
              border-bottom: 1px solid #e2e8f0;
              vertical-align: top;
            }
            .items-table th.right, .items-table td.right { text-align: right; }
            .items-table th.center, .items-table td.center { text-align: center; }
            .bottom-section {
              display: flex;
              justify-content: space-between;
              gap: 60px;
              page-break-inside: avoid;
              margin-top: 30px;
            }
            .terms-box {
              flex: 1.5;
            }
            .totals-box {
              flex: 1;
            }
            .totals-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 40px;
            }
            .totals-table td {
              padding: 8px 0;
              text-align: right;
            }
            .totals-table td:first-child {
              font-weight: 600;
              text-align: left;
            }
            .totals-table tr.grand-total td {
              border-top: 1px solid #333;
              font-weight: 700;
            }
            .signature-container {
              display: flex;
              flex-direction: column;
              align-items: center;
              margin-top: 40px;
              width: 100%;
              gap: 40px;
            }
            .signature {
              text-align: center;
              width: 300px;
            }
            .signature-img {
              height: 80px;
              margin: 10px 0;
              display: inline-block;
              object-fit: contain;
            }
            .logo-img {
              height: 60px;
              max-width: 250px;
              object-fit: contain;
            }
            ol.terms-list {
              padding-left: 16px;
              margin: 10px 0 20px 0;
            }
            ol.terms-list li {
              margin-bottom: 4px;
              padding-left: 4px;
            }
            .bank-details {
              margin-bottom: 30px;
            }
            .bank-details p {
              margin: 4px 0;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <img src="/logo harvest merah.jpeg" class="logo-img" alt="Harvest Edukasi" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
              <div class="logo-container" style="display:none;">
                <div>
                  <div class="logo-text"><span class="orange">h</span><span class="black">arvest</span></div>
                  <div class="logo-sub">edukasi</div>
                </div>
              </div>
            </div>
            <div>
              <div class="invoice-title">Invoice</div>
              <table class="meta-table">
                <tr><td>Referensi</td><td>${order.id}</td></tr>
                <tr><td>Tanggal</td><td>${orderDate.toLocaleDateString('id-ID')}</td></tr>
                <tr><td>Tgl. Jatuh Tempo</td><td>${dueDate.toLocaleDateString('id-ID')}</td></tr>
                <tr><td>NPWP</td><td>623571718019000</td></tr>
              </table>
            </div>
          </div>

          <div class="info-section">
            <div class="info-box">
              <div class="info-title">Info Perusahaan</div>
              <div class="info-name">Harvest Edukasi Indonesia</div>
              <p style="margin:0">Jl. Gandaria Tengah IV/14,<br/>Kramat Pela, Kebayoran Baru, Kota Jakarta Selatan,<br/>DKI Jakarta, 12130<br/>Indonesia<br/>Telp: 081288383777<br/>Email: harvest.edukasi@gmail.com</p>
            </div>
            <div class="info-box">
              <div class="info-title">Tagihan Untuk</div>
              <div class="info-name">${toTitleCase(order.school_name)}</div>
              <p style="margin:0">${order.pic_name} (${order.position || 'PIC'})<br/>Telp: ${order.whatsapp}<br/>Email: ${order.email}</p>
            </div>
          </div>

          <table class="items-table">
            <thead>
              <tr>
                <th>Produk</th>
                <th class="center">Qty</th>
                <th class="center">Satuan</th>
                <th class="right">Harga</th>
                <th class="center">Disc</th>
                <th class="right">Jumlah</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div class="bottom-section">
            <div class="terms-box">
              <div class="info-title">Keterangan</div>
              <div class="bank-details">
                <p><strong>Detail Pembayaran :</strong></p>
                <p>Nama Bank : <strong>Bank Central Asia</strong></p>
                <p>Cabang Bank : <strong>KCU Kebayoran Baru</strong></p>
                <p>Nama Akun : <strong>Harvest Edukasi Indonesia</strong></p>
                <p>Nomor Rekening : <strong>0700335712</strong></p>
              </div>

              <div class="info-title">Syarat & Ketentuan</div>
              <ol class="terms-list">
                <li>Pembayaran : Pelunasan 100% sebelum barang dikirim.</li>
                <li>Jangka waktu pengiriman, estimasi 4- 6 minggu (setelah konfirmasi dan pelunasan)</li>
                <li>Harga <strong>SUDAH TERMASUK</strong> Ongkos Pengiriman untuk wilayah Jabodetabek</li>
                <li>Pembayaran dilakukan dengan Transfer melalui rekening BCA - KCU Kebayoran Baru tersebut di atas,</li>
                <li>Pesanan adalah pasti dan tidak dapat dibatalkan sejak PO Kami terima atau Proforma Invoice disetujui</li>
                <li>Tidak berlaku sistem RETUR</li>
                <li>Harga tersebut di atas valid untuk periode 4 minggu sejak tanggal dokumen ini.</li>
              </ol>

              <p style="margin-top: 20px;">Jika menyetujui, mohon konfirmasi melalui email ke <strong>harvest.edukasi@gmail.com</strong> atau WA ke Ibu Sinthia (0851-7508-3278). Terima kasih atas kepercayaan menggunakan program dari Harvest Edukasi Indonesia</p>
            </div>
            
            <div class="totals-box">
              <table class="totals-table">
                <tr>
                  <td>Subtotal</td>
                  <td>Rp ${order.total_revenue.toLocaleString('id-ID', { minimumFractionDigits: 2 })}</td>
                </tr>
                <tr>
                  <td>Total</td>
                  <td>Rp ${order.total_revenue.toLocaleString('id-ID', { minimumFractionDigits: 2 })}</td>
                </tr>
                <tr class="grand-total">
                  <td>Jumlah Tertagih:</td>
                  <td>Rp ${order.total_revenue.toLocaleString('id-ID', { minimumFractionDigits: 2 })}</td>
                </tr>
              </table>

              <div class="signature-container">
                <div class="signature">
                  <p style="margin-bottom: 10px;">Hormat Kami,</p>
                  <img src="/ttd-tirto-hadi.png" class="signature-img" alt="Tanda Tangan" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';" />
                  <div style="display:none; height: 60px; margin: 10px 0;"></div>
                  <div style="height: 1px; border-bottom: 1px solid #333; width: 250px; margin-left: auto; margin-right: auto; margin-bottom: 5px;"></div>
                  <p style="margin:0; font-weight: 600;">Tirto Hadi</p>
                  <p style="margin:0; font-size: 12px; color: #64748b;">Direktur PT Harvest Edukasi Indonesia</p>
                </div>

                <div class="signature">
                  <p style="margin-bottom: 10px;">Mengetahui,</p>
                  <div style="height: 80px; margin: 10px 0;"></div>
                  <div style="height: 1px; border-bottom: 1px solid #333; width: 250px; margin-left: auto; margin-right: auto; margin-bottom: 5px;"></div>
                  <p style="margin:0; font-weight: 600;">${order.pic_name}</p>
                  <p style="margin:0; font-size: 12px; color: #64748b;">${order.position || 'PIC'}</p>
                </div>
              </div>
            </div>
          </div>

          <script>
            window.onload = () => window.print();
          </script>
        </body>
      </html>
    `);
    invoiceWindow.document.close();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-4 md:p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center justify-between md:justify-start gap-4">
          <h3 className="font-bold text-slate-900">All Orders</h3>
          <div className="px-3 py-1.5 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-bold uppercase">
            Total: {orders.length}
          </div>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" placeholder="Search school or PIC name..." 
            value={orderSearch} onChange={e => { setOrderSearch(e.target.value); setCurrentPage(1); }}
            className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none w-full"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">No.</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">School</th>
              <th className="px-6 py-4">Contact</th>
              <th className="px-6 py-4 min-w-[300px]">Products</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Invoice</th>
              <th className="px-6 py-4 min-w-[200px]">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedOrders.map((order, idx) => (
              <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-sm text-slate-400">{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                <td className="px-6 py-4 text-xs text-slate-600">
                  <div className="whitespace-nowrap">{new Date(order.created_at).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{new Date(order.created_at).toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit' })}</div>
                </td>
                <td className="px-6 py-4 font-mono text-xs font-bold text-slate-500">{order.id}</td>
                <td className="px-6 py-4 font-bold text-slate-900">{toTitleCase(order.school_name)}</td>
                <td className="px-6 py-4">
                  <div className="text-xs font-bold text-slate-900">{order.pic_name}</div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider">{order.position}</div>
                  <div className="text-xs text-slate-500 mt-1 flex items-center gap-1"><Plus className="w-2 h-2" />{order.whatsapp}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="max-h-24 overflow-y-auto pr-2 space-y-2">
                    {order.items?.map((item: any, i: number) => (
                      <div key={i} className="text-xs border-b border-slate-100 pb-1 last:border-0">
                        <div className="font-bold text-slate-800 line-clamp-1" title={item.title}>{item.title}</div>
                        <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                          <span className="font-mono">{item.isbn}</span>
                          <span className="font-bold text-orange-600">Qty: {item.quantity}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 text-[10px] font-bold text-slate-600 uppercase tracking-wider border-t border-slate-200 pt-1">
                    Total: {order.total_books} books (Rp {order.total_revenue.toLocaleString('id-ID')})
                  </div>
                </td>
                <td className="px-6 py-4">
                  <select 
                    value={order.status}
                    onChange={async (e) => {
                      await fetch(`/api/admin/orders/${order.id}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ status: e.target.value })
                      });
                      onRefresh();
                    }}
                    className={`${statusColors[order.status] || 'bg-orange-50 text-orange-600'} text-[10px] font-bold rounded px-2 py-1 border-none outline-none cursor-pointer uppercase transition-colors`}
                  >
                    {['Receiving', 'Invoicing', 'Processing', 'Packing', 'Delivery'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => printInvoice(order)}
                    className="p-2 bg-slate-100 text-slate-600 hover:bg-orange-100 hover:text-orange-600 rounded-lg transition-colors"
                    title="Print Invoice"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </td>
                <td className="px-6 py-4">
                  <textarea 
                    placeholder="Add notes..."
                    defaultValue={order.notes}
                    onBlur={async (e) => {
                      await fetch(`/api/admin/orders/${order.id}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ notes: e.target.value })
                      });
                    }}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="p-4 border-t border-slate-100 flex items-center justify-end gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="p-2 text-slate-400 hover:text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 text-slate-400 hover:text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-bold text-slate-700 mx-2">
              {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of {filteredOrders.length}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 text-slate-400 hover:text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="p-2 text-slate-400 hover:text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const AdminDashboard = ({ stats }: { stats: AdminStats | null }) => {
  if (!stats) return null;

  const cards = [
    { label: 'Total Orders', value: stats.totalOrders, icon: ClipboardList, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Revenue', value: `Rp ${stats.totalRevenue.toLocaleString('id-ID')}`, icon: LayoutDashboard, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Active Products', value: stats.activeProducts, icon: Package, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map(card => (
          <div key={card.label} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${card.bg} ${card.color}`}>
                <card.icon className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Updated just now</span>
            </div>
            <h4 className="text-slate-500 font-medium mb-1">{card.label}</h4>
            <p className="text-3xl font-bold text-slate-900">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-4 md:p-6 border-b border-slate-100 flex items-center justify-between">
        <h3 className="font-bold text-slate-900">Recent Orders</h3>
        <button className="text-orange-600 text-sm font-bold hover:underline">View All</button>
      </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">School</th>
                <th className="px-6 py-4">Value</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stats.recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">No orders yet</td>
                </tr>
              ) : (
                stats.recentOrders.map(order => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs font-bold text-slate-600">{order.id}</td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{order.school_name}</div>
                      <div className="text-xs text-slate-500">{order.pic_name}</div>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">Rp {order.total_revenue.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded uppercase">{order.status}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const LoginPage = ({ onLogin }: { onLogin: (role: 'customer' | 'admin') => void }) => {
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [error, setError] = useState('');

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple password check - in a real app this would be server-side
    if (adminPassword === 'admin123') {
      onLogin('admin');
    } else {
      setError('Invalid admin password');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100 flex flex-col items-center text-center space-y-6"
        >
          <div className="w-20 h-20 bg-orange-100 rounded-2xl flex items-center justify-center">
            <User className="w-10 h-10 text-orange-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Customer Portal</h2>
            <p className="text-slate-500 mt-2">Browse our collection and place your book orders easily.</p>
          </div>
          <button 
            onClick={() => onLogin('customer')}
            className="w-full py-4 bg-orange-500 text-white rounded-2xl font-bold text-lg hover:bg-orange-600 transition-all shadow-lg shadow-orange-200 flex items-center justify-center gap-2"
          >
            Enter as Customer
            <ChevronRight className="w-5 h-5" />
          </button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          className="bg-slate-900 p-10 rounded-3xl shadow-xl flex flex-col items-center text-center space-y-6 text-white overflow-hidden relative"
        >
          <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center">
            <ShieldCheck className="w-10 h-10 text-orange-500" />
          </div>
          
          <AnimatePresence mode="wait">
            {!showAdminLogin ? (
              <motion.div 
                key="choice"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="space-y-6 w-full flex flex-col items-center"
              >
                <div>
                  <h2 className="text-2xl font-bold">Admin Panel</h2>
                  <p className="text-slate-400 mt-2">Manage products, orders, and system settings.</p>
                </div>
                <button 
                  onClick={() => setShowAdminLogin(true)}
                  className="w-full py-4 bg-white text-slate-900 rounded-2xl font-bold text-lg hover:bg-slate-100 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  Enter as Admin
                  <ChevronRight className="w-5 h-5" />
                </button>
              </motion.div>
            ) : (
              <motion.div 
                key="login"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="space-y-6 w-full"
              >
                <div className="text-left">
                  <h2 className="text-2xl font-bold">Admin Login</h2>
                  <p className="text-slate-400 text-sm mt-1">Please enter your administrator password.</p>
                </div>
                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <div className="space-y-2">
                    <input 
                      autoFocus
                      type="password" 
                      placeholder="Enter password" 
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      className="w-full px-5 py-4 bg-slate-800 border border-slate-700 rounded-2xl text-white outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                    />
                    {error && <p className="text-red-400 text-xs font-bold">{error}</p>}
                  </div>
                  <div className="flex gap-3">
                    <button 
                      type="button"
                      onClick={() => setShowAdminLogin(false)}
                      className="flex-1 py-4 bg-slate-800 text-slate-400 rounded-2xl font-bold hover:bg-slate-700 transition-all"
                    >
                      Back
                    </button>
                    <button 
                      type="submit"
                      className="flex-2 py-4 bg-orange-500 text-white rounded-2xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-900/20"
                    >
                      Login
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

const AdminLoginModal = ({ isOpen, onClose, onLogin }: { isOpen: boolean, onClose: () => void, onLogin: () => void }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      onLogin();
      onClose();
      setPassword('');
    } else {
      setError('Invalid password');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
            className="bg-slate-900 text-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-800"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Admin Login</h3>
                <p className="text-slate-400 text-xs">Enter password to access dashboard</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <input 
                  autoFocus
                  type="password" 
                  placeholder="Password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-800 border border-slate-700 rounded-2xl text-white outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                />
                {error && <p className="text-red-400 text-xs font-bold">{error}</p>}
              </div>
              <div className="flex gap-3 pt-2">
                <button 
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-4 bg-slate-800 text-slate-400 rounded-2xl font-bold hover:bg-slate-700 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-2 py-4 bg-orange-500 text-white rounded-2xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-900/20"
                >
                  Login
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// --- Main App ---

export default function App() {
  const [view, setView] = useState<'login' | 'customer' | 'admin'>('customer');
  const [adminTab, setAdminTab] = useState('dashboard');
  const [isAdminSidebarOpen, setIsAdminSidebarOpen] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo>({ schoolName: '', picName: '', position: '', whatsapp: '', email: '' });
  const [search, setSearch] = useState('');
  const [publisherFilter, setPublisherFilter] = useState('All Publishers');
  const [levelFilter, setLevelFilter] = useState('All Levels');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [adminOrders, setAdminOrders] = useState<Order[]>([]);
  const [orderSearch, setOrderSearch] = useState('');
  const [settings, setSettings] = useState<any>({});
  const [isConfirmingOrder, setIsConfirmingOrder] = useState(false);
  const [showSchoolInfoWarning, setShowSchoolInfoWarning] = useState(false);

  const statusColors: Record<string, string> = {
    'Receiving': 'bg-slate-100 text-slate-600',
    'Invoicing': 'bg-blue-100 text-blue-600',
    'Processing': 'bg-amber-100 text-amber-600',
    'Packing': 'bg-indigo-100 text-indigo-600',
    'Delivery': 'bg-emerald-100 text-emerald-600',
  };

  useEffect(() => {
    fetchProducts();
    fetchSettings();
  }, []);

  useEffect(() => {
    if (view === 'admin') {
      fetchAdminData();
    }
  }, [view, adminTab]);

  const fetchProducts = async () => {
    const res = await fetch('/api/products');
    const data = await res.json();
    setProducts(data);
  };

  const fetchSettings = async () => {
    const res = await fetch('/api/settings');
    const data = await res.json();
    setSettings(data);
  };

  const fetchAdminData = async () => {
    const [statsRes, ordersRes] = await Promise.all([
      fetch('/api/admin/stats'),
      fetch('/api/admin/orders')
    ]);
    setAdminStats(await statsRes.json());
    setAdminOrders(await ordersRes.json());
  };

  const isSchoolInfoValid = schoolInfo.schoolName && schoolInfo.picName && schoolInfo.whatsapp && schoolInfo.email && schoolInfo.email.includes('@');

  useEffect(() => {
    if (isSchoolInfoValid) {
      setShowSchoolInfoWarning(false);
    }
  }, [isSchoolInfoValid]);

  const addToCart = (product: Product) => {
    if (!isSchoolInfoValid) {
      setShowSchoolInfoWarning(true);
      document.getElementById('school-info-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateCartQuantity = (id: number, delta: number, absolute?: boolean) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = absolute ? delta : Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const submitOrder = async () => {
    const totalBooks = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalRevenue = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ schoolInfo, items: cart, totalBooks, totalRevenue })
    });

    const data = await res.json();
    if (data.success) {
      setOrderSuccess(data.orderId);
      setCart([]);
      setIsCartOpen(false);
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.isbn.includes(search);
    const matchesPublisher = !publisherFilter || publisherFilter === 'All Publishers' || p.publisher === publisherFilter;
    const matchesLevel = !levelFilter || levelFilter === 'All Levels' || p.level === levelFilter;
    return matchesSearch && matchesPublisher && matchesLevel;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const resetFilters = () => {
    setSearch('');
    setPublisherFilter('All Publishers');
    setLevelFilter('All Levels');
    setCurrentPage(1);
  };

  const publishers = ['All Publishers', ...new Set(products.map(p => p.publisher))];
  
  const availableProductsForLevel = publisherFilter === 'All Publishers' 
    ? products 
    : products.filter(p => p.publisher === publisherFilter);
  const levels = ['All Levels', ...new Set(availableProductsForLevel.map(p => p.level))];

  if (view === 'admin') {
    return (
      <div className="min-h-screen bg-slate-50">
        <AdminSidebar 
          activeTab={adminTab} 
          setActiveTab={setAdminTab} 
          onLogout={() => setView('customer')} 
          isOpen={isAdminSidebarOpen}
          onClose={() => setIsAdminSidebarOpen(false)}
        />
        
        {/* Mobile Admin Header */}
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 h-16 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsAdminSidebarOpen(true)} className="p-2 -ml-2 hover:bg-slate-100 rounded-lg">
              <Menu className="w-6 h-6 text-slate-600" />
            </button>
            <span className="font-bold text-slate-900 capitalize">{adminTab}</span>
          </div>
          <img 
            src="/logoW.jpeg" 
            className="w-8 h-8 rounded-full"
            alt="Logo"
          />
        </div>

        <main className="lg:ml-64 p-4 md:p-8 lg:p-12">
          <div className="max-w-6xl mx-auto">
            <header className="mb-8 lg:mb-12 hidden lg:flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 capitalize">{adminTab}</h2>
                <p className="text-slate-500 mt-1">Welcome back, Admin</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                System Online
              </div>
            </header>

            {adminTab === 'dashboard' && <AdminDashboard stats={adminStats} />}
            {adminTab === 'products' && <AdminProducts products={products} onRefresh={() => { fetchProducts(); fetchAdminData(); }} />}
            {adminTab === 'orders' && <AdminOrders orders={adminOrders} onRefresh={fetchAdminData} />}

            {adminTab === 'settings' && (
              <div className="max-w-2xl bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-8">
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-900">Customer Dashboard Settings</h3>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Header Title</label>
                    <textarea 
                      value={settings.header_title}
                      onChange={(e) => setSettings({ ...settings, header_title: e.target.value })}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Hero Image Upload</label>
                    <div className="flex flex-col gap-4">
                      <input 
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setSettings({ ...settings, hero_image: reader.result as string });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                      />
                      {settings.hero_image && (
                        <div className="relative h-32 rounded-xl overflow-hidden border border-slate-200 w-full max-w-md">
                          <img src={settings.hero_image} alt="Hero Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-slate-100">
                  <h3 className="font-bold text-slate-900">Admin Security</h3>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Admin Password</label>
                    <input 
                      type="password"
                      value={settings.admin_password || ''}
                      onChange={(e) => setSettings({ ...settings, admin_password: e.target.value })}
                      placeholder="Leave blank to keep current password"
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <button 
                    onClick={async () => {
                      await fetch('/api/settings', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(settings)
                      });
                      alert('Settings saved!');
                    }}
                    className="px-6 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-all"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <Header 
        onLogoClick={() => setShowAdminLogin(true)} 
        cartCount={cart.reduce((sum, i) => sum + i.quantity, 0)} 
        onCartClick={() => setIsCartOpen(true)}
        settings={settings}
      />

      <AdminLoginModal 
        isOpen={showAdminLogin} 
        onClose={() => setShowAdminLogin(false)} 
        onLogin={() => setView('admin')} 
      />
      
      <main className="max-w-7xl mx-auto px-4">
        <Hero settings={settings} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
          <div className="lg:col-span-2 space-y-12">
            <SchoolInfoForm info={schoolInfo} setInfo={setInfo => setSchoolInfo(setInfo)} showWarning={showSchoolInfoWarning} />

            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
                    <Package className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Select Books</h3>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text" placeholder="Search title/ISBN..." 
                      value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                      className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none w-full md:w-64"
                    />
                  </div>
                  <select 
                    value={publisherFilter} onChange={e => { 
                      setPublisherFilter(e.target.value); 
                      setLevelFilter('All Levels');
                      setCurrentPage(1); 
                    }}
                    className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {publishers.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                  <select 
                    value={levelFilter} onChange={e => { setLevelFilter(e.target.value); setCurrentPage(1); }}
                    className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {levels.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                  {(search || publisherFilter !== 'All Publishers' || levelFilter !== 'All Levels') && (
                    <button 
                      onClick={resetFilters}
                      className="px-4 py-2 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-xl text-sm font-bold transition-colors"
                    >
                      Reset Filter
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paginatedProducts.map(p => (
                  <BookCard 
                    key={p.id} product={p} 
                    onAdd={addToCart}
                    onUpdate={updateCartQuantity}
                    cartItem={cart.find(i => i.id === p.id)} 
                  />
                ))}
              </div>
              
              {totalPages > 1 && (
                <div className="p-4 border-t border-slate-100 flex items-center justify-end gap-4 mt-8">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                      className="p-2 text-slate-400 hover:text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronsLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-2 text-slate-400 hover:text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-bold text-slate-700 mx-2">
                      {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length}
                    </span>
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2 text-slate-400 hover:text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                      className="p-2 text-slate-400 hover:text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronsRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm sticky top-24 flex flex-col max-h-[calc(100vh-7rem)]">
              <div className="flex items-center justify-between mb-6 shrink-0">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-orange-500" />
                  Order Summary
                </h3>
                <span className="px-2 py-0.5 bg-orange-100 text-orange-600 text-[10px] font-bold rounded uppercase">
                  {cart.length} items
                </span>
              </div>
              
              <div className="space-y-4 overflow-y-auto pr-2 flex-1 min-h-[100px]">
                {cart.length === 0 ? (
                  <div className="py-12 text-center text-slate-400">
                    <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p className="text-sm">Your cart is empty</p>
                  </div>
                ) : (
                  cart.map(item => (
                    <div key={item.id} className="flex gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-slate-900 truncate">{item.title}</h4>
                        <p className="text-xs text-slate-500">{item.quantity} x Rp {item.price.toLocaleString('id-ID')}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-slate-900">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 space-y-4 shrink-0">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-sm">Subtotal</span>
                  <span className="font-bold text-slate-900">Rp {cart.reduce((sum, i) => sum + (i.price * i.quantity), 0).toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-900 font-bold">Total</span>
                  <span className="text-xl font-bold text-orange-600">Rp {cart.reduce((sum, i) => sum + (i.price * i.quantity), 0).toLocaleString('id-ID')}</span>
                </div>
                <button 
                  disabled={cart.length === 0 || !schoolInfo.schoolName || !schoolInfo.picName || !schoolInfo.whatsapp || !schoolInfo.email || !schoolInfo.email.includes('@')}
                  onClick={() => setIsConfirmingOrder(true)}
                  className="w-full py-3 bg-orange-500 text-white rounded-xl font-bold shadow-lg shadow-orange-200 hover:bg-orange-600 transition-all disabled:bg-slate-200 disabled:shadow-none disabled:text-slate-400"
                >
                  Submit Order
                </button>
                
                <div className="mt-6 bg-slate-900 rounded-2xl p-6 text-center text-white shadow-xl">
                  <p className="text-base font-bold mb-1">Need help?</p>
                  <p className="text-sm text-slate-400 mb-4">Contact our team Harvest Edukasi for assistance with your order</p>
                  <div className="flex flex-col items-center gap-3 text-sm font-medium">
                    <a href="mailto:harvestedukasi@gmail.com" className="flex items-center gap-2 hover:text-orange-400 transition-colors">
                      <Mail className="w-4 h-4" />
                      harvestedukasi@gmail.com
                    </a>
                    <a href="https://wa.me/6285175083278" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-orange-400 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      085175083278
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <ConfirmOrderModal 
        isOpen={isConfirmingOrder} 
        onClose={() => setIsConfirmingOrder(false)} 
        onConfirm={() => {
          setIsConfirmingOrder(false);
          submitOrder();
        }} 
      />

      <CartDrawer 
        isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} 
        items={cart} onUpdate={updateCartQuantity} 
        onSubmit={submitOrder} schoolInfo={schoolInfo}
      />

      {/* Floating Cart Button for Mobile */}
      <div className="lg:hidden fixed bottom-6 right-6 z-40">
        <button 
          onClick={() => setIsCartOpen(true)}
          className="w-14 h-14 bg-orange-500 text-white rounded-full shadow-2xl flex items-center justify-center relative active:scale-90 transition-transform"
        >
          <ShoppingCart className="w-6 h-6" />
          {cart.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-white text-orange-600 text-[10px] font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-orange-500">
              {cart.reduce((sum, i) => sum + i.quantity, 0)}
            </span>
          )}
        </button>
      </div>

      <AnimatePresence>
        {orderSuccess && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-[60] flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl p-12 max-w-md w-full text-center shadow-2xl"
            >
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Order Submitted!</h2>
              <p className="text-slate-500 mb-8">
                Thank you for your order. Our education consultant will contact you shortly via WhatsApp or Email to process the invoice.
              </p>
              <div className="bg-slate-50 p-4 rounded-2xl mb-8">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Order ID</p>
                <p className="font-mono font-bold text-orange-600 text-lg">{orderSuccess}</p>
              </div>
              <button 
                onClick={() => setOrderSuccess(null)}
                className="w-full py-4 bg-orange-500 text-white rounded-2xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-200"
              >
                Order More Books
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
