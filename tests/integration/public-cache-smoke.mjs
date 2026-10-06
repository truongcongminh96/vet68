// Runs an actual Next production build against a local Supabase HTTP fixture.
// No production credentials or database writes are used.
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { readFile, mkdir } from 'node:fs/promises';
import { once } from 'node:events';

const id = '11111111-1111-4111-8111-111111111111';
const companyId = '22222222-2222-4222-8222-222222222222';
const brandId = '33333333-3333-4333-8333-333333333333';
const categoryId = '44444444-4444-4444-8444-444444444444';
const userId = '55555555-5555-4555-8555-555555555555';
const anonKey = 'local-cache-test-anonymous-key';
const common = { is_active: true, sort_order: 0, description: '', updated_at: '2026-09-01T00:00:00Z' };
const tables = {
  products: [{ ...common, id, name: 'Cache smoke product', slug: 'cache-smoke-product', sku: 'CACHE-001', company_id: companyId, brand_id: brandId, category_id: categoryId, price_display_mode: 'contact', reference_price: null, short_description: 'Public cache verification', is_featured: true, is_new: true, requires_consultation: true }],
  companies: [{ ...common, id: companyId, name: 'Cache Company', slug: 'cache-company' }],
  brands: [{ ...common, id: brandId, name: 'Cache Brand', slug: 'cache-brand' }],
  categories: [{ ...common, id: categoryId, name: 'Cache Category', slug: 'thuoc-thu-y', kind: 'product_type' }],
  animal_types: [], product_animal_types: [], product_categories: [], product_images: [], banners: [], posts: [],
  profiles: [{ id: userId, full_name: 'Local staff fixture', role: 'staff', is_active: true }],
  site_settings: [{ key: 'contact', is_public: true, value: { phone: '0900000068', phone_display: '0900 000 068', zalo_url: 'https://zalo.me/0900000068', email: 'test@example.com', address: 'Local fixture' } }],
};
const requests = [];
let fixture;
let app;
let inserted = 0;
let failAssociationDelete = false;

async function listen(server) {
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  return server.address().port;
}
const nextBin = new URL('../../node_modules/next/dist/bin/next', import.meta.url).pathname;
function runNext(args, env) {
  const child = spawn(process.execPath, [nextBin, ...args], { env, stdio: ['ignore', 'pipe', 'pipe'] });
  child.stdout.on('data', chunk => process.stdout.write(chunk));
  child.stderr.on('data', chunk => process.stderr.write(chunk));
  return child;
}
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));

try {
  fixture = createServer(async (req, res) => {
    const url = new URL(req.url, 'http://fixture');
    requests.push({ path: url.pathname, query: url.search, method: req.method, authorization: req.headers.authorization });
    res.setHeader('content-type', 'application/json');
    if (url.pathname === '/auth/v1/user') {
      return res.end(JSON.stringify({ id: userId, aud: 'authenticated', role: 'authenticated', email: 'staff@example.com' }));
    }
    const table = url.pathname.split('/').pop();
    if (!(table in tables)) { res.statusCode = 404; return res.end('{}'); }
    const matches = row => [...url.searchParams].every(([key, value]) => {
      if (value.startsWith('eq.')) return String(row[key]) === value.slice(3);
      if (value.startsWith('in.')) return value.slice(4, -1).split(',').includes(String(row[key]));
      return true;
    });
    if (failAssociationDelete && table === 'product_categories' && req.method === 'DELETE') {
      failAssociationDelete = false;
      res.statusCode = 500;
      return res.end(JSON.stringify({ message: 'Local fixture association failure' }));
    }
    let rows = tables[table].filter(matches);
    if (req.method === 'POST' || req.method === 'PATCH') {
      let raw = '';
      for await (const chunk of req) raw += chunk;
      const payload = JSON.parse(raw);
      if (req.method === 'PATCH') rows.forEach(row => Object.assign(row, payload));
      else {
        rows = (Array.isArray(payload) ? payload : [payload]).map(row => ({ ...common, id: `66666666-6666-4666-8666-${String(++inserted).padStart(12, '0')}`, ...row }));
        tables[table].push(...rows);
      }
    } else if (req.method === 'DELETE') {
      tables[table] = tables[table].filter(row => !matches(row));
      rows = [];
    }
    // Simulate anonymous RLS: an inactive product must not leak into public cache.
    if (req.headers.authorization === `Bearer ${anonKey}` && table === 'products') rows = rows.filter(row => row.is_active);
    if (req.method === 'HEAD') { res.setHeader('content-range', `0-0/${rows.length}`); return res.end(); }
    const single = req.headers.accept?.includes('application/vnd.pgrst.object+json');
    res.end(JSON.stringify(single ? rows[0] ?? null : rows));
  });
  const fixturePort = await listen(fixture);
  const env = { ...process.env, NEXT_TELEMETRY_DISABLED: '1', NEXT_PUBLIC_SUPABASE_URL: `http://127.0.0.1:${fixturePort}`, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: anonKey, VET68_BUILD_VERSION: 'cache-smoke-build' };
  const build = runNext(['build'], env);
  const [buildCode] = await once(build, 'exit');
  assert.equal(buildCode, 0, 'configured production build must pass');
  const freePort = createServer();
  const appPort = await listen(freePort);
  await new Promise(resolve => freePort.close(resolve));
  const origin = `http://127.0.0.1:${appPort}`;
  app = runNext(['start', '--hostname', '127.0.0.1', '--port', String(appPort)], env);
  let ready = false;
  for (let attempt = 0; attempt < 100; attempt++) {
    try { const response = await fetch(`${origin}/robots.txt`); if (response.ok) { ready = true; break; } } catch {}
    await pause(100);
  }
  assert.ok(ready, 'production server must start');
  async function page(path, expected = 200, headers = {}) {
    const response = await fetch(`${origin}${path}`, { headers, redirect: 'manual' });
    const html = await response.text();
    // Next may already have streamed the loading shell when notFound() runs.
    if (expected === 404 && response.status === 200) {
      assert.match(html, /name="robots" content="noindex"/, `${path} must be a streamed not-found response`);
    } else assert.equal(response.status, expected, `${path} status`);
    return { html, cache: response.headers.get('x-nextjs-cache') };
  }

  const first = await page('/san-pham/cache-smoke-product');
  assert.match(first.html, /Cache smoke product/);
  const countBefore = requests.length;
  const second = await page('/san-pham/cache-smoke-product');
  assert.equal(second.cache, 'HIT', 'repeat product access must hit the Full Route Cache');
  assert.equal(requests.length, countBefore, 'repeat page access must issue zero Supabase requests');
  await page('/san-pham/cache-smoke-product', 200, { cookie: 'sb-127-auth-token=invalid-staff-session; vet68-auth-build=outdated' });
  assert.equal(requests.length, countBefore, 'public page must ignore staff auth cookies');
  assert.equal(requests.filter(req => req.path.startsWith('/auth/')).length, 0, 'public reads must never refresh authentication');
  await page('/san-pham?q=Cache');
  const catalogueCount = requests.length;
  await page('/san-pham?q=Company&sort=newest');
  await page('/san-pham?price_mode=contact&page=2');
  assert.equal(requests.length, catalogueCount, 'dynamic catalogue filters must reuse persistent data cache');
  const unknownStart = requests.length;
  await page('/san-pham/missing-product', 404);
  const unknownReads = requests.slice(unknownStart).filter(req => req.path.endsWith('/products'));
  assert.equal(unknownReads.length, 1);
  assert.match(unknownReads[0].query, /slug=eq\.missing-product/, 'unknown product must query by slug instead of downloading the entire catalogue');

  const manifest = JSON.parse(await readFile('.next/server/server-reference-manifest.json', 'utf8'));
  function actionId(name) {
    const match = Object.entries(manifest.node).find(([, entry]) => entry.exportedName === name);
    assert.ok(match, `server action ${name} must exist`);
    return match[0];
  }
  const tokenPart = value => Buffer.from(JSON.stringify(value)).toString('base64url');
  const accessToken = `${tokenPart({ alg: 'HS256', typ: 'JWT' })}.${tokenPart({ sub: userId, aud: 'authenticated', role: 'authenticated', exp: Math.floor(Date.now() / 1000) + 3600 })}.local-fixture-signature`;
  const session = { access_token: accessToken, refresh_token: 'local-fixture-refresh', expires_at: Math.floor(Date.now() / 1000) + 3600, token_type: 'bearer', user: { id: userId } };
  const cookie = `sb-127-auth-token=base64-${tokenPart(session)}; vet68-auth-build=cache-smoke-build`;
  async function callAction(name, args, authenticated = true, expectedOk = true) {
    const response = await fetch(`${origin}/admin/san-pham/${id}`, {
      method: 'POST', redirect: 'manual',
      headers: { 'Next-Action': actionId(name), 'Content-Type': 'text/plain;charset=UTF-8', Origin: origin, ...(authenticated ? { Cookie: cookie } : {}) },
      body: JSON.stringify(args),
    });
    const body = await response.text();
    if (authenticated) { assert.equal(response.status, 200); assert.match(body, expectedOk ? /"ok":true/ : /"ok":false/, `${name} result: ${body.slice(-500)}`); }
    return { response, body };
  }
  const unauthenticated = await callAction('refreshProductImagesAction', [id], false);
  assert.ok(unauthenticated.response.headers.get('x-action-redirect')?.includes('/admin/dang-nhap') || unauthenticated.body.includes('NEXT_REDIRECT'), 'cache invalidation action must require staff');

  const values = { id, name: 'Updated cache product', slug: 'cache-smoke-product', sku: 'CACHE-001', companyId, brandId, categoryId, priceDisplayMode: 'contact', animalTypeIds: [], treatmentCategoryIds: [], requiresConsultation: true, isFeatured: true, isNew: true, isActive: true };
  await callAction('saveProductAction', [values]);
  const updated = await page('/san-pham/cache-smoke-product');
  assert.match(updated.html, /Updated cache product/, 'saving product must immediately invalidate its cached page');
  const updatedCatalogue = await page('/san-pham?q=Updated');
  assert.match(updatedCatalogue.html, /Updated cache product/, 'saving product must invalidate catalogue data too');
  await page('/san-pham/new-cache-product', 404);
  await callAction('saveProductAction', [{ ...values, id: undefined, name: 'Newly added cache product', slug: 'new-cache-product', sku: 'CACHE-002' }]);
  assert.match((await page('/san-pham/new-cache-product')).html, /Newly added cache product/, 'new slugs must work without redeploying');

  tables.product_images.push({ id: '77777777-7777-4777-8777-777777777777', product_id: id, storage_path: '/images/demo/article-care.jpg', alt_text: 'Changed public product image', is_primary: true, sort_order: 0 });
  await callAction('refreshProductImagesAction', [id]);
  assert.match((await page('/san-pham/cache-smoke-product')).html, /Changed public product image/, 'image-only edits must refresh public cache');
  failAssociationDelete = true;
  await callAction('saveProductAction', [{ ...values, name: 'Partially saved cache product' }], true, false);
  assert.match((await page('/san-pham/cache-smoke-product')).html, /Partially saved cache product/, 'successful product writes must invalidate cache even if an association write fails');
  await callAction('saveProductAction', [{ ...values, isActive: false }]);
  await page('/san-pham/cache-smoke-product', 404);
  assert.doesNotMatch((await page('/san-pham?q=Updated')).html, /Updated cache product/, 'deactivated products must disappear from cached public listings');
  const admin = await fetch(`${origin}/admin`, { redirect: 'manual' });
  assert.ok([307, 308].includes(admin.status));
  assert.match(admin.headers.get('location'), /admin\/dang-nhap/);
  await mkdir('test-results', { recursive: true });
  const result = { repeatedProductSupabaseRequests: 0, publicAuthRequests: 0, repeatedFilteredCatalogueSupabaseRequests: 0, productCache: second.cache, verified: ['staff cookies ignored on public routes', 'slug-scoped detail queries', 'staff-only invalidation', 'save updates cached product and catalogue', 'new product available after cached not-found', 'partial save failure expires cache', 'image-only cache invalidation', 'deactivation hides cached products', 'admin authentication preserved'] };
  await import('node:fs/promises').then(fs => fs.writeFile('test-results/public-cache-smoke.json', JSON.stringify(result, null, 2)));
  console.log('PUBLIC CACHE SMOKE PASSED', JSON.stringify(result));
  if (process.argv.includes('--serve')) {
    console.log(`Local verification preview: ${origin}/san-pham/new-cache-product (PID ${process.pid})`);
    await new Promise(resolve => {
      process.once('SIGTERM', resolve);
      process.once('SIGINT', resolve);
    });
  }
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  if (app && app.exitCode === null) { app.kill('SIGTERM'); await once(app, 'exit'); }
  if (fixture) await new Promise(resolve => fixture.close(resolve));
}
