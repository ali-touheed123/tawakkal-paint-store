const fs = require('fs');

const shadesRaw = `
Off White|6301|#F9F4E3
Crisp|6324|#F8F5DC
Mobe Pearl|6335|#EFDFCA
Almond Sand|6330|#E7D5B8
Palace White|6327|#F9EED1
Candle Wax|6331|#F1DEC0
Evening Tea|6305|#FAD0A1
Sweet Cream|6325|#F8D18C
Flax Straw|6336|#E2C995
Apricot|6306|#F4AF7A
Natural Paprika|6307|#CE7256
Trondheim|6332|#A6805D

Lavender|6362|#B4B9D6
Angel Blue|6340|#DAEFE6
Peach Shadow|6321|#F8D1B4
Baby Pink|6308|#F9D8D2
Pink Orchard|6349|#A66E99
Purple Aster|6312|#E0CFD8
Soft Blue|6315|#C4E4F2
Red Buff|6333|#B56D56
Petal Pink|6339|#E4CAC3
Carnival Pink (SP.)|6313|#B368A6
Purple|6343|#6E5C8D
Ice Turquoise|6361|#85D4F5
Fresh Pasta|6322|#EAE3BA
Angelica Pink|6309|#F5C2CD
Chilli Red (SP.)|6353|#853331
Royal Orchard (SP.)|6345|#4C3C58
Blue Flame|6316|#3E6B9D
Gold Rush|6317|#A48D51
Emily|6311|#EEBFA9
Adventure (SP.)|6314|#872E31
Red Wine (SP.)|6350|#3C293C
Navy Blue (SP.)|6354|#213C7A

Ash White|6318|#F8F4DF
Ash Grey|6357|#8A8E89
Turquoise|6347|#73C5B5
Green Grape|6320|#EFF4D2
Vanilla Yellow|6323|#FFF3C4
Ego Shell|6328|#EBE4D0
Steel Grey|6359|#778488
Pacific Ocean|6351|#3EAFAF
Sherbet|6342|#DAEED6
Lemon Shine|6326|#FCE07A
Lavender White|6319|#DED9D4
Havana (SP.)|6360|#5C4530
Ocean Dip|6346|#3986A8
Apple Green|6310|#AFD38E
Banana Yellow|6329|#FFD555
Snow White|6356|#E4E0D6
Dark Brown|6337|#352B28
Peacock Blue|6355|#295F6C
Lime|6341|#D1E58B
Honey Gold|6334|#F8B56A
Snowfield|6358|#C0C8C8
Green Land|6348|#498242
Dark Green|6352|#214F33
Grass Green|6344|#7C9854
Mango Yellow (SP.)|6338|#F6A841
`;

const lines = shadesRaw.split('\n').filter(l => l.trim().length > 0);

let tsContent = `export const SAASI_HYDROUS_SHADES: Shade[] = [\n`;
let idCount = 1;

for (const line of lines) {
    const [name, code, hex] = line.split('|');
    const cleanName = name.replace(' (SP.)', '');
    tsContent += `  { id: 'saasi-hydrous-${idCount}', name: '${cleanName}', code: '${code}', hex: '${hex}' },\n`;
    idCount++;
}

tsContent += `];\n`;

fs.writeFileSync('C:/Users/KING/Desktop/open/tawakkal-paint/tmp_saasi_hydrous_ts.txt', tsContent);
console.log('Saved to tmp_saasi_hydrous_ts.txt');
