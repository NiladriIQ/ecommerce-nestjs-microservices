'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '../components/Navbar';
import { getCustomerHistory, getCustomers } from '../lib/api';

function HistoryContent() {
  const searchParams = useSearchParams();
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const [customers, setCustomers] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Initial customer fetch
    const fetchCustomers = async () => {
      try {
        const data = await getCustomers();
        setCustomers(data);
        
        // If customerId in URL, use it
        const urlId = searchParams.get('customerId');
        if (urlId) {
          setSelectedCustomerId(Number(urlId));
        } else if (data.length > 0) {
          setSelectedCustomerId(data[0].id);
        }
      } catch (err) {
        console.error('Failed to fetch customers', err);
      }
    };
    fetchCustomers();
  }, [searchParams]);

  useEffect(() => {
    if (selectedCustomerId) {
      const fetchHistory = async () => {
        setLoading(true);
        try {
          const data = await getCustomerHistory(selectedCustomerId);
          setHistory(data);
        } catch (err) {
          console.error('Failed to fetch history', err);
        } finally {
          setLoading(false);
        }
      };
      fetchHistory();
    }
  }, [selectedCustomerId]);

  return (
    <main className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
        <h1 className="text-2xl font-bold mb-4 text-center">Order History</h1>
        <div className="max-w-md mx-auto">
          <label className="block text-sm font-semibold mb-2">Select Customer</label>
          <select 
            className="w-full p-3 border rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedCustomerId || ''}
            onChange={(e) => setSelectedCustomerId(Number(e.target.value))}
          >
            <option value="" disabled>Choose a customer...</option>
            {customers.map(c => (
              <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin text-4xl">⚙️</div>
        </div>
      ) : history.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-100">
          <span className="text-5xl block mb-4">📜</span>
          <p className="text-gray-500 font-medium">No order history found for this customer.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {history.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div className="bg-gray-50 p-4 border-b flex justify-between items-center flex-wrap gap-2">
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Order ID</span>
                  <span className="font-mono text-sm">#{order.orderId}</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Date Placed</span>
                  <span className="text-sm font-medium">{new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString()}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Total Amount</span>
                  <span className="text-lg font-bold text-blue-600">${Number(order.totalAmount).toFixed(2)}</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold mb-4 text-sm uppercase tracking-widest text-gray-500">Items Ordered</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {order.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <div className="flex items-center space-x-3">
                        <span className="bg-blue-100 text-blue-700 w-8 h-8 flex items-center justify-center rounded-full font-bold text-xs">
                          {item.quantity}x
                        </span>
                        <span className="font-medium text-sm">{item.productName}</span>
                      </div>
                      <span className="text-xs font-mono text-gray-500">${item.unitPrice} each</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-blue-50/50 p-3 text-center">
                <span className="text-[10px] text-blue-400 font-bold uppercase tracking-tighter italic">Synced via RabbitMQ</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Suspense fallback={<div className="text-center pt-20">Loading...</div>}>
        <HistoryContent />
      </Suspense>
    </div>
  );
}

