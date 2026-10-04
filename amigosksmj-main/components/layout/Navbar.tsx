'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ShoppingBag, Heart, Menu, X, Phone, MessageCircle, MapPin } from 'lucide-react';
import { AnnouncementBar } from './AnnouncementBar';
import { useCart } from '@/lib/store/cart-store';
import { useWishlist } from '@/lib/store/wishlist-store';
import { STORE_INFO } from '@/lib/data/store-info';

export function Navbar() {
  const { totalQuantity, setIsCartOpen } = useCart();
  const { count: wishlistCount } = useWishlist();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const navLinks = [
    { label: 'New Arrivals', href: '/shop?filter=new-arrivals' },
    { label: 'Kurti Sets', href: '/shop/kurti-sets' },
    { label: 'Long Kurtis', href: '/shop/long-kurtis' },
    { label: 'Short Kurtis', href: '/shop/short-kurtis' },
    { label: 'Clearance Sale', href: '/shop/clearance', isHighlight: true },
    { label: 'Wholesale B2B', href: '/wholesale' },
    { label: 'Visit Store', href: '/visit-us' },
    { label: 'About', href: '/about' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
      <AnnouncementBar />

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile Menu Trigger */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-2 text-stone-700 hover:text-brand-wine focus:outline-none"
              aria-label="Open mobile navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-stone-700 hover:text-brand-wine focus:outline-none ml-1"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/admin" className="p-2 text-stone-700 hover:text-brand-wine bg-stone-100 rounded-full hover:bg-stone-200 transition-colors" title="Admin Portal">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
            </Link>
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-12 h-12 md:w-14 md:h-14 shrink-0 transition-transform group-hover:scale-105">
                <Image
                  src="/images/brand/logo.png"
                  alt="Amigos Fashion Stop Logo Crest"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-lg md:text-xl font-bold tracking-tight text-brand-charcoal uppercase group-hover:text-brand-wine transition-colors">
                  Amigos Fashionstop
                </span>
                <span className="text-[9px] md:text-[10px] tracking-widest text-brand-wine font-semibold uppercase">
                  Our Passion, Your Fashion
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder="Search kurtis, sets, fabrics (e.g. pure cotton, AFS 001)..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-full focus:bg-white focus:border-brand-wine focus:outline-none focus:ring-1 focus:ring-brand-wine transition-all"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            </form>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Titwala Local Tag */}
            <Link
              href="/visit-us"
              className="hidden xl:flex items-center gap-1.5 text-xs text-stone-600 hover:text-brand-wine px-2.5 py-1.5 rounded-full hover:bg-stone-50 transition-colors"
              title="Titwala Flagship Store"
            >
              <MapPin className="w-3.5 h-3.5 text-brand-wine" />
              <span>Titwala Store</span>
            </Link>

            {/* Direct WhatsApp Call/Chat */}
            <a
              href={`https://wa.me/${STORE_INFO.primaryWhatsApp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1.5 rounded-full transition-colors font-medium"
              title="WhatsApp Customer Desk"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Chat</span>
            </a>

            {/* Wishlist Icon */}
            <Link
              href="/account#wishlist"
              className="p-2 text-stone-700 hover:text-brand-wine relative rounded-full hover:bg-stone-100 transition-colors"
              aria-label="View Wishlist"
            >
              <Heart className="w-5 h-5" />
              {isMounted && wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-brand-wine text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 p-2 sm:px-3 sm:py-2 bg-brand-wine hover:bg-brand-wine-dark text-white rounded-full transition-all shadow-sm active:scale-95"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline text-xs font-semibold">Bag</span>
              <span className="w-4 h-4 bg-white text-brand-wine text-[10px] font-bold rounded-full flex items-center justify-center">
                {isMounted ? totalQuantity : 0}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Search Dropdown */}
        {isSearchOpen && (
          <div className="lg:hidden pb-3 pt-1">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder="Search products, fabrics, AFS code..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-stone-100 border border-stone-300 rounded-full focus:bg-white focus:border-brand-wine focus:outline-none"
              />
              <Search className="w-4 h-4 text-stone-500 absolute left-3 top-2.5" />
            </form>
          </div>
        )}

        {/* Desktop Category Navigation */}
        <nav className="hidden lg:flex items-center justify-center space-x-7 py-2.5 border-t border-stone-100">
          {navLinks.map(link => (
            <Link
              key={link.label}
              href={link.href}
              className={`text-xs font-medium uppercase tracking-wider transition-colors pb-0.5 ${
                link.isHighlight
                  ? 'text-red-700 font-bold hover:text-red-800'
                  : 'text-stone-700 hover:text-brand-wine'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-xl flex flex-col z-10">
            <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-2">
                <div className="relative w-8 h-8">
                  <Image src="/images/brand/logo.png" alt="Amigos Logo" fill className="object-contain" />
                </div>
                <span className="font-serif text-sm font-bold text-brand-charcoal">Amigos Fashionstop</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 text-stone-500 hover:text-stone-800 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 px-5 space-y-3">
              {navLinks.map(link => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block text-sm py-2 border-b border-stone-100 font-medium ${
                    link.isHighlight ? 'text-red-600 font-bold' : 'text-stone-800'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <div className="pt-4 space-y-2">
                <Link
                  href="/journal"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-xs text-stone-600 hover:text-brand-wine"
                >
                  Fashion Journal & Styling
                </Link>
                <Link
                  href="/size-guide"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-xs text-stone-600 hover:text-brand-wine"
                >
                  Indian Ethnic Size Guide
                </Link>
                <Link
                  href="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-xs text-stone-400 hover:text-stone-700"
                >
                  Admin CMS Portal
                </Link>
              </div>

              {/* Mobile Contact Quick Actions */}
              <div className="pt-6 border-t border-stone-200 space-y-2">
                <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Titwala Store</p>
                <p className="text-xs text-stone-700">{STORE_INFO.address.line1}, {STORE_INFO.address.city}</p>
                <a
                  href={`tel:${STORE_INFO.primaryPhone}`}
                  className="flex items-center gap-2 text-xs text-brand-wine font-medium pt-1"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{STORE_INFO.primaryPhone}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
