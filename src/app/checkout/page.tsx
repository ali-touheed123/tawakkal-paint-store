'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Loader2, Lock, Check, CreditCard, Smartphone, Building } from 'lucide-react';
import { useCartStore, useUserStore, useLocationStore, useUIStore } from '@/lib/store';
import { createClient } from '@/lib/supabase/client';
import { getDiscount, KARACHI_AREAS, type OrderItem } from '@/types';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const { user, isAuthenticated } = useUserStore();
  const { area: deliveryArea } = useLocationStore();
  const { redirectAfterAuth } = useUIStore();
  
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: user?.full_name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    deliveryArea: deliveryArea || '',
    deliveryAddress: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push('/?auth_required=true');
    }
  }, [mounted, isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: prev.fullName || user.full_name || '',
        phone: prev.phone || user.phone || '',
        email: prev.email || user.email || '',
        deliveryArea: prev.deliveryArea || deliveryArea || ''
      }));
    }
  }, [user, deliveryArea]);

  if (!mounted || !isAuthenticated) {
    return (
      <div className="min-h-screen pt-[70px] flex items-center justify-center">
        <Loader2 className="animate-spin text-gold" size={40} />
      </div>
    );
  }

  if (orderId) {
    return (
      <div className="min-h-screen pt-[70px] bg-off-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto text-center p-8 bg-white rounded-2xl shadow-xl"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-20 h-20 bg-gold rounded-full flex items-center justify-center mx-auto mb-6 animate-shimmer"
          >
            <Check className="text-navy" size={40} />
          </motion.div>
          <h1 className="font-heading text-3xl font-bold text-navy mb-4">Order Placed!</h1>
          <p className="text-gray-600 mb-2">Your order has been confirmed.</p>
          <p className="text-gold font-semibold text-xl mb-6">Order ID: {orderId}</p>
          
          <a
            href={`https://wa.me/923475658761?text=Hi! My order ID is ${orderId}. Please update me on my delivery status.`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-400 transition-colors mb-4"
          >
            Track on WhatsApp
          </a>
          
          <Link
            href="/"
            className="block w-full py-3 border-2 border-navy text-navy rounded-lg font-semibold hover:bg-navy hover:text-white transition-colors"
          >
            Continue Shopping
          </Link>
        </motion.div>
      </div>
    );
  }

  const subtotal = getTotal();
  const discountPercent = getDiscount(subtotal);
  const discountAmount = subtotal * (discountPercent / 100);
  const total = subtotal - discountAmount;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^03\d{9}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Phone must be 03XXXXXXXXX format';
    }
    if (!formData.deliveryArea) newErrors.deliveryArea = 'Please select delivery area';
    if (!formData.deliveryAddress.trim()) newErrors.deliveryAddress = 'Delivery address is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      const supabase = createClient();
      
      const orderItems: OrderItem[] = items.map(item => ({
        product_id: item.product_id,
        name: item.product?.name || '',
        brand: item.product?.brand || '',
        size: item.size,
        quantity: item.quantity,
        price: item.size === 'quarter'
          ? item.product?.price_quarter || 0
          : item.size === 'gallon'
            ? item.product?.price_gallon || 0
            : item.product?.price_drum || 0,
        image_url: item.product?.image_url || null
      }));

      const { data, error } = await supabase
        .from('orders')
        .insert({
          user_id: user?.id,
          items: orderItems,
          subtotal,
          discount_percent: discountPercent,
          discount_amount: discountAmount,
          total,
          payment_method: 'cash_on_delivery',
          status: 'pending',
          delivery_area: formData.deliveryArea,
          delivery_address: formData.deliveryAddress,
          phone: formData.phone
        })
        .select('id')
        .single();

      if (error) throw error;

      clearCart();
      setOrderId(data.id);
    } catch (err) {
      console.error('Order error:', err);
      setErrors({ submit: 'Failed to place order. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const paymentMethods = [
    { id: 'cod', label: 'Cash on Delivery', icon: Check, active: true, coming: false },
    { id: 'bank', label: 'Bank Transfer', icon: Building, active: false, coming: true },
    { id: 'card', label: 'Credit / Debit Card', icon: CreditCard, active: false, coming: true },
    { id: 'jazz', label: 'JazzCash', icon: Smartphone, active: false, coming: true },
    { id: 'easy', label: 'EasyPaisa', icon: Smartphone, active: false, coming: true }
  ];

  return (
    <div className="min-h-screen pt-[70px] bg-off-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-navy mb-8">Checkout</h1>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h2 className="font-heading text-xl font-semibold text-navy mb-6">Delivery Details</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.fullName ? 'border-red-500' : 'border-gray-200 focus:border-gold'
                    }`}
                    placeholder="John Doe"
                  />
                  {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.phone ? 'border-red-500' : 'border-gray-200 focus:border-gold'
                    }`}
                    placeholder="03XXXXXXXXX"
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email (Optional)</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:border-gold focus:outline-none"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Area *</label>
                  <select
                    value={formData.deliveryArea}
                    onChange={(e) => setFormData({ ...formData, deliveryArea: e.target.value })}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.deliveryArea ? 'border-red-500' : 'border-gray-200 focus:border-gold'
                    }`}
                  >
                    <option value="">Select area</option>
                    {KARACHI_AREAS.map(area => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                  </select>
                  {errors.deliveryArea && <p className="text-red-500 text-sm mt-1">{errors.deliveryArea}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Address *</label>
                  <textarea
                    value={formData.deliveryAddress}
                    onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                    rows={3}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.deliveryAddress ? 'border-red-500' : 'border-gray-200 focus:border-gold'
                    }`}
                    placeholder="House #, Street #, Area..."
                  />
                  {errors.deliveryAddress && <p className="text-red-500 text-sm mt-1">{errors.deliveryAddress}</p>}
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h2 className="font-heading text-xl font-semibold text-navy mb-6">Payment Method</h2>
              
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-colors ${
                      method.active
                        ? 'border-green-500 bg-green-50'
                        : method.coming
                          ? 'border-gray-200 bg-gray-50 opacity:60'
                          : 'border-gray-200'
                    }`}
                  >
                    {method.active ? (
                      <Check className="text-green-500" size={20} />
                    ) : method.coming ? (
                      <Lock className="text-gray-400" size={20} />
                    ) : null}
                    
                    <div className="flex-1">
                      <p className={`font-medium ${method.active ? 'text-navy' : 'text-gray-500'}`}>
                        {method.label}
                      </p>
                      {method.coming && (
                        <span className="text-xs bg-gold text-navy px-2 py-0.5 rounded-full">Coming Soon</span>
                      )}
                    </div>
                    
                    <method.icon className={method.active ? 'text-green-500' : 'text-gray-400'} size={20} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h2 className="font-heading text-xl font-semibold text-navy mb-6">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.product?.name} ({item.size}) x {item.quantity}
                    </span>
                    <span className="font-medium">
                      Rs. {((item.size === 'quarter' 
                        ? item.product?.price_quarter 
                        : item.size === 'gallon' 
                          ? item.product?.price_gallon 
                          : item.product?.price_drum) || 0 * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>Rs. {subtotal.toLocaleString()}</span>
                </div>
                
                {discountPercent > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({discountPercent}%)</span>
                    <span>- Rs. {discountAmount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between font-heading text-xl font-bold text-navy pt-3 border-t">
                  <span>Total</span>
                  <span>Rs. {total.toLocaleString()}</span>
                </div>
              </div>

              {errors.submit && (
                <p className="text-red-500 text-sm mt-4 text-center">{errors.submit}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 py-4 bg-navy text-white rounded-lg font-semibold hover:bg-navy/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Processing...
                  </>
                ) : (
                  'Place Order'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
