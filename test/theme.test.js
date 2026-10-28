import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

// Tema întunecată stă de două ori în app.css: o dată pentru „ca telefonul",
// în media query, și o dată pentru alegerea explicită din Setări. Un token
// adăugat doar într-una -- s-a întâmplat cu --on-primary -- face butoanele
// ilizibile numai pentru cine a ales tema din aplicație.
test('the two dark palettes stay identical', () => {
  const css = fs.readFileSync(new URL('../web/app.css', import.meta.url), 'utf8');
  const tokens = (block) => block.split(';').map((d) => d.trim()).filter((d) => d.startsWith('--')).sort();
  const system = css.match(/:root:not\(\[data-theme="light"\]\) \{([^}]*)\}/);
  const chosen = css.match(/:root\[data-theme="dark"\] \{([^}]*)\}/);
  assert.ok(system && chosen, 'nu găsesc ambele blocuri');
  assert.deepEqual(tokens(chosen[1]), tokens(system[1]));
  assert.ok(tokens(system[1]).length > 10);
});
