import { NextResponse, NextRequest } from 'next/server';
import { getAdminSupabase } from '@/lib/supabase';
import { getDynamicCategories, getServerProducts } from '@/lib/data/server-products';
import { requireAdminAPI } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const list = await getServerProducts();
    return NextResponse.json({ products: list, categories: await getDynamicCategories(), available: true });
  } catch {
    return NextResponse.json({ error: 'Product catalog is temporarily unavailable', available: false }, { status: 503 });
  }
}

export async function POST(request: NextRequest) {
  if (!(await requireAdminAPI(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { products } = await request.json();
    if (products && Array.isArray(products)) {
      const supabase = getAdminSupabase();

      const { data: existingProducts, error: existingError } = await supabase.from('products').select('id, sku');
      if (existingError) throw existingError;
      const dbProducts = products.map(p => ({
        id: existingProducts?.find(row => row.id === p.id || row.sku === (p.sku || p.code))?.id,
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
      }));

      const productRows = dbProducts.filter(product => product.sku);
      if (productRows.length !== dbProducts.length) return NextResponse.json({ success: false, error: 'Every product must have a SKU or code' }, { status: 400 });
      const { error: pError } = await supabase
        .from('products')
        .upsert(productRows, { onConflict: 'sku' });

      if (pError) throw pError;

      // Now map sizes/variants
      const dbVariants: any[] = [];
      const { data: savedProducts, error: savedProductsError } = await supabase.from('products').select('id, sku');
      if (savedProductsError) throw savedProductsError;
      products.forEach(p => {
        const savedProduct = savedProducts?.find(row => row.id === p.id || row.sku === (p.sku || p.code));
        if (!savedProduct) return;
        if (p.sizes && Array.isArray(p.sizes)) {
          p.sizes.forEach((size: string) => {
            dbVariants.push({
              product_id: savedProduct.id,
              size: size,
              stock: p.stock ? Math.floor(p.stock / p.sizes.length) : 0 // Fallback distribution if no exact size stock
            });
          });
        } else if (p.stock > 0) {
           dbVariants.push({
              product_id: savedProduct.id,
              size: 'Free Size',
              stock: p.stock
           });
        }
      });

      if (dbVariants.length > 0) {
        const { error: vError } = await supabase
          .from('product_variants')
          .upsert(dbVariants, { onConflict: 'product_id,size' });
        if (vError) throw vError;
      }

      return NextResponse.json({ success: true, count: products.length });
    }
    return NextResponse.json({ success: false, error: 'Invalid products format' }, { status: 400 });
  } catch (error: any) {
    console.error('Error saving products:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
