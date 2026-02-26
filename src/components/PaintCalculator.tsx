'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Plus, Minus } from 'lucide-react';
import { PAINT_TYPES } from '@/types';

export function PaintCalculator() {
  const [paintType, setPaintType] = useState(PAINT_TYPES[0]);
  const [dimensionsMode, setDimensionsMode] = useState<'dimensions' | 'area'>('dimensions');
  const [length, setLength] = useState(12);
  const [width, setWidth] = useState(12);
  const [height, setHeight] = useState(10);
  const [directArea, setDirectArea] = useState(500);
  const [coats, setCoats] = useState(2);
  const [rooms, setRooms] = useState(1);
  const [subtractDoors, setSubtractDoors] = useState(false);
  const [numDoors, setNumDoors] = useState(1);
  const [subtractWindows, setSubtractWindows] = useState(false);
  const [numWindows, setNumWindows] = useState(2);

  const coverageRate = paintType.coverage;

  const calculation = useMemo(() => {
    let wallArea: number;
    
    if (dimensionsMode === 'dimensions') {
      wallArea = 2 * (length + width) * height;
    } else {
      wallArea = directArea;
    }

    const deductions = (subtractDoors ? numDoors * 21 : 0) + 
                       (subtractWindows ? numWindows * 15 : 0);
    
    const netArea = Math.max(0, wallArea - deductions);
    const totalArea = netArea * coats * rooms;
    const amount = totalArea / coverageRate;
    const withWastage = Math.ceil(amount * 1.1 * 2) / 2;

    const drums = Math.floor(withWastage / 18.9);
    const remainderAfterDrums = withWastage - drums * 18.9;
    const gallons = Math.floor(remainderAfterDrums / 3.785);
    const quarters = Math.ceil((remainderAfterDrums - gallons * 3.785) / 1);

    let breakdown = '';
    if (drums > 0) breakdown += `${drums} Drum${drums > 1 ? 's' : ''} `;
    if (gallons > 0) breakdown += `${gallons} Gallon${gallons > 1 ? 's' : ''} `;
    if (quarters > 0) breakdown += `${quarters} Quarter${quarters > 1 ? 's' : ''}`;
    if (!breakdown) breakdown = '1 Quarter';

    return {
      litres: withWastage,
      totalArea,
      breakdown: breakdown.trim()
    };
  }, [dimensionsMode, length, width, height, directArea, coats, rooms, subtractDoors, numDoors, subtractWindows, numWindows, coverageRate]);

  const whatsappMessage = `Hi! The calculator says I need ${calculation.litres} litres of ${paintType.label} for ${calculation.totalArea} sq/ft. Please help me choose the right product.`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy mb-4">
          How Much Paint Do You Need?
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Calculate the exact amount of paint required for your project.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
        >
          {/* Paint Type */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-navy mb-3">Paint Type</label>
            <div className="flex flex-wrap gap-2">
              {PAINT_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setPaintType(type)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    paintType.id === type.id
                      ? 'bg-gold text-navy'
                      : 'bg-gray-100 text-gray-600 hover:bg-gold-pale'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dimensions Mode */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-navy mb-3">Calculation Mode</label>
            <div className="flex gap-4 mb-4">
              <button
                onClick={() => setDimensionsMode('dimensions')}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                  dimensionsMode === 'dimensions'
                    ? 'bg-navy text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Room Dimensions
              </button>
              <button
                onClick={() => setDimensionsMode('area')}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                  dimensionsMode === 'area'
                    ? 'bg-navy text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Direct sq/ft
              </button>
            </div>

            {dimensionsMode === 'dimensions' ? (
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Length (ft)</label>
                  <input
                    type="number"
                    value={length}
                    onChange={(e) => setLength(Number(e.target.value))}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:border-gold focus:outline-none"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Width (ft)</label>
                  <input
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:border-gold focus:outline-none"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Height (ft)</label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:border-gold focus:outline-none"
                    min="1"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs text-gray-500 mb-1">Total Wall Area (sq/ft)</label>
                <input
                  type="number"
                  value={directArea}
                  onChange={(e) => setDirectArea(Number(e.target.value))}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:border-gold focus:outline-none"
                  min="1"
                />
              </div>
            )}
          </div>

          {/* Coats */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-navy mb-3">Number of Coats</label>
            <div className="flex gap-2">
              {[1, 2, 3].map((num) => (
                <button
                  key={num}
                  onClick={() => setCoats(num)}
                  className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all ${
                    coats === num
                      ? 'bg-gold text-navy'
                      : 'bg-gray-100 text-gray-600 hover:bg-gold-pale'
                  }`}
                >
                  {num} {num === 1 ? 'Coat' : 'Coats'}
                </button>
              ))}
            </div>
          </div>

          {/* Rooms */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-navy mb-3">Number of Rooms</label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setRooms(Math.max(1, rooms - 1))}
                className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gold-pale transition-colors"
              >
                <Minus size={18} />
              </button>
              <span className="text-xl font-semibold text-navy w-8 text-center">{rooms}</span>
              <button
                onClick={() => setRooms(rooms + 1)}
                className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gold-pale transition-colors"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

          {/* Doors & Windows */}
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={subtractDoors}
                onChange={(e) => setSubtractDoors(e.target.checked)}
                className="w-5 h-5 text-gold rounded focus:ring-gold"
              />
              <span className="text-sm text-navy">Subtract doors (21 sq/ft each)</span>
            </label>
            {subtractDoors && (
              <div className="flex items-center gap-4 ml-8">
                <span className="text-xs text-gray-500">Number of doors:</span>
                <input
                  type="number"
                  value={numDoors}
                  onChange={(e) => setNumDoors(Number(e.target.value))}
                  className="w-20 p-2 border border-gray-200 rounded-lg focus:border-gold focus:outline-none"
                  min="0"
                />
              </div>
            )}

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={subtractWindows}
                onChange={(e) => setSubtractWindows(e.target.checked)}
                className="w-5 h-5 text-gold rounded focus:ring-gold"
              />
              <span className="text-sm text-navy">Subtract windows (15 sq/ft each)</span>
            </label>
            {subtractWindows && (
              <div className="flex items-center gap-4 ml-8">
                <span className="text-xs text-gray-500">Number of windows:</span>
                <input
                  type="number"
                  value={numWindows}
                  onChange={(e) => setNumWindows(Number(e.target.value))}
                  className="w-20 p-2 border border-gray-200 rounded-lg focus:border-gold focus:outline-none"
                  min="0"
                />
              </div>
            )}
          </div>
        </motion.div>

        {/* Result Section */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-navy rounded-2xl p-6 md:p-8 text-white"
        >
          <h3 className="font-heading text-2xl font-bold text-gold mb-8 text-center">
            Your Paint Requirement
          </h3>

          <div className="text-center mb-8">
            <p className="text-gray-400 text-sm mb-2">Total Area</p>
            <p className="text-3xl font-bold">{calculation.totalArea.toLocaleString()} sq/ft</p>
          </div>

          <div className="bg-white/10 rounded-2xl p-8 mb-8 text-center">
            <p className="text-gray-300 text-sm mb-2">Paint Needed</p>
            <motion.p
              key={calculation.litres}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="font-heading text-5xl md:text-6xl font-bold text-gold"
            >
              {calculation.litres}
            </motion.p>
            <p className="text-gray-300 mt-2">
              {paintType.id === 'putty' ? 'kg' : 'Litres'}
            </p>
          </div>

          <div className="bg-gold/20 rounded-xl p-6 mb-8">
            <p className="text-gray-300 text-sm mb-2">Best Tin Combination</p>
            <p className="text-xl font-semibold text-gold">{calculation.breakdown}</p>
          </div>

          <a
            href={`https://wa.me/923475658761?text=${encodeURIComponent(whatsappMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-4 bg-green-500 hover:bg-green-400 rounded-lg font-semibold transition-colors"
          >
            <MessageCircle size={20} />
            Inquire on WhatsApp
          </a>

          <p className="text-gray-500 text-xs text-center mt-4">
            Results are estimates. Contact us for exact advice.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
