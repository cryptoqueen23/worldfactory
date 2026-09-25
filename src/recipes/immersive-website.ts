export type Destination = { kind: 'section'; sectionId: string } | { kind: 'experience'; experienceId: string } | { kind: 'url'; href: string };
export interface NavigationItem { id: string; label: string; destination: Destination }
export interface CallToAction extends NavigationItem { emphasis: 'primary' | 'secondary' }
export interface Section { id: string; title: string; paragraphs: string[]; experienceIds?: string[]; mediaIds?: string[]; actionIds?: string[] }
export interface Experience { id: string; title: string; summary: string; paragraphs: string[]; status: 'demonstration' | 'coming-soon'; mediaIds?: string[]; actionIds?: string[] }
export interface Portal { id: string; experienceId: string; availability?: 'available' | 'coming-soon' | 'inactive' }
export type MediaItem = { id: string; kind: 'image'; src: string; alt: string; width: number; height: number; decorative?: boolean } | { id: string; kind: 'video'; src: string; title: string; posterMediaId: string; transcript: string; captions: { src: string; language: string; label: string }[]; audioDescriptionSrc?: string };
export interface Theme { background: string; surface: string; text: string; accent: string; onAccent: string; focus: string }
export interface SiteConfig {
  recipe: 'ImmersiveWebsiteRecipe'; schemaVersion: '0.1';
  site: { id: string; title: string; description: string; language: string };
  theme: Theme; navigation: NavigationItem[]; sections: Section[];
  experiences: Experience[]; portals: Portal[]; media: MediaItem[]; actions: CallToAction[];
  presentation: { immersive: { enabled: boolean; layout: 'exhibit-gallery'; portalOrder: string[]; signaturePortalId?: string } };
}

export function destinationHref(d: Destination): string {
  return d.kind === 'section' ? `#section-${d.sectionId}` : d.kind === 'experience' ? `#experience-${d.experienceId}` : d.href;
}
export const statusLabel = (status: Experience['status']) => status === 'demonstration' ? 'Interactive demonstration' : 'Coming soon';

/** Validate untrusted configuration before either presentation consumes it. */
export function validateSiteConfig(input: unknown): SiteConfig {
  const fail = (message: string): never => { throw new Error(`SiteConfig: ${message}`); };
  const object = (value: unknown): Record<string, any> => value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, any> : fail('expected an object');
  const text = (value: unknown, label: string): string => typeof value === 'string' && value.trim() ? value : fail(`${label} must be nonempty text`);
  const list = (value: unknown, label: string): any[] => Array.isArray(value) ? value : fail(`${label} must be an array`);
  const id = (value: unknown) => /^[a-z][a-z0-9-]*$/.test(text(value, 'id')) ? value as string : fail('invalid id');
  const url = (value: unknown, media = false) => {
    const s = text(value, 'URL');
    if (/\s|[<>"\\]/.test(s) || s.startsWith('//') || !( /^https:\/\//i.test(s) || /^\.?\.?\//.test(s) || (!media && /^(#|mailto:|tel:)/i.test(s)))) fail('unsafe URL');
  };
  const c = object(input);
  if (c.recipe !== 'ImmersiveWebsiteRecipe' || c.schemaVersion !== '0.1') fail('unsupported recipe/version');
  const site = object(c.site); id(site.id); text(site.title, 'site title'); text(site.description, 'description'); text(site.language, 'language');
  const collections = ['navigation', 'sections', 'experiences', 'portals', 'media', 'actions'] as const;
  const ids: Record<string, Set<string>> = {};
  for (const key of collections) {
    ids[key] = new Set();
    for (const item of list(c[key], key)) { object(item); const keyId = id(item.id); if (ids[key].has(keyId)) fail(`duplicate ${key} id ${keyId}`); ids[key].add(keyId); }
  }
  if (!c.sections.length) fail('at least one section required');
  const refs = (items: unknown, group: string) => { for (const ref of items === undefined ? [] : list(items, group)) if (!ids[group].has(ref)) fail(`unknown ${group} reference ${ref}`); };
  const destination = (value: unknown) => {
    const d = object(value);
    if (d.kind === 'section') refs([d.sectionId], 'sections');
    else if (d.kind === 'experience') refs([d.experienceId], 'experiences');
    else if (d.kind === 'url') url(d.href);
    else fail('invalid destination');
  };
  const memberships = new Map<string, number>();
  const usedMedia = new Set<string>(); const usedActions = new Set<string>();
  for (const item of [...c.sections, ...c.experiences]) {
    text(item.title, 'title'); for (const p of list(item.paragraphs, 'paragraphs')) text(p, 'paragraph');
    refs(item.mediaIds, 'media'); refs(item.actionIds, 'actions');
    item.mediaIds?.forEach((v: string) => usedMedia.add(v)); item.actionIds?.forEach((v: string) => usedActions.add(v));
  }
  for (const s of c.sections) { refs(s.experienceIds, 'experiences'); for (const e of s.experienceIds ?? []) memberships.set(e, (memberships.get(e) ?? 0) + 1); }
  for (const e of c.experiences) { text(e.summary, 'summary'); if (!['demonstration', 'coming-soon'].includes(e.status)) fail('invalid status'); if (memberships.get(e.id) !== 1) fail(`${e.id} must belong to exactly one section`); }
  for (const a of [...c.navigation, ...c.actions]) { text(a.label, 'label'); destination(a.destination); }
  for (const a of c.actions) if (!['primary', 'secondary'].includes(a.emphasis) || !usedActions.has(a.id)) fail('invalid or unreachable action');
  for (const p of c.portals) {
    refs([p.experienceId], 'experiences');
    if (p.availability !== undefined && !['available', 'coming-soon', 'inactive'].includes(p.availability)) fail('invalid portal availability');
  }
  for (const m of c.media) {
    url(m.src, true);
    if (m.kind === 'image') {
      if (m.decorative ? m.alt !== '' : !text(m.alt, 'alt')) fail('invalid alternative');
      if (!(Number.isFinite(m.width) && m.width > 0 && Number.isFinite(m.height) && m.height > 0)) fail('invalid image dimensions');
    } else if (m.kind === 'video') {
      text(m.title, 'video title'); text(m.transcript, 'transcript'); refs([m.posterMediaId], 'media'); usedMedia.add(m.posterMediaId);
      if (!c.media.some((p: any) => p.id === m.posterMediaId && p.kind === 'image' && !p.decorative)) fail('video needs a descriptive image poster');
      if (!list(m.captions, 'captions').length) fail('video needs captions');
      for (const track of m.captions) { url(track.src, true); text(track.language, 'caption language'); text(track.label, 'caption label'); }
      if (m.audioDescriptionSrc) url(m.audioDescriptionSrc, true);
    } else fail('invalid media kind');
  }
  for (const m of c.media) if (!usedMedia.has(m.id)) fail('unreachable media');
  const theme = object(c.theme);
  for (const k of ['background', 'surface', 'text', 'accent', 'onAccent', 'focus']) if (!/^#[0-9a-f]{6}$/i.test(theme[k])) fail('theme requires six-digit hex colors');
  const luminance = (hex: string) => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255).map(v => v <= 0.04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4).reduce((sum, v, i) => sum + v * [.2126, .7152, .0722][i], 0);
  const contrast = (a: string, b: string) => { const x = luminance(a), y = luminance(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
  for (const bg of ['background', 'surface']) if (contrast(theme.text, theme[bg]) < 4.5 || contrast(theme.focus, theme[bg]) < 3) fail('insufficient text/focus contrast');
  if (contrast(theme.accent, theme.onAccent) < 4.5) fail('insufficient button contrast');
  const immersive = object(object(c.presentation).immersive);
  if (typeof immersive.enabled !== 'boolean' || immersive.layout !== 'exhibit-gallery') fail('invalid immersive presentation');
  if (immersive.enabled && c.experiences.length > 9) fail('exhibit-gallery supports at most nine exhibits');
  const order = list(immersive.portalOrder, 'portalOrder'); refs(order, 'portals');
  if (immersive.signaturePortalId !== undefined) refs([immersive.signaturePortalId], 'portals');
  if (new Set(order).size !== order.length || (immersive.enabled ? order.length !== c.portals.length : order.length !== 0)) fail('invalid portal order');
  return c as SiteConfig;
}
