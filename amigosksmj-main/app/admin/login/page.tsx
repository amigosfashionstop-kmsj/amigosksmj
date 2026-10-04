'use client';

import React, { useState } from 'react';
import Image from 'next/image';

export default function AdminLogin() {
  const [username, setUsername] = useState('Admin');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Redirect to admin portal on successful authentication
        window.location.href = '/admin';
      } else {
        setError(data.error || 'Invalid login credentials.');
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4 font-sans">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full space-y-6">
        <div className="flex flex-col items-center">
          <div className="relative w-16 h-16 mb-4">
            <Image src="/images/brand/logo.png" alt="Amigos Logo" fill className="object-contain" priority />
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
              placeholder="Admin"
              required
              autoComplete="username"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-wine focus:border-transparent text-sm"
              placeholder="Enter secure password"
              required
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-brand-wine hover:bg-brand-wine-dark text-white font-bold rounded-md transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isLoading ? 'Verifying...' : 'Login to Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}
