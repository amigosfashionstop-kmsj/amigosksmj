import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Read from .env.local
const envFile = fs.readFileSync(path.join(process.cwd(), '.env.local'), 'utf-8');
const env = {};
envFile.split('\n').forEach(line => {
  const [key, ...val] = line.split('=');
  if (key && val) env[key.trim()] = val.join('=').trim();
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

const productsData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data', 'products.json'), 'utf-8'));

async function seed() {
  console.log('Seeding products...');
  for (const p of productsData) {
    console.log(`Inserting ${p.name}...`);
    
    const dbProduct = {
      sku: p.sku || p.code || '',
      code: p.code || '',
      name: p.name,
      slug: p.slug,
      category: p.category,
      subcategory: p.subcategory || null,
      fabric: p.fabric || null,
      color: p.color || null,
      mrp: p.mrp || 0,
      price: p.price || 0,
      sale_price: p.salePrice || null,
      short_description: p.shortDescription || null,
      description: p.description || null,
      care_instructions: p.careInstructions || null,
      fit_details: p.fitDetails || null,
      shipping_info: p.shippingInfo || null,
      is_new_arrival: p.isNewArrival || false,
      is_featured: p.isFeatured || false,
      is_clearance: p.isClearance || false,
      rating: p.rating || 5.0,
      reviews_count: p.reviewsCount || 0,
      images: p.images || []
    };

    const { data: insertedProduct, error: pError } = await supabase
      .from('products')
      .insert(dbProduct)
      .select('id')
      .single();

    if (pError) {
      if (pError.code === '23505') {
        console.log(`Product ${p.slug} already exists, skipping...`);
        continue;
      }
      console.error('Error inserting product:', pError);
      continue;
    }

    const newId = insertedProduct.id;

    // Insert variants
    const dbVariants = [];
    if (p.sizes && Array.isArray(p.sizes)) {
      p.sizes.forEach(size => {
        dbVariants.push({
          product_id: newId,
          size: size,
          stock: p.stock ? Math.floor(p.stock / p.sizes.length) : 0
        });
      });
    } else if (p.stock > 0) {
       dbVariants.push({
          product_id: newId,
          size: 'Free Size',
          stock: p.stock
       });
    }

    if (dbVariants.length > 0) {
      const { error: vError } = await supabase.from('product_variants').insert(dbVariants);
      if (vError) console.error('Error inserting variants:', vError);
    }
  }
  console.log('Done seeding products!');
}

seed();
