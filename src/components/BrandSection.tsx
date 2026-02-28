'use client';

import { motion } from 'framer-motion';
import { BRAND_LOGOS } from '@/types';

export function BrandSection() {
    const logos = Object.entries(BRAND_LOGOS).map(([name, url]) => ({
        name,
        url
    }));

    // Duplicate logos for a seamless marquee
    const displayLogos = [...logos, ...logos, ...logos];

    return (
        <section className="py-8 bg-white border-b border-gray-100 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                    {/* Header */}
                    <div className="flex items-center gap-6 shrink-0">
                        <h2 className="font-heading text-xl md:text-2xl font-bold text-navy whitespace-nowrap">
                            Our Top Brands
                        </h2>
                        <div className="hidden md:block w-px h-12 bg-gray-200" />
                    </div>

                    {/* Marquee */}
                    <div className="w-full overflow-hidden relative">
                        <motion.div
                            className="flex items-center gap-12 md:gap-20"
                            animate={{
                                x: [0, -100 * logos.length],
                            }}
                            transition={{
                                duration: logos.length * 3,
                                repeat: Infinity,
                                ease: "linear",
                            }}
                        >
                            {displayLogos.map((logo, i) => (
                                <div
                                    key={`${logo.name}-${i}`}
                                    className="shrink-0 grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
                                >
                                    <img
                                        src={logo.url}
                                        alt={logo.name}
                                        className="h-8 md:h-12 w-auto object-contain pointer-events-none"
                                    />
                                </div>
                            ))}
                        </motion.div>

                        {/* Gradients to fade edges */}
                        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent z-10" />
                        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent z-10" />
                    </div>
                </div>
            </div>
        </section>
    );
}
