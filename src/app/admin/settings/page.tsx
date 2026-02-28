'use client';

import { useState, useEffect } from 'react';
import {
    Settings,
    Save,
    Image as ImageIcon,
    Link as LinkIcon,
    Mail,
    Phone,
    Facebook,
    Instagram,
    Globe,
    Loader2,
    Plus,
    X
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function SettingsPage() {
    const [settings, setSettings] = useState<any>({
        logo: '',
        contact: { phone: '', email: '', whatsapp: '' },
        socials: { facebook: '', instagram: '' },
        banners: [] as string[],
        deals_base_pricing: {
            local: 50000,
            normal: 100000,
            best: 200000,
            premium: 370000
        }
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const supabase = createClient();

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        const { data } = await supabase
            .from('site_settings')
            .select('*');

        if (data && data.length > 0) {
            const formatted = data.reduce((acc: any, curr: any) => {
                acc[curr.key] = curr.value;
                return acc;
            }, {});
            setSettings((prev: any) => ({ ...prev, ...formatted }));
        }
        setLoading(false);
    };

    const handleUpdate = (key: string, value: any) => {
        setSettings({ ...settings, [key]: value });
    };

    const handleNestedUpdate = (parent: string, key: string, value: any) => {
        setSettings({
            ...settings,
            [parent]: { ...settings[parent], [key]: value }
        });
    };

    const saveSettings = async () => {
        setSaving(true);
        try {
            const keys = Object.keys(settings);
            for (const key of keys) {
                const { error } = await supabase
                    .from('site_settings')
                    .upsert({ key, value: settings[key] }, { onConflict: 'key' });

                if (error) throw error;
            }
            alert('Settings saved successfully!');
        } catch (error) {
            console.error(error);
            alert('Error saving settings');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-gold" size={40} /></div>;

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-navy">Website Settings</h1>
                    <p className="text-gray-500 text-sm">Configure your site branding and contact information</p>
                </div>
                <button
                    onClick={saveSettings}
                    disabled={saving}
                    className="bg-gold text-navy px-8 py-3 rounded-lg font-bold hover:bg-gold-light transition-all flex items-center gap-2 shadow-lg shadow-gold/20 disabled:opacity-50"
                >
                    {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    Save All Settings
                </button>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Branding & Visuals */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                        <h3 className="font-bold text-navy flex items-center gap-2">
                            <ImageIcon className="text-gold" size={20} />
                            Branding & Banners
                        </h3>

                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase block mb-2">Logo URL</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={settings.logo}
                                    onChange={(e) => handleUpdate('logo', e.target.value)}
                                    className="flex-1 p-2.5 border border-gray-200 rounded-lg outline-none focus:border-gold text-sm"
                                    placeholder="https://..."
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase block mb-2">Homepage Banners</label>
                            <div className="space-y-3">
                                {settings.banners?.map((banner: string, i: number) => (
                                    <div key={i} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={banner}
                                            onChange={(e) => {
                                                const newBanners = [...settings.banners];
                                                newBanners[i] = e.target.value;
                                                handleUpdate('banners', newBanners);
                                            }}
                                            className="flex-1 p-2.5 border border-gray-200 rounded-lg outline-none focus:border-gold text-sm"
                                        />
                                        <button
                                            onClick={() => {
                                                const newBanners = settings.banners.filter((_: any, idx: number) => idx !== i);
                                                handleUpdate('banners', newBanners);
                                            }}
                                            className="p-2.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    onClick={() => handleUpdate('banners', [...(settings.banners || []), ''])}
                                    className="w-full py-2 border-2 border-dashed border-gray-100 rounded-xl text-gray-400 hover:text-gold hover:border-gold transition-all flex items-center justify-center gap-2 text-sm font-medium"
                                >
                                    <Plus size={16} />
                                    Add Banner Image
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                        <h3 className="font-bold text-navy flex items-center gap-2">
                            <Globe className="text-gold" size={20} />
                            Social Media Links
                        </h3>
                        <div className="grid gap-4">
                            <div className="relative">
                                <Facebook className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    value={settings.socials?.facebook}
                                    onChange={(e) => handleNestedUpdate('socials', 'facebook', e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-gold text-sm"
                                    placeholder="Facebook URL"
                                />
                            </div>
                            <div className="relative">
                                <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    value={settings.socials?.instagram}
                                    onChange={(e) => handleNestedUpdate('socials', 'instagram', e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-gold text-sm"
                                    placeholder="Instagram URL"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6 h-fit">
                    <h3 className="font-bold text-navy flex items-center gap-2">
                        <LinkIcon className="text-gold" size={20} />
                        Contact & Support
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase block mb-2">Display Phone</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    value={settings.contact?.phone}
                                    onChange={(e) => handleNestedUpdate('contact', 'phone', e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-gold text-sm"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase block mb-2">Display Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    value={settings.contact?.email}
                                    onChange={(e) => handleNestedUpdate('contact', 'email', e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-gold text-sm"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase block mb-2">WhatsApp Number (For floating button)</label>
                            <div className="relative">
                                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    value={settings.contact?.whatsapp}
                                    onChange={(e) => handleNestedUpdate('contact', 'whatsapp', e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-gold text-sm"
                                    placeholder="e.g. 923001234567"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <p className="text-[10px] text-gray-400 font-bold uppercase mb-2">Internal Note</p>
                        <p className="text-xs text-gray-600 leading-relaxed">
                            These details are used across the Navbar, Footer, and Contact page.
                            Changes will reflect instantly on the live site.
                        </p>
                    </div>
                </div>
                {/* Deals Pricing Defaults */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                    <h3 className="font-bold text-navy flex items-center gap-2">
                        <Settings className="text-gold" size={20} />
                        Deals / Projects Base Pricing
                    </h3>
                    <p className="text-xs text-gray-500">
                        Set the base prices for an <strong>80 Gaz (720 sq/ft)</strong> property. All other sizes will calculate proportionally.
                    </p>
                    <div className="grid gap-4">
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase block mb-2">Local Quality (PKR)</label>
                            <input
                                type="number"
                                value={settings.deals_base_pricing?.local || ''}
                                onChange={(e) => handleNestedUpdate('deals_base_pricing', 'local', Number(e.target.value))}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-gold text-sm"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase block mb-2">Normal Quality (PKR)</label>
                            <input
                                type="number"
                                value={settings.deals_base_pricing?.normal || ''}
                                onChange={(e) => handleNestedUpdate('deals_base_pricing', 'normal', Number(e.target.value))}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-gold text-sm"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase block mb-2">Best Quality (PKR)</label>
                            <input
                                type="number"
                                value={settings.deals_base_pricing?.best || ''}
                                onChange={(e) => handleNestedUpdate('deals_base_pricing', 'best', Number(e.target.value))}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-gold text-sm"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase block mb-2">Premium Quality (PKR)</label>
                            <input
                                type="number"
                                value={settings.deals_base_pricing?.premium || ''}
                                onChange={(e) => handleNestedUpdate('deals_base_pricing', 'premium', Number(e.target.value))}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-gold text-sm"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
