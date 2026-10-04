import { STORE_INFO } from '../data/store-info';
import { Product } from '../data/products';
import { CartItem } from '../store/cart-store';

export function generateProductWhatsAppUrl(product: Product, selectedSize?: string): string {
  const phone = STORE_INFO.primaryWhatsApp;
  const sizeText = selectedSize ? ('in Size: ' + selectedSize) : '';
  const price = product.isClearance ? product.salePrice : product.price;
  const message = `Hi Amigos Fashionstop! 👋
I am interested in buying:
✨ *${product.code}* - ${product.name}
👗 Fabric: ${product.fabric}
🏷️ Price: ₹${price} ${sizeText}

Please confirm availability and dispatch options to my location. Thank you!`;

  return 'https://wa.me/' + phone + '?text=' + encodeURIComponent(message);
}

export function generateCartWhatsAppUrl(items: CartItem[], grandTotal: number): string {
  const phone = STORE_INFO.primaryWhatsApp;
  const itemsSummary = items.map((item, i) => `${i + 1}. ${item.product.code} (Size: ${item.size}) x ${item.quantity} = ₹${item.price * item.quantity}`).join('\n');
  const message = `Hi Amigos Fashionstop! 👋
I would like to order the following items from your website:

${itemsSummary}

💰 *Total Amount*: ₹${grandTotal}

Could you please confirm payment and dispatch details? Thank you!`;

  return 'https://wa.me/' + phone + '?text=' + encodeURIComponent(message);
}

export function generateWholesaleWhatsAppUrl(businessName: string, city: string, units: string): string {
  const phone = STORE_INFO.primaryWhatsApp;
  const message = `Hi Amigos Fashionstop! 👋
I would like to enquire about wholesale / bulk orders for women's ethnic wear.

🏪 *Business Name*: ${businessName}
📍 *City*: ${city}
📦 *Estimated Units Required*: ${units}

Please share your latest B2B catalog and wholesale price tiers.`;

  return 'https://wa.me/' + phone + '?text=' + encodeURIComponent(message);
}

export function generateGeneralWhatsAppUrl(): string {
  const phone = STORE_INFO.primaryWhatsApp;
  const message = `Hi Amigos Fashionstop! 👋
I am browsing your collection on your website and would love some assistance with selecting kurtis and sizing.`;

  return 'https://wa.me/' + phone + '?text=' + encodeURIComponent(message);
}
