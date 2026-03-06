const fs = require('fs');

const saasiSuperGlossEnamelShades = `
export const SAASI_SUPER_GLOSS_ENAMEL_SHADES: Shade[] = [
  // Manually Added
  { id: 'saasi-sge-60', product_id: '', name: 'Brilliant White', code: '200', hex: '#FFFFFF', is_drum_available: true },
  
  // Image 1 - Warm/Cream/Peach
  { id: 'saasi-sge-1', product_id: '', name: 'Riesling', code: '252', hex: '#FDF7E2', is_drum_available: false },
  { id: 'saasi-sge-2', product_id: '', name: 'Butter Corn', code: '251', hex: '#FCE0A1', is_drum_available: false },
  { id: 'saasi-sge-3', product_id: '', name: 'Peach', code: '236', hex: '#F8B595', is_drum_available: false },
  { id: 'saasi-sge-4', product_id: '', name: 'Off White', code: '201', hex: '#FDF4E3', is_drum_available: true },
  { id: 'saasi-sge-5', product_id: '', name: 'County Cream', code: '202', hex: '#F8D18C', is_drum_available: true },
  { id: 'saasi-sge-6', product_id: '', name: 'Cameo', code: '232', hex: '#FBCBA0', is_drum_available: false },
  { id: 'saasi-sge-7', product_id: '', name: 'Sea Oats', code: '250', hex: '#F9EED1', is_drum_available: false },
  { id: 'saasi-sge-8', product_id: '', name: 'Diyar', code: '259', hex: '#E2BF9C', is_drum_available: false },
  { id: 'saasi-sge-9', product_id: '', name: 'Soft Terracotta', code: '225', hex: '#F9AC8D', is_drum_available: false },
  { id: 'saasi-sge-10', product_id: '', name: 'Early Dawn', code: '221', hex: '#FEE5D9', is_drum_available: false },
  { id: 'saasi-sge-11', product_id: '', name: 'Caramel', code: '226', hex: '#D78E29', is_drum_available: false },
  { id: 'saasi-sge-12', product_id: '', name: 'Terracotta', code: '260', hex: '#D29783', is_drum_available: false },

  // Image 2 - Mid Tones
  { id: 'saasi-sge-13', product_id: '', name: 'Blush Pink', code: '205', hex: '#F9D8D2', is_drum_available: false },
  { id: 'saasi-sge-14', product_id: '', name: 'Dream Land', code: '224', hex: '#E4EFDC', is_drum_available: false },
  { id: 'saasi-sge-15', product_id: '', name: 'Beige', code: '203', hex: '#BC9F79', is_drum_available: false },
  { id: 'saasi-sge-16', product_id: '', name: 'Orange', code: '243', hex: '#E74323', is_drum_available: false },
  { id: 'saasi-sge-17', product_id: '', name: 'Lilac Touch', code: '238', hex: '#DFD8EB', is_drum_available: false },
  { id: 'saasi-sge-18', product_id: '', name: 'Angel', code: '233', hex: '#F5C2CD', is_drum_available: false },
  { id: 'saasi-sge-19', product_id: '', name: 'Sea Green', code: '216', hex: '#80B98E', is_drum_available: true },
  { id: 'saasi-sge-20', product_id: '', name: 'Coriander', code: '242', hex: '#A47D75', is_drum_available: false },
  { id: 'saasi-sge-21', product_id: '', name: 'Golden Brown', code: '207', hex: '#955034', is_drum_available: false },
  { id: 'saasi-sge-22', product_id: '', name: 'Mauve', code: '219', hex: '#AFA4CC', is_drum_available: false },
  { id: 'saasi-sge-23', product_id: '', name: 'Rose Bouquet', code: '255', hex: '#F599AC', is_drum_available: false },
  { id: 'saasi-sge-24', product_id: '', name: 'Green Dream', code: '259', hex: '#44A89C', is_drum_available: false },
  { id: 'saasi-sge-25', product_id: '', name: 'Red Oxide', code: '217', hex: '#3B1213', is_drum_available: true },
  { id: 'saasi-sge-26', product_id: '', name: 'Oyster', code: '223', hex: '#D2D1BF', is_drum_available: false },
  { id: 'saasi-sge-27', product_id: '', name: 'Slate Grey', code: '227', hex: '#929B9C', is_drum_available: false },
  { id: 'saasi-sge-28', product_id: '', name: 'Sweet William', code: '257', hex: '#E6B4CE', is_drum_available: false },
  { id: 'saasi-sge-29', product_id: '', name: 'Adams Green', code: '261', hex: '#34A086', is_drum_available: false },
  { id: 'saasi-sge-30', product_id: '', name: 'Colombian Coffee', code: '258', hex: '#4B3131', is_drum_available: false },
  { id: 'saasi-sge-31', product_id: '', name: 'Crimson', code: '234', hex: '#4E0A0C', is_drum_available: false },
  { id: 'saasi-sge-32', product_id: '', name: 'Dark Grey', code: '231', hex: '#34383F', is_drum_available: false },
  { id: 'saasi-sge-33', product_id: '', name: 'Carnival Pink', code: '256', hex: '#B8456D', is_drum_available: false },
  { id: 'saasi-sge-34', product_id: '', name: 'Signal Green', code: '218', hex: '#0B1D16', is_drum_available: true },

  // Image 3 - Neutrals/Blue/Strong
  { id: 'saasi-sge-35', product_id: '', name: 'Ash White', code: '209', hex: '#EBE4D0', is_drum_available: true },
  { id: 'saasi-sge-36', product_id: '', name: 'Pumice', code: '263', hex: '#CCD6D7', is_drum_available: false },
  { id: 'saasi-sge-37', product_id: '', name: 'Polish Brown', code: '253', hex: '#B26231', is_drum_available: false },
  { id: 'saasi-sge-38', product_id: '', name: 'Mustard', code: '265', hex: '#BE9151', is_drum_available: false },
  { id: 'saasi-sge-39', product_id: '', name: 'Sky Blue', code: '214', hex: '#AED6EB', is_drum_available: true },
  { id: 'saasi-sge-40', product_id: '', name: 'Dove Grey', code: '210', hex: '#C0C8C8', is_drum_available: true },
  { id: 'saasi-sge-41', product_id: '', name: 'Torres Blue', code: '235', hex: '#C7DAEA', is_drum_available: false },
  { id: 'saasi-sge-42', product_id: '', name: 'Ochre', code: '254', hex: '#C36437', is_drum_available: false },
  { id: 'saasi-sge-43', product_id: '', name: 'New Polish Brown', code: '266', hex: '#A37250', is_drum_available: false },
  { id: 'saasi-sge-44', product_id: '', name: 'Light Blue', code: '215', hex: '#87C3EA', is_drum_available: true },
  { id: 'saasi-sge-45', product_id: '', name: 'Ash Grey', code: '211', hex: '#BDBDBA', is_drum_available: true },
  { id: 'saasi-sge-46', product_id: '', name: 'Smoke Grey', code: '212', hex: '#3E546C', is_drum_available: true },
  { id: 'saasi-sge-47', product_id: '', name: 'Lemon', code: '228', hex: '#FDD521', is_drum_available: false },
  { id: 'saasi-sge-48', product_id: '', name: 'Brown', code: '267', hex: '#633D2D', is_drum_available: false },
  { id: 'saasi-sge-49', product_id: '', name: 'Vivid Blue', code: '241', hex: '#0076B8', is_drum_available: false },
  { id: 'saasi-sge-50', product_id: '', name: 'Court Grey', code: '220', hex: '#A9ABAA', is_drum_available: false },
  { id: 'saasi-sge-51', product_id: '', name: 'Champagne', code: '204', hex: '#84735E', is_drum_available: false },
  { id: 'saasi-sge-52', product_id: '', name: 'Golden Yellow', code: '208', hex: '#FC9D1B', is_drum_available: false },
  { id: 'saasi-sge-53', product_id: '', name: 'Signal Red', code: '206', hex: '#95161B', is_drum_available: true },
  { id: 'saasi-sge-54', product_id: '', name: 'Middle Blue', code: '213', hex: '#1E3E7F', is_drum_available: true },
  { id: 'saasi-sge-55', product_id: '', name: 'Light Grey', code: '262', hex: '#94A6A2', is_drum_available: false },
  { id: 'saasi-sge-56', product_id: '', name: 'Bahama Brown', code: '240', hex: '#30221E', is_drum_available: false },
  { id: 'saasi-sge-57', product_id: '', name: 'Yellow', code: '264', hex: '#F99521', is_drum_available: false },
  { id: 'saasi-sge-58', product_id: '', name: 'Leather Brown', code: '222', hex: '#111111', is_drum_available: true },
  { id: 'saasi-sge-59', product_id: '', name: 'Black', code: '229', hex: '#000000', is_drum_available: true },
];
`;

// Read existing shades.ts
let content = fs.readFileSync('src/constants/shades.ts', 'utf8');

// Remove existing SAASI_SUPER_GLOSS_ENAMEL_SHADES if present
const existingIdx = content.indexOf('\nexport const SAASI_SUPER_GLOSS_ENAMEL_SHADES');
if (existingIdx > 0) {
    content = content.substring(0, existingIdx);
}

content = content.trimEnd() + '\n';
fs.writeFileSync('src/constants/shades.ts', content + saasiSuperGlossEnamelShades, 'utf8');
console.log('Done! Added SAASI_SUPER_GLOSS_ENAMEL_SHADES (60 shades total).');
console.log('File size:', fs.statSync('src/constants/shades.ts').size, 'bytes');
