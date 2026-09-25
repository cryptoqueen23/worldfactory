import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
const compile = path => ts.transpileModule(readFileSync(path, 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } }).outputText;
const dataUrl = source => `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`;
const recipeUrl = dataUrl(compile('src/recipes/immersive-website.ts'));
const { validateSiteConfig } = await import(recipeUrl);
const { renderSite } = await import(dataUrl(compile('src/ui/render-site.ts').replace('../recipes/immersive-website', recipeUrl)));
const original = JSON.parse(readFileSync('src/content/site.json', 'utf8'));
validateSiteConfig(original);
const html = renderSite(original);
assert(html.includes('tel:+15123872748'));
for (const x of original.experiences) assert(html.includes(x.title.replaceAll('&', '&amp;')));
for (const mutate of [
  c => c.sections[1].experienceIds.push('missing'),
  c => c.experiences.push(c.experiences[0]),
  c => c.actions[0].destination = { kind: 'url', href: 'javascript:alert(1)' },
  c => c.presentation.immersive.portalOrder.pop(),
  c => c.theme.text = c.theme.background,
  c => c.schemaVersion = '9',
  c => c.portals[0].availability = 'teleport-anywhere',
  c => c.presentation.immersive.signaturePortalId = 'missing',
]) { const c = structuredClone(original); mutate(c); assert.throws(() => validateSiteConfig(c)); }
const other = structuredClone(original);
other.site = { id: 'studio-example', title: 'Studio <Example>', description: 'A second site', language: 'en' };
other.experiences = [{ id: 'design', title: 'Design collection', summary: 'A different business.', paragraphs: ['Reusable content.'], status: 'coming-soon' }];
other.sections = [{ id: 'welcome', title: 'Hello studio', paragraphs: ['A new configuration.'] }, { id: 'collection', title: 'Collection', paragraphs: [], experienceIds: ['design'] }];
other.navigation = []; other.actions = []; other.portals = [{ id: 'design-portal', experienceId: 'design' }]; other.presentation.immersive.portalOrder = ['design-portal'];
other.presentation.immersive.signaturePortalId = 'design-portal';
const second = renderSite(validateSiteConfig(other));
assert(second.includes('Studio &lt;Example&gt;')); assert(second.includes('Design collection')); assert(!second.includes('World Factory'));
const { portalAvailability, portalMessage } = await import(dataUrl(compile('src/engine-adapters/iwsdk/showroom-layout.ts')));
assert.equal(portalAvailability(original, original.portals[0]), 'available');
assert.equal(portalAvailability(original, original.portals[1]), 'coming-soon');
assert.equal(portalAvailability(original, { ...original.portals[0], availability: 'inactive' }), 'inactive');
assert(portalMessage('coming-soon').includes('travel is not available'));
const empty = structuredClone(other); empty.portals = []; empty.presentation.immersive.portalOrder = []; delete empty.presentation.immersive.signaturePortalId;
assert(renderSite(validateSiteConfig(empty)).includes('Design collection'));
console.log('PASS: shared content, second site, empty portals, escaping, eight invalid configurations, and three portal availability states.');
