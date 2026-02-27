'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { Category, Brand } from '@/types';
import {
    Plus,
    Trash2,
    Edit,
    Upload,
    X,
    Loader2,
    Image as ImageIcon,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';

export default function TaxonomyPage() {
    const [activeTab, setActiveTab] = useState<'categories' | 'brands'>('categories');
    const [categories, setCategories] = useState<Category[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);

    const supabase = createClient();

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        setLoading(true);
        const [catsRes, brandsRes] = await Promise.all([
            supabase.from('categories').select('*').order('name'),
            supabase.from('brands').select('*').order('name')
        ]);
        if (catsRes.data) setCategories(catsRes.data);
        if (brandsRes.data) setBrands(brandsRes.data);
        setLoading(false);
    }

    const handleImageUpload = async (file: File, folder: string): Promise<string> => {
        const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
        const { data, error } = await supabase.storage
            .from(folder)
            .upload(fileName, file);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
            .from(folder)
            .getPublicUrl(fileName);

        return publicUrl;
    };

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSaving(true);
        const formData = new FormData(e.currentTarget);
        const name = formData.get('name') as string;
        const slug = formData.get('slug') as string;
        const description = formData.get('description') as string;

        try {
            let imageUrl = editingItem?.image_url || editingItem?.logo_url || '';

            if (imageFile) {
                imageUrl = await handleImageUpload(imageFile, activeTab === 'categories' ? 'categories' : 'brands');
            }

            const payload: any = { name, slug };
            if (activeTab === 'categories') {
                payload.description = description;
                payload.image_url = imageUrl;
            } else {
                payload.logo_url = imageUrl;
            }

            let res;
            if (editingItem) {
                res = await supabase.from(activeTab).update(payload).eq('id', editingItem.id);
            } else {
                res = await supabase.from(activeTab).insert(payload);
            }

            if (res.error) throw res.error;

            setIsModalOpen(false);
            setEditingItem(null);
            setImageFile(null);
            fetchData();
        } catch (error) {
            console.error(error);
            alert('Error saving data');
        } finally {
            setIsSaving(false);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm(`Are you sure you want to delete this ${activeTab === 'categories' ? 'category' : 'brand'}?`)) return;
        const res = await supabase.from(activeTab).delete().eq('id', id);
        if (res.error) {
            alert('Error deleting. Ensure no products are linked.');
        } else {
            fetchData();
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-navy">Taxonomy Management</h1>
                    <p className="text-gray-500 text-sm">Manage your product categories and brands</p>
                </div>
                <button
                    onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
                    className="bg-gold text-navy px-4 py-2 rounded-lg font-semibold hover:bg-gold-light flex items-center gap-2 transition-colors shadow-sm"
                >
                    <Plus size={20} />
                    Add {activeTab === 'categories' ? 'Category' : 'Brand'}
                </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('categories')}
                    className={`px-6 py-3 font-medium transition-colors relative ${activeTab === 'categories' ? 'text-gold' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Categories
                    {activeTab === 'categories' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />}
                </button>
                <button
                    onClick={() => setActiveTab('brands')}
                    className={`px-6 py-3 font-medium transition-colors relative ${activeTab === 'brands' ? 'text-gold' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Brands
                    {activeTab === 'brands' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />}
                </button>
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="animate-spin text-gold" size={40} />
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {activeTab === 'categories' ? categories.map(cat => (
                        <div key={cat.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group">
                            <div className="aspect-video bg-gray-100 relative">
                                {cat.image_url ? (
                                    <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <ImageIcon size={40} />
                                    </div>
                                )}
                                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => { setEditingItem(cat); setIsModalOpen(true); }} className="p-2 bg-white/90 rounded-lg text-navy hover:bg-white shadow-lg"><Edit size={16} /></button>
                                    <button onClick={() => handleDelete(cat.id)} className="p-2 bg-white/90 rounded-lg text-red-500 hover:bg-white shadow-lg"><Trash2 size={16} /></button>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-navy">{cat.name}</h3>
                                <p className="text-xs text-gold font-medium uppercase tracking-wider mb-2">{cat.slug}</p>
                                <p className="text-sm text-gray-500 line-clamp-2">{cat.description}</p>
                            </div>
                        </div>
                    )) : brands.map(brand => (
                        <div key={brand.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-4 group">
                            <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100">
                                {brand.logo_url ? (
                                    <img src={brand.logo_url} alt={brand.name} className="w-full h-full object-contain p-2" />
                                ) : (
                                    <ImageIcon size={24} className="text-gray-300" />
                                )}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-navy">{brand.name}</h3>
                                <p className="text-xs text-gold font-medium uppercase">{brand.slug}</p>
                            </div>
                            <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => { setEditingItem(brand); setIsModalOpen(true); }} className="p-2 text-navy hover:bg-gray-50 rounded-lg"><Edit size={16} /></button>
                                <button onClick={() => handleDelete(brand.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 bg-navy/60 backdrop-blur-sm flex items-center justify-center z-[70] p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-navy">{editingItem ? 'Edit' : 'Add'} {activeTab === 'categories' ? 'Category' : 'Brand'}</h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-navy"><X size={24} /></button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        defaultValue={editingItem?.name || ''}
                                        className="w-full p-2.5 border border-gray-200 rounded-lg focus:border-gold outline-none"
                                        placeholder={`e.g. ${activeTab === 'categories' ? 'Decorative' : 'Berger'}`}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Slug *</label>
                                    <input
                                        type="text"
                                        name="slug"
                                        required
                                        defaultValue={editingItem?.slug || ''}
                                        className="w-full p-2.5 border border-gray-200 rounded-lg focus:border-gold outline-none"
                                        placeholder="e.g. interior-paints"
                                    />
                                </div>
                                {activeTab === 'categories' && (
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                                        <textarea
                                            name="description"
                                            defaultValue={editingItem?.description || ''}
                                            className="w-full p-2.5 border border-gray-200 rounded-lg focus:border-gold outline-none"
                                            rows={2}
                                        />
                                    </div>
                                )}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">{activeTab === 'categories' ? 'Image' : 'Logo'}</label>
                                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-gold transition-colors relative">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                        />
                                        <Upload className="mx-auto text-gray-400 mb-2" size={24} />
                                        <p className="text-xs text-gray-500">
                                            {imageFile ? imageFile.name : 'Click to upload'}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="w-full bg-gold text-navy py-3 rounded-xl font-bold hover:bg-gold-light disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                                >
                                    {isSaving ? <Loader2 className="animate-spin" /> : (editingItem ? 'Update' : 'Create')}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
