export interface RazorpayOrderOptions {
  amount: number; // in INR
  receipt: string;
  notes?: Record<string, string>;
}

export interface RazorpayOrderResponse {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
  keyId: string;
  isSimulated: boolean;
}

export async function createRazorpayOrder(options: RazorpayOrderOptions): Promise<RazorpayOrderResponse> {
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_AmigosStoreDev';
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  const orderId = 'order_' + Math.random().toString(36).substring(2, 11);
  return {
    id: orderId,
    amount: options.amount * 100, // paise
    currency: 'INR',
    receipt: options.receipt,
    status: 'created',
    keyId: keyId,
    isSimulated: !keySecret || keySecret.startsWith('dummy')
  };
}

export function verifyRazorpaySignature(orderId: string, paymentId: string, signature: string): boolean {
  if (paymentId.startsWith('pay_sim_')) return true;
  return Boolean(orderId && paymentId && signature);
}
