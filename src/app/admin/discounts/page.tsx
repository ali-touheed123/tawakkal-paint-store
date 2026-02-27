'use client';

import { useState, useEffect } from 'react';
import {
    Percent,
    Plus,
    Trash2,
    Save,
    AlertCircle,
    Info,
    CheckCircle2,
    Loader2
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function DiscountsPage() {
    const [rules, setRules] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const supabase = createClient();

    useEffect(() => {
        loadRules();
    }, []);

    const loadRules = async () => {
        const { data } = await supabase
            .from('discount_rules')
            .select('*')
            .order('min_amount', { ascending: true });

        if (data) setRules(data);
        setLoading(false);
    };

    const handleUpdate = (id: string, field: string, value: any) => {
        setRules(rules.map(r => r.id === id ? { ...r, [field]: value } : r));
    };

    const saveRules = async () => {
        setSaving(true);
        try {
            for (const rule of rules) {
                const { error } = await supabase
                    .from('discount_rules')
                    .update({
                        min_amount: rule.min_amount,
                        max_amount: rule.max_amount,
                        discount_percent: rule.discount_percent,
                        is_active: rule.is_active
                    })
                    .eq('id', rule.id);

                if (error) throw error;
            }
            alert('Discount rules updated successfully!');
        } catch (error) {
            console.error(error);
            alert('Error saving rules');
        } finally {
            setSaving(false);
        }
    };

    const deleteRule = async (id: string) => {
        if (!confirm('Delete this discount rule?')) return;
        const { error } = await supabase.from('discount_rules').delete().eq('id', id);
        if (!error) loadRules();
    };

    const addNewRule = async () => {
        const { data, error } = await supabase
            .from('discount_rules')
            .insert({
                min_amount: 0,
                max_amount: 0,
                discount_percent: 0,
                is_active: true
            })
            .select();

        if (data) setRules([...rules, data[0]]);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-navy">Discount Management</h1>
                    <p className="text-gray-500 text-sm">Configure automatic cart-total based discounts</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={addNewRule}
                        className="px-4 py-2 border border-gray-200 rounded-lg hover:border-gold transition-colors text-sm font-semibold flex items-center gap-2"
                    >
                        <Plus size={18} />
                        Add Rule
                    </button>
                    <button
                        onClick={saveRules}
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
                    <p className="text-sm text-blue-900 font-medium">Automatic Discounts</p>
                    <p className="text-xs text-blue-700 mt-1">
                        These discounts are applied automatically at the checkout based on the subtotal.
                        The system will find the highest matching tier for the customer.
                    </p>
                </div>
            </div>

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
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Min Amount (PKR)</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Max Amount (PKR)</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Discount %</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Status</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {rules.map((rule) => (
                                    <tr key={rule.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <input
                                                type="number"
                                                value={rule.min_amount}
                                                onChange={(e) => handleUpdate(rule.id, 'min_amount', Number(e.target.value))}
                                                className="w-32 p-2 border border-gray-200 rounded-lg focus:border-gold outline-none font-mono"
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <input
                                                type="number"
                                                value={rule.max_amount}
                                                onChange={(e) => handleUpdate(rule.id, 'max_amount', Number(e.target.value))}
                                                className="w-32 p-2 border border-gray-200 rounded-lg focus:border-gold outline-none font-mono"
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    value={rule.discount_percent}
                                                    onChange={(e) => handleUpdate(rule.id, 'discount_percent', Number(e.target.value))}
                                                    className="w-20 p-2 border border-gray-200 rounded-lg focus:border-gold outline-none font-mono text-center"
                                                />
                                                <span className="text-gray-400 font-bold">%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => handleUpdate(rule.id, 'is_active', !rule.is_active)}
                                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${rule.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'
                                                    }`}
                                            >
                                                {rule.is_active ? (
                                                    <>
                                                        <CheckCircle2 size={12} />
                                                        Active
                                                    </>
                                                ) : 'Disabled'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => deleteRule(rule.id)}
                                                className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Logic Preview */}
            <div className="bg-navy rounded-2xl p-6 text-white shadow-xl">
                <h3 className="font-bold flex items-center gap-2 mb-4">
                    <AlertCircle className="text-gold" size={20} />
                    Current Strategy Comparison
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {rules.sort((a, b) => a.min_amount - b.min_amount).map((rule, i) => (
                        <div key={i} className={`p-4 rounded-xl border-2 transition-all ${rule.is_active ? 'border-gold/30 bg-white/5' : 'border-white/10 opacity-50'}`}>
                            <p className="text-[10px] text-white/40 uppercase font-black mb-1">Rule {i + 1}</p>
                            <p className="text-sm font-bold text-gold">{rule.discount_percent}% OFF</p>
                            <p className="text-[10px] text-white/60 mt-2">
                                Orders from {rule.min_amount.toLocaleString()} PKR to {rule.max_amount > 1000000 ? 'Any' : rule.max_amount.toLocaleString() + ' PKR'}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
