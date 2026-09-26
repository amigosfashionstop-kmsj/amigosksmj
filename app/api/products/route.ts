import { NextResponse } from 'next/server';
import { getProducts, saveProducts } from '@/lib/db';
import { PRODUCTS } from '@/lib/data/products';
import { getDynamicCategories } from '@/lib/data/server-products';

export async function GET() {
  let list = getProducts();
  if (!list) {
    // Seed DB on first run
    saveProducts(PRODUCTS);
    list = PRODUCTS;
  }
  return NextResponse.json({
    products: list,
    categories: getDynamicCategories()
  });
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
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
