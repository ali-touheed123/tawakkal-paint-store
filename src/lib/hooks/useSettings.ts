'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { SiteSettings, DiscountRule, ShippingRate, PaymentMethod } from '@/types';

export function useSettings() {
    const [settings, setSettings] = useState<SiteSettings | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadSettings() {
            const supabase = createClient();
            const { data } = await supabase.from('site_settings').select('*');

            if (data) {
                const formatted = data.reduce((acc: any, curr: any) => {
                    acc[curr.key] = curr.value;
                    return acc;
                }, {});
                setSettings(formatted);
            }
            setLoading(false);
        }
        loadSettings();
    }, []);

    return { settings, loading };
}

export function useDiscountRules() {
    const [rules, setRules] = useState<DiscountRule[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadRules() {
            const supabase = createClient();
            const { data } = await supabase
                .from('discount_rules')
                .select('*')
                .eq('is_active', true)
                .order('min_amount', { ascending: true });

            if (data) setRules(data);
            setLoading(false);
        }
        loadRules();
    }, []);

    const calculateDiscount = (subtotal: number) => {
        const applicableRule = [...rules].reverse().find(r => subtotal >= r.min_amount);
        return applicableRule ? applicableRule.discount_percent : 0;
    };

    const getNextTier = (subtotal: number) => {
        const nextRule = rules.find(r => r.min_amount > subtotal);
        if (!nextRule) return null;
        return {
            discount: nextRule.discount_percent,
            amountNeeded: nextRule.min_amount - subtotal
        };
    };

    return { rules, loading, calculateDiscount, getNextTier };
}

export function useShippingRates() {
    const [rates, setRates] = useState<ShippingRate[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadRates() {
            const supabase = createClient();
            const { data } = await supabase
                .from('shipping_rates')
                .select('*')
                .eq('is_active', true);

            if (data) setRates(data);
            setLoading(false);
        }
        loadRates();
    }, []);

    const getRateForArea = (area: string, subtotal: number) => {
        const rate = rates.find(r => r.area === area);
        if (!rate) return null;

        if (rate.min_order_for_free && subtotal >= rate.min_order_for_free) {
            return 0;
        }
        return rate.rate;
    };

    return { rates, loading, getRateForArea };
}

export function usePaymentMethods() {
    const [methods, setMethods] = useState<PaymentMethod[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadMethods() {
            const supabase = createClient();
            const { data } = await supabase
                .from('payment_methods')
                .select('*')
                .eq('is_active', true);

            if (data) setMethods(data);
            setLoading(false);
        }
        loadMethods();
    }, []);

    return { methods, loading };
}
