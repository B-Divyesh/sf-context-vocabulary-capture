import { type Capture, type EncryptedVault, type Vault, createDeviceKey, decryptVault, encryptVault, exportKey, importKey } from './core';

const KEY = 'keep-the-sentence:vault';
const DEVICE_KEY = 'keep-the-sentence:device-key';
type Store = {
  get: (key: string) => Promise<unknown>;
  set: (items: Record<string, unknown>) => Promise<void>;
  remove: (keys: string[]) => Promise<void>;
};

function chromeStore(): Store | null {
  const area = globalThis.chrome?.storage?.local;
  if (!area) return null;
  return {
    get: async (key) => (await area.get(key))[key],
    set: async (items) => { await area.set(items); },
    remove: async (keys) => { await area.remove(keys); },
  };
}
function localStore(): Store {
  return {
    get: async (key) => { const value = localStorage.getItem(key); return value ? JSON.parse(value) : undefined; },
    set: async (items) => Object.entries(items).forEach(([key, value]) => localStorage.setItem(key, JSON.stringify(value))),
    remove: async (keys) => keys.forEach((key) => localStorage.removeItem(key)),
  };
}
function store(): Store { return chromeStore() ?? localStore(); }
async function keyFor(storage: Store, namespace = ''): Promise<CryptoKey> {
  const keyName = `${namespace}${DEVICE_KEY}`;
  const saved = await storage.get(keyName) as string | undefined;
  if (saved) return importKey(saved);
  const key = await createDeviceKey();
  await storage.set({ [keyName]: await exportKey(key) });
  return key;
}
export async function readVault(namespace = ''): Promise<Vault> {
  const storage = store(); const encrypted = await storage.get(`${namespace}${KEY}`) as EncryptedVault | undefined;
  if (!encrypted) return { version: 1, records: [] };
  return decryptVault(encrypted, await keyFor(storage, namespace));
}
export async function writeVault(vault: Vault, namespace = ''): Promise<void> {
  const storage = store();
  await storage.set({ [`${namespace}${KEY}`]: await encryptVault(vault, await keyFor(storage, namespace)) });
}
export async function addCapture(capture: Capture, namespace = ''): Promise<Capture> {
  const vault = await readVault(namespace); vault.records.unshift(capture); await writeVault(vault, namespace); return capture;
}
export async function reviewCapture(id: string, namespace = ''): Promise<void> {
  const vault = await readVault(namespace); const record = vault.records.find((r) => r.id === id);
  if (!record) throw new Error('That saved phrase could not be found. Return to your list and try again.');
  record.reviewedAt = new Date().toISOString(); record.reviews += 1; await writeVault(vault, namespace);
}
export async function replaceRecords(records: Capture[], namespace = ''): Promise<void> { await writeVault({ version: 1, records }, namespace); }
export async function clearVault(namespace = ''): Promise<void> { await writeVault({ version: 1, records: [] }, namespace); }
/** Remove a vault and its key together. This is used for disposable demo data. */
export async function discardVault(namespace = ''): Promise<void> {
  await store().remove([`${namespace}${KEY}`, `${namespace}${DEVICE_KEY}`]);
}
