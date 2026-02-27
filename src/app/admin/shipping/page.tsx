'use client';

import { useState, useEffect } from 'react';
import {
    Truck,
    Plus,
    Trash2,
    Save,
    MapPin,
    Loader2,
    AlertCircle
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function ShippingPage() {
    const [rates, setRates] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const supabase = createClient();

    useEffect(() => {
        loadRates();
    }, []);

    const loadRates = async () => {
        const { data } = await supabase
            .from('shipping_rates')
            .select('*')
            .order('city', { ascending: true });

        if (data) setRates(data);
        setLoading(false);
    };

    const handleUpdate = (id: string, field: string, value: any) => {
        setRates(rates.map(r => r.id === id ? { ...r, [field]: value } : r));
    };

    const saveRates = async () => {
        setSaving(true);
        try {
            for (const rate of rates) {
                const { error } = await supabase
                    .from('shipping_rates')
                    .update({
                        city: rate.city,
                        area: rate.area,
                        rate: rate.rate,
                        min_order_for_free: rate.min_order_for_free,
                        is_active: rate.is_active
                    })
                    .eq('id', rate.id);

                if (error) throw error;
            }
            alert('Shipping rates updated successfully!');
        } catch (error) {
            console.error(error);
            alert('Error saving rates');
        } finally {
            setSaving(false);
        }
    };

    const deleteRate = async (id: string) => {
        if (!confirm('Delete this shipping rate?')) return;
        const { error } = await supabase.from('shipping_rates').delete().eq('id', id);
        if (!error) loadRates();
    };

    const addNewRate = async () => {
        const { data, error } = await supabase
            .from('shipping_rates')
            .insert({
                city: 'Karachi',
                area: 'New Area',
                rate: 200,
                min_order_for_free: 5000,
                is_active: true
            })
            .select();

        if (data) setRates([...rates, data[0]]);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-navy">Shipping & Delivery</h1>
                    <p className="text-gray-500 text-sm">Manage city-wise delivery charges and free shipping thresholds</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={addNewRate}
                        className="px-4 py-2 border border-gray-200 rounded-lg hover:border-gold transition-colors text-sm font-semibold flex items-center gap-2"
                    >
                        <Plus size={18} />
                        Add Rate
                    </button>
                    <button
                        onClick={saveRates}
                        disabled={saving}
                        className="bg-gold text-navy px-6 py-2 rounded-lg font-bold hover:bg-gold-light transition-all flex items-center gap-2 shadow-lg shadow-gold/20 disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        Save Changes
                    </button>
                </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-2xl flex items-start gap-3">
                <AlertCircle className="text-yellow-600 mt-0.5" size={20} />
                <div>
                    <p className="text-sm text-yellow-900 font-medium">Free Shipping Logic</p>
                    <p className="text-xs text-yellow-700 mt-1">
                        "Min Order for Free" sets the subtotal required for Rs. 0 shipping.
                        If left blank or 0, free shipping is disabled for that area.
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
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">City</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Area / Region</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Standard Rate</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Free Over (PKR)</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {rates.map((rate) => (
                                    <tr key={rate.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <input
                                                type="text"
                                                value={rate.city}
                                                onChange={(e) => handleUpdate(rate.id, 'city', e.target.value)}
                                                className="w-full p-2 border border-gray-200 rounded-lg focus:border-gold outline-none font-medium text-navy"
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <MapPin size={14} className="text-gray-400" />
                                                <input
                                                    type="text"
                                                    value={rate.area}
                                                    onChange={(e) => handleUpdate(rate.id, 'area', e.target.value)}
                                                    className="w-full p-2 border border-gray-200 rounded-lg focus:border-gold outline-none text-sm"
                                                />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-400 text-xs font-bold">Rs.</span>
                                                <input
                                                    type="number"
                                                    value={rate.rate}
                                                    onChange={(e) => handleUpdate(rate.id, 'rate', Number(e.target.value))}
                                                    className="w-24 p-2 border border-gray-200 rounded-lg focus:border-gold outline-none font-mono"
                                                />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <input
                                                type="number"
                                                placeholder="e.g. 5000"
                                                value={rate.min_order_for_free || ''}
                                                onChange={(e) => handleUpdate(rate.id, 'min_order_for_free', Number(e.target.value))}
                                                className="w-24 p-2 border border-gray-200 rounded-lg focus:border-gold outline-none font-mono"
                                            />
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => deleteRate(rate.id)}
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

            {/* Visual Indicator */}
            <div className="p-6 bg-white border border-gray-100 rounded-2xl flex items-center gap-6">
                <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center text-gold">
                    <Truck size={32} />
                </div>
                <div>
                    <h3 className="font-bold text-navy">Coverage Alert</h3>
                    <p className="text-xs text-gray-500 mt-1 max-w-md">
                        Any areas not listed here will default to a manual quote during checkout.
                        Ensure your top delivery zones are accurately priced.
                    </p>
                </div>
            </div>
        </div>
    );
}
