import { SignJWT, jwtVerify } from 'jose';

function getTrackingSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secret || secret.length < 32) throw new Error('Order tracking secret is not configured.');
  return new TextEncoder().encode(secret);
}

export async function createOrderTrackingToken(orderNumber: string) {
  return new SignJWT({ orderNumber, purpose: 'order-tracking' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(getTrackingSecret());
}

export async function verifyOrderTrackingToken(token: string, orderNumber: string) {
  try {
    const { payload } = await jwtVerify(token, getTrackingSecret());
    return payload.purpose === 'order-tracking' && payload.orderNumber === orderNumber;
  } catch {
    return false;
  }
}
