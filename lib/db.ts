import fs from 'fs';
import path from 'path';

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

function ensureDb() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(ordersDbFile)) {
    fs.writeFileSync(ordersDbFile, JSON.stringify([]));
  }
}

export function getOrders(): BackendOrder[] {
  ensureDb();
  try {
    const data = fs.readFileSync(ordersDbFile, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

export function saveOrder(order: BackendOrder) {
  const orders = getOrders();
  orders.unshift(order);
  fs.writeFileSync(ordersDbFile, JSON.stringify(orders, null, 2));
}

export function updateOrderStatus(orderId: string, status: string) {
  const orders = getOrders();
  const order = orders.find(o => o.orderId === orderId);
  if (order) {
    order.delivery.status = status;
    fs.writeFileSync(ordersDbFile, JSON.stringify(orders, null, 2));
    return order;
  }
  return null;
}

export function getProducts() {
  ensureDb();
  if (fs.existsSync(productsDbFile)) {
    try {
      const data = fs.readFileSync(productsDbFile, 'utf8');
      return JSON.parse(data);
    } catch (e) {
      // fallback
    }
  }
  // If not exists, return null so caller can seed it
  return null;
}

export function saveProducts(products: any[]) {
  ensureDb();
  fs.writeFileSync(productsDbFile, JSON.stringify(products, null, 2));
}
