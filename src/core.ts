export type Capture = {
  id: string;
  phrase: string;
  context: string;
  title: string;
  url: string;
  language: string;
  gloss: string;
  createdAt: string;
  reviewedAt?: string;
  reviews: number;
};

export type Vault = { version: 1; records: Capture[] };

export const SAMPLE_RECORDS: Capture[] = [
  {
    id: 'sample-quietly', phrase: 'quietly held',
    context: 'At dawn, the harbour quietly held its breath. A single boat moved beyond the breakwater.',
    title: 'A morning at the harbour', url: '/demo-sources/harbour.html', language: 'English',
    gloss: 'remained still and calm', createdAt: '2026-08-28T08:00:00.000Z', reviews: 0,
  },
  {
    id: 'sample-recoger', phrase: 'recoger el hilo',
    context: 'Después de una pausa, Marta volvió a recoger el hilo de la conversación. Nadie había olvidado la pregunta.',
    title: 'La conversación', url: '/demo-sources/conversation.html', language: 'Spanish',
    gloss: 'to pick up the thread again', createdAt: '2026-08-27T08:00:00.000Z', reviews: 1,
  },
  {
    id: 'sample-einfall', phrase: 'auf jeden Fall',
    context: 'Auf jeden Fall wollte er vor Sonnenuntergang zurück sein. Der Weg durch den Wald war länger als erwartet.',
    title: 'Der Waldweg', url: '/demo-sources/wald.html', language: 'German',
    gloss: 'in any case; definitely', createdAt: '2026-08-25T08:00:00.000Z', reviews: 0,
  },
];

export const csvEscape = (value: string | number) => `"${String(value).replaceAll('"', '""')}"`;
export const makeCsv = (records: Capture[]) => [
  ['phrase', 'context', 'gloss', 'language', 'source title', 'source URL', 'captured at', 'reviews'],
  ...records.map((r) => [r.phrase, r.context, r.gloss, r.language, r.title, r.url, r.createdAt, r.reviews]),
].map((row) => row.map(csvEscape).join(',')).join('\n');

export function inferLanguage(text: string): string {
  if (/[áéíóúñ¿¡]/i.test(text)) return 'Spanish';
  if (/[äöüß]/i.test(text)) return 'German';
  if (/[àâçéèêëîïôûùüÿœ]/i.test(text)) return 'French';
  return typeof document !== 'undefined' && document.documentElement.lang ? document.documentElement.lang : 'Unknown';
}

const normalizedText = (text: string) => text.replace(/\s+/g, ' ').trim();

function contextAtPosition(clean: string, position: number): string {
  const sentences = [...clean.matchAll(/[^.!?…。！？]+(?:[.!?…。！？]+|$)/g)]
    .map((match) => {
      const text = match[0].trim();
      const leadingSpace = match[0].search(/\S/);
      const start = (match.index ?? 0) + Math.max(0, leadingSpace);
      return { text, start, end: start + text.length };
    })
    .filter(({ text }) => text.length > 0);
  if (!sentences.length) return clean;
  const index = sentences.findIndex(({ start, end }) => position >= start && position < end);
  const selectedIndex = index < 0 ? sentences.length - 1 : index;
  const start = Math.max(0, selectedIndex - 1);
  return sentences.slice(start, Math.min(sentences.length, selectedIndex + 2)).map(({ text }) => text).join(' ');
}

export function sentenceContextAt(fullText: string, selectedStart: number): string {
  const clean = normalizedText(fullText);
  if (!clean) return '';
  const rawStart = Math.max(0, Math.min(selectedStart, fullText.length));
  const position = fullText.slice(0, rawStart).replace(/\s+/g, ' ').trimStart().length;
  return contextAtPosition(clean, Math.min(position, clean.length - 1));
}

export function sentenceContext(fullText: string, selected: string): string {
  const clean = normalizedText(fullText);
  const target = normalizedText(selected);
  const position = clean.toLocaleLowerCase().indexOf(target.toLocaleLowerCase());
  return position < 0 ? target : contextAtPosition(clean, position);
}

export function newCapture(fields: Pick<Capture, 'phrase' | 'context' | 'title' | 'url' | 'language' | 'gloss'>): Capture {
  return { ...fields, id: crypto.randomUUID(), createdAt: new Date().toISOString(), reviews: 0 };
}

export function due(records: Capture[]): Capture[] {
  return records.filter((r) => !r.reviewedAt || new Date(r.reviewedAt).toDateString() !== new Date().toDateString());
}

const b64 = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes));
const unb64 = (text: string) => Uint8Array.from(atob(text), (c) => c.charCodeAt(0));

export type EncryptedVault = { iv: string; cipher: string; version: 1 };
export async function createDeviceKey(): Promise<CryptoKey> {
  return crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']);
}
export async function exportKey(key: CryptoKey): Promise<string> {
  return b64(new Uint8Array(await crypto.subtle.exportKey('raw', key)));
}
export async function importKey(raw: string): Promise<CryptoKey> {
  return crypto.subtle.importKey('raw', unb64(raw), { name: 'AES-GCM' }, true, ['encrypt', 'decrypt']);
}
export async function encryptVault(vault: Vault, key: CryptoKey): Promise<EncryptedVault> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const data = new TextEncoder().encode(JSON.stringify(vault));
  const cipher = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, data);
  return { version: 1, iv: b64(iv), cipher: b64(new Uint8Array(cipher)) };
}
export async function decryptVault(payload: EncryptedVault, key: CryptoKey): Promise<Vault> {
  const clear = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64(payload.iv) }, key, unb64(payload.cipher));
  return JSON.parse(new TextDecoder().decode(clear)) as Vault;
}
