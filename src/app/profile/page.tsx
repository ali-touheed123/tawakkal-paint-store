'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2, LogOut, MapPin, Phone, Mail, Package } from 'lucide-react';
import { useUserStore, useUIStore } from '@/lib/store';
import { createClient } from '@/lib/supabase/client';
import { Order, KARACHI_AREAS } from '@/types';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, setUser } = useUserStore();
  const { setAuthModalOpen, setAuthModalMode } = useUIStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      setAuthModalMode('login');
      setAuthModalOpen(true);
      router.push('/');
    }
  }, [mounted, isAuthenticated, router, setAuthModalOpen, setAuthModalMode]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) return;
      
      const supabase = createClient();
      const { data } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (data) setOrders(data as Order[]);
      setLoading(false);
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    router.push('/');
  };

  if (!mounted || !isAuthenticated || !user) {
    return (
      <div className="min-h-screen pt-[70px] flex items-center justify-center">
        <Loader2 className="animate-spin text-gold" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-[70px] bg-off-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="bg-navy rounded-2xl p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="font-heading text-3xl font-bold text-white mb-2">
                Welcome, {user.full_name}
              </h1>
              <div className="flex flex-wrap gap-4 text-gray-300 text-sm">
                <span className="flex items-center gap-2">
                  <Mail size={16} className="text-gold" />
                  {user.email}
                </span>
                <span className="flex items-center gap-2">
                  <Phone size={16} className="text-gold" />
                  {user.phone || 'Not provided'}
                </span>
                <span className="flex items-center gap-2">
                  <MapPin size={16} className="text-gold" />
                  {user.area || 'Not set'}
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-400 transition-colors"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h2 className="font-heading text-xl font-semibold text-navy mb-6">Your Area</h2>
              <p className="text-gray-600 mb-4">
                Currently set to: <span className="font-semibold text-gold">{user.area || 'Not set'}</span>
              </p>
              <p className="text-sm text-gray-500">
                To change your delivery area, click the location chip in the navigation bar.
              </p>
            </div>
          </div>

          {/* Orders */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h2 className="font-heading text-xl font-semibold text-navy mb-6 flex items-center gap-2">
                <Package className="text-gold" size={24} />
                Your Orders
              </h2>

              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="animate-spin text-gold" size={32} />
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No orders yet</p>
                  <button
                    onClick={() => router.push('/category/decorative')}
                    className="text-gold hover:underline"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border border-gray-200 rounded-xl p-4"
                    >
                      <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                        <div>
                          <p className="font-mono text-sm text-gold">#{order.id.slice(0, 8).toUpperCase()}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          order.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                          order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>

                      <div className="space-y-2 mb-4">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex justify-between text-sm">
                            <span className="text-gray-600">
                              {item.name} ({item.size}) x {item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                        <div>
                          <span className="text-sm text-gray-500">Total: </span>
                          <span className="font-semibold text-navy">Rs. {order.total.toLocaleString()}</span>
                          {order.discount_percent > 0 && (
                            <span className="ml-2 text-xs text-green-600">
                              (-{order.discount_percent}% off)
                            </span>
                          )}
                        </div>
                        <a
                          href={`https://wa.me/923475658761?text=Hi! My order ID is ${order.id}. Please update me on my delivery status.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-500 text-sm hover:underline"
                        >
                          Track on WhatsApp
                        </a>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
