'use client';

import { useState, useEffect } from 'react';
import {
    CreditCard,
    Plus,
    Trash2,
    Save,
    Banknote,
    Smartphone,
    CheckCircle2,
    Loader2,
    Info
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function PaymentsPage() {
    const [methods, setMethods] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const supabase = createClient();

    useEffect(() => {
        loadMethods();
    }, []);

    const loadMethods = async () => {
        const { data } = await supabase
            .from('payment_methods')
            .select('*')
            .order('created_at', { ascending: true });

        if (data) setMethods(data);
        setLoading(false);
    };

    const handleUpdate = (id: string, field: string, value: any) => {
        setMethods(methods.map(m => m.id === id ? { ...m, [field]: value } : m));
    };

    const saveMethods = async () => {
        setSaving(true);
        try {
            for (const method of methods) {
                const { error } = await supabase
                    .from('payment_methods')
                    .update({
                        name: method.name,
                        type: method.type,
                        details: method.details,
                        is_active: method.is_active
                    })
                    .eq('id', method.id);

                if (error) throw error;
            }
            alert('Payment methods updated successfully!');
        } catch (error) {
            console.error(error);
            alert('Error saving methods');
        } finally {
            setSaving(false);
        }
    };

    const deleteMethod = async (id: string) => {
        if (!confirm('Delete this payment method?')) return;
        const { error } = await supabase.from('payment_methods').delete().eq('id', id);
        if (!error) loadMethods();
    };

    const addNewMethod = async () => {
        const { data } = await supabase
            .from('payment_methods')
            .insert({
                name: 'New Method',
                type: 'bank',
                details: 'Account Details...',
                is_active: true
            })
            .select();

        if (data) setMethods([...methods, data[0]]);
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'cod': return <Banknote className="text-green-600" size={24} />;
            case 'bank': return <CreditCard className="text-blue-600" size={24} />;
            default: return <Smartphone className="text-purple-600" size={24} />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-navy">Payment Settings</h1>
                    <p className="text-gray-500 text-sm">Configure available payment options for your customers</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={addNewMethod}
                        className="px-4 py-2 border border-gray-200 rounded-lg hover:border-gold transition-colors text-sm font-semibold flex items-center gap-2"
                    >
                        <Plus size={18} />
                        Add Method
                    </button>
                    <button
                        onClick={saveMethods}
                        disabled={saving}
                        className="bg-gold text-navy px-6 py-2 rounded-lg font-bold hover:bg-gold-light transition-all flex items-center gap-2 shadow-lg shadow-gold/20 disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        Save Changes
                    </button>
                </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex items-start gap-3">
                <Info className="text-blue-600 mt-0.5" size={20} />
                <div>
                    <p className="text-sm text-blue-900 font-medium">Customer View</p>
                    <p className="text-xs text-blue-700 mt-1">
                        Only "Active" payment methods will be visible to customers during checkout.
                        Ensure "Bank" methods include clear account details.
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="animate-spin text-gold" size={40} />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {methods.map((method) => (
                        <div key={method.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-gray-50 rounded-xl">
                                        {getIcon(method.type)}
                                    </div>
                                    <select
                                        value={method.type}
                                        onChange={(e) => handleUpdate(method.id, 'type', e.target.value)}
                                        className="bg-transparent font-bold text-navy outline-none border-b-2 border-transparent focus:border-gold"
                                    >
                                        <option value="cod">Cash on Delivery</option>
                                        <option value="bank">Bank Transfer</option>
                                        <option value="jazz_cash">JazzCash</option>
                                        <option value="easy_paisa">Easypaisa</option>
                                    </select>
                                </div>
                                <button
                                    onClick={() => handleUpdate(method.id, 'is_active', !method.is_active)}
                                    className={`p-2 rounded-full transition-colors ${method.is_active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                                        }`}
                                >
                                    <CheckCircle2 size={24} />
                                </button>
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Display Name</label>
                                <input
                                    type="text"
                                    value={method.name}
                                    onChange={(e) => handleUpdate(method.id, 'name', e.target.value)}
                                    className="w-full p-2.5 border border-gray-200 rounded-lg focus:border-gold outline-none"
                                    placeholder="e.g. Bank Al Habib"
                                />
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Method Details / Instructions</label>
                                <textarea
                                    value={method.details || ''}
                                    onChange={(e) => handleUpdate(method.id, 'details', e.target.value)}
                                    className="w-full p-2.5 border border-gray-200 rounded-lg focus:border-gold outline-none text-sm"
                                    rows={3}
                                    placeholder="Enter account number, owner name, or COD instructions..."
                                />
                            </div>

                            <div className="pt-2 flex justify-end">
                                <button
                                    onClick={() => deleteMethod(method.id)}
                                    className="text-xs text-red-500 hover:underline flex items-center gap-1"
                                >
                                    <Trash2 size={14} />
                                    Delete Method
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
