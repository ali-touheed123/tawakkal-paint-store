const fs = require('fs');

const saasiWeatherSafeShades = `
export const SAASI_WEATHER_SAFE_SHADES: Shade[] = [
  // Manually Added
  { id: 'saasi-ws-62', product_id: '', name: 'Brilliant White', code: '(400) 1000', hex: '#FFFFFF', is_drum_available: true },
  
  // Image 1
  { id: 'saasi-ws-1', product_id: '', name: 'Off White', code: '(401) 1952', hex: '#FDF6D8', is_drum_available: true },
  { id: 'saasi-ws-2', product_id: '', name: 'Ivory Silk', code: '(436) 6108', hex: '#F2EDDA', is_drum_available: false },
  { id: 'saasi-ws-3', product_id: '', name: 'Barber Beige', code: '(430) 2891', hex: '#FDF4E3', is_drum_available: true },
  { id: 'saasi-ws-4', product_id: '', name: 'Almond Whisper', code: '(435) 6107', hex: '#FEF8E6', is_drum_available: false },
  { id: 'saasi-ws-5', product_id: '', name: 'Sand Stone', code: '(411) 1949', hex: '#CBC2B1', is_drum_available: false },
  { id: 'saasi-ws-6', product_id: '', name: 'Apricot', code: '(410) 1920', hex: '#F8D1B4', is_drum_available: true },
  { id: 'saasi-ws-7', product_id: '', name: 'Cameo', code: '(421) 2685', hex: '#FBCBA0', is_drum_available: false },
  { id: 'saasi-ws-8', product_id: '', name: 'Beige', code: '(414) 2087', hex: '#BC9F79', is_drum_available: true },
  { id: 'saasi-ws-9', product_id: '', name: 'Sweet Jewel', code: '(432) 4058', hex: '#F9AC8D', is_drum_available: false },
  { id: 'saasi-ws-10', product_id: '', name: 'Sharp Cameo', code: '(439) 6826', hex: '#E2BF9C', is_drum_available: false },
  { id: 'saasi-ws-11', product_id: '', name: 'Sun Shower', code: '(449) 6849', hex: '#F9EED1', is_drum_available: false },

  // Image 2
  { id: 'saasi-ws-12', product_id: '', name: 'Ash White', code: '5081', hex: '#E8E2D8', is_drum_available: true },
  { id: 'saasi-ws-13', product_id: '', name: 'Sea Lock', code: '(417) 2465', hex: '#A8D4C0', is_drum_available: false },
  { id: 'saasi-ws-14', product_id: '', name: 'Weak Tea', code: '(433) 5055', hex: '#F9D8D2', is_drum_available: false },
  { id: 'saasi-ws-15', product_id: '', name: 'Fruity', code: '(420) 081', hex: '#FCE0A1', is_drum_available: false },
  { id: 'saasi-ws-16', product_id: '', name: 'Roof Tile', code: '(416) 2111', hex: '#872E31', is_drum_available: false },
  { id: 'saasi-ws-17', product_id: '', name: 'Badami', code: '(438) 6183', hex: '#DED9D4', is_drum_available: true },
  { id: 'saasi-ws-18', product_id: '', name: 'Vivid', code: '(418) 2468', hex: '#3E6B9D', is_drum_available: false },
  { id: 'saasi-ws-19', product_id: '', name: 'Pink Pavilion', code: '(437) 6172', hex: '#F5C5C8', is_drum_available: false },
  { id: 'saasi-ws-20', product_id: '', name: 'Mehndi', code: '(405) 0170', hex: '#B0985A', is_drum_available: false },
  { id: 'saasi-ws-21', product_id: '', name: 'Red Oxide', code: '(426) 2910', hex: '#5C4530', is_drum_available: true },
  { id: 'saasi-ws-22', product_id: '', name: 'Tea Rose', code: '(412) 1958', hex: '#E0CFD8', is_drum_available: false },
  { id: 'saasi-ws-23', product_id: '', name: 'Ocean Wave', code: '(427) 2983', hex: '#89B8D8', is_drum_available: false },
  { id: 'saasi-ws-24', product_id: '', name: 'Cappuccino', code: '(404) 0161', hex: '#A6805D', is_drum_available: false },
  { id: 'saasi-ws-25', product_id: '', name: 'Red Haze', code: '5082', hex: '#E74323', is_drum_available: false },
  { id: 'saasi-ws-26', product_id: '', name: 'Chocolate', code: '(407) 0175', hex: '#352B28', is_drum_available: true },
  { id: 'saasi-ws-27', product_id: '', name: 'Desert Dawn', code: '(450) 7049', hex: '#F4B8A0', is_drum_available: false },
  { id: 'saasi-ws-28', product_id: '', name: 'Sharp Blue', code: '093', hex: '#1E7890', is_drum_available: false },
  { id: 'saasi-ws-29', product_id: '', name: 'Avocado', code: '(415) 2088', hex: '#88C8A4', is_drum_available: false },
  { id: 'saasi-ws-30', product_id: '', name: 'Orange', code: '(456) 3050', hex: '#E8762A', is_drum_available: false },
  { id: 'saasi-ws-31', product_id: '', name: 'Evening Shadow', code: '5083', hex: '#34383F', is_drum_available: false },
  { id: 'saasi-ws-32', product_id: '', name: 'Peach', code: '(431) 3165', hex: '#F8D1B4', is_drum_available: true },
  { id: 'saasi-ws-33', product_id: '', name: 'Blue Magic', code: '(453) 3032', hex: '#1C2E68', is_drum_available: false },
  { id: 'saasi-ws-34', product_id: '', name: 'Admiral', code: '(424) 2886', hex: '#3C72A8', is_drum_available: false },
  { id: 'saasi-ws-35', product_id: '', name: 'Red Rose', code: '(441) 0141', hex: '#9E2040', is_drum_available: false },
  { id: 'saasi-ws-36', product_id: '', name: 'Black', code: '5084', hex: '#000000', is_drum_available: true },

  // Image 3
  { id: 'saasi-ws-37', product_id: '', name: 'Ash White', code: '(402) 1919', hex: '#E8E2D8', is_drum_available: true },
  { id: 'saasi-ws-38', product_id: '', name: 'Portland', code: '(422) 2688', hex: '#CCD6D7', is_drum_available: false },
  { id: 'saasi-ws-39', product_id: '', name: 'Ash Grey', code: '(446) 5002', hex: '#8A8E89', is_drum_available: false },
  { id: 'saasi-ws-40', product_id: '', name: 'Terracotta', code: '(429) 3148', hex: '#6B3820', is_drum_available: false },
  { id: 'saasi-ws-41', product_id: '', name: 'Clay', code: '(428) 3145', hex: '#929B9C', is_drum_available: false },
  { id: 'saasi-ws-42', product_id: '', name: 'Grey White', code: '455', hex: '#BDBDBA', is_drum_available: true },
  { id: 'saasi-ws-43', product_id: '', name: 'Moor Land', code: '(451) 3045', hex: '#80B98E', is_drum_available: false },
  { id: 'saasi-ws-44', product_id: '', name: 'Stone Grey', code: '(445) 5023', hex: '#787A7C', is_drum_available: false },
  { id: 'saasi-ws-45', product_id: '', name: 'Multani Tile', code: '(434) 5354', hex: '#A37250', is_drum_available: false },
  { id: 'saasi-ws-46', product_id: '', name: 'Avocado', code: '5086', hex: '#498242', is_drum_available: false },
  { id: 'saasi-ws-47', product_id: '', name: 'Sky Grey', code: '(425) 3160', hex: '#A9ABAA', is_drum_available: false },
  { id: 'saasi-ws-48', product_id: '', name: 'Grey Tile', code: '(442) 5079', hex: '#94A6A2', is_drum_available: false },
  { id: 'saasi-ws-49', product_id: '', name: 'Antelope', code: '(419) 2683', hex: '#84735E', is_drum_available: false },
  { id: 'saasi-ws-50', product_id: '', name: 'Spicy Orange', code: '(406) 0171', hex: '#C36437', is_drum_available: false },
  { id: 'saasi-ws-51', product_id: '', name: 'Tile Red', code: '(447) 0113', hex: '#95161B', is_drum_available: true },
  { id: 'saasi-ws-52', product_id: '', name: 'Goose Wing', code: '(413) 1959', hex: '#DED9D4', is_drum_available: false },
  { id: 'saasi-ws-53', product_id: '', name: 'Ocean Storm', code: '(443) 0178', hex: '#C7DAEA', is_drum_available: false },
  { id: 'saasi-ws-54', product_id: '', name: 'Nutty Brown', code: '(452) 3049', hex: '#633D2D', is_drum_available: false },
  { id: 'saasi-ws-55', product_id: '', name: 'Chilli Red', code: '(408) 0176', hex: '#9E2040', is_drum_available: false },
  { id: 'saasi-ws-56', product_id: '', name: 'Khaprail', code: '5087', hex: '#5C4530', is_drum_available: false },
  { id: 'saasi-ws-57', product_id: '', name: 'Charcoal', code: '(454) 3127', hex: '#34383F', is_drum_available: false },
  { id: 'saasi-ws-58', product_id: '', name: 'Wirework Grey', code: '5080', hex: '#BDBDBA', is_drum_available: true },
  { id: 'saasi-ws-59', product_id: '', name: 'Chocolate', code: '5085', hex: '#352B28', is_drum_available: true },
  { id: 'saasi-ws-60', product_id: '', name: 'Spice', code: '(448) 014', hex: '#BC9F79', is_drum_available: false },
  { id: 'saasi-ws-61', product_id: '', name: 'Autumn Red', code: '5088', hex: '#872E31', is_drum_available: false },
];
`;

// Read existing shades.ts
let content = fs.readFileSync('src/constants/shades.ts', 'utf8');

// Remove existing SAASI_WEATHER_SAFE_SHADES if present
const existingIdx = content.indexOf('\nexport const SAASI_WEATHER_SAFE_SHADES');
if (existingIdx > 0) {
    content = content.substring(0, existingIdx);
}

content = content.trimEnd() + '\n';
fs.writeFileSync('src/constants/shades.ts', content + saasiWeatherSafeShades, 'utf8');
console.log('Done! Added SAASI_WEATHER_SAFE_SHADES (62 shades total).');
console.log('File size:', fs.statSync('src/constants/shades.ts').size, 'bytes');
