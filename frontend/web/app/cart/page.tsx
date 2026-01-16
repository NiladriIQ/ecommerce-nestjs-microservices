'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import { createCustomer, createOrder } from '../lib/api';

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
  });

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(savedCart);
  }, []);

  const updateQuantity = (id: number, delta: number) => {
    const newCart = cart.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    });
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event('cart-updated'));
  };

  const removeItem = (id: number) => {
    const newCart = cart.filter(item => item.id !== id);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event('cart-updated'));
  };

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // 1. Create (or get) customer
      // In a real app, you'd handle login. Here we create a new customer or reuse email.
      const customer = await createCustomer(formData);
      
      // 2. Place order
      const orderData = {
        customerId: customer.id,
        items: cart.map(item => ({
          productId: item.id,
          quantity: item.quantity
        }))
      };

      await createOrder(orderData);

      // 3. Clear cart and redirect
      localStorage.removeItem('cart');
      window.dispatchEvent(new Event('cart-updated'));
      router.push(`/history?customerId=${customer.id}`);
    } catch (err: any) {
      setError(err.message || 'Something went wrong while placing the order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-4xl mx-auto p-6 text-center pt-20">
          <span className="text-6xl mb-4 block">🛒</span>
          <h1 className="text-3xl font-bold mb-4 text-gray-900">Your cart is empty</h1>
          <p className="text-gray-700 mb-8 text-lg">Looks like you haven't added anything yet.</p>
          <button onClick={() => router.push('/')} className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors">
            Start Shopping
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8 text-center md:text-left text-gray-900">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <ul className="divide-y divide-gray-100">
                {cart.map((item) => (
                  <li key={item.id} className="p-6 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center text-2xl">
                        📦
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">{item.name}</h3>
                        <p className="text-blue-600 font-semibold text-base">${item.price}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center border rounded-lg bg-gray-50">
                        <button onClick={() => updateQuantity(item.id, -1)} className="px-3 py-1 hover:text-blue-600 font-bold text-gray-700 text-lg">-</button>
                        <span className="px-3 font-semibold text-gray-900">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="px-3 py-1 hover:text-blue-600 font-bold text-gray-700 text-lg">+</button>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700 text-sm font-semibold">Remove</button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="bg-gray-50 p-6 flex justify-between items-center border-t">
                <span className="text-gray-700 font-semibold text-lg">Total Amount:</span>
                <span className="text-2xl font-bold text-blue-600">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-50">
              <h2 className="text-xl font-bold mb-6 text-gray-900">Checkout Details</h2>
              {error && (
                <div className="bg-red-50 text-red-700 p-3 rounded mb-4 text-sm font-medium border border-red-200">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">Full Name</label>
                  <input 
                    required
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 placeholder:text-gray-400" 
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">Email Address</label>
                  <input 
                    required
                    type="email" 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 placeholder:text-gray-400" 
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">Shipping Address</label>
                  <textarea 
                    required
                    rows={3}
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 placeholder:text-gray-400" 
                    placeholder="123 Main St, City, Country"
                  />
                </div>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-transform active:scale-95 ${
                    isSubmitting ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isSubmitting ? 'Processing...' : 'Place Order Now'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

