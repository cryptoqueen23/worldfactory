export interface Preferences { version: 1; motion: 'system' | 'reduced'; captions: boolean }
const defaults: Preferences = { version: 1, motion: 'system', captions: true };
const key = 'immersive-website-preferences-v1';
export const prefersReducedMotion = (p: Preferences) => p.motion === 'reduced' || matchMedia('(prefers-reduced-motion: reduce)').matches;
export function readPreferences(): Preferences {
  try { const p = JSON.parse(localStorage.getItem(key) ?? 'null'); if (p?.version === 1 && ['system', 'reduced'].includes(p.motion) && typeof p.captions === 'boolean') return p; } catch { /* Storage is optional. */ }
  return { ...defaults };
}
export function savePreferences(p: Preferences) { try { localStorage.setItem(key, JSON.stringify(p)); } catch { /* Keep in-memory preferences. */ } }
export function applyPreferences(p: Preferences) {
  document.documentElement.dataset.motion = prefersReducedMotion(p) ? 'reduced' : 'full';
  document.querySelectorAll('video').forEach(video => { for (const track of video.textTracks) if (track.kind === 'captions') track.mode = p.captions ? 'showing' : 'disabled'; });
}
export function resetPreferences() { const p = { ...defaults }; savePreferences(p); return p; }
