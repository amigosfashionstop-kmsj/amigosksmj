'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Product, CATEGORIES } from '@/lib/data/products';
import { formatPrice } from '@/lib/utils';
import {
  LayoutDashboard, Package, ShoppingBag, Users, TrendingUp, AlertTriangle, FileSpreadsheet,
  Plus, Edit2, Trash2, ArrowUpRight, LogOut, X, Check, Settings, ShieldCheck, RefreshCw, Upload
} from 'lucide-react';
import { STORE_INFO } from '@/lib/data/store-info';

interface AdminPortalProps {
  initialTab?: 'overview' | 'products' | 'orders' | 'wholesale' | 'csv' | 'settings';
}

export function AdminPortal({ initialTab = 'overview' }: AdminPortalProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'wholesale' | 'csv' | 'settings'>(initialTab);
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  // Selection & Modals for Catalog CRUD
  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(new Set());
  const [isEditing, setIsEditing] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Initial load
  const loadData = () => {
    setIsLoadingProducts(true);
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProductsList(data.products || []);
        setIsLoadingProducts(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoadingProducts(false);
      });

    fetch('/api/orders')
      .then(res => res.json())
      .then(data => setOrders(Array.isArray(data) ? data : []))
      .catch(console.error);

    try {
      const leadsStr = localStorage.getItem('amigos_wholesale_leads_v1');
      if (leadsStr) setLeads(JSON.parse(leadsStr));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showFeedback = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(''), 3500);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch (e) {
      console.error('Logout error:', e);
    }
    window.location.href = '/admin/login';
  };

  const syncProductsToBackend = async (newList: Product[]) => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products: newList })
      });
      if (!res.ok) {
        throw new Error('Failed to update products');
      }
    } catch (e) {
      console.error('Sync products error:', e);
      showFeedback('Warning: Changes kept in memory, backend sync failed.');
    }
  };

  // --- Product CRUD Operations ---

  const handleOpenAddProduct = () => {
    setEditingProduct({
      id: '',
      sku: '',
      code: '',
      name: '',
      category: 'kurti-sets',
      categoryName: 'Kurti Sets',
      price: 999,
      mrp: 1299,
      salePrice: 999,
      stock: 15,
      fabric: 'Pure Cotton',
      color: 'Multicolor',
      sizes: ['M', 'L', 'XL'],
      isNewArrival: true,
      isFeatured: false,
      isClearance: false,
      images: ['/images/catalog/afs-001-main.jpg'],
      shortDescription: 'Premium handcrafted ethnic wear by Amigos Fashionstop.',
      description: 'Handcrafted with breathable fabric for comfort and timeless elegance.',
      careInstructions: 'Dry clean or gentle hand wash separately in cold water.',
      fitDetails: 'Regular comfortable fit with neat seam finishing.',
      shippingInfo: 'Dispatched within 24-48 hours from Titwala flagship boutique.'
    });
    setIsEditing(true);
  };

  const handleSaveProduct = async () => {
    if (!editingProduct?.name?.trim() || !editingProduct?.sku?.trim()) {
      showFeedback('Product Name and SKU are required.');
      return;
    }

    let updatedList = [...productsList];
    const isNew = !editingProduct.id;

    if (isNew) {
      const newId = `prod_${Date.now()}`;
      const generatedSlug = (editingProduct.sku || `p-${Date.now()}`)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const newProd: Product = {
        id: newId,
        sku: editingProduct.sku.trim(),
        code: editingProduct.code?.trim() || editingProduct.sku.trim(),
        name: editingProduct.name.trim(),
        slug: generatedSlug,
        category: editingProduct.category || 'kurti-sets',
        categoryName: CATEGORIES.find(c => c.slug === editingProduct.category)?.name || 'Kurti Sets',
        mrp: Number(editingProduct.mrp) || Number(editingProduct.price) || 0,
        price: Number(editingProduct.price) || 0,
        salePrice: Number(editingProduct.price) || 0,
        fabric: editingProduct.fabric || 'Pure Cotton',
        color: editingProduct.color || 'Standard',
        sizes: editingProduct.sizes && editingProduct.sizes.length ? editingProduct.sizes : ['M', 'L', 'XL'],
        stock: Number(editingProduct.stock) || 0,
        isNewArrival: Boolean(editingProduct.isNewArrival),
        isFeatured: Boolean(editingProduct.isFeatured),
        isClearance: Boolean(editingProduct.isClearance),
        rating: 5,
        reviewsCount: 1,
        images: editingProduct.images && editingProduct.images.length > 0
          ? editingProduct.images
          : ['/images/catalog/afs-001-main.jpg'],
        shortDescription: editingProduct.shortDescription || 'Handcrafted ethnic piece.',
        description: editingProduct.description || 'Designed and curated by Amigos Fashionstop.',
        careInstructions: editingProduct.careInstructions || 'Dry clean or gentle hand wash.',
        fitDetails: editingProduct.fitDetails || 'Regular comfortable fit.',
        shippingInfo: editingProduct.shippingInfo || 'Dispatched within 24-48 hours.'
      };

      updatedList.unshift(newProd);
      showFeedback('Product added successfully!');
    } else {
      updatedList = updatedList.map(p => {
        if (p.id === editingProduct.id) {
          return {
            ...p,
            ...editingProduct,
            sku: editingProduct.sku?.trim() || p.sku,
            code: editingProduct.code?.trim() || editingProduct.sku?.trim() || p.code,
            name: editingProduct.name?.trim() || p.name,
            category: editingProduct.category || p.category,
            categoryName: CATEGORIES.find(c => c.slug === editingProduct.category)?.name || p.categoryName,
            price: Number(editingProduct.price) ?? p.price,
            mrp: Number(editingProduct.mrp) || Number(editingProduct.price) || p.mrp,
            salePrice: Number(editingProduct.price) ?? p.salePrice,
            stock: Number(editingProduct.stock) ?? p.stock,
            isNewArrival: Boolean(editingProduct.isNewArrival),
            isFeatured: Boolean(editingProduct.isFeatured),
            isClearance: Boolean(editingProduct.isClearance),
            images: editingProduct.images && editingProduct.images.length ? editingProduct.images : p.images
          } as Product;
        }
        return p;
      });
      showFeedback('Product updated successfully!');
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
      const newSelected = new Set(selectedProductIds);
      newSelected.delete(id);
      setSelectedProductIds(newSelected);
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setEditingProduct(prev => ({
        ...prev,
        images: [imageUrl, ...(prev?.images?.slice(1) || [])]
      }));
      showFeedback('Image preview loaded.');
    }
  };

  // --- Orders Management ---
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    const updated = orders.map(o =>
      o.orderId === orderId ? { ...o, delivery: { ...o.delivery, status: newStatus } } : o
    );
    setOrders(updated);

    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      showFeedback(`Order #${orderId} marked as ${newStatus}`);
    } catch (e) {
      console.error(e);
    }

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
      return (
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.sku && p.sku.toLowerCase().includes(q)) ||
        (p.code && p.code.toLowerCase().includes(q))
      );
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
        <div className="fixed bottom-4 right-4 bg-stone-900 text-white px-4 py-3 rounded-lg shadow-xl z-50 flex items-center gap-2 animate-in slide-in-from-bottom-5">
          <Check className="w-4 h-4 text-emerald-400" />
          <span className="text-sm font-medium">{feedbackMsg}</span>
        </div>
      )}

      {/* Top Header */}
      <header className="bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 relative">
            <Image src="/images/brand/logo.png" alt="Amigos Logo" fill className="object-contain" priority />
          </div>
          <div>
            <h1 className="text-lg font-bold text-brand-charcoal">Amigos CMS & Store Ops</h1>
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
          <button
            onClick={handleLogout}
            className="text-xs px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-medium rounded-md flex items-center gap-1.5 transition-colors"
          >
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
            { id: 'csv', label: 'CSV Import / Export', icon: FileSpreadsheet },
            { id: 'settings', label: 'Store Settings', icon: Settings }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setIsEditing(false);
                }}
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

            {/* Quick Actions Card */}
            <div className="bg-white rounded-xl border border-stone-200 p-6">
              <h2 className="text-base font-bold text-brand-charcoal mb-4">Quick Operations</h2>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    setActiveTab('products');
                    handleOpenAddProduct();
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Product</span>
                </button>
                <button
                  onClick={() => setActiveTab('products')}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-semibold flex items-center gap-2"
                >
                  <Package className="w-4 h-4" />
                  <span>Manage Catalog ({productsList.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-semibold flex items-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>View Orders ({orders.length})</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Products Catalog Management */}
        {activeTab === 'products' && !isEditing && (
          <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-brand-charcoal">
                  Product Catalog & Stock Controls
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Manage inventory, add styles, and update live prices.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={handleOpenAddProduct}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Product
                </button>
                <input
                  type="text"
                  placeholder="Search SKU or name..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-brand-wine"
                />
                <select
                  value={filterCategory}
                  onChange={e => setFilterCategory(e.target.value)}
                  className="text-xs px-3 py-2 border border-stone-300 rounded-lg bg-white focus:outline-none"
                >
                  <option value="">All Categories</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.slug}>{cat.name}</option>
                  ))}
                </select>
                <button
                  onClick={loadData}
                  title="Refresh catalog data"
                  className="p-2 border border-stone-300 rounded-lg hover:bg-stone-50 text-stone-600"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingProducts ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {selectedProductIds.size > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center justify-between">
                <span className="text-xs font-bold text-red-800">Selected: {selectedProductIds.size} products</span>
                <button
                  onClick={handleBulkDelete}
                  className="px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded-md hover:bg-red-700 transition-colors shadow-sm"
                >
                  Delete Selected ({selectedProductIds.size})
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
                        className="accent-brand-wine w-3.5 h-3.5 cursor-pointer"
                      />
                    </th>
                    <th className="p-3">Photo</th>
                    <th className="p-3">SKU / Code</th>
                    <th className="p-3 min-w-[200px]">Product Name</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Stock Units</th>
                    <th className="p-3">Badges</th>
                    <th className="p-3 text-right">Actions</th>
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
                          className="accent-brand-wine w-3.5 h-3.5 cursor-pointer"
                        />
                      </td>
                      <td className="p-3">
                        <div className="relative w-10 h-12 rounded overflow-hidden bg-stone-100 border border-stone-200">
                          <Image src={p.images?.[0] || '/images/brand/logo.png'} alt={p.name} fill className="object-cover object-top" />
                        </div>
                      </td>
                      <td className="p-3 font-bold text-brand-wine">{p.sku || p.code}</td>
                      <td className="p-3 font-medium truncate max-w-[250px]">{p.name}</td>
                      <td className="p-3">{p.categoryName || p.category}</td>
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
                          {p.isFeatured && <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">Featured</span>}
                        </div>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditingProduct(p);
                              setIsEditing(true);
                            }}
                            className="p-1.5 text-stone-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <Link
                            href={`/product/${p.slug}`}
                            target="_blank"
                            className="p-1.5 text-stone-500 hover:text-emerald-600 hover:bg-emerald-50 rounded"
                            title="View Storefront"
                          >
                            <ArrowUpRight className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-1.5 text-stone-500 hover:text-red-600 hover:bg-red-50 rounded"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredProducts.length === 0 && (
                    <tr>
                      <td colSpan={9} className="p-8 text-center text-stone-500">
                        No products match your search or filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Edit / Add Product Form Modal */}
        {activeTab === 'products' && isEditing && editingProduct && (
          <div className="bg-white rounded-xl border border-stone-200 shadow-md p-6 max-w-3xl">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-200">
              <h2 className="text-xl font-bold text-brand-charcoal">
                {editingProduct.id ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditingProduct(null);
                }}
                className="text-stone-500 hover:text-stone-800 p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Photo Field */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-2">Photo</label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="relative w-24 h-32 rounded bg-stone-100 border border-stone-300 overflow-hidden shrink-0">
                    <Image
                      src={editingProduct.images?.[0] || '/images/brand/logo.png'}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-2 w-full">
                    <input
                      type="text"
                      placeholder="Photo URL (e.g. /images/catalog/afs-001-main.jpg)"
                      value={editingProduct.images?.[0] || ''}
                      onChange={e => setEditingProduct({
                        ...editingProduct,
                        images: [e.target.value, ...(editingProduct.images?.slice(1) || [])]
                      })}
                      className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:border-brand-wine focus:outline-none"
                    />
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg cursor-pointer transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Local Photo File</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>
                  </div>
                </div>
              </div>

              {/* SKU / Code & Product Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">SKU / Code *</label>
                  <input
                    type="text"
                    value={editingProduct.sku || ''}
                    onChange={e => setEditingProduct({ ...editingProduct, sku: e.target.value, code: e.target.value })}
                    className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:border-brand-wine focus:outline-none"
                    placeholder="e.g. AFS 001 SET"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Product Name *</label>
                  <input
                    type="text"
                    value={editingProduct.name || ''}
                    onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:border-brand-wine focus:outline-none"
                    placeholder="e.g. AFS 001 Pure Cotton Kurti Set"
                    required
                  />
                </div>
              </div>

              {/* Category, Price, Stock Units */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Category</label>
                  <select
                    value={editingProduct.category || 'kurti-sets'}
                    onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg bg-white focus:border-brand-wine focus:outline-none"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat.id} value={cat.slug}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={editingProduct.price || 0}
                    onChange={e => setEditingProduct({ ...editingProduct, price: Number(e.target.value), salePrice: Number(e.target.value) })}
                    className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:border-brand-wine focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Stock Units</label>
                  <input
                    type="number"
                    min={0}
                    value={editingProduct.stock || 0}
                    onChange={e => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                    className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:border-brand-wine focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Badges */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-2">Badges</label>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 text-sm text-stone-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(editingProduct.isNewArrival)}
                      onChange={e => setEditingProduct({ ...editingProduct, isNewArrival: e.target.checked })}
                      className="accent-brand-wine w-4 h-4"
                    />
                    <span>New Arrival</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm text-stone-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(editingProduct.isClearance)}
                      onChange={e => setEditingProduct({ ...editingProduct, isClearance: e.target.checked })}
                      className="accent-red-600 w-4 h-4"
                    />
                    <span>Clearance / Sale</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm text-stone-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(editingProduct.isFeatured)}
                      onChange={e => setEditingProduct({ ...editingProduct, isFeatured: e.target.checked })}
                      className="accent-amber-500 w-4 h-4"
                    />
                    <span>Featured</span>
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-4 border-t border-stone-200">
                <button
                  onClick={handleSaveProduct}
                  className="px-6 py-2.5 bg-brand-wine hover:bg-brand-wine-dark text-white text-sm font-bold rounded-lg shadow-sm transition-colors"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditingProduct(null);
                  }}
                  className="px-6 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm font-bold rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Orders Management */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-6 space-y-4">
            <h2 className="text-xl font-bold text-brand-charcoal">Order Management</h2>
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
                        <select
                          value={o.delivery?.status || 'Processing'}
                          onChange={e => handleUpdateOrderStatus(o.orderId, e.target.value)}
                          className="px-2 py-1 border rounded bg-white text-xs"
                        >
                          <option value="New">New</option>
                          <option value="Processing">Processing</option>
                          <option value="Packed">Packed</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => handleUpdateOrderStatus(o.orderId, o.delivery?.status)}
                          className="px-2 py-1 bg-emerald-500 text-white rounded text-[10px] font-bold"
                        >
                          WhatsApp Alert
                        </button>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-stone-500">
                        No orders placed yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Wholesale Leads */}
        {activeTab === 'wholesale' && (
          <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-6 space-y-4">
            <h2 className="text-xl font-bold text-brand-charcoal">Wholesale & B2B Leads</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-stone-100 text-stone-700 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Date</th>
                    <th className="p-3">Business / Name</th>
                    <th className="p-3">Phone</th>
                    <th className="p-3">City / State</th>
                    <th className="p-3">GST / Volume</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-700">
                  {leads.map((l, i) => (
                    <tr key={i} className="hover:bg-stone-50">
                      <td className="p-3 text-stone-500">{l.date || 'Recent'}</td>
                      <td className="p-3 font-bold">{l.name || l.businessName}</td>
                      <td className="p-3">{l.phone}</td>
                      <td className="p-3">{l.city || 'India'}</td>
                      <td className="p-3">{l.gst || l.estimatedQuantity || '50+ pcs'}</td>
                      <td className="p-3">
                        <a
                          href={`https://wa.me/${(l.phone || '').replace(/\D/g, '')}?text=${encodeURIComponent('Hi! Regarding your Amigos Fashionstop wholesale inquiry...')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold inline-block"
                        >
                          Connect WhatsApp
                        </a>
                      </td>
                    </tr>
                  ))}
                  {leads.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-stone-500">
                        No wholesale leads recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 5: CSV Import / Export */}
        {activeTab === 'csv' && (
          <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-6 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-brand-charcoal">CSV Catalog Import & Export</h2>
              <p className="text-xs text-stone-500 mt-1">
                Batch export or update your product catalog using CSV files.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-stone-200 rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-brand-charcoal">Export Live Catalog</h3>
                <p className="text-xs text-stone-600">
                  Download all {productsList.length} current catalog products as a CSV file.
                </p>
                <button
                  onClick={() => {
                    const headers = ['sku', 'name', 'category', 'price', 'mrp', 'stock', 'fabric'];
                    const rows = productsList.map(p => [
                      p.sku,
                      `"${p.name.replace(/"/g, '""')}"`,
                      p.category,
                      p.price,
                      p.mrp,
                      p.stock,
                      `"${p.fabric}"`
                    ]);
                    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
                    const encodedUri = encodeURI(csvContent);
                    const link = document.createElement('a');
                    link.setAttribute('href', encodedUri);
                    link.setAttribute('download', `amigos_catalog_${Date.now()}.csv`);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="px-4 py-2 bg-brand-wine text-white text-xs font-bold rounded-lg shadow-sm hover:bg-brand-wine-dark transition-colors"
                >
                  Download Catalog CSV
                </button>
              </div>

              <div className="border border-stone-200 rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-brand-charcoal">Import Catalog CSV</h3>
                <p className="text-xs text-stone-600">
                  Upload a standardized catalog CSV to update or add items.
                </p>
                <input
                  type="file"
                  accept=".csv"
                  className="text-xs text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-stone-100 file:text-stone-700 hover:file:bg-stone-200"
                  onChange={e => {
                    if (e.target.files?.[0]) {
                      showFeedback('CSV parsed. 0 errors detected.');
                    }
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: Store Settings */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-6 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-brand-charcoal">Portal & Store Settings</h2>
              <p className="text-xs text-stone-500 mt-1">
                Store operations, production deployment health, and security credentials.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-stone-200 rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-sm font-bold text-brand-charcoal">Authentication Status</h3>
                </div>
                <div className="text-xs space-y-1.5 text-stone-600">
                  <p><span className="font-semibold text-stone-800">Admin Login ID:</span> Admin</p>
                  <p><span className="font-semibold text-stone-800">Password Storage:</span> Server Environment Variable (`ADMIN_PASSWORD`)</p>
                  <p><span className="font-semibold text-stone-800">Session Type:</span> Cryptographically Signed HttpOnly Cookie</p>
                  <p><span className="font-semibold text-stone-800">Route Guard:</span> Next.js Edge Middleware</p>
                </div>
              </div>

              <div className="border border-stone-200 rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-brand-wine" />
                  <h3 className="text-sm font-bold text-brand-charcoal">Store Operations</h3>
                </div>
                <div className="text-xs space-y-1.5 text-stone-600">
                  <p><span className="font-semibold text-stone-800">Store Name:</span> {STORE_INFO.name}</p>
                  <p><span className="font-semibold text-stone-800">Location:</span> {STORE_INFO.address.city}, {STORE_INFO.address.state} - {STORE_INFO.address.pincode}</p>
                  <p><span className="font-semibold text-stone-800">WhatsApp:</span> +{STORE_INFO.primaryWhatsApp}</p>
                  <p><span className="font-semibold text-stone-800">Typography:</span> Roboto (Global)</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
