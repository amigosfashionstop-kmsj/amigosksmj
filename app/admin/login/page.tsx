'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'Admin' && password === 'admin') {
      document.cookie = "adminAuth=true; path=/";
      router.push('/admin');
    } else {
      setError('Invalid login credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4 font-sans">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full space-y-6">
        <div className="flex flex-col items-center">
          <div className="relative w-16 h-16 mb-4">
            <Image src="/images/brand/logo.png" alt="Amigos Logo" fill className="object-contain" />
          </div>
          <h1 className="text-2xl font-bold text-brand-charcoal text-center">Admin Login</h1>
          <p className="text-xs text-stone-500 mt-1">Amigos CMS Portal</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-xs p-3 rounded-md border border-red-100 text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Login ID</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-wine focus:border-transparent text-sm"
              placeholder="Enter admin ID"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-wine focus:border-transparent text-sm"
              placeholder="Enter password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2.5 bg-brand-wine hover:bg-brand-wine-dark text-white font-bold rounded-md transition-colors"
          >
            Login to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}
