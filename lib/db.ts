import fs from 'fs';
import path from 'path';
import { PRODUCTS } from './data/products';

export interface BackendOrder {
  orderId: string;
  date: string;
  customer: any;
  items: any[];
  totals: any;
  delivery: {
    status: string;
    trackingNumber: string;
  };
}

const dataDir = path.join(process.cwd(), 'data');
const ordersDbFile = path.join(dataDir, 'orders.json');
const productsDbFile = path.join(dataDir, 'products.json');

// Vercel serverless writable fallback directory
const tmpDir = process.env.TMPDIR || '/tmp';
const tmpOrdersDbFile = path.join(tmpDir, 'amigos_orders.json');
const tmpProductsDbFile = path.join(tmpDir, 'amigos_products.json');

let inMemoryProducts: any[] | null = null;
let inMemoryOrders: BackendOrder[] | null = null;

function safeWrite(primaryPath: string, fallbackPath: string, data: string): boolean {
  try {
    const dir = path.dirname(primaryPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(primaryPath, data);
    return true;
  } catch {
    try {
      fs.writeFileSync(fallbackPath, data);
      return true;
    } catch {
      return false;
    }
  }
}

function safeRead(primaryPath: string, fallbackPath: string): string | null {
  try {
    if (fs.existsSync(fallbackPath)) {
      return fs.readFileSync(fallbackPath, 'utf8');
    }
  } catch {}

  try {
    if (fs.existsSync(primaryPath)) {
      return fs.readFileSync(primaryPath, 'utf8');
    }
  } catch {}

  return null;
}

export function getOrders(): BackendOrder[] {
  if (inMemoryOrders) return inMemoryOrders;

  const raw = safeRead(ordersDbFile, tmpOrdersDbFile);
  if (raw) {
    try {
      inMemoryOrders = JSON.parse(raw);
      return inMemoryOrders || [];
    } catch (e) {
      console.error('Failed to parse orders data', e);
    }
  }
  return [];
}

export function saveOrder(order: BackendOrder) {
  const orders = getOrders();
  orders.unshift(order);
  inMemoryOrders = orders;
  safeWrite(ordersDbFile, tmpOrdersDbFile, JSON.stringify(orders, null, 2));
}

export function updateOrderStatus(orderId: string, status: string) {
  const orders = getOrders();
  const order = orders.find(o => o.orderId === orderId);
  if (order) {
    order.delivery.status = status;
    inMemoryOrders = orders;
    safeWrite(ordersDbFile, tmpOrdersDbFile, JSON.stringify(orders, null, 2));
    return order;
  }
  return null;
}

export function getProducts(): any[] {
  if (inMemoryProducts && inMemoryProducts.length > 0) {
    return inMemoryProducts;
  }

  const raw = safeRead(productsDbFile, tmpProductsDbFile);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        inMemoryProducts = parsed;
        return inMemoryProducts;
      }
    } catch (e) {
      console.error('Failed to parse products data', e);
    }
  }

  // Fallback to static PRODUCTS
  inMemoryProducts = PRODUCTS;
  return inMemoryProducts;
}

export function saveProducts(products: any[]) {
  inMemoryProducts = products;
  safeWrite(productsDbFile, tmpProductsDbFile, JSON.stringify(products, null, 2));
}
