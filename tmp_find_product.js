const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://kadkryylyzfwtxknvcic.supabase.co';
const supabaseKey = 'sb_publishable_fJrcCMjovWvsxV1Dg7Cs5A_ZM-8Q7Xp';
const supabase = createClient(supabaseUrl, supabaseKey);

async function findProduct() {
    const { data, error } = await supabase
        .from('products')
        .select('id, name')
        .eq('name', 'Brighto Super Emulsion')
        .single();

    if (error) {
        console.error('Error finding product:', error);
    } else {
        console.log('Product ID:', data.id);
    }
}

findProduct();
