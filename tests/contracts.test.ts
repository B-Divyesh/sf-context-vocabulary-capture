import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

type Claim = { id: string; claim: string; where: string; test: string; sandbox: string };

function filesBelow(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? filesBelow(path) : [path];
  });
}

describe('factory acceptance contracts', () => {
  it('registers every claim once with exactly one tagged test', () => {
    const claims = JSON.parse(readFileSync('.factory/claims.json', 'utf8')) as Claim[];
    const tests = filesBelow('tests').filter((file) => file.endsWith('.ts')).map((file) => readFileSync(file, 'utf8')).join('\n');
    expect(new Set(claims.map((claim) => claim.id)).size).toBe(claims.length);
    for (const claim of claims) {
      expect(claim).toEqual(expect.objectContaining({ id: expect.any(String), claim: expect.any(String), where: expect.any(String), test: expect.stringMatching(/^npm run test:/), sandbox: expect.any(String) }));
      const occurrences = tests.split(`@claim:${claim.id}`).length - 1;
      expect(occurrences, `${claim.id} must have exactly one tagged test`).toBe(1);
    }
  });

  it('keeps the catalog description verb-first and within 120 characters', () => {
    const description = readFileSync('.factory/catalog-description.txt', 'utf8').trim();
    expect(description).toMatch(/^Save\b/);
    expect(description.length).toBeLessThanOrEqual(120);
    expect(description).not.toContain('\n');
  });
});

