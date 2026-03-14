'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Save, Loader2, Briefcase, Plus, Trash2, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PACKAGE_IDS = ['local', 'normal', 'best', 'premium'];

export default function DealsManagement() {
  const [pricing, setPricing] = useState<Record<string, number>>({
    local: 0,
    normal: 0,
    best: 0,
    premium: 0
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    async function fetchPricing() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('key', 'deals_base_pricing')
        .single();

      if (data && data.value) {
        setPricing(data.value);
      } else if (error && error.code !== 'PGRST116') {
        console.error('Error fetching deals pricing:', error);
      }
      setLoading(false);
    }
    fetchPricing();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    const supabase = createClient();

    try {
      // Use upsert to update or create
      const { error } = await supabase
        .from('site_settings')
        .upsert({ 
          key: 'deals_base_pricing', 
          value: pricing,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      setMessage({ type: 'success', text: 'Pricing updated successfully!' });
    } catch (error: any) {
      console.error('Error saving deals pricing:', error);
      setMessage({ type: 'error', text: 'Failed to update pricing.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-navy" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-navy flex items-center gap-3">
            <Briefcase className="text-gold" />
            Deals & Projects Management
          </h1>
          <p className="text-gray-500 mt-2">Manage base pricing for the deals calculator (80 Gaz house estimate).</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-navy text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-navy/90 transition-all disabled:opacity-50 shadow-lg shadow-navy/20"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={18} />}
          {saving ? 'Saving...' : 'Save Pricing'}
        </button>
      </div>

      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`p-4 rounded-xl border ${
              message.type === 'success' ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700'
            }`}
          >
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 bg-gray-50/50">
          <div className="flex items-center gap-2 text-navy font-bold">
            <Info size={18} className="text-gold" />
            Pricing Logic Note
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Prices entered here are for a standard **80 Gaz property**. The calculator will automatically scale these prices for larger properties (120 Gaz, 1000 Gaz, etc.) based on square footage.
          </p>
        </div>

        <div className="p-8">
          <div className="grid sm:grid-cols-2 gap-8">
            {PACKAGE_IDS.map((id) => (
              <div key={id} className="space-y-3">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest block">
                  {id} Quality Base Price
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">Rs.</div>
                  <input
                    type="number"
                    value={pricing[id] || 0}
                    onChange={(e) => setPricing(prev => ({ ...prev, [id]: Number(e.target.value) }))}
                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all font-bold text-navy"
                    placeholder="Enter amount"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-300 uppercase">
                    80 Gaz
                  </div>
                </div>
                <p className="text-[10px] text-gray-400 font-medium">
                  Standard estimate for {id} quality materials and labor.
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gold/5 border border-gold/10 p-6 rounded-2xl">
        <h3 className="font-bold text-navy mb-2">How it works on the site:</h3>
        <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
          <li>Admin saves the base prices for an 80 Gaz house here.</li>
          <li>Customer selects their property size (e.g., 200 Gaz).</li>
          <li>Calculator applies a multiplier: <code className="bg-white px-1 rounded opacity-80 text-navy font-mono">new_price = base_price * (new_sqft / 720)</code></li>
          <li>If customer unchecks "With Labour", price is reduced by 25%.</li>
          <li>Standard site-wide discounts are also applied to the final total.</li>
        </ul>
      </div>
    </div>
  );
}
