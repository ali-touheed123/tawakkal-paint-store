const fs = require('fs');

// Read the UTF-16 file and convert to UTF-8
const buf = fs.readFileSync('src/constants/shades.ts');
// Check for BOM - if starts with FF FE or FE FF it's UTF-16
let content;
if (buf[0] === 0xFF && buf[1] === 0xFE) {
    content = buf.slice(2).toString('utf16le');
} else if (buf[0] === 0xFE && buf[1] === 0xFF) {
    content = buf.slice(2).swap16().toString('utf16le');
} else {
    content = buf.toString('utf8');
}

// Remove the SAASI section if it accidentally got in (from previous runs)
const cleanEnd = content.indexOf('\nexport const SAASI_HYDROUS_SHADES');
if (cleanEnd > 0) {
    content = content.substring(0, cleanEnd);
}

// Make sure it ends with ];\n
content = content.trimEnd() + '\n';

// Append SAASI_HYDROUS_SHADES as clean UTF-8 with all required Shade fields
const saasiShades = `
export const SAASI_HYDROUS_SHADES: Shade[] = [
  { id: 'saasi-hydrous-1', product_id: '', name: 'Off White', code: '6301', hex: '#F9F4E3', is_drum_available: false },
  { id: 'saasi-hydrous-2', product_id: '', name: 'Crisp', code: '6324', hex: '#F8F5DC', is_drum_available: false },
  { id: 'saasi-hydrous-3', product_id: '', name: 'Mobe Pearl', code: '6335', hex: '#EFDFCA', is_drum_available: false },
  { id: 'saasi-hydrous-4', product_id: '', name: 'Almond Sand', code: '6330', hex: '#E7D5B8', is_drum_available: false },
  { id: 'saasi-hydrous-5', product_id: '', name: 'Palace White', code: '6327', hex: '#F9EED1', is_drum_available: false },
  { id: 'saasi-hydrous-6', product_id: '', name: 'Candle Wax', code: '6331', hex: '#F1DEC0', is_drum_available: false },
  { id: 'saasi-hydrous-7', product_id: '', name: 'Evening Tea', code: '6305', hex: '#FAD0A1', is_drum_available: false },
  { id: 'saasi-hydrous-8', product_id: '', name: 'Sweet Cream', code: '6325', hex: '#F8D18C', is_drum_available: false },
  { id: 'saasi-hydrous-9', product_id: '', name: 'Flax Straw', code: '6336', hex: '#E2C995', is_drum_available: false },
  { id: 'saasi-hydrous-10', product_id: '', name: 'Apricot', code: '6306', hex: '#F4AF7A', is_drum_available: false },
  { id: 'saasi-hydrous-11', product_id: '', name: 'Natural Paprika', code: '6307', hex: '#CE7256', is_drum_available: false },
  { id: 'saasi-hydrous-12', product_id: '', name: 'Trondheim', code: '6332', hex: '#A6805D', is_drum_available: false },
  { id: 'saasi-hydrous-13', product_id: '', name: 'Lavender', code: '6362', hex: '#B4B9D6', is_drum_available: false },
  { id: 'saasi-hydrous-14', product_id: '', name: 'Angel Blue', code: '6340', hex: '#DAEFE6', is_drum_available: false },
  { id: 'saasi-hydrous-15', product_id: '', name: 'Peach Shadow', code: '6321', hex: '#F8D1B4', is_drum_available: false },
  { id: 'saasi-hydrous-16', product_id: '', name: 'Baby Pink', code: '6308', hex: '#F9D8D2', is_drum_available: false },
  { id: 'saasi-hydrous-17', product_id: '', name: 'Pink Orchard', code: '6349', hex: '#A66E99', is_drum_available: false },
  { id: 'saasi-hydrous-18', product_id: '', name: 'Purple Aster', code: '6312', hex: '#E0CFD8', is_drum_available: false },
  { id: 'saasi-hydrous-19', product_id: '', name: 'Soft Blue', code: '6315', hex: '#C4E4F2', is_drum_available: false },
  { id: 'saasi-hydrous-20', product_id: '', name: 'Red Buff', code: '6333', hex: '#B56D56', is_drum_available: false },
  { id: 'saasi-hydrous-21', product_id: '', name: 'Petal Pink', code: '6339', hex: '#E4CAC3', is_drum_available: false },
  { id: 'saasi-hydrous-22', product_id: '', name: 'Carnival Pink', code: '6313', hex: '#B368A6', is_drum_available: false },
  { id: 'saasi-hydrous-23', product_id: '', name: 'Purple', code: '6343', hex: '#6E5C8D', is_drum_available: false },
  { id: 'saasi-hydrous-24', product_id: '', name: 'Ice Turquoise', code: '6361', hex: '#85D4F5', is_drum_available: false },
  { id: 'saasi-hydrous-25', product_id: '', name: 'Fresh Pasta', code: '6322', hex: '#EAE3BA', is_drum_available: false },
  { id: 'saasi-hydrous-26', product_id: '', name: 'Angelica Pink', code: '6309', hex: '#F5C2CD', is_drum_available: false },
  { id: 'saasi-hydrous-27', product_id: '', name: 'Chilli Red', code: '6353', hex: '#853331', is_drum_available: false },
  { id: 'saasi-hydrous-28', product_id: '', name: 'Royal Orchard', code: '6345', hex: '#4C3C58', is_drum_available: false },
  { id: 'saasi-hydrous-29', product_id: '', name: 'Blue Flame', code: '6316', hex: '#3E6B9D', is_drum_available: false },
  { id: 'saasi-hydrous-30', product_id: '', name: 'Gold Rush', code: '6317', hex: '#A48D51', is_drum_available: false },
  { id: 'saasi-hydrous-31', product_id: '', name: 'Emily', code: '6311', hex: '#EEBFA9', is_drum_available: false },
  { id: 'saasi-hydrous-32', product_id: '', name: 'Adventure', code: '6314', hex: '#872E31', is_drum_available: false },
  { id: 'saasi-hydrous-33', product_id: '', name: 'Red Wine', code: '6350', hex: '#3C293C', is_drum_available: false },
  { id: 'saasi-hydrous-34', product_id: '', name: 'Navy Blue', code: '6354', hex: '#213C7A', is_drum_available: false },
  { id: 'saasi-hydrous-35', product_id: '', name: 'Ash White', code: '6318', hex: '#F8F4DF', is_drum_available: false },
  { id: 'saasi-hydrous-36', product_id: '', name: 'Ash Grey', code: '6357', hex: '#8A8E89', is_drum_available: false },
  { id: 'saasi-hydrous-37', product_id: '', name: 'Turquoise', code: '6347', hex: '#73C5B5', is_drum_available: false },
  { id: 'saasi-hydrous-38', product_id: '', name: 'Green Grape', code: '6320', hex: '#EFF4D2', is_drum_available: false },
  { id: 'saasi-hydrous-39', product_id: '', name: 'Vanilla Yellow', code: '6323', hex: '#FFF3C4', is_drum_available: false },
  { id: 'saasi-hydrous-40', product_id: '', name: 'Ego Shell', code: '6328', hex: '#EBE4D0', is_drum_available: false },
  { id: 'saasi-hydrous-41', product_id: '', name: 'Steel Grey', code: '6359', hex: '#778488', is_drum_available: false },
  { id: 'saasi-hydrous-42', product_id: '', name: 'Pacific Ocean', code: '6351', hex: '#3EAFAF', is_drum_available: false },
  { id: 'saasi-hydrous-43', product_id: '', name: 'Sherbet', code: '6342', hex: '#DAEED6', is_drum_available: false },
  { id: 'saasi-hydrous-44', product_id: '', name: 'Lemon Shine', code: '6326', hex: '#FCE07A', is_drum_available: false },
  { id: 'saasi-hydrous-45', product_id: '', name: 'Lavender White', code: '6319', hex: '#DED9D4', is_drum_available: false },
  { id: 'saasi-hydrous-46', product_id: '', name: 'Havana', code: '6360', hex: '#5C4530', is_drum_available: false },
  { id: 'saasi-hydrous-47', product_id: '', name: 'Ocean Dip', code: '6346', hex: '#3986A8', is_drum_available: false },
  { id: 'saasi-hydrous-48', product_id: '', name: 'Apple Green', code: '6310', hex: '#AFD38E', is_drum_available: false },
  { id: 'saasi-hydrous-49', product_id: '', name: 'Banana Yellow', code: '6329', hex: '#FFD555', is_drum_available: false },
  { id: 'saasi-hydrous-50', product_id: '', name: 'Snow White', code: '6356', hex: '#E4E0D6', is_drum_available: false },
  { id: 'saasi-hydrous-51', product_id: '', name: 'Dark Brown', code: '6337', hex: '#352B28', is_drum_available: false },
  { id: 'saasi-hydrous-52', product_id: '', name: 'Peacock Blue', code: '6355', hex: '#295F6C', is_drum_available: false },
  { id: 'saasi-hydrous-53', product_id: '', name: 'Lime', code: '6341', hex: '#D1E58B', is_drum_available: false },
  { id: 'saasi-hydrous-54', product_id: '', name: 'Honey Gold', code: '6334', hex: '#F8B56A', is_drum_available: false },
  { id: 'saasi-hydrous-55', product_id: '', name: 'Snowfield', code: '6358', hex: '#C0C8C8', is_drum_available: false },
  { id: 'saasi-hydrous-56', product_id: '', name: 'Green Land', code: '6348', hex: '#498242', is_drum_available: false },
  { id: 'saasi-hydrous-57', product_id: '', name: 'Dark Green', code: '6352', hex: '#214F33', is_drum_available: false },
  { id: 'saasi-hydrous-58', product_id: '', name: 'Grass Green', code: '6344', hex: '#7C9854', is_drum_available: false },
  { id: 'saasi-hydrous-59', product_id: '', name: 'Mango Yellow', code: '6338', hex: '#F6A841', is_drum_available: false },
];
`;

// Write back as UTF-8 (no BOM)
fs.writeFileSync('src/constants/shades.ts', content + saasiShades, 'utf8');
console.log('Done! Written as clean UTF-8 with all Shade fields.');
console.log('File size:', fs.statSync('src/constants/shades.ts').size, 'bytes');
