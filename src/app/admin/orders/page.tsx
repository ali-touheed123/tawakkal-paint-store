'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Package,
    MapPin,
    Phone,
    Clock,
    CheckCircle2,
    Truck,
    XCircle,
    Printer,
    Search,
    ChevronDown,
    Loader2,
    ExternalLink,
    Users,
    ShoppingCart,
    X,
    MessageCircle
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Order, OrderStatus, OrderItem } from '@/types';

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const supabase = createClient();

    useEffect(() => {
        loadOrders();

        // Subscribe to new orders
        const channel = supabase
            .channel('order-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
                loadOrders();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const loadOrders = async () => {
        const { data } = await supabase
            .from('orders')
            .select('*, users(full_name, email)')
            .order('created_at', { ascending: false });

        if (data) setOrders(data);
        setLoading(false);
    };

    const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
        const { error } = await supabase
            .from('orders')
            .update({ status })
            .eq('id', orderId);

        if (error) {
            alert('Error updating status');
        } else {
            if (selectedOrder?.id === orderId) {
                setSelectedOrder({ ...selectedOrder, status });
            }
            loadOrders();
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'confirmed': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'shipped': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'delivered': return 'bg-green-100 text-green-700 border-green-200';
            case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const filteredOrders = orders.filter(o =>
        o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.users?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.phone.includes(searchTerm)
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-navy">Order Management</h1>
                    <p className="text-gray-500 text-sm">Track, manage and update customer orders</p>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by Order ID, Name or Phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-gold transition-colors"
                    />
                </div>
            </div>

            {/* Orders List */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="animate-spin text-gold" size={40} />
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {filteredOrders.map((order) => (
                        <motion.div
                            key={order.id}
                            layoutId={order.id}
                            onClick={() => setSelectedOrder(order)}
                            className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-gold transition-all cursor-pointer group"
                        >
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-xl ${getStatusColor(order.status).split(' ')[0]}`}>
                                        <Package className={getStatusColor(order.status).split(' ')[1]} size={24} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-sm font-bold text-gold">#{order.id.slice(0, 8).toUpperCase()}</span>
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <h3 className="font-bold text-navy mt-0.5">{order.users?.full_name || 'Guest User'}</h3>
                                        <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                                            <Clock size={12} />
                                            {new Date(order.created_at).toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                                    <p className="text-xl font-bold text-navy">Rs. {order.total.toLocaleString()}</p>
                                </div>

                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-2 text-gray-400 hover:text-gold transition-colors" title="Print Invoice">
                                        <Printer size={20} />
                                    </button>
                                    <ChevronDown className="text-gray-400" size={20} />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Order Detail Modal */}
            <AnimatePresence>
                {selectedOrder && (
                    <div className="fixed inset-0 bg-navy/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
                        >
                            {/* Header */}
                            <div className="bg-navy p-6 text-white flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-mono text-lg font-bold text-gold">Order #{selectedOrder.id.slice(0, 12).toUpperCase()}</span>
                                    </div>
                                    <p className="text-sm text-white/60">{new Date(selectedOrder.created_at).toLocaleString()}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-8">
                                {/* Status Stepper */}
                                <div className="flex items-center justify-between px-4">
                                    {[
                                        { key: 'pending', icon: Clock, label: 'Pending' },
                                        { key: 'confirmed', icon: CheckCircle2, label: 'Confirmed' },
                                        { key: 'shipped', icon: Truck, label: 'Shipped' },
                                        { key: 'delivered', icon: CheckCircle2, label: 'Delivered' }
                                    ].map((step, i, arr) => {
                                        const Icon = step.icon;
                                        const isCompleted = arr.findIndex(s => s.key === selectedOrder.status) >= i;
                                        const isLast = i === arr.length - 1;

                                        return (
                                            <div key={step.key} className="flex items-center flex-1">
                                                <div className="flex flex-col items-center gap-2">
                                                    <div className={`p-2 rounded-full border-2 transition-colors ${isCompleted ? 'bg-gold border-gold text-navy' : 'bg-white border-gray-200 text-gray-300'
                                                        }`}>
                                                        <Icon size={20} />
                                                    </div>
                                                    <span className={`text-[10px] font-bold uppercase tracking-wider ${isCompleted ? 'text-navy' : 'text-gray-400'}`}>
                                                        {step.label}
                                                    </span>
                                                </div>
                                                {!isLast && (
                                                    <div className={`flex-1 h-0.5 mx-2 -mt-6 transition-colors ${isCompleted ? 'bg-gold' : 'bg-gray-100'
                                                        }`} />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    {/* Customer Info */}
                                    <div className="space-y-4">
                                        <h4 className="font-bold text-navy flex items-center gap-2">
                                            <Users size={18} className="text-gold" />
                                            Customer Details
                                        </h4>
                                        <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
                                            <div className="flex flex-col">
                                                <span className="text-xs text-gray-500">Name</span>
                                                <span className="font-semibold">{selectedOrder.users?.full_name || 'Guest User'}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs text-gray-500">Phone</span>
                                                <a href={`tel:${selectedOrder.phone}`} className="font-semibold text-gold flex items-center gap-2">
                                                    {selectedOrder.phone}
                                                    <ExternalLink size={14} />
                                                </a>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs text-gray-500">Delivery Address</span>
                                                <span className="font-medium text-sm flex items-start gap-2 mt-1">
                                                    <MapPin size={16} className="text-gray-400 mt-0.5 shrink-0" />
                                                    {selectedOrder.delivery_address}, {selectedOrder.delivery_area}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Summary */}
                                    <div className="space-y-4">
                                        <h4 className="font-bold text-navy flex items-center gap-2">
                                            <ShoppingCart size={18} className="text-gold" />
                                            Order Items
                                        </h4>
                                        <div className="border border-gray-100 rounded-2xl overflow-hidden">
                                            <div className="max-h-48 overflow-y-auto divide-y divide-gray-50">
                                                {selectedOrder.items.map((item: OrderItem, i: number) => (
                                                    <div key={i} className="p-3 flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-gray-50 rounded-lg flex-shrink-0">
                                                            {item.image_url && <img src={item.image_url} className="w-full h-full object-cover rounded-lg" />}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-xs font-bold truncate">{item.name}</p>
                                                            <p className="text-[10px] text-gray-500">{item.size} x {item.quantity}</p>
                                                        </div>
                                                        <p className="text-xs font-bold text-navy">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="bg-gray-50 p-4 space-y-2">
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-gray-500">Subtotal</span>
                                                    <span>Rs. {Number(selectedOrder.subtotal).toLocaleString()}</span>
                                                </div>
                                                {selectedOrder.discount_amount > 0 && (
                                                    <div className="flex justify-between text-xs text-green-600 font-medium">
                                                        <span>Discount ({selectedOrder.discount_percent}%)</span>
                                                        <span>- Rs. {Number(selectedOrder.discount_amount).toLocaleString()}</span>
                                                    </div>
                                                )}
                                                <div className="flex justify-between text-sm font-bold pt-2 border-t border-gray-200">
                                                    <span className="text-navy">Total</span>
                                                    <span className="text-gold">Rs. {Number(selectedOrder.total).toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    <button
                                        onClick={() => updateOrderStatus(selectedOrder.id, 'confirmed' as OrderStatus)}
                                        className="flex flex-col items-center gap-2 p-3 rounded-xl border border-blue-100 bg-blue-50/50 hover:bg-blue-50 text-blue-700 transition-colors"
                                    >
                                        <CheckCircle2 size={20} />
                                        <span className="text-[10px] font-bold uppercase">Confirm</span>
                                    </button>
                                    <button
                                        onClick={() => updateOrderStatus(selectedOrder.id, 'shipped' as OrderStatus)}
                                        className="flex flex-col items-center gap-2 p-3 rounded-xl border border-purple-100 bg-purple-50/50 hover:bg-purple-50 text-purple-700 transition-colors"
                                    >
                                        <Truck size={20} />
                                        <span className="text-[10px] font-bold uppercase">Ship</span>
                                    </button>
                                    <button
                                        onClick={() => updateOrderStatus(selectedOrder.id, 'delivered' as OrderStatus)}
                                        className="flex flex-col items-center gap-2 p-3 rounded-xl border border-green-100 bg-green-50/50 hover:bg-green-50 text-green-700 transition-colors"
                                    >
                                        <CheckCircle2 size={20} />
                                        <span className="text-[10px] font-bold uppercase">Deliver</span>
                                    </button>
                                    <button
                                        onClick={() => updateOrderStatus(selectedOrder.id, 'cancelled' as OrderStatus)}
                                        className="flex flex-col items-center gap-2 p-3 rounded-xl border border-red-100 bg-red-50/50 hover:bg-red-50 text-red-700 transition-colors"
                                    >
                                        <XCircle size={20} />
                                        <span className="text-[10px] font-bold uppercase">Cancel</span>
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 border-t border-gray-100 flex justify-between">
                                <button
                                    onClick={() => window.print()}
                                    className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors flex items-center gap-2"
                                >
                                    <Printer size={18} />
                                    Print Invoice
                                </button>
                                <a
                                    href={`https://wa.me/${selectedOrder.phone.replace(/[^0-9]/g, '')}`}
                                    target="_blank"
                                    className="px-6 py-2.5 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-colors flex items-center gap-2"
                                >
                                    <MessageCircle size={18} />
                                    Contact on WhatsApp
                                </a>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
