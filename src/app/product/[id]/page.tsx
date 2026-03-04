'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft,
    ShoppingCart,
    MessageCircle,
    ShieldCheck,
    Truck,
    Package,
    Info,
    ArrowRight
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Product, ItemSize } from '@/types';
import { useCartStore } from '@/lib/store';
import { ShadeSelector, Shade } from '@/components/ShadeSelector';
import { SimpleVisualizer } from '@/components/SimpleVisualizer';
import Link from 'next/link';

export default function ProductDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState<ItemSize>('gallon');
    const [quantity, setQuantity] = useState(1);
    const [shades, setShades] = useState<Shade[]>([]);
    const [selectedShade, setSelectedShade] = useState<Shade | null>(null);
    const [addingToCart, setAddingToCart] = useState(false);

    const { addItem } = useCartStore();

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            const supabase = createClient();

            // Fetch product details
            const { data: productData, error: productError } = await supabase
                .from('products')
                .select('*')
                .eq('id', id)
                .single();

            if (productData) {
                setProduct(productData);

                // Fetch shades for this product
                const { data: shadeData, error: shadeError } = await supabase
                    .from('product_shades')
                    .select('*')
                    .eq('product_id', id)
                    .order('name');

                if (shadeData) {
                    setShades(shadeData);
                } else {
                    // Placeholder shades for testing if DB is not yet seeded
                    if (productData.name === 'Brighto Super Emulsion') {
                        setShades([
                            { id: '1', name: 'White', code: 'B-101', hex: '#FFFFFF', is_drum_available: true },
                            { id: '2', name: 'Ash White', code: 'B-102', hex: '#F2F2F2', is_drum_available: true },
                            { id: '3', name: 'Off White', code: 'B-103', hex: '#FAF9F6', is_drum_available: true },
                            { id: '4', name: 'Soft Rose', code: 'B-104', hex: '#FFD1DC', is_drum_available: false },
                            { id: '5', name: 'Sky Blue', code: 'B-105', hex: '#87CEEB', is_drum_available: false },
                            { id: '6', name: 'Garden Green', code: 'B-106', hex: '#90EE90', is_drum_available: false },
                        ]);
                    }
                }
            }
            setLoading(false);
        };

        if (id) fetchProduct();
    }, [id]);

    const price = selectedSize === 'quarter'
        ? product?.price_quarter
        : selectedSize === 'gallon'
            ? product?.price_gallon
            : product?.price_drum;

    const handleAddToCart = () => {
        if (!product) return;
        setAddingToCart(true);
        // Include shade in metadata or special property if needed
        addItem(product.id, selectedSize, quantity, {
            ...product,
            // We could pass selectedShade here to store it in the cart
        });
        setTimeout(() => setAddingToCart(false), 500);
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-32 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen pt-32 text-center text-gray-500">
                Product not found.
            </div>
        );
    }

    const isBrightoSuperEmulsion = product.name === 'Brighto Super Emulsion';

    return (
        <div className="min-h-screen pt-[70px] bg-white">
            {/* Top Banner/Breadcrumb */}
            <div className="bg-gray-50 border-b border-gray-100 py-3">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-navy"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-500 overflow-hidden whitespace-nowrap">
                        <Link href="/" className="hover:text-gold uppercase tracking-tighter">Home</Link>
                        <ArrowRight size={10} className="shrink-0" />
                        <Link href={`/category/${product.category}`} className="hover:text-gold uppercase tracking-tighter line-clamp-1">{product.category}</Link>
                        <ArrowRight size={10} className="shrink-0" />
                        <span className="text-navy uppercase tracking-tighter truncate font-bold">{product.name}</span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                <div className="grid lg:grid-cols-12 gap-12">

                    {/* Left Column: Media & Visualizer */}
                    <div className="lg:col-span-12 xl:col-span-7 space-y-8">
                        <div className="sticky top-[140px] space-y-8">
                            {/* Main Visualizer or Product Image */}
                            {isBrightoSuperEmulsion ? (
                                <SimpleVisualizer
                                    color={selectedShade?.hex || '#FFFFFF'}
                                    name={selectedShade?.name || 'White'}
                                />
                            ) : (
                                <div className="aspect-square bg-white rounded-3xl border border-gray-100 p-8 flex items-center justify-center shadow-lg overflow-hidden group">
                                    <img
                                        src={product.image_url || '/images/products/placeholder.webp'}
                                        alt={product.name}
                                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
                                    />
                                </div>
                            )}

                            {/* Product Badges */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex flex-col items-center text-center gap-2">
                                    <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center text-gold">
                                        <ShieldCheck size={20} />
                                    </div>
                                    <span className="text-[10px] font-bold text-navy uppercase">100% Original</span>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex flex-col items-center text-center gap-2">
                                    <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center text-gold">
                                        <Truck size={20} />
                                    </div>
                                    <span className="text-[10px] font-bold text-navy uppercase">Standard Delivery</span>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex flex-col items-center text-center gap-2">
                                    <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center text-gold">
                                        <Package size={20} />
                                    </div>
                                    <span className="text-[10px] font-bold text-navy uppercase">Secure Packing</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Shopping Logic */}
                    <div className="lg:col-span-12 xl:col-span-5 space-y-8">
                        <div>
                            <span className="inline-block py-1 px-3 bg-gold/10 text-gold rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
                                {product.brand} • {product.category}
                            </span>
                            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-navy leading-tight mb-4">
                                {product.name}
                            </h1>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="text-3xl font-bold text-navy">
                                    Rs. {price?.toLocaleString()}
                                </div>
                                {product.in_stock ? (
                                    <span className="px-3 py-1 bg-green-100 text-green-600 text-[10px] font-bold rounded-full uppercase tracking-widest">
                                        In Stock
                                    </span>
                                ) : (
                                    <span className="px-3 py-1 bg-red-100 text-red-600 text-[10px] font-bold rounded-full uppercase tracking-widest">
                                        Out of Stock
                                    </span>
                                )}
                            </div>

                            {/* Size Selector */}
                            <div className="mb-8">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Select Size</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {(['quarter', 'gallon', 'drum'] as ItemSize[]).map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`py-3 px-4 rounded-xl text-sm font-bold transition-all border-2 ${selectedSize === size
                                                    ? 'bg-navy border-navy text-white shadow-lg'
                                                    : 'bg-white border-gray-100 text-gray-500 hover:border-navy/30 hover:text-navy'
                                                }`}
                                        >
                                            {size.charAt(0).toUpperCase() + size.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Quantity Selector */}
                            <div className="flex items-center gap-6 mb-8">
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Quantity</label>
                                    <div className="flex items-center gap-4 bg-gray-50 border border-gray-100 rounded-xl p-1 w-fit">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="w-10 h-10 rounded-lg flex items-center justify-center text-navy font-bold hover:bg-white transition-colors"
                                        >
                                            -
                                        </button>
                                        <span className="text-sm font-bold w-4 text-center text-navy">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="w-10 h-10 rounded-lg flex items-center justify-center text-navy font-bold hover:bg-white transition-colors"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Add to Cart Actions */}
                            <div className="flex flex-col sm:flex-row gap-4 mb-10 pt-4 border-t border-gray-100">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={addingToCart || !product.in_stock}
                                    className="flex-[2] py-4 rounded-2xl bg-navy text-white font-bold flex items-center justify-center gap-3 hover:bg-gold transition-all shadow-xl shadow-navy/10 active:scale-95 disabled:opacity-50"
                                >
                                    <ShoppingCart size={20} />
                                    {addingToCart ? 'Added to Cart!' : 'Add to Cart'}
                                </button>
                                <Link
                                    href={`https://wa.me/923475658761?text=Hi! I want to order ${product.name} (${selectedSize}, ${quantity} units) with shade ${selectedShade?.name || 'Standard'}.`}
                                    target="_blank"
                                    className="flex-1 py-4 rounded-2xl border-2 border-green-500 text-green-500 font-bold flex items-center justify-center gap-3 hover:bg-green-500 hover:text-white transition-all shadow-xl shadow-green-500/10 active:scale-95"
                                >
                                    <MessageCircle size={20} />
                                    WhatsApp
                                </Link>
                            </div>

                            {/* Shade Selection logic */}
                            {isBrightoSuperEmulsion && (
                                <div className="pt-8 border-t border-gray-100 mt-10">
                                    <ShadeSelector
                                        shades={shades}
                                        selectedSize={selectedSize}
                                        onSelect={(shade) => setSelectedShade(shade)}
                                    />
                                </div>
                            )}

                            {/* Description */}
                            <div className="pt-10 space-y-4">
                                <div className="flex items-center gap-2 text-navy">
                                    <Info size={18} className="text-gold" />
                                    <h3 className="font-bold uppercase tracking-widest text-xs">Description</h3>
                                </div>
                                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {product.description || `Experience the premium quality of ${product.brand} ${product.name}. Designed to provide superior coverage and a stunning finish for your ${product.category.toLowerCase()} needs. Available in various sizes to suit your project requirements.`}
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
