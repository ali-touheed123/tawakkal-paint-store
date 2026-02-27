'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  ShoppingCart,
  TrendingUp,
  Package,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Clock
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    lowStock: 0,
    recentOrders: [] as any[]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      const supabase = createClient();

      // Fetch total orders
      const { count: orderCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });

      // Fetch total customers
      const { count: customerCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      // Fetch low stock items
      const { count: lowStockCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('in_stock', false);

      // Fetch recent orders
      const { data: recentOrders } = await supabase
        .from('orders')
        .select('*, users(full_name)')
        .order('created_at', { ascending: false })
        .limit(5);

      // Calculate revenue
      const { data: revenueData } = await supabase
        .from('orders')
        .select('total')
        .eq('status', 'delivered');

      const revenue = revenueData?.reduce((sum, order) => sum + Number(order.total), 0) || 0;

      setStats({
        totalOrders: orderCount || 0,
        totalRevenue: revenue,
        totalCustomers: customerCount || 0,
        lowStock: lowStockCount || 0,
        recentOrders: recentOrders || []
      });
      setLoading(false);
    };

    loadDashboardData();
  }, []);

  const statCards = [
    { label: 'Total Revenue', value: `Rs. ${stats.totalRevenue.toLocaleString()}`, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-100', trend: '+12%', isUp: true },
    { label: 'Total Orders', value: stats.totalOrders.toString(), icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-100', trend: '+5%', isUp: true },
    { label: 'New Customers', value: stats.totalCustomers.toString(), icon: Users, color: 'text-purple-600', bg: 'bg-purple-100', trend: '+18%', isUp: true },
    { label: 'Low Stock', value: stats.lowStock.toString(), icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-100', trend: 'Critical', isUp: false },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-navy">Dashboard Overview</h1>
        <p className="text-gray-500 text-sm">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${card.bg} ${card.color}`}>
                  <Icon size={24} />
                </div>
                <div className={`flex items-center gap-1 text-sm font-semibold ${card.isUp ? 'text-green-600' : 'text-red-600'}`}>
                  {card.trend}
                  {card.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                </div>
              </div>
              <p className="text-gray-500 text-sm font-medium">{card.label}</p>
              <h3 className="text-2xl font-bold text-navy mt-1">{card.value}</h3>
            </motion.div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <h3 className="font-bold text-navy">Recent Orders</h3>
            <button className="text-gold text-sm font-semibold hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Order ID</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Customer</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {stats.recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-sm text-gold">#{order.id.slice(0, 8).toUpperCase()}</td>
                    <td className="px-6 py-4 text-sm font-medium text-navy">{order.users?.full_name || 'Guest'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                            'bg-blue-100 text-blue-700'
                        }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-navy">Rs. {order.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-navy mb-6 flex items-center gap-2">
            <Clock className="text-gold" size={20} />
            Quick Alerts
          </h3>
          <div className="space-y-4">
            {stats.lowStock > 0 ? (
              <div className="flex items-start gap-4 p-4 bg-red-50 rounded-xl border border-red-100">
                <AlertTriangle className="text-red-600 mt-1" size={20} />
                <div>
                  <h4 className="font-bold text-red-900 text-sm">Low Inventory</h4>
                  <p className="text-red-700 text-xs mt-1">{stats.lowStock} products are currently out of stock.</p>
                  <button className="text-red-800 text-xs font-bold mt-2 hover:underline">Restock Now</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-100">
                <Package className="text-green-600" size={20} />
                <p className="text-green-700 text-xs font-medium">All products are in stock.</p>
              </div>
            )}

            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
              <h4 className="font-bold text-blue-900 text-sm">Today's Traffic</h4>
              <p className="text-blue-700 text-xs mt-1">Visit counts are up 20% compared to yesterday.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
