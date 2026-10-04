'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Product } from '@/lib/data/products';
import { formatPrice } from '@/lib/utils';
import {
  LayoutDashboard, Package, ShoppingBag, Users, TrendingUp, AlertTriangle, FileSpreadsheet,
  Download, Upload, Plus, Edit2, Trash2, MessageCircle, ArrowUpRight, LogOut, X, Check
} from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'wholesale' | 'csv'>('overview');
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  
  // Selection & Modals
  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(new Set());
  const [isEditing, setIsEditing] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Initial load
  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProductsList(data.products || []))
      .catch(console.error);

    fetch('/api/orders')
      .then(res => res.json())
      .then(data => setOrders(data.orders || []))
      .catch(console.error);

    const leadsStr = localStorage.getItem('amigos_wholesale_leads_v1');
    if (leadsStr) setLeads(JSON.parse(leadsStr));
  }, []);

  const showFeedback = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(''), 3000);
  };

  const handleLogout = () => {
    document.cookie = "adminAuth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push('/admin/login');
  };

  const syncProductsToBackend = async (newList: Product[]) => {
    try {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products: newList })
      });
    } catch (e) {
      console.error(e);
    }
  };

  // --- Product Management ---

  const handleSaveProduct = async () => {
    if (!editingProduct?.name || !editingProduct?.sku) return;
    
    let updatedList = [...productsList];
    const isNew = !productsList.find(p => p.id === editingProduct.id);

    if (isNew) {
      const newProd = {
        ...editingProduct,
        id: `prod_${Date.now()}`,
        slug: editingProduct.sku?.toLowerCase().replace(/\s+/g, '-') || `p-${Date.now()}`,
        images: editingProduct.images?.length ? editingProduct.images : ['/images/catalog/afs-001-main.jpg'],
        sizes: editingProduct.sizes || ['M', 'L'],
        rating: 5,
        reviewsCount: 1,
      } as Product;
      updatedList.unshift(newProd);
      showFeedback('Product added successfully.');
    } else {
      updatedList = updatedList.map(p => p.id === editingProduct.id ? { ...p, ...editingProduct } as Product : p);
      showFeedback('Product updated successfully.');
    }

    setProductsList(updatedList);
    setIsEditing(false);
    setEditingProduct(null);
    await syncProductsToBackend(updatedList);
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      const updatedList = productsList.filter(p => p.id !== id);
      setProductsList(updatedList);
      showFeedback('Product deleted successfully.');
      await syncProductsToBackend(updatedList);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProductIds.size === 0) return;
    if (confirm(`Are you sure you want to delete ${selectedProductIds.size} selected products?`)) {
      const updatedList = productsList.filter(p => !selectedProductIds.has(p.id));
      setProductsList(updatedList);
      showFeedback(`${selectedProductIds.size} products deleted successfully.`);
      setSelectedProductIds(new Set());
      await syncProductsToBackend(updatedList);
    }
  };

  const toggleSelection = (id: string) => {
    const newSet = new Set(selectedProductIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedProductIds(newSet);
  };

  const toggleAllSelection = () => {
    if (selectedProductIds.size === filteredProducts.length) {
      setSelectedProductIds(new Set());
    } else {
      setSelectedProductIds(new Set(filteredProducts.map(p => p.id)));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      const formData = new FormData();
      formData.append('file', file);

      try {
        showFeedback('Uploading image...');
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        
        if (!res.ok) throw new Error('Upload failed');
        const data = await res.json();
        
        if (data.imageUrl) {
          setEditingProduct(prev => ({
            ...prev,
            images: [data.imageUrl, ...(prev?.images?.slice(1) || [])]
          }));
          showFeedback('Image uploaded and saved successfully.');
        }
      } catch (error) {
        console.error(error);
        showFeedback('Error uploading image.');
      }
    }
  };

  // --- Orders ---
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    const updated = orders.map(o =>
      o.orderId === orderId ? { ...o, delivery: { ...o.delivery, status: newStatus } } : o
    );
    setOrders(updated);
    
    await fetch(`/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    
    const order = orders.find(o => o.orderId === orderId);
    if (order && order.customer?.phone) {
      const waMessage = `Hi ${order.customer.name}, your Amigos Fashionstop order #${order.orderId} status is now: ${newStatus}.`;
      const waUrl = `https://wa.me/${order.customer.phone.replace(/\D/g, '')}?text=${encodeURIComponent(waMessage)}`;
      window.open(waUrl, '_blank');
    }
  };

  // --- Computations ---
  const filteredProducts = productsList.filter(p => {
    if (filterCategory && p.category !== filterCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.code.toLowerCase().includes(q);
    }
    return true;
  });

  const totalRevenue = orders.reduce((sum, o) => sum + (o.totals?.grandTotal || 0), 0);
  const lowStockCount = productsList.filter(p => p.stock < 10).length;
  const outOfStockCount = productsList.filter(p => p.stock === 0).length;

  return (
    <div className="bg-stone-100 min-h-screen font-sans">
      {/* Toast Feedback */}
      {feedbackMsg && (
        <div className="fixed bottom-4 right-4 bg-stone-800 text-white px-4 py-3 rounded-lg shadow-xl z-50 flex items-center gap-2 animate-in slide-in-from-bottom-5">
          <Check className="w-4 h-4 text-emerald-400" />
          <span className="text-sm font-medium">{feedbackMsg}</span>
        </div>
      )}

      {/* Top Header */}
      <header className="bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 relative">
            <Image src="/images/brand/logo.png" alt="Amigos Logo" fill className="object-contain" />
          </div>
          <div>
            <h1 className="font-serif text-lg font-bold text-brand-charcoal">Amigos CMS & Store Ops</h1>
            <p className="text-[10px] text-stone-500 uppercase tracking-widest">Titwala Flagship Operations</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="text-xs px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium rounded-md flex items-center gap-1.5 transition-colors"
          >
            <span>View Live Website</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
          <button onClick={handleLogout} className="text-xs px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-medium rounded-md flex items-center gap-1.5 transition-colors">
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { id: 'overview', label: 'Overview Metrics', icon: LayoutDashboard },
            { id: 'products', label: `Catalog (${productsList.length})`, icon: Package },
            { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag },
            { id: 'wholesale', label: `Wholesale Leads (${leads.length})`, icon: Users },
            { id: 'csv', label: 'CSV Import / Export', icon: FileSpreadsheet }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                  activeTab === tab.id
                    ? 'bg-brand-wine text-white shadow-sm'
                    : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Overview Dashboard */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
                <div className="flex items-center justify-between text-stone-500 mb-2">
                  <span className="text-xs font-medium uppercase tracking-wider">Total Sales</span>
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-bold text-brand-charcoal">{formatPrice(totalRevenue)}</div>
                <p className="text-[11px] text-emerald-700 mt-1 font-medium">From {orders.length} online orders</p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
                <div className="flex items-center justify-between text-stone-500 mb-2">
                  <span className="text-xs font-medium uppercase tracking-wider">Live Catalog</span>
                  <Package className="w-4 h-4 text-brand-wine" />
                </div>
                <div className="text-2xl font-bold text-brand-charcoal">{productsList.length} Styles</div>
                <p className="text-[11px] text-stone-500 mt-1">Live CMS products</p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
                <div className="flex items-center justify-between text-stone-500 mb-2">
                  <span className="text-xs font-medium uppercase tracking-wider">Inventory Health</span>
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-2xl font-bold text-amber-600">{lowStockCount} Low Stock</div>
                <p className="text-[11px] text-stone-500 mt-1">{outOfStockCount} out of stock</p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
                <div className="flex items-center justify-between text-stone-500 mb-2">
                  <span className="text-xs font-medium uppercase tracking-wider">Wholesale Leads</span>
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-brand-charcoal">{leads.length} Leads</div>
                <p className="text-[11px] text-blue-700 mt-1 font-medium">B2B buyer inquiries</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Products Catalog Management */}
        {activeTab === 'products' && !isEditing && (
          <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-xl font-bold text-brand-charcoal">
                  Product Catalog & Stock Controls
                </h2>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => {
                    setEditingProduct({ isNewArrival: false, isFeatured: false, isClearance: false, stock: 10, price: 0, mrp: 0 });
                    setIsEditing(true);
                  }}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Product
                </button>
                <input
                  type="text"
                  placeholder="Search SKU or name..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="text-xs px-3 py-1.5 border border-stone-300 rounded focus:outline-none focus:border-brand-wine"
                />
                <select
                  value={filterCategory}
                  onChange={e => setFilterCategory(e.target.value)}
                  className="text-xs px-2.5 py-1.5 border border-stone-300 rounded bg-white focus:outline-none"
                >
                  <option value="">All Categories</option>
                  <option value="kurti-sets">Kurti Sets</option>
                  <option value="long-kurtis">Long Kurtis</option>
                  <option value="short-kurtis">Short Kurtis</option>
                </select>
              </div>
            </div>

            {selectedProductIds.size > 0 && (
              <div className="bg-stone-50 border border-stone-200 rounded p-3 flex items-center justify-between">
                <span className="text-xs font-bold text-stone-700">Selected: {selectedProductIds.size} products</span>
                <button onClick={handleBulkDelete} className="px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded hover:bg-red-700 transition-colors">
                  Delete Selected
                </button>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left whitespace-nowrap">
                <thead className="bg-stone-100 text-stone-700 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3 w-8">
                      <input 
                        type="checkbox" 
                        checked={filteredProducts.length > 0 && selectedProductIds.size === filteredProducts.length} 
                        onChange={toggleAllSelection} 
                        className="accent-brand-wine w-3.5 h-3.5"
                      />
                    </th>
                    <th className="p-3">Photo</th>
                    <th className="p-3">SKU / Code</th>
                    <th className="p-3 min-w-[200px]">Product Name</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Stock Units</th>
                    <th className="p-3">Badges</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-700">
                  {filteredProducts.map(p => (
                    <tr key={p.id} className={`hover:bg-stone-50/80 transition-colors ${p.stock === 0 ? 'bg-red-50/30' : ''}`}>
                      <td className="p-3">
                        <input 
                          type="checkbox" 
                          checked={selectedProductIds.has(p.id)} 
                          onChange={() => toggleSelection(p.id)} 
                          className="accent-brand-wine w-3.5 h-3.5"
                        />
                      </td>
                      <td className="p-3">
                        <div className="relative w-10 h-12 rounded overflow-hidden bg-stone-100 border border-stone-200">
                          <Image src={p.images?.[0] || '/images/brand/logo.png'} alt={p.name} fill className="object-cover object-top" />
                        </div>
                      </td>
                      <td className="p-3 font-bold text-brand-wine">{p.sku || p.code}</td>
                      <td className="p-3 font-medium truncate max-w-[250px]">{p.name}</td>
                      <td className="p-3">{p.category}</td>
                      <td className="p-3">
                        <strong className="text-brand-charcoal text-sm">{formatPrice(p.price)}</strong>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded font-bold ${p.stock > 10 ? 'bg-emerald-50 text-emerald-700' : p.stock > 0 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'}`}>
                          {p.stock}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1">
                          {p.isNewArrival && <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-brand-wine text-white">New</span>}
                          {p.isClearance && <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white">Sale</span>}
                          {p.isFeatured && <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-brand-gold/20 text-brand-gold">Featured</span>}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => { setEditingProduct(p); setIsEditing(true); }} className="p-1.5 text-stone-500 hover:text-blue-600 hover:bg-blue-50 rounded" title="Edit">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <Link href={`/product/${p.slug}`} target="_blank" className="p-1.5 text-stone-500 hover:text-emerald-600 hover:bg-emerald-50 rounded" title="View Storefront">
                            <ArrowUpRight className="w-4 h-4" />
                          </Link>
                          <button onClick={() => handleDeleteProduct(p.id)} className="p-1.5 text-stone-500 hover:text-red-600 hover:bg-red-50 rounded" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Edit / Add Product Form */}
        {activeTab === 'products' && isEditing && editingProduct && (
          <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-6 max-w-3xl">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-200">
              <h2 className="font-serif text-xl font-bold text-brand-charcoal">
                {editingProduct.id ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={() => { setIsEditing(false); setEditingProduct(null); }} className="text-stone-500 hover:text-stone-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Photo */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-2">Product Photo</label>
                <div className="flex items-end gap-4">
                  <div className="relative w-24 h-32 rounded bg-stone-100 border border-stone-300 overflow-hidden">
                    <Image src={editingProduct.images?.[0] || '/images/brand/logo.png'} alt="Preview" fill className="object-cover" />
                  </div>
                  <label className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded cursor-pointer transition-colors">
                    Upload New Image
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                </div>
              </div>

              {/* SKU & Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">SKU / Code</label>
                  <input type="text" value={editingProduct.sku || ''} onChange={e => setEditingProduct({ ...editingProduct, sku: e.target.value, code: e.target.value })} className="w-full text-sm px-3 py-2 border border-stone-300 rounded focus:border-brand-wine focus:outline-none" placeholder="e.g. AFS 001 SET" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Product Name</label>
                  <input type="text" value={editingProduct.name || ''} onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })} className="w-full text-sm px-3 py-2 border border-stone-300 rounded focus:border-brand-wine focus:outline-none" placeholder="e.g. AFS 001 Cotton Set" required />
                </div>
              </div>

              {/* Category, Price, Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Category</label>
                  <select value={editingProduct.category || 'kurti-sets'} onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value })} className="w-full text-sm px-3 py-2 border border-stone-300 rounded bg-white focus:border-brand-wine focus:outline-none">
                    <option value="kurti-sets">Kurti Sets</option>
                    <option value="long-kurtis">Long Kurtis</option>
                    <option value="short-kurtis">Short Kurtis</option>
                    <option value="co-ord-sets">Co-ord Sets</option>
                    <option value="dress-sets">Dress Sets</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Price (₹)</label>
                  <input type="number" value={editingProduct.price || 0} onChange={e => setEditingProduct({ ...editingProduct, price: Number(e.target.value), salePrice: Number(e.target.value) })} className="w-full text-sm px-3 py-2 border border-stone-300 rounded focus:border-brand-wine focus:outline-none" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Stock Units</label>
                  <input type="number" min={0} value={editingProduct.stock || 0} onChange={e => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })} className="w-full text-sm px-3 py-2 border border-stone-300 rounded focus:border-brand-wine focus:outline-none" required />
                </div>
              </div>

              {/* Badges */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-2">Product Badges</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm text-stone-700 cursor-pointer">
                    <input type="checkbox" checked={!!editingProduct.isNewArrival} onChange={e => setEditingProduct({ ...editingProduct, isNewArrival: e.target.checked })} className="accent-brand-wine w-4 h-4" />
                    New
                  </label>
                  <label className="flex items-center gap-2 text-sm text-stone-700 cursor-pointer">
                    <input type="checkbox" checked={!!editingProduct.isClearance} onChange={e => setEditingProduct({ ...editingProduct, isClearance: e.target.checked })} className="accent-red-600 w-4 h-4" />
                    Clearance/Sale
                  </label>
                  <label className="flex items-center gap-2 text-sm text-stone-700 cursor-pointer">
                    <input type="checkbox" checked={!!editingProduct.isFeatured} onChange={e => setEditingProduct({ ...editingProduct, isFeatured: e.target.checked })} className="accent-brand-gold w-4 h-4" />
                    Featured
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-stone-200">
                <button onClick={handleSaveProduct} className="px-6 py-2.5 bg-brand-wine hover:bg-brand-wine-dark text-white text-sm font-bold rounded shadow-sm">
                  Save Changes
                </button>
                <button onClick={() => { setIsEditing(false); setEditingProduct(null); }} className="px-6 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm font-bold rounded">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Orders (Unchanged core logic) */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-6 space-y-4">
            <h2 className="font-serif text-xl font-bold text-brand-charcoal">Order Management</h2>
            {/* Same orders table as before ... */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-stone-100 text-stone-700 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Order ID</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Items</th>
                    <th className="p-3">Total</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-700">
                  {orders.map(o => (
                    <tr key={o.orderId} className="hover:bg-stone-50">
                      <td className="p-3 font-bold text-brand-wine">{o.orderId}</td>
                      <td className="p-3">{o.customer?.name}</td>
                      <td className="p-3">{o.items?.map((i: any) => i.product?.code).join(', ')}</td>
                      <td className="p-3 font-bold">{formatPrice(o.totals?.grandTotal)}</td>
                      <td className="p-3">
                        <select value={o.delivery?.status || 'Processing'} onChange={e => handleUpdateOrderStatus(o.orderId, e.target.value)} className="px-2 py-1 border rounded bg-white text-xs">
                          <option value="New">New</option>
                          <option value="Processing">Processing</option>
                          <option value="Packed">Packed</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </td>
                      <td className="p-3">
                        <button onClick={() => handleUpdateOrderStatus(o.orderId, o.delivery?.status)} className="px-2 py-1 bg-emerald-500 text-white rounded text-[10px] font-bold">WhatsApp Alert</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
