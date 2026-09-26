import { NextResponse } from 'next/server';
import { getProducts, saveProducts } from '@/lib/db';
import { PRODUCTS } from '@/lib/data/products';
import { getDynamicCategories } from '@/lib/data/server-products';

export const dynamic = 'force-dynamic';

export async function GET() {
  let list = getProducts();
  if (!list || list.length === 0) {
    list = PRODUCTS;
  }
  return NextResponse.json(
    {
      products: list,
      categories: getDynamicCategories()
    },
    {
      headers: {
        'Cache-Control': 'no-store, max-age=0'
      }
    }
  );
}

export async function POST(request: Request) {
  try {
    const { products } = await request.json();
    if (products && Array.isArray(products)) {
      saveProducts(products);
      return NextResponse.json({ success: true, count: products.length });
    }
    return NextResponse.json({ success: false, error: 'Invalid products format' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to save products' }, { status: 500 });
  }
}
