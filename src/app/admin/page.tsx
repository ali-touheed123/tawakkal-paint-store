'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { BRANDS, ProductCategory, SubCategory } from '@/types';
import { Upload, X, Loader2 } from 'lucide-react';

export default function AdminPage() {
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

  const supabase = createClient();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-off-white">
        <Loader2 className="animate-spin text-gold" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-off-white pt-[70px] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-heading text-3xl font-bold text-navy">Admin Panel - Products</h1>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-gold text-navy px-6 py-3 rounded-lg font-semibold hover:bg-gold-light"
          >
            + Add Product
          </button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              {product.image_url && (
                <img src={product.image_url} alt={product.name} className="w-full h-40 object-cover" />
              )}
              <div className="p-4">
                <p className="text-gold text-xs uppercase">{product.brand}</p>
                <h3 className="font-semibold text-navy truncate">{product.name}</h3>
                <p className="text-sm text-gray-500">Rs. {product.price_gallon.toLocaleString()}</p>
                <button
                  onClick={() => deleteProduct(product.id)}
                  className="mt-2 text-red-500 text-sm hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Product Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-heading text-xl font-bold text-navy">Add Product</h2>
                <button onClick={() => setShowAddForm(false)}><X size={24} /></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Brand *</label>
                    <select
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value as any })}
                      className="w-full p-2 border rounded-lg"
                    >
                      {BRANDS.map((b) => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as ProductCategory })}
                      className="w-full p-2 border rounded-lg"
                    >
                      <option value="decorative">Decorative</option>
                      <option value="industrial">Industrial</option>
                      <option value="auto">Auto</option>
                      <option value="projects">Projects</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Sub Category</label>
                  <select
                    value={formData.sub_category}
                    onChange={(e) => setFormData({ ...formData, sub_category: e.target.value as SubCategory })}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="interior">Interior</option>
                    <option value="exterior">Exterior</option>
                    <option value="wood_metal">Wood & Metal</option>
                    <option value="waterproofing">Waterproofing</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Quarter Price</label>
                    <input
                      type="number"
                      value={formData.price_quarter}
                      onChange={(e) => setFormData({ ...formData, price_quarter: Number(e.target.value) })}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Gallon Price *</label>
                    <input
                      type="number"
                      required
                      value={formData.price_gallon}
                      onChange={(e) => setFormData({ ...formData, price_gallon: Number(e.target.value) })}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Drum Price</label>
                    <input
                      type="number"
                      value={formData.price_drum}
                      onChange={(e) => setFormData({ ...formData, price_drum: Number(e.target.value) })}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Product Image</label>
                  <div className="border-2 border-dashed rounded-lg p-4 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <Upload className="mx-auto text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">
                        {imageFile ? imageFile.name : 'Click to upload image'}
                      </span>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full bg-gold text-navy py-3 rounded-lg font-semibold hover:bg-gold-light disabled:opacity-50"
                >
                  {uploading ? <Loader2 className="animate-spin mx-auto" /> : 'Add Product'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
