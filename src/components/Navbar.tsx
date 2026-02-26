'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MessageCircle, ShoppingCart, User, Menu, X, MapPin } from 'lucide-react';
import { useCartStore, useLocationStore, useUIStore, useUserStore } from '@/lib/store';

export function Navbar() {
  const pathname = usePathname();
  const { items } = useCartStore();
  const { area } = useLocationStore();
  const { setLocationPopupOpen, isMobileMenuOpen, setMobileMenuOpen, setSearchOpen, setAuthModalOpen, setAuthModalMode } = useUIStore();
  const { user, isAuthenticated } = useUserStore();
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname, setMobileMenuOpen]);

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/category/decorative', label: 'Products' },
    { href: '/#why-choose-us', label: 'Why Choose Us' },
    { href: '/#calculator', label: 'Calculator' },
    { href: '/#contact', label: 'Contact Us' },
  ];

  const handleProfileClick = () => {
    if (isAuthenticated) {
      window.location.href = '/profile';
    } else {
      setAuthModalMode('login');
      setAuthModalOpen(true);
    }
  };

  const handleChangeArea = () => {
    if (typeof window !== 'undefined' && (window as any).openLocationPopup) {
      (window as any).openLocationPopup();
    } else {
      setLocationPopupOpen(true);
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled ? 'glassmorphism border-b border-gold/20' : 'bg-navy'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[70px] md:h-[70px]">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <img 
                src="/logo.png" 
                alt="Tawakkal Paint Store" 
                className="h-10 md:h-12 w-auto"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors duration-300 ${
                    pathname === link.href
                      ? 'text-gold'
                      : 'text-white/80 hover:text-gold'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop Icons */}
            <div className="hidden lg:flex items-center gap-4">
              <button
                onClick={() => setSearchOpen(true)}
                className="text-white/80 hover:text-gold transition-colors"
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              <Link
                href="https://wa.me/923475658761?text=Hi! I need help with paint."
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-400 hover:text-green-300 transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle size={20} />
              </Link>

              <Link
                href="/cart"
                className="relative text-white/80 hover:text-gold transition-colors"
                aria-label="Cart"
              >
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gold text-navy text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              <button
                onClick={handleProfileClick}
                className="text-white/80 hover:text-gold transition-colors"
                aria-label="Profile"
              >
                {isAuthenticated && user ? (
                  <span className="text-gold text-sm font-medium">{user.full_name.split(' ')[0]}</span>
                ) : (
                  <User size={20} />
                )}
              </button>

              {area && (
                <button
                  onClick={handleChangeArea}
                  className="flex items-center gap-1 text-gold text-sm bg-gold/10 px-3 py-1.5 rounded-full hover:bg-gold/20 transition-colors"
                >
                  <MapPin size={14} />
                  <span className="hidden xl:inline">{area}</span>
                  <span className="text-xs opacity-60">✏️</span>
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-white"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-navy border-t border-gold/20"
            >
              <div className="px-4 py-4 space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`block py-2 text-sm font-medium ${
                      pathname === link.href ? 'text-gold' : 'text-white/80'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}

                <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                  <button
                    onClick={() => setSearchOpen(true)}
                    className="text-white/80"
                  >
                    <Search size={20} />
                  </button>

                  <Link
                    href="https://wa.me/923475658761?text=Hi! I need help with paint."
                    target="_blank"
                    className="text-green-400"
                  >
                    <MessageCircle size={20} />
                  </Link>

                  <Link href="/cart" className="relative text-white/80">
                    <ShoppingCart size={20} />
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-gold text-navy text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </Link>

                  <button onClick={handleProfileClick} className="text-white/80">
                    <User size={20} />
                  </button>
                </div>

                {area && (
                  <button
                    onClick={handleChangeArea}
                    className="flex items-center gap-2 text-gold text-sm bg-gold/10 px-3 py-2 rounded-lg w-full mt-4"
                  >
                    <MapPin size={14} />
                    <span>{area}, Karachi</span>
                    <span className="ml-auto">✏️</span>
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-[70px]" />
    </>
  );
}
