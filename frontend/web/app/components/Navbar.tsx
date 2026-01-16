'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    const updateCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const count = cart.reduce((acc: number, item: any) => acc + item.quantity, 0);
      setCartCount(count);
    };

    updateCount();
    window.addEventListener('storage', updateCount);
    // Custom event for same-window updates
    window.addEventListener('cart-updated', updateCount);

    return () => {
      window.removeEventListener('storage', updateCount);
      window.removeEventListener('cart-updated', updateCount);
    };
  }, []);

  // Helper function to check if a route is active
  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  return (
    <nav className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-blue-600">
          🛒 E-Shop
        </Link>
        <div className="flex items-center space-x-6">
          <Link 
            href="/" 
            className={`transition-colors ${
              isActive('/') 
                ? 'text-blue-600 font-semibold border-b-2 border-blue-600 pb-1' 
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Products
          </Link>
          <Link 
            href="/history" 
            className={`transition-colors ${
              isActive('/history') 
                ? 'text-blue-600 font-semibold border-b-2 border-blue-600 pb-1' 
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            History
          </Link>
          <Link 
            href="/cart" 
            className={`relative p-2 rounded-full transition-colors ${
              isActive('/cart') 
                ? 'bg-blue-50 text-blue-600' 
                : 'hover:bg-gray-100'
            }`}
          >
            <span className="text-2xl">🛒</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}

