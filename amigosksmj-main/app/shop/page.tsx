'use client';
import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PRODUCTS, CATEGORIES, Product } from '@/lib/data/products';
import { ProductCard } from '@/components/ui/ProductCard';
import { Filter, SlidersHorizontal, X, ArrowUpDown } from 'lucide-react';

function ShopContent() {
  const searchParams = useSearchParams();
  const initialFilter = searchParams.get('filter');
  const initialCategory = searchParams.get('category');
  const initialPrice = searchParams.get('price');
  const initialSearch = searchParams.get('search') || '';

  const [productsData, setProductsData] = useState<Product[]>(PRODUCTS);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProductsData(data.products || []);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || '');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedFabric, setSelectedFabric] = useState<string>(
    initialFilter === 'cotton' ? 'Pure Cotton' : initialFilter === 'silk' ? 'Silk' : ''
  );
  const [priceRange, setPriceRange] = useState<string>(initialPrice || '');
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [onlyNewArrivals, setOnlyNewArrivals] = useState<boolean>(initialFilter === 'new-arrivals');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  // Available fabrics from data
  const fabrics = ['Pure Cotton', 'Rayon', 'Poly Silk', 'Chanderi Silk', 'Georgette', 'Crepe'];
  const sizes = ['S', 'M', 'L', 'XL', '2XL', '3XL'];

  const filteredProducts = useMemo(() => {
    return productsData.filter(product => {
      // Category filter
      if (selectedCategory && selectedCategory !== 'all') {
        if (selectedCategory === 'clearance' && !product.isClearance) return false;
        if (selectedCategory !== 'clearance' && product.category !== selectedCategory) return false;
      }

      // New arrivals filter
      if (onlyNewArrivals && !product.isNewArrival) return false;

      // Size filter
      if (selectedSize && !product.sizes.includes(selectedSize)) return false;

      // Fabric filter
      if (selectedFabric) {
        if (selectedFabric === 'Silk') {
          if (!product.fabric.toLowerCase().includes('silk')) return false;
        } else if (!product.fabric.toLowerCase().includes(selectedFabric.toLowerCase())) {
          return false;
        }
      }

      // Price filter
      const activePrice = product.isClearance ? product.salePrice : product.price;
      if (priceRange === 'under-500' && activePrice >= 500) return false;
      if (priceRange === '500-999' && (activePrice < 500 || activePrice > 999)) return false;
      if (priceRange === '1000-1499' && (activePrice < 1000 || activePrice > 1499)) return false;
      if (priceRange === '1500-above' && activePrice < 1500) return false;

      // Search query (code, name, fabric, color)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const match =
          product.name.toLowerCase().includes(q) ||
          product.code.toLowerCase().includes(q) ||
          product.fabric.toLowerCase().includes(q) ||
          product.color.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    }).sort((a, b) => {
      const priceA = a.isClearance ? a.salePrice : a.price;
      const priceB = b.isClearance ? b.salePrice : b.price;

      if (sortBy === 'price-low') return priceA - priceB;
      if (sortBy === 'price-high') return priceB - priceA;
      if (sortBy === 'discount') return (b.mrp - priceB) - (a.mrp - priceA);
      return 0; // default order
    });
  }, [selectedCategory, selectedSize, selectedFabric, priceRange, searchQuery, onlyNewArrivals, sortBy]);

  const clearAllFilters = () => {
    setSelectedCategory('');
    setSelectedSize('');
    setSelectedFabric('');
    setPriceRange('');
    setSearchQuery('');
    setOnlyNewArrivals(false);
    setSortBy('featured');
  };

  const hasActiveFilters = Boolean(
    selectedCategory || selectedSize || selectedFabric || priceRange || searchQuery || onlyNewArrivals
  );

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8 border-b border-stone-200 pb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-charcoal">
                Women&apos;s Ethnic Collection
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                Explore handcrafted Indian kurtis, sets, and festive silhouettes.
              </p>
            </div>

            {/* Sorting and Mobile Filter Trigger */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden px-3.5 py-2 bg-white border border-stone-300 rounded-md text-xs font-semibold text-stone-700 flex items-center gap-2 shadow-xs"
              >
                <Filter className="w-3.5 h-3.5" />
                <span>Filters {hasActiveFilters ? '•' : ''}</span>
              </button>

              <div className="flex items-center gap-2 bg-white border border-stone-300 rounded-md px-3 py-1.5 shadow-xs">
                <ArrowUpDown className="w-3.5 h-3.5 text-stone-500" />
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="text-xs bg-transparent text-stone-700 font-medium focus:outline-none cursor-pointer"
                >
                  <option value="featured">Featured Styles</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="discount">Biggest Savings</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-stone-200">
              <span className="text-xs text-stone-500">Active Filters:</span>
              {selectedCategory && (
                <button
                  onClick={() => setSelectedCategory('')}
                  className="text-[11px] bg-white border border-stone-300 px-2.5 py-1 rounded-full flex items-center gap-1.5 hover:border-brand-wine"
                >
                  <span>Category: {selectedCategory}</span>
                  <X className="w-3 h-3 text-stone-400" />
                </button>
              )}
              {selectedFabric && (
                <button
                  onClick={() => setSelectedFabric('')}
                  className="text-[11px] bg-white border border-stone-300 px-2.5 py-1 rounded-full flex items-center gap-1.5 hover:border-brand-wine"
                >
                  <span>Fabric: {selectedFabric}</span>
                  <X className="w-3 h-3 text-stone-400" />
                </button>
              )}
              {selectedSize && (
                <button
                  onClick={() => setSelectedSize('')}
                  className="text-[11px] bg-white border border-stone-300 px-2.5 py-1 rounded-full flex items-center gap-1.5 hover:border-brand-wine"
                >
                  <span>Size: {selectedSize}</span>
                  <X className="w-3 h-3 text-stone-400" />
                </button>
              )}
              {priceRange && (
                <button
                  onClick={() => setPriceRange('')}
                  className="text-[11px] bg-white border border-stone-300 px-2.5 py-1 rounded-full flex items-center gap-1.5 hover:border-brand-wine"
                >
                  <span>Budget: {priceRange}</span>
                  <X className="w-3 h-3 text-stone-400" />
                </button>
              )}
              {onlyNewArrivals && (
                <button
                  onClick={() => setOnlyNewArrivals(false)}
                  className="text-[11px] bg-white border border-stone-300 px-2.5 py-1 rounded-full flex items-center gap-1.5 hover:border-brand-wine"
                >
                  <span>New In</span>
                  <X className="w-3 h-3 text-stone-400" />
                </button>
              )}
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-[11px] bg-white border border-stone-300 px-2.5 py-1 rounded-full flex items-center gap-1.5 hover:border-brand-wine"
                >
                  <span>Search: &quot;{searchQuery}&quot;</span>
                  <X className="w-3 h-3 text-stone-400" />
                </button>
              )}
              <button
                onClick={clearAllFilters}
                className="text-[11px] text-brand-wine font-semibold underline ml-2"
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* Catalog Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block space-y-6 bg-white p-6 rounded-xl border border-stone-200/80 shadow-xs h-fit sticky top-28">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="font-serif text-base font-bold text-brand-charcoal">Filter Wardrobe</h3>
              {hasActiveFilters && (
                <button onClick={clearAllFilters} className="text-xs text-brand-wine font-medium underline">
                  Reset
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">Category</h4>
              <div className="space-y-1 text-xs">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`block w-full text-left px-2 py-1.5 rounded transition-colors ${
                    selectedCategory === '' ? 'bg-brand-wine text-white font-semibold' : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  All Styles ({productsData.length})
                </button>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`block w-full text-left px-2 py-1.5 rounded transition-colors ${
                      selectedCategory === cat.slug ? 'bg-brand-wine text-white font-semibold' : 'text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    {cat.name} ({cat.count})
                  </button>
                ))}
              </div>
            </div>

            {/* Size Filter */}
            <div className="space-y-2 pt-3 border-t border-stone-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">Sizes Available</h4>
              <div className="flex flex-wrap gap-1.5">
                {sizes.map(sz => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(selectedSize === sz ? '' : sz)}
                    className={`text-xs px-2.5 py-1 rounded border font-medium transition-all ${
                      selectedSize === sz
                        ? 'border-brand-wine bg-brand-wine text-white'
                        : 'border-stone-200 bg-stone-50 text-stone-700 hover:border-stone-400'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Fabric Filter */}
            <div className="space-y-2 pt-3 border-t border-stone-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">Fabric</h4>
              <div className="space-y-1 text-xs">
                {fabrics.map(fb => (
                  <label key={fb} className="flex items-center gap-2 cursor-pointer text-stone-700 hover:text-brand-wine">
                    <input
                      type="radio"
                      name="fabric"
                      checked={selectedFabric === fb}
                      onChange={() => setSelectedFabric(selectedFabric === fb ? '' : fb)}
                      className="accent-brand-wine"
                    />
                    <span>{fb}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="space-y-2 pt-3 border-t border-stone-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">Budget Range</h4>
              <div className="space-y-1.5 text-xs text-stone-700">
                {[
                  { label: 'Under ₹500', val: 'under-500' },
                  { label: '₹500 – ₹999', val: '500-999' },
                  { label: '₹1,000 – ₹1,499', val: '1000-1499' },
                  { label: '₹1,500 and Above', val: '1500-above' },
                ].map(tier => (
                  <label key={tier.val} className="flex items-center gap-2 cursor-pointer hover:text-brand-wine">
                    <input
                      type="radio"
                      name="priceTier"
                      checked={priceRange === tier.val}
                      onChange={() => setPriceRange(priceRange === tier.val ? '' : tier.val)}
                      className="accent-brand-wine"
                    />
                    <span>{tier.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Product Grid Area */}
          <main className="lg:col-span-3">
            <div className="mb-4 flex items-center justify-between text-xs text-stone-500">
              <span>Showing <strong>{filteredProducts.length}</strong> styles</span>
              <span className="text-stone-400">Handpicked Amigos Ethnic Collection</span>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-xl border border-stone-200 p-12 text-center my-8">
                <SlidersHorizontal className="w-10 h-10 text-stone-300 mx-auto mb-3" />
                <h3 className="font-serif text-lg font-semibold text-brand-charcoal">No styles match these filters</h3>
                <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                  Try adjusting your budget or fabric selections to view more pieces from our catalog.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="mt-4 px-4 py-2 bg-brand-wine text-white text-xs font-semibold rounded-md shadow-xs"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {filteredProducts.map((product, idx) => (
                  <ProductCard key={product.id} product={product} priority={idx < 6} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Slide-in Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileFilterOpen(false)} />
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-xl flex flex-col z-10 p-6 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <h3 className="font-serif text-lg font-bold text-brand-charcoal">Filters</h3>
              <button onClick={() => setIsMobileFilterOpen(false)}>
                <X className="w-5 h-5 text-stone-500" />
              </button>
            </div>

            {/* Mobile Category */}
            <div className="py-4 border-b border-stone-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">Category</h4>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`text-xs px-2.5 py-1 rounded border ${
                    selectedCategory === '' ? 'bg-brand-wine text-white' : 'bg-stone-50'
                  }`}
                >
                  All
                </button>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`text-xs px-2.5 py-1 rounded border ${
                      selectedCategory === cat.slug ? 'bg-brand-wine text-white' : 'bg-stone-50'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Sizes */}
            <div className="py-4 border-b border-stone-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">Size</h4>
              <div className="flex flex-wrap gap-1.5">
                {sizes.map(sz => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(selectedSize === sz ? '' : sz)}
                    className={`text-xs px-3 py-1 rounded border ${
                      selectedSize === sz ? 'bg-brand-wine text-white' : 'bg-stone-50'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Action Buttons */}
            <div className="pt-6 mt-auto space-y-2">
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full py-2.5 bg-brand-wine text-white text-xs font-bold rounded-md"
              >
                View {filteredProducts.length} Styles
              </button>
              <button
                onClick={clearAllFilters}
                className="w-full py-2 bg-stone-100 text-stone-700 text-xs font-medium rounded-md"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-stone-500">Loading Amigos Collection...</div>}>
      <ShopContent />
    </Suspense>
  );
}
