'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MessageCircle, ShoppingCart, User, Menu, X, MapPin, ChevronRight } from 'lucide-react';
import { useCartStore, useLocationStore, useUIStore, useUserStore } from '@/lib/store';
import { useSettings } from '@/lib/hooks/useSettings';

export function Navbar() {
  const pathname = usePathname();
  const { items } = useCartStore();
  const { area } = useLocationStore();
  const { setLocationPopupOpen, isMobileMenuOpen, setMobileMenuOpen, setSearchOpen, setAuthModalOpen, setAuthModalMode } = useUIStore();
  const { user, isAuthenticated } = useUserStore();
  const { settings } = useSettings();
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeBrand, setActiveBrand] = useState<string | null>(null);

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
    { href: '#', label: 'Products', hasDropdown: true },
    { href: '/#why-choose-us', label: 'Why Choose Us' },
    { href: '/#calculator', label: 'Calculator' },
    { href: '/#contact', label: 'Contact Us' },
  ];

  const productData = {
    categories: [
      { slug: 'decorative', label: 'Decorative' },
      { slug: 'industrial', label: 'Industrial' },
      { slug: 'auto', label: 'Auto' },
      { slug: 'projects', label: 'Projects' },
    ],
    brands: [
      { slug: 'gobis', label: "Gobi's" },
      { slug: 'berger', label: 'Berger' },
      { slug: 'diamond', label: 'Diamond' },
      { slug: 'saasil', label: 'Saasil' },
      { slug: 'ocean', label: 'Ocean' },
      { slug: 'rozzilac', label: 'Rozzilac' },
      { slug: 'reliance', label: 'Reliance' },
      { slug: 'reliable', label: 'Reliable' },
    ],
    subs: [
      { slug: 'interior', label: 'Interior' },
      { slug: 'exterior', label: 'Exterior' },
      { slug: 'wood_metal', label: 'Wood & Metal' },
      { slug: 'waterproofing', label: 'Waterproofing' },
      { slug: 'accessories', label: 'Accessories' },
    ]
  };

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
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled ? 'glassmorphism border-b border-gold/20' : 'bg-navy'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[70px] md:h-[70px]">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <img
                src={settings?.logo || "/logo.png"}
                alt="Tawakkal Paint Store"
                className="h-10 md:h-12 w-auto"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <div
                  key={link.label}
                  className="relative h-full flex items-center"
                  onMouseEnter={() => link.hasDropdown && setActiveMenu('products')}
                  onMouseLeave={() => link.hasDropdown && setActiveMenu(null)}
                >
                  <Link
                    href={link.href}
                    className={`text-sm font-medium transition-colors duration-300 py-[25px] ${pathname === link.href
                      ? 'text-gold'
                      : 'text-white/80 hover:text-gold'
                      }`}
                  >
                    {link.label}
                  </Link>

                  {/* Desktop Multi-level Dropdown */}
                  <AnimatePresence>
                    {link.hasDropdown && activeMenu === 'products' && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 w-64 bg-navy border border-gold/20 shadow-2xl overflow-visible"
                      >
                        <div className="py-2">
                          {productData.categories.map((cat) => (
                            <div
                              key={cat.slug}
                              className="relative group"
                              onMouseEnter={() => setActiveCategory(cat.slug)}
                              onMouseLeave={() => setActiveCategory(null)}
                            >
                              <Link
                                href={`/category/${cat.slug}`}
                                className="flex items-center justify-between px-6 py-3 text-sm text-white/80 hover:text-gold hover:bg-white/5 transition-all"
                              >
                                {cat.label}
                                <ChevronRight size={14} className="opacity-40 group-hover:opacity-100" />
                              </Link>

                              {/* Level 2: Brands */}
                              <AnimatePresence>
                                {activeCategory === cat.slug && (
                                  <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="absolute top-0 left-full w-64 bg-navy border border-gold/20 shadow-2xl"
                                  >
                                    <div className="py-2">
                                      {productData.brands.map((brand) => (
                                        <div
                                          key={brand.slug}
                                          className="relative group/brand"
                                          onMouseEnter={() => setActiveBrand(brand.slug)}
                                          onMouseLeave={() => setActiveBrand(null)}
                                        >
                                          <Link
                                            href={`/category/${cat.slug}?brand=${brand.label}`}
                                            className="flex items-center justify-between px-6 py-3 text-sm text-white/80 hover:text-gold hover:bg-white/5 transition-all"
                                          >
                                            {brand.label}
                                            <ChevronRight size={14} className="opacity-40 group-hover/brand:opacity-100" />
                                          </Link>

                                          {/* Level 3: Sub-categories */}
                                          <AnimatePresence>
                                            {activeBrand === brand.slug && (
                                              <motion.div
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -10 }}
                                                className="absolute top-0 left-full w-64 bg-navy border border-gold/20 shadow-2xl"
                                              >
                                                <div className="py-2">
                                                  {productData.subs.map((sub) => (
                                                    <Link
                                                      key={sub.slug}
                                                      href={`/category/${cat.slug}?brand=${brand.label}&sub=${sub.slug}`}
                                                      className="block px-6 py-3 text-sm text-white/80 hover:text-gold hover:bg-white/5 transition-all"
                                                    >
                                                      {sub.label}
                                                    </Link>
                                                  ))}
                                                </div>
                                              </motion.div>
                                            )}
                                          </AnimatePresence>
                                        </div>
                                      ))}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
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
                href={`https://wa.me/${settings?.contact?.whatsapp || '923475658761'}?text=Hi! I need help with paint.`}
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
                  <div key={link.label}>
                    {link.hasDropdown ? (
                      <div>
                        <button
                          onClick={() => setActiveCategory(activeCategory === 'mobile_products' ? null : 'mobile_products')}
                          className="flex items-center justify-between w-full py-2 text-sm font-medium text-white/80"
                        >
                          {link.label}
                          <ChevronDown size={14} className={`transition-transform ${activeCategory === 'mobile_products' ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                          {activeCategory === 'mobile_products' && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden pl-4 space-y-2 mt-2 border-l border-gold/20"
                            >
                              {productData.categories.map((cat) => (
                                <div key={cat.slug}>
                                  <button
                                    onClick={() => setActiveBrand(activeBrand === cat.slug ? null : cat.slug)}
                                    className="flex items-center justify-between w-full py-2 text-sm text-white/60"
                                  >
                                    {cat.label}
                                    <ChevronDown size={12} className={`transition-transform ${activeBrand === cat.slug ? 'rotate-180' : ''}`} />
                                  </button>

                                  <AnimatePresence>
                                    {activeBrand === cat.slug && (
                                      <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden pl-4 space-y-1 mt-1 border-l border-gold/10"
                                      >
                                        {productData.brands.map((brand) => (
                                          <Link
                                            key={brand.slug}
                                            href={`/category/${cat.slug}?brand=${brand.label}`}
                                            className="block py-2 text-xs text-white/40 hover:text-gold"
                                            onClick={() => setMobileMenuOpen(false)}
                                          >
                                            {brand.label}
                                          </Link>
                                        ))}
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        href={link.href}
                        className={`block py-2 text-sm font-medium ${pathname === link.href ? 'text-gold' : 'text-white/80'
                          }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    )}
                  </div>
                ))}

                <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                  <button
                    onClick={() => setSearchOpen(true)}
                    className="text-white/80"
                  >
                    <Search size={20} />
                  </button>

                  <Link
                    href={`https://wa.me/${settings?.contact?.whatsapp || '923475658761'}?text=Hi! I need help with paint.`}
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
