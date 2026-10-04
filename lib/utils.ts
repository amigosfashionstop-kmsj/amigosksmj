import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
}

export function calculateDiscount(mrp: number, price: number): number {
  if (!mrp || mrp <= price) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}

/**
 * Cleans product titles at render time and in metadata.
 * Removes repeated SKU/code prefix, collapses duplicate words ("SET ... SET"),
 * corrects "Lehnga" to "Lehenga", and appends SKU at the end.
 * Example: "AFS 045 SET Cotton SET in Ochre Yellow Angrakha" -> "Ochre Yellow Angrakha Cotton Kurti Set (AFS 045)"
 */
export function displayTitle(title: string, skuOrCode?: string): string {
  if (!title) return '';

  let cleaned = title.trim();

  // 1. Extract SKU / code if present at beginning (e.g. "AFS 045 SET", "AFS 016 Kurta", "AFS 001")
  let extractedCode = skuOrCode || '';
  const prefixMatch = cleaned.match(/^(AFS[\s-]*\d+[\s-]*(SET|KURTA|Kurta)?)\s+/i);
  if (prefixMatch) {
    if (!extractedCode) {
      extractedCode = prefixMatch[1].replace(/\s+(SET|KURTA|Kurta)$/i, '').trim();
    }
    cleaned = cleaned.substring(prefixMatch[0].length).trim();
  }

  // 2. Correct common typos like "Lehnga" -> "Lehenga"
  cleaned = cleaned.replace(/\bLehnga\b/gi, 'Lehenga');

  // 3. Remove duplicate words case-insensitively (e.g. "Cotton ... Cotton", "SET ... SET")
  // Example: "Cotton SET in Ochre Yellow Angrakha"
  const inMatch = cleaned.match(/^(.*?)\s+in\s+(.*)$/i);
  if (inMatch) {
    const frontPart = inMatch[1].trim(); // e.g. "Cotton SET"
    const colorStyle = inMatch[2].trim(); // e.g. "Ochre Yellow Angrakha"

    // Simplify frontPart
    const isSet = /set/i.test(frontPart) || /set/i.test(title);
    const fabricWord = frontPart.replace(/set/i, '').trim();

    cleaned = `${colorStyle} ${fabricWord} ${isSet ? 'Kurti Set' : 'Kurti'}`.replace(/\s+/g, ' ').trim();
  } else {
    // Collapse duplicate adjacent words
    cleaned = cleaned.replace(/\b(\w+)\s+\1\b/gi, '$1');
  }

  // Final cleanup of extra spaces
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  // If we have a code/sku, append it nicely e.g. "(AFS 045)"
  const codeTag = extractedCode ? extractedCode.replace(/\s+(SET|KURTA|Kurta)$/i, '').trim() : '';
  if (codeTag && !cleaned.includes(codeTag)) {
    return `${cleaned} (${codeTag})`;
  }

  return cleaned;
}
