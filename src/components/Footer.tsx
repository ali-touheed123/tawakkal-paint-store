'use client';

import Link from 'next/link';
import { MessageCircle, Instagram, Facebook, Phone, MapPin } from 'lucide-react';
import { useLocationStore, useUIStore } from '@/lib/store';

export function Footer() {
  const { setLocationPopupOpen } = useUIStore();

  const handleChangeArea = () => {
    if (typeof window !== 'undefined' && (window as any).openLocationPopup) {
      (window as any).openLocationPopup();
    } else {
      setLocationPopupOpen(true);
    }
  };

  return (
    <footer className="bg-navy text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Column 1: Logo & Description */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img 
                src="/logo.png" 
                alt="Tawakkal Paint Store" 
                className="h-12 w-auto"
              />
            </div>
            <p className="text-gray-400 text-sm mb-6">
              Quality You Can Trust Since 2011
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="https://wa.me/923475658761"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-400 hover:text-green-300 transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle size={20} />
              </Link>
              <a
                href="#"
                className="text-gray-400 hover:text-gold transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-gold transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-heading text-lg font-semibold mb-4 text-gold">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-400 hover:text-gold transition-colors text-sm">Home</Link></li>
              <li><Link href="/category/decorative" className="text-gray-400 hover:text-gold transition-colors text-sm">Products</Link></li>
              <li><Link href="/#why-choose-us" className="text-gray-400 hover:text-gold transition-colors text-sm">Why Choose Us</Link></li>
              <li><Link href="/#calculator" className="text-gray-400 hover:text-gold transition-colors text-sm">Calculator</Link></li>
              <li><Link href="/#contact" className="text-gray-400 hover:text-gold transition-colors text-sm">Contact Us</Link></li>
            </ul>
            <h3 className="font-heading text-lg font-semibold mt-6 mb-4 text-gold">Categories</h3>
            <ul className="space-y-2">
              <li><Link href="/category/decorative" className="text-gray-400 hover:text-gold transition-colors text-sm">Decorative</Link></li>
              <li><Link href="/category/industrial" className="text-gray-400 hover:text-gold transition-colors text-sm">Industrial</Link></li>
              <li><Link href="/category/auto" className="text-gray-400 hover:text-gold transition-colors text-sm">Auto</Link></li>
              <li><Link href="/category/projects" className="text-gray-400 hover:text-gold transition-colors text-sm">Projects</Link></li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h3 className="font-heading text-lg font-semibold mb-4 text-gold">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Phone size={18} className="text-gold mt-0.5" />
                <div>
                  <p className="text-gray-400 text-sm">0347-5658761</p>
                  <p className="text-gray-400 text-sm">WhatsApp: 0347-5658761</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-gold mt-0.5" />
                <div>
                  <p className="text-gray-400 text-sm">Karachi, Pakistan</p>
                  <button
                    onClick={handleChangeArea}
                    className="text-gold text-sm hover:underline mt-1"
                  >
                    Change Delivery Area
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-sm">
            © 2025 Tawakkal Paint Store. All Rights Reserved.
          </p>
          <p className="text-gray-400 text-sm">
            Made with ❤️ in Karachi
          </p>
        </div>
      </div>
    </footer>
  );
}
