'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MessageCircle, ShoppingCart, Bell } from 'lucide-react';
import { Product, ItemSize } from '@/types';
import { useCartStore } from '@/lib/store';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState<ItemSize>('gallon');
  const [addingToCart, setAddingToCart] = useState(false);
  const [imgError, setImgError] = useState(false);
  const { addItem } = useCartStore();

  const getImageUrl = () => {
    if (!product.image_url || imgError) {
      return `https://placehold.co/400x400/0F1F3D/C9973A?text=${encodeURIComponent(product.brand)}`;
    }
    return product.image_url;
  };

  const price = selectedSize === 'quarter' 
    ? product.price_quarter 
    : selectedSize === 'gallon' 
      ? product.price_gallon 
      : product.price_drum;

  const handleAddToCart = () => {
    setAddingToCart(true);
    addItem(product.id, selectedSize, 1, product);
    setTimeout(() => setAddingToCart(false), 500);
  };

  const sizes: ItemSize[] = ['quarter', 'gallon', 'drum'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow border border-gold/10 group"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={getImageUrl()}
          alt={product.name}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {!product.in_stock && (
          <div className="absolute inset-0 bg-navy/60 flex items-center justify-center">
            <span className="text-white font-semibold">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-gold text-xs uppercase tracking-wider font-semibold mb-1">
          {product.brand}
        </p>
        <h3 className="font-heading text-lg font-semibold text-navy mb-3 line-clamp-2">
          {product.name}
        </h3>

        {/* Size Toggle */}
        <div className="flex gap-2 mb-4">
          {sizes.map((size) => {
            const sizePrice = size === 'quarter' 
              ? product.price_quarter 
              : size === 'gallon' 
                ? product.price_gallon 
                : product.price_drum;
            
            if (sizePrice === 0) return null;
            
            return (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                  selectedSize === size
                    ? 'bg-gold text-navy'
                    : 'bg-gray-100 text-gray-600 hover:bg-gold-pale'
                }`}
              >
                {size.charAt(0).toUpperCase() + size.slice(1)}
              </button>
            );
          })}
        </div>

        {/* Price */}
        <p className="font-heading text-xl font-bold text-navy mb-4">
          Rs. {price.toLocaleString()}
        </p>

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            href={`https://wa.me/923475658761?text=Hi! I'm interested in ${product.name} – ${selectedSize}. Please share availability and price.`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white transition-colors"
          >
            <MessageCircle size={16} />
            <span className="hidden sm:inline">Inquiry</span>
          </Link>
          
          {product.in_stock ? (
            <button
              onClick={handleAddToCart}
              disabled={addingToCart}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium bg-navy text-white hover:bg-gold transition-colors disabled:opacity-50"
            >
              <ShoppingCart size={16} />
              <span className="hidden sm:inline">{addingToCart ? 'Added!' : 'Add'}</span>
            </button>
          ) : (
            <button
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium border-2 border-navy text-navy hover:bg-navy hover:text-white transition-colors"
            >
              <Bell size={16} />
              <span className="hidden sm:inline">Notify Me</span>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
