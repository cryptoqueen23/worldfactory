import { World, RayInteractable, UIKitMLAsset, VisibilityState, Mesh, Vector3 } from '@iwsdk/core';
import projectOptions from 'virtual:iwsdk-project';
import { statusLabel, type SiteConfig } from '../../recipes/immersive-website';
import { Portal, ShowroomState, AmbientMotion } from './portal-component';
import { PortalSystem } from './portal-system';
import { ShowroomNavigationSystem } from './showroom-navigation-system';
import { exhibitNodeId, labelNodeId, SHOWROOM_CAPACITY, portalAvailability, portalDescription, portalMessage } from './showroom-layout';
export interface PortalPreview { id: string; title: string; summary: string; status: string; message: string; canInspect: boolean }
export interface ExperienceHandle {
  select(id: string, focus?: boolean): void; overview(): void; freeExplore(enabled: boolean): void;
  previewPortal(id?: string): void; closePortal(): void; inspectPortal(): void; setReducedMotion(value: boolean): void;
  enterXR(): void; exitXR(): void; dispose(): Promise<void>;
}
interface Events { select(id: string): void; close(): void; status(text: string): void; xr(active: boolean): void; mode(free: boolean): void; portal(preview: PortalPreview | null): void }
export async function createExperience(container: HTMLDivElement, config: SiteConfig, events: Events): Promise<ExperienceHandle> {
  const world = await World.create(container, projectOptions);
  const cleanup: (() => void)[] = []; let disposed = false; let xrTimer: ReturnType<typeof setTimeout> | undefined;
  // Bound pixel cost on high-density mobile screens without changing the shared scene.
  world.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, matchMedia('(pointer: coarse)').matches ? 1 : 1.5));
  world.renderer.setSize(container.clientWidth, container.clientHeight);
  try {
    const state = world.createTransformEntity().addComponent(ShowroomState); state.object3D!.name = 'Showroom state';
    world.registerSystem(PortalSystem); world.registerSystem(ShowroomNavigationSystem);
    const system = world.getSystem(PortalSystem)!, navigation = world.getSystem(ShowroomNavigationSystem)!;
    navigation.onMode = events.mode;
    const panel = world.requireSceneObject<UIKitMLAsset>('exhibit-panel');
    const previewPanel = world.requireSceneObject<UIKitMLAsset>('portal-preview');
    const heroLabel = world.requireSceneObject<UIKitMLAsset>('signature-label');
    const hero = world.requireSceneEntity('signature-portal');
    const brand = world.requireSceneObject<UIKitMLAsset>('brand');
    const set = (asset: UIKitMLAsset, id: string, text: string) => asset.requireElementById(id).setProperties({ text });
    const bind = (asset: UIKitMLAsset, id: string, callback: () => void) => {
      const button = asset.requireElementById(id); button.name = id;
      button.addEventListener('click', callback); cleanup.push(() => button.removeEventListener('click', callback));
    };
    set(brand, 'brand', config.site.title.toUpperCase()); set(brand, 'tagline', config.site.description);
    set(panel, 'site-title', config.site.title.toUpperCase());
    let current = config.experiences[0]?.id ?? '', previewId = '';
    let heroPortal = config.portals.find(p => p.id === config.presentation.immersive.signaturePortalId) ?? config.portals[0];
    const updateHero = (id: string) => {
      const destination = config.portals.find(p => p.experienceId === id); if (!destination) return;
      heroPortal = destination; const item = config.experiences.find(x => x.id === id)!;
      const availability = portalAvailability(config, destination);
      if (!hero.hasComponent(Portal)) hero.addComponent(Portal, { hero: true }).addComponent(RayInteractable);
      hero.setValue(Portal, 'portalId', destination.id); hero.setValue(Portal, 'experienceId', id); hero.setValue(Portal, 'availability', availability);
      set(heroLabel, 'number', 'DESTINATION PORTAL'); set(heroLabel, 'title', item.title); set(heroLabel, 'status', portalDescription(availability)); set(heroLabel, 'open', 'Preview destination');
    };
    const closePortal = () => {
      previewId = ''; previewPanel.visible = false; if (hero.hasComponent(Portal)) hero.setValue(Portal, 'preview', false); events.portal(null);
    };
    const select = (id: string, focus = false) => {
      const item = config.experiences.find(x => x.id === id); if (!item || disposed) return;
      current = id; state.setValue(ShowroomState, 'selectedId', id); system.select(id);
      set(panel, 'title', item.title); set(panel, 'status', statusLabel(item.status)); set(panel, 'summary', item.summary); set(panel, 'details', item.paragraphs.join(' '));
      closePortal();
      if (focus) { const index = config.experiences.findIndex(x => x.id === id); if (index < SHOWROOM_CAPACITY) navigation.focusObject(world.requireSceneObject(exhibitNodeId(index))); }
    };
    const previewPortal = (id = current) => {
      updateHero(id); if (!heroPortal) return;
      const item = config.experiences.find(x => x.id === heroPortal.experienceId)!;
      const availability = portalAvailability(config, heroPortal); previewId = item.id;
      hero.setValue(Portal, 'preview', true);
      const preview: PortalPreview = { id: item.id, title: item.title, summary: item.summary, status: portalDescription(availability), message: portalMessage(availability), canInspect: availability !== 'inactive' };
      set(previewPanel, 'title', preview.title); set(previewPanel, 'summary', preview.summary); set(previewPanel, 'availability', preview.status); set(previewPanel, 'message', preview.message);
      previewPanel.requireElementById('surface').setProperties({ backgroundColor: availability === 'available' ? '#d2e8d9' : availability === 'coming-soon' ? '#ead9b6' : '#d6d8d3' });
      previewPanel.requireElementById('inspect').setProperties({ display: preview.canInspect ? 'flex' : 'none' });
      previewPanel.visible = !!world.session; events.portal(preview);
      if (!world.session) navigation.focusObject(hero.object3D!, 5.8);
    };
    const inspectPortal = () => { if (!previewId || !heroPortal || portalAvailability(config, heroPortal) === 'inactive') return; const id = previewId; closePortal(); events.select(id); };
    const step = (delta: number) => { const n = config.experiences.length; if (n) events.select(config.experiences[(config.experiences.findIndex(x => x.id === current) + delta + n) % n].id); };
    bind(panel, 'previous', () => step(-1)); bind(panel, 'next', () => step(1)); bind(panel, 'portal', () => previewPortal()); bind(panel, 'return', events.close);
    bind(heroLabel, 'open', () => previewPortal(heroPortal?.experienceId)); bind(previewPanel, 'back', closePortal); bind(previewPanel, 'inspect', inspectPortal);
    system.onActivate = (id, isHero) => isHero ? previewPortal(id) : events.select(id);
    for (let index = 0; index < SHOWROOM_CAPACITY; index++) {
      const entity = world.requireSceneEntity(exhibitNodeId(index));
      const label = world.requireSceneObject<UIKitMLAsset>(labelNodeId(index));
      const item = config.experiences[index];
      if (!item) { entity.object3D!.visible = false; label.visible = false; continue; }
      const portal = config.portals.find(p => p.experienceId === item.id);
      entity.addComponent(Portal, { experienceId: item.id, portalId: portal?.id ?? '', availability: portal ? portalAvailability(config, portal) : 'inactive' });
      entity.object3D!.name = `Exhibit ${item.id}`;
      set(label, 'number', String(index + 1).padStart(2, '0')); set(label, 'title', item.title); set(label, 'status', statusLabel(item.status));
      bind(label, 'open', () => events.select(item.id));
    }
    if (heroPortal) updateHero(heroPortal.experienceId);
    else { hero.object3D!.visible = false; heroLabel.visible = false; }
    const sculpture = world.requireSceneEntity('centerpiece');
    const orbit = sculpture.object3D!.getObjectByName('Orbital assembly')!;
    world.createTransformEntity(orbit, sculpture).addComponent(AmbientMotion);
    panel.visible = false; previewPanel.visible = false;
    cleanup.push(world.visibilityState.subscribe(visibility => {
      const active = visibility !== VisibilityState.NonImmersive;
      navigation.setFree(false); panel.visible = active; previewPanel.visible = active && !!previewId; events.xr(active);
      if (!active && !disposed) navigation.overview();
    }));
    select(current); navigation.overview();
    return {
      select, overview() { closePortal(); navigation.overview(); }, freeExplore: value => navigation.setFree(value),
      previewPortal, closePortal, inspectPortal,
      setReducedMotion(value) { state.setValue(ShowroomState, 'reducedMotion', value); },
      enterXR() {
        if (disposed || world.session || world.sessionRequestPending) return;
        navigation.overview(); events.status('Waiting for XR permission. You can keep exploring if the request is declined.');
        try { world.launchXR(); } catch { events.status('XR could not start. Desktop exploration remains available.'); return; }
        const observe = () => {
          if (disposed) return;
          if (world.sessionRequestPending) { xrTimer = setTimeout(observe, 150); return; }
          if (!world.session) events.status('XR did not start. Permission may have been declined or the device is unavailable. Try Enter XR again, or continue on screen.');
        };
        xrTimer = setTimeout(observe, 150);
      },
      exitXR() { if (!disposed) world.exitXR(); },
      async dispose() {
        if (disposed) return; disposed = true; if (xrTimer) clearTimeout(xrTimer);
        cleanup.splice(0).forEach(fn => fn());
        try { if (world.session) await world.session.end(); } finally { world.destroy(); }
      },
    };
  } catch (error) { cleanup.forEach(fn => fn()); world.destroy(); throw error; }
}
