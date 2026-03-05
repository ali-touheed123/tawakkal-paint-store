'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BRIGHTO_SHADES } from '@/constants/shades';
import { Shade } from '@/types';
import { Check, Maximize2, Palette } from 'lucide-react';

interface SimpleVisualizerProps {
    color: string;
    name: string;
    onSelect?: (shade: Shade) => void;
}

export function SimpleVisualizer({ color: initialColor, name: initialName, onSelect }: SimpleVisualizerProps) {
    const [currentColor, setCurrentColor] = useState(initialColor);
    const [currentName, setCurrentName] = useState(initialName);

    // Sync with external selection
    useEffect(() => {
        setCurrentColor(initialColor);
        setCurrentName(initialName);
    }, [initialColor, initialName]);

    const handleSwatchClick = (shade: Shade) => {
        setCurrentColor(shade.hex);
        setCurrentName(shade.name);
        if (onSelect) onSelect(shade);
    };

    return (
        <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gray-100 aspect-square group border-4 border-white">
            {/* LAYER 1: Base Image (Wall + Floor + Sofa) */}
            <img
                src="/images/visualizer/back.png"
                alt="Room Base"
                className="absolute inset-0 w-full h-full object-cover"
            />

            {/* LAYER 2: Colored Overlay (Multiply) - Clipped to Wall Area */}
            <motion.div
                initial={false}
                animate={{ backgroundColor: currentColor }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="absolute inset-0 z-10"
                style={{
                    mixBlendMode: 'multiply',
                    opacity: 0.8,
                    // Clipping to wall area (avoiding the floor)
                    // Tune the 68% based on back.png alignment
                    clipPath: 'polygon(0% 0%, 100% 0%, 100% 68.5%, 0% 68.5%)'
                }}
            />

            {/* LAYER 3: Foreground (Sofa Only) - Perfectly Aligned */}
            <img
                src="/images/visualizer/front.png"
                alt="Sofa Foreground"
                className="absolute inset-0 w-full h-full object-cover z-20 pointer-events-none"
            />

            {/* Color Info Badge */}
            <div className="absolute top-6 left-6 z-30">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={currentColor}
                    className="bg-white/90 backdrop-blur-md px-5 py-2.5 rounded-2xl shadow-xl flex items-center gap-3 border border-white/50"
                >
                    <div
                        className="w-4 h-4 rounded-full shadow-inner ring-2 ring-white"
                        style={{ backgroundColor: currentColor }}
                    />
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Active Color</p>
                        <p className="text-xs font-black text-navy uppercase">{currentName}</p>
                    </div>
                </motion.div>
            </div>

            {/* Premium Branding */}
            <div className="absolute top-6 right-6 z-30">
                <div className="bg-gold text-navy px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-tighter shadow-lg ring-2 ring-gold/20">
                    Tawakkal Visualizer Pro
                </div>
            </div>
        </div>
    );
}
