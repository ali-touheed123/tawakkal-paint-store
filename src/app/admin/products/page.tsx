'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { BRANDS, ProductCategory, SubCategory } from '@/types';
import { Upload, X, Loader2, Plus, Search, Filter, Trash2, Edit } from 'lucide-react';

export default function ProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        brand: BRANDS[0],
        category: 'decorative' as ProductCategory,
        sub_category: 'interior' as SubCategory,
        description: '',
        price_quarter: 0,
        price_gallon: 0,
        price_drum: 0,
        in_stock: true
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const supabase = createClient();

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        setLoading(true);
        const { data } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });
        if (data) setProducts(data);
        setLoading(false);
    };

    const handleImageUpload = async (file: File): Promise<string> => {
        const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
        const { data, error } = await supabase.storage
            .from('products')
            .upload(fileName, file);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
            .from('products')
            .getPublicUrl(fileName);

        return publicUrl;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);

        try {
            let imageUrl = '';

            if (imageFile) {
                imageUrl = await handleImageUpload(imageFile);
            }

            const { error } = await supabase.from('products').insert({
                ...formData,
                image_url: imageUrl
            });

            if (error) throw error;

            setShowAddForm(false);
            setFormData({
                name: '',
                brand: BRANDS[0],
                category: 'decorative',
                sub_category: 'interior',
                description: '',
                price_quarter: 0,
                price_gallon: 0,
                price_drum: 0,
                in_stock: true
            });
            setImageFile(null);
            loadProducts();
        } catch (error) {
            console.error(error);
            alert('Error adding product');
        } finally {
            setUploading(false);
        }
    };

    const deleteProduct = async (id: string) => {
        if (!confirm('Delete this product?')) return;
        await supabase.from('products').delete().eq('id', id);
        loadProducts();
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-navy">Product Management</h1>
                    <p className="text-gray-500 text-sm">Manage your inventory and product listings</p>
                </div>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="bg-gold text-navy px-4 py-2 rounded-lg font-semibold hover:bg-gold-light flex items-center gap-2 transition-colors shadow-sm"
                >
                    <Plus size={20} />
                    Add Product
                </button>
            </div>

            {/* Filters & Search */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gold transition-colors"
                    />
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:border-gold transition-colors text-sm font-medium">
                        <Filter size={16} />
                        Filter
                    </button>
                </div>
            </div>

            {/* Products Table/Grid */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="animate-spin text-gold" size={40} />
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Brand</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price (Gallon)</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {product.image_url ? (
                                                    <img src={product.image_url} alt="" className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                                                        <Package size={20} />
                                                    </div>
                                                )}
                                                <span className="font-medium text-navy">{product.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 bg-gold/10 text-gold rounded text-xs font-bold uppercase">
                                                {product.brand}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {product.category}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-semibold text-navy">
                                            Rs. {product.price_gallon.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${product.in_stock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                {product.in_stock ? 'In Stock' : 'Out of Stock'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button className="p-2 text-gray-400 hover:text-gold transition-colors">
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => deleteProduct(product.id)}
                                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 size={18} />
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

            {/* Add Product Modal */}
            {showAddForm && (
                <div className="fixed inset-0 bg-navy/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-navy">Add New Product</h2>
                            <button
                                onClick={() => setShowAddForm(false)}
                                className="text-gray-400 hover:text-navy transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Product Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none transition-all"
                                    placeholder="e.g. Diamond Ace Emulsion"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Brand *</label>
                                    <select
                                        value={formData.brand}
                                        onChange={(e) => setFormData({ ...formData, brand: e.target.value as any })}
                                        className="w-full p-2.5 border border-gray-200 rounded-lg focus:border-gold outline-none"
                                    >
                                        {BRANDS.map((b) => <option key={b} value={b}>{b}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Category *</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value as ProductCategory })}
                                        className="w-full p-2.5 border border-gray-200 rounded-lg focus:border-gold outline-none"
                                    >
                                        <option value="decorative">Decorative</option>
                                        <option value="industrial">Industrial</option>
                                        <option value="auto">Auto</option>
                                        <option value="projects">Projects</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full p-2.5 border border-gray-200 rounded-lg focus:border-gold outline-none"
                                    rows={2}
                                    placeholder="Tell us about the product..."
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Quarter Price</label>
                                    <input
                                        type="number"
                                        value={formData.price_quarter}
                                        onChange={(e) => setFormData({ ...formData, price_quarter: Number(e.target.value) })}
                                        className="w-full p-2.5 border border-gray-200 rounded-lg focus:border-gold outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Gallon Price *</label>
                                    <input
                                        type="number"
                                        required
                                        value={formData.price_gallon}
                                        onChange={(e) => setFormData({ ...formData, price_gallon: Number(e.target.value) })}
                                        className="w-full p-2.5 border border-gray-200 rounded-lg focus:border-gold outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Drum Price</label>
                                    <input
                                        type="number"
                                        value={formData.price_drum}
                                        onChange={(e) => setFormData({ ...formData, price_drum: Number(e.target.value) })}
                                        className="w-full p-2.5 border border-gray-200 rounded-lg focus:border-gold outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Product Image</label>
                                <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-gold transition-colors group cursor-pointer relative">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                    <Upload className="mx-auto text-gray-400 group-hover:text-gold mb-2 transition-colors" size={32} />
                                    <p className="text-sm text-gray-500">
                                        {imageFile ? <span className="text-gold font-medium">{imageFile.name}</span> : 'Click or drag image to upload'}
                                    </p>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={uploading}
                                className="w-full bg-gold text-navy py-4 rounded-xl font-bold hover:bg-gold-light disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-gold/20"
                            >
                                {uploading ? <Loader2 className="animate-spin" /> : (
                                    <>
                                        <Plus size={20} />
                                        Create Product
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
