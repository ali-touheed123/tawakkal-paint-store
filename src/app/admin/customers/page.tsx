'use client';

import { useState, useEffect } from 'react';
import {
    Users,
    Search,
    MoreVertical,
    Ban,
    CheckCircle,
    History,
    Mail,
    Phone,
    Loader2,
    ShieldCheck,
    ShieldAlert
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function CustomersPage() {
    const [customers, setCustomers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const supabase = createClient();

    useEffect(() => {
        loadCustomers();
    }, []);

    const loadCustomers = async () => {
        // Fetch users with their order count and total spend
        const { data: userData, error } = await supabase
            .from('users')
            .select('*, orders(id, total, status)')
            .order('created_at', { ascending: false });

        if (error) {
            console.error(error);
        } else {
            const enhancedData = userData.map(user => {
                const deliveredOrders = user.orders?.filter((o: any) => o.status === 'delivered') || [];
                const totalSpent = deliveredOrders.reduce((sum: number, o: any) => sum + Number(o.total), 0);
                return {
                    ...user,
                    orderCount: user.orders?.length || 0,
                    totalSpent
                };
            });
            setCustomers(enhancedData);
        }
        setLoading(false);
    };

    const toggleBlockStatus = async (userId: string, currentStatus: boolean) => {
        const { error } = await supabase
            .from('users')
            .update({ is_blocked: !currentStatus })
            .eq('id', userId);

        if (error) {
            alert('Error updating user status');
        } else {
            setCustomers(customers.map(c =>
                c.id === userId ? { ...c, is_blocked: !currentStatus } : c
            ));
        }
    };

    const filteredCustomers = customers.filter(c =>
        c.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone?.includes(searchTerm)
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-navy">Customer Management</h1>
                    <p className="text-gray-500 text-sm">View customer insights and manage user access</p>
                </div>
                <div className="flex gap-4 bg-white p-1 rounded-xl shadow-sm border border-gray-100">
                    <div className="px-4 py-2 text-center border-r border-gray-100">
                        <p className="text-xs text-gray-400 uppercase font-bold">Total Users</p>
                        <p className="text-xl font-bold text-navy">{customers.length}</p>
                    </div>
                    <div className="px-4 py-2 text-center">
                        <p className="text-xs text-gray-400 uppercase font-bold">Blocked</p>
                        <p className="text-xl font-bold text-red-500">{customers.filter(c => c.is_blocked).length}</p>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by Name, Email or Phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-gold transition-colors"
                    />
                </div>
            </div>

            {/* Customers Table */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="animate-spin text-gold" size={40} />
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Orders</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Spend</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredCustomers.map((customer) => (
                                    <tr key={customer.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-navy text-gold flex items-center justify-center font-bold">
                                                    {customer.full_name?.charAt(0) || 'U'}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-navy">{customer.full_name || 'Anonymous'}</p>
                                                    <div className="flex items-center gap-2 text-xs text-gray-400">
                                                        <Mail size={12} />
                                                        {customer.email || 'No email'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {customer.is_blocked ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase transition-all">
                                                    <ShieldAlert size={12} />
                                                    Blocked
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase transition-all">
                                                    <ShieldCheck size={12} />
                                                    Active
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm text-navy font-medium">
                                                <History size={16} className="text-gray-400" />
                                                {customer.orderCount} Orders
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-bold text-navy">Rs. {customer.totalSpent.toLocaleString()}</p>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => toggleBlockStatus(customer.id, customer.is_blocked)}
                                                    className={`p-2 rounded-lg transition-colors ${customer.is_blocked
                                                            ? 'text-green-600 hover:bg-green-50'
                                                            : 'text-red-600 hover:bg-red-50'
                                                        }`}
                                                    title={customer.is_blocked ? 'Unblock User' : 'Block User'}
                                                >
                                                    {customer.is_blocked ? <CheckCircle size={20} /> : <Ban size={20} />}
                                                </button>
                                                <button className="p-2 text-gray-400 hover:text-navy transition-colors">
                                                    <MoreVertical size={20} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
