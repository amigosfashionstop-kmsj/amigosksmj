export const ADMIN_COOKIE_NAME = 'admin_session';

const getSecretKey = (): string => {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_PASSWORD ||
    'amigos_fashionstop_production_secret_key_2026'
  );
};

function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

function hexToBuffer(hex: string): ArrayBuffer {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes.buffer;
}

async function getCryptoKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

export async function createAdminToken(username = 'Admin'): Promise<string> {
  const payload = JSON.stringify({
    username,
    createdAt: Date.now()
  });
  const payloadB64 = btoa(payload);
  const key = await getCryptoKey(getSecretKey());
  const enc = new TextEncoder();
  const signatureBuffer = await crypto.subtle.sign('HMAC', key, enc.encode(payloadB64));
  const signatureHex = bufferToHex(signatureBuffer);
  return `${payloadB64}.${signatureHex}`;
}

export async function verifyAdminToken(token: string | undefined | null): Promise<boolean> {
  if (!token || typeof token !== 'string') return false;
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return false;
    const [payloadB64, signatureHex] = parts;
    if (!payloadB64 || !signatureHex) return false;

    const key = await getCryptoKey(getSecretKey());
    const sigBuffer = hexToBuffer(signatureHex);
    const enc = new TextEncoder();
    const isValid = await crypto.subtle.verify('HMAC', key, sigBuffer, enc.encode(payloadB64));
    if (!isValid) return false;

    const payload = JSON.parse(atob(payloadB64));
    const expectedUsername = process.env.ADMIN_ID || 'Admin';
    if (payload.username !== expectedUsername) return false;

    // Token valid for 7 days
    const maxAgeMs = 7 * 24 * 60 * 60 * 1000;
    if (Date.now() - payload.createdAt > maxAgeMs) return false;

    return true;
  } catch {
    return false;
  }
}
