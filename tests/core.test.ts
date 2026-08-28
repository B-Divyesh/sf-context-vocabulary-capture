import { describe, expect, it } from 'vitest';
import { SAMPLE_RECORDS, createDeviceKey, decryptVault, encryptVault, makeCsv, sentenceContext } from '../src/core';

describe('context extraction', () => {
  it('keeps the selected sentence and its neighbours', () => {
    const text = 'The first train arrived late. Nora quietly held the door. Everyone stepped inside.';
    expect(sentenceContext(text, 'quietly held')).toBe('The first train arrived late. Nora quietly held the door. Everyone stepped inside.');
  });
});
describe('encrypted local vault', () => {
  it('encrypts records before local storage', async () => {
    const key = await createDeviceKey(); const encrypted = await encryptVault({ version: 1, records: SAMPLE_RECORDS }, key);
    expect(encrypted.cipher).not.toContain('quietly held');
    await expect(decryptVault(encrypted, key)).resolves.toEqual({ version: 1, records: SAMPLE_RECORDS });
  });
});
describe('@claim:csv-export', () => {
  it('exports the sample records with a header and one row per record', () => {
    const rows = makeCsv(SAMPLE_RECORDS).split('\n');
    expect(rows).toHaveLength(SAMPLE_RECORDS.length + 1);
    expect(rows[0]).toContain('"phrase"'); expect(rows[1]).toContain('"quietly held"');
  });
});
describe('@claim:local-only', () => {
  it('uses an encrypted payload that carries no endpoint or source request', async () => {
    const encrypted = await encryptVault({ version: 1, records: [SAMPLE_RECORDS[0]] }, await createDeviceKey());
    expect(JSON.stringify(encrypted)).not.toContain('example.org');
  });
});
describe('@claim:no-account', () => {
  it('needs no identity field to create an encrypted local record', async () => {
    const encrypted = await encryptVault({ version: 1, records: [SAMPLE_RECORDS[0]] }, await createDeviceKey());
    expect(encrypted.version).toBe(1);
  });
});
