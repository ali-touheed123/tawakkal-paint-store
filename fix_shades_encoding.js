const fs = require('fs');

const saasiMattEnamelShades = `
export const SAASI_MATT_ENAMEL_SHADES: Shade[] = [
  // Image 1 - Warm Whites & Peachy tones
  { id: 'saasi-me-1', product_id: '', name: 'Milki White', code: '358', hex: '#FEF8E6', is_drum_available: false },
  { id: 'saasi-me-2', product_id: '', name: 'Kitten White', code: '353', hex: '#FCDECE', is_drum_available: false },
  { id: 'saasi-me-3', product_id: '', name: 'Peach', code: '346', hex: '#F5A987', is_drum_available: false },
  { id: 'saasi-me-4', product_id: '', name: 'Off White', code: '306', hex: '#FDF6D8', is_drum_available: false },
  { id: 'saasi-me-5', product_id: '', name: 'Rose White', code: '359', hex: '#F9CEBA', is_drum_available: false },
  { id: 'saasi-me-6', product_id: '', name: 'Natural Paprika', code: '320', hex: '#C96B4E', is_drum_available: false },
  { id: 'saasi-me-7', product_id: '', name: 'Cream', code: '301', hex: '#FDDCB0', is_drum_available: false },
  { id: 'saasi-me-8', product_id: '', name: 'Cameo', code: '352', hex: '#FBCBA0', is_drum_available: false },
  { id: 'saasi-me-9', product_id: '', name: 'Pumpkin', code: '338', hex: '#D45B35', is_drum_available: false },
  // Image 2 - Earthy, Warm & Vivid tones
  { id: 'saasi-me-10', product_id: '', name: 'Desert Tan', code: '387', hex: '#EBD8D0', is_drum_available: false },
  { id: 'saasi-me-11', product_id: '', name: 'Onion', code: '375', hex: '#F0E2D8', is_drum_available: false },
  { id: 'saasi-me-12', product_id: '', name: 'Shingle', code: '354', hex: '#F5C5C8', is_drum_available: false },
  { id: 'saasi-me-13', product_id: '', name: 'Lilac Bliss', code: '317', hex: '#C8BEDD', is_drum_available: false },
  { id: 'saasi-me-14', product_id: '', name: 'Bristoe Cream', code: '376', hex: '#F6E4DC', is_drum_available: false },
  { id: 'saasi-me-15', product_id: '', name: 'Beige Grey', code: '391', hex: '#C4B4B6', is_drum_available: false },
  { id: 'saasi-me-16', product_id: '', name: 'Puff', code: '325', hex: '#F4B8A0', is_drum_available: false },
  { id: 'saasi-me-17', product_id: '', name: 'Angel', code: '326', hex: '#F5C5C8', is_drum_available: false },
  { id: 'saasi-me-18', product_id: '', name: 'Purple Party', code: '357', hex: '#5A3060', is_drum_available: false },
  { id: 'saasi-me-19', product_id: '', name: 'Golden Brown', code: '379', hex: '#A05830', is_drum_available: false },
  { id: 'saasi-me-20', product_id: '', name: 'Gold Rust', code: '382', hex: '#C09030', is_drum_available: false },
  { id: 'saasi-me-21', product_id: '', name: 'Orange Grove', code: '380', hex: '#E8762A', is_drum_available: false },
  { id: 'saasi-me-22', product_id: '', name: 'Classical', code: '383', hex: '#D4A0A8', is_drum_available: false },
  { id: 'saasi-me-23', product_id: '', name: 'Bringal', code: '342', hex: '#4A1840', is_drum_available: false },
  { id: 'saasi-me-24', product_id: '', name: 'Chilli Red', code: '345', hex: '#9E2040', is_drum_available: false },
  { id: 'saasi-me-25', product_id: '', name: 'Gold', code: '381', hex: '#B0985A', is_drum_available: false },
  { id: 'saasi-me-26', product_id: '', name: 'Lemon', code: '334', hex: '#DDD020', is_drum_available: false },
  { id: 'saasi-me-27', product_id: '', name: 'Cameo Rose', code: '374', hex: '#E8809A', is_drum_available: false },
  { id: 'saasi-me-28', product_id: '', name: 'Carnival Pink', code: '341', hex: '#E02878', is_drum_available: false },
  { id: 'saasi-me-29', product_id: '', name: 'Sheesham', code: '388', hex: '#6B3820', is_drum_available: false },
  // Image 3 - Cool & Neutral tones
  { id: 'saasi-me-30', product_id: '', name: 'Ash White', code: '310', hex: '#E8E2D8', is_drum_available: false },
  { id: 'saasi-me-31', product_id: '', name: 'Snow Bell', code: '355', hex: '#C8C8CA', is_drum_available: false },
  { id: 'saasi-me-32', product_id: '', name: 'Torres Blue', code: '321', hex: '#89B8D8', is_drum_available: false },
  { id: 'saasi-me-33', product_id: '', name: 'Cool Blue', code: '322', hex: '#6098BC', is_drum_available: false },
  { id: 'saasi-me-34', product_id: '', name: 'Reflection', code: '313', hex: '#A8D4C0', is_drum_available: false },
  { id: 'saasi-me-35', product_id: '', name: 'Antique White', code: '350', hex: '#F2EDDA', is_drum_available: false },
  { id: 'saasi-me-36', product_id: '', name: 'Lavender White', code: '328', hex: '#ABABAF', is_drum_available: false },
  { id: 'saasi-me-37', product_id: '', name: 'First Dawn', code: '327', hex: '#3C72A8', is_drum_available: false },
  { id: 'saasi-me-38', product_id: '', name: 'Ocean Dip', code: '386', hex: '#1E7890', is_drum_available: false },
  { id: 'saasi-me-39', product_id: '', name: 'Sea Green', code: '324', hex: '#88C8A4', is_drum_available: false },
  { id: 'saasi-me-40', product_id: '', name: 'Chandni', code: '389', hex: '#EEE8D4', is_drum_available: false },
  { id: 'saasi-me-41', product_id: '', name: 'Steel Grey', code: '390', hex: '#787A7C', is_drum_available: false },
  { id: 'saasi-me-42', product_id: '', name: 'Fresh Lime', code: '384', hex: '#A8AA40', is_drum_available: false },
  { id: 'saasi-me-43', product_id: '', name: 'White Ice', code: '361', hex: '#EEF0E8', is_drum_available: false },
  { id: 'saasi-me-44', product_id: '', name: 'Navy Blue', code: '336', hex: '#1C2E68', is_drum_available: false },
  { id: 'saasi-me-45', product_id: '', name: 'Pennant', code: '385', hex: '#00A8A8', is_drum_available: false },
];
`;

// Read existing shades.ts (should be UTF-8 now)
let content = fs.readFileSync('src/constants/shades.ts', 'utf8');

// Remove existing SAASI_MATT_ENAMEL_SHADES if present
const existingIdx = content.indexOf('\nexport const SAASI_MATT_ENAMEL_SHADES');
if (existingIdx > 0) {
    content = content.substring(0, existingIdx);
}

content = content.trimEnd() + '\n';
fs.writeFileSync('src/constants/shades.ts', content + saasiMattEnamelShades, 'utf8');
console.log('Done! Added SAASI_MATT_ENAMEL_SHADES (45 shades).');
console.log('File size:', fs.statSync('src/constants/shades.ts').size, 'bytes');
