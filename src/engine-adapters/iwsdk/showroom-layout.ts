import type { SiteConfig, Portal } from '../../recipes/immersive-website';
/** Named authored slots carry presentation only; content remains in SiteConfig. */
export const SHOWROOM_CAPACITY = 9;
export const exhibitNodeId = (index: number) => `exhibit-${index}`;
export const labelNodeId = (index: number) => `exhibit-label-${index}`;
export function portalAvailability(config: SiteConfig, portal: Portal) {
  return portal.availability ?? (config.experiences.find(item => item.id === portal.experienceId)?.status === 'demonstration' ? 'available' : 'coming-soon');
}
export function portalDescription(state: ReturnType<typeof portalAvailability>) {
  return state === 'available' ? 'Available preview' : state === 'coming-soon' ? 'Coming soon' : 'Inactive';
}
export function portalMessage(state: ReturnType<typeof portalAvailability>) {
  return state === 'available' ? 'Explore this capability in the current showroom. This portal previews a connection; it does not load another world.' : state === 'coming-soon' ? 'This destination is planned. You can read its capability exhibit, but travel is not available yet.' : 'This destination is currently inactive. Its information remains available on the website.';
}
