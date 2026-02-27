'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    Settings,
    Percent,
    Truck,
    CreditCard,
    Menu,
    X,
    LogOut,
    ChevronRight,
    Loader2
} from 'lucide-react';
import { useUserStore } from '@/lib/store';
import { createClient } from '@/lib/supabase/client';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, isAuthenticated, loading, setUser } = useUserStore();
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted && !loading) {
            if (!isAuthenticated || !user?.is_admin) {
                router.push('/');
            }
        }
    }, [mounted, loading, isAuthenticated, user, router]);

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        setUser(null);
        router.push('/');
    };

    const navItems = [
        { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/admin/products', label: 'Products', icon: Package },
        { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
        { href: '/admin/customers', label: 'Customers', icon: Users },
        { href: '/admin/discounts', label: 'Discounts', icon: Percent },
        { href: '/admin/shipping', label: 'Shipping', icon: Truck },
        { href: '/admin/payments', label: 'Payments', icon: CreditCard },
        { href: '/admin/settings', label: 'Settings', icon: Settings },
    ];

    if (!mounted || loading || !user?.is_admin) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="animate-spin text-gold" size={40} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar - Desktop */}
            <aside
                className={`hidden lg:flex flex-col bg-navy text-white transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'
                    }`}
            >
                <div className="p-6 flex items-center justify-between">
                    {isSidebarOpen ? (
                        <Link href="/" className="font-heading text-xl font-bold text-gold">
                            Tawakkal <span className="text-white">Admin</span>
                        </Link>
                    ) : (
                        <div className="w-8 h-8 bg-gold rounded-full" />
                    )}
                    <button
                        onClick={() => setSidebarOpen(!isSidebarOpen)}
                        className="text-white/60 hover:text-white"
                    >
                        <ChevronRight className={`transition-transform duration-300 ${isSidebarOpen ? 'rotate-180' : ''}`} />
                    </button>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${isActive
                                        ? 'bg-gold text-navy font-semibold'
                                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                <Icon size={isSidebarOpen ? 20 : 24} />
                                {isSidebarOpen && <span>{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/10">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-3 py-3 w-full text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                    >
                        <LogOut size={isSidebarOpen ? 20 : 24} />
                        {isSidebarOpen && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Mobile Sidebar & Header */}
            <div className="flex-1 flex flex-col">
                <header className="lg:hidden bg-navy text-white p-4 flex items-center justify-between">
                    <Link href="/" className="font-heading text-lg font-bold text-gold">
                        Tawakkal <span className="text-white">Admin</span>
                    </Link>
                    <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}>
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </header>

                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            className="lg:hidden fixed inset-0 z-50 bg-navy text-white p-6"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <span className="font-heading text-xl font-bold text-gold">Navigation</span>
                                <button onClick={() => setMobileMenuOpen(false)}><X size={24} /></button>
                            </div>
                            <nav className="space-y-4">
                                {navItems.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="flex items-center gap-4 text-lg py-2 text-white/80 hover:text-gold"
                                        >
                                            <Icon size={24} />
                                            {item.label}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Main Content */}
                <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
