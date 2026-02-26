'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, RotateCcw } from 'lucide-react';
import { COLOR_FAMILIES } from '@/types';

type RoomType = 'living' | 'bedroom' | 'exterior';
type SurfaceType = 'main' | 'accent' | 'ceiling';

const defaultColors: Record<SurfaceType, string> = {
  main: '#F5F5DC',
  accent: '#C9973A',
  ceiling: '#FFFFFF'
};

const rooms = [
  { id: 'living', label: 'Living Room' },
  { id: 'bedroom', label: 'Bedroom' },
  { id: 'exterior', label: 'Exterior' }
];

export function PaintVisualizer() {
  const [selectedRoom, setSelectedRoom] = useState<RoomType>('living');
  const [selectedSurface, setSelectedSurface] = useState<SurfaceType>('main');
  const [colors, setColors] = useState(defaultColors);
  const [selectedColor, setSelectedColor] = useState<{ name: string; hex: string } | null>(null);

  const handleColorSelect = (color: { name: string; hex: string }) => {
    setColors((prev) => ({ ...prev, [selectedSurface]: color.hex }));
    setSelectedColor(color);
  };

  const handleReset = () => {
    setColors(defaultColors);
    setSelectedColor(null);
  };

  const whatsappMessage = selectedColor
    ? `Hi! I love the colour ${selectedColor.name} (${selectedColor.hex}) from your visualizer. Can you recommend the right product?`
    : '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy mb-4">
          Visualise Your Space
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Experiment with colors to find the perfect look for your space.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Room Preview */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          {/* Room Selector */}
          <div className="flex gap-2 mb-6">
            {rooms.map((room) => (
              <button
                key={room.id}
                onClick={() => setSelectedRoom(room.id as RoomType)}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                  selectedRoom === room.id
                    ? 'bg-gold text-navy'
                    : 'bg-gray-100 text-gray-600 hover:bg-gold-pale'
                }`}
              >
                {room.label}
              </button>
            ))}
          </div>

          {/* Room SVG */}
          <div className="relative aspect-video bg-gray-100 rounded-xl overflow-hidden mb-6">
            <svg viewBox="0 0 400 250" className="w-full h-full">
              {/* Floor */}
              <rect x="0" y="200" width="400" height="50" fill="#8B7355" />
              
              {/* Ceiling */}
              <rect
                x="20"
                y="20"
                width="360"
                height="40"
                fill={colors.ceiling}
                className="transition-colors duration-300"
                onClick={() => setSelectedSurface('ceiling')}
              />
              
              {/* Main Wall Left */}
              <rect
                x="20"
                y="60"
                width="120"
                height="140"
                fill={colors.main}
                className="transition-colors duration-300 cursor-pointer"
                onClick={() => setSelectedSurface('main')}
                stroke={selectedSurface === 'main' ? '#C9973A' : 'none'}
                strokeWidth="3"
              />
              
              {/* Main Wall Right */}
              <rect
                x="260"
                y="60"
                width="120"
                height="140"
                fill={colors.main}
                className="transition-colors duration-300 cursor-pointer"
                onClick={() => setSelectedSurface('main')}
                stroke={selectedSurface === 'main' ? '#C9973A' : 'none'}
                strokeWidth="3"
              />
              
              {/* Back Wall */}
              <rect
                x="140"
                y="60"
                width="120"
                height="140"
                fill={colors.main}
                className="transition-colors duration-300 cursor-pointer"
                onClick={() => setSelectedSurface('main')}
                stroke={selectedSurface === 'main' ? '#C9973A' : 'none'}
                strokeWidth="3"
              />
              
              {/* Accent Wall (Back Center) */}
              <rect
                x="160"
                y="80"
                width="80"
                height="100"
                fill={colors.accent}
                className="transition-colors duration-300 cursor-pointer"
                onClick={() => setSelectedSurface('accent')}
                stroke={selectedSurface === 'accent' ? '#C9973A' : 'none'}
                strokeWidth="3"
              />
              
              {/* Window */}
              <rect x="180" y="90" width="40" height="50" fill="#87CEEB" stroke="#333" strokeWidth="2" />
              <line x1="200" y1="90" x2="200" y2="140" stroke="#333" strokeWidth="2" />
              <line x1="180" y1="115" x2="220" y2="115" stroke="#333" strokeWidth="2" />
              
              {/* Door */}
              <rect x="50" y="120" width="30" height="80" fill="#654321" stroke="#333" strokeWidth="2" />
              <circle cx="75" cy="160" r="3" fill="#C9973A" />
              
              {/* Surface Labels */}
              <text x="75" y="180" textAnchor="middle" fill="#666" fontSize="10">Main Wall</text>
              <text x="200" y="195" textAnchor="middle" fill="#666" fontSize="10">Accent Wall</text>
              <text x="200" y="40" textAnchor="middle" fill="#666" fontSize="10">Ceiling</text>
            </svg>
          </div>

          {/* Surface Selector */}
          <div className="flex gap-2">
            {(['main', 'accent', 'ceiling'] as SurfaceType[]).map((surface) => (
              <button
                key={surface}
                onClick={() => setSelectedSurface(surface)}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  selectedSurface === surface
                    ? 'bg-navy text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <div
                  className="w-4 h-4 rounded-full border border-gray-300"
                  style={{ backgroundColor: colors[surface] }}
                />
                {surface.charAt(0).toUpperCase() + surface.slice(1)}
              </button>
            ))}
          </div>

          {/* Selected Color Info */}
          {selectedColor && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-gold-pale rounded-xl flex items-center gap-4"
            >
              <div
                className="w-12 h-12 rounded-full border-2 border-gold shadow-md"
                style={{ backgroundColor: selectedColor.hex }}
              />
              <div>
                <p className="font-semibold text-navy">{selectedColor.name}</p>
                <p className="text-sm text-gray-500">{selectedColor.hex}</p>
              </div>
            </motion.div>
          )}

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleReset}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg border-2 border-navy text-navy hover:bg-navy hover:text-white transition-colors"
            >
              <RotateCcw size={18} />
              Reset
            </button>
            {selectedColor ? (
              <a
                href={`https://wa.me/923475658761?text=${encodeURIComponent(whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-colors bg-green-500 text-white hover:bg-green-400"
              >
                <MessageCircle size={18} />
                Inquire on WhatsApp
              </a>
            ) : (
              <span className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-colors bg-gray-200 text-gray-400 cursor-not-allowed">
                <MessageCircle size={18} />
                Inquire on WhatsApp
              </span>
            )}
          </div>
        </motion.div>

        {/* Color Palette */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <h3 className="font-heading text-xl font-semibold text-navy mb-6">
            Color Palette
          </h3>

          <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2">
            {COLOR_FAMILIES.map((family) => (
              <div key={family.name}>
                <p className="text-sm font-medium text-gray-500 mb-3">{family.name}</p>
                <div className="grid grid-cols-3 gap-3">
                  {family.colors.map((color) => (
                    <button
                      key={color.hex}
                      onClick={() => handleColorSelect(color)}
                      className={`group relative aspect-square rounded-lg overflow-hidden transition-all ${
                        selectedColor?.hex === color.hex
                          ? 'ring-2 ring-gold ring-offset-2'
                          : 'hover:scale-105'
                      }`}
                      title={color.name}
                    >
                      <div
                        className="w-full h-full"
                        style={{ backgroundColor: color.hex }}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
