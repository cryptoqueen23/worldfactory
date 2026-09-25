import type { SiteConfig } from '../recipes/immersive-website';
import { statusLabel } from '../recipes/immersive-website';
import { applyPreferences, prefersReducedMotion, readPreferences, resetPreferences, savePreferences } from '../accessibility/preferences';
import type { ExperienceHandle, PortalPreview } from '../engine-adapters/iwsdk/experience';
export function startSite(config: SiteConfig) {
  const get = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
  const dialog = get<HTMLDialogElement>('experience-dialog'), container = get<HTMLDivElement>('scene-container');
  const select = get<HTMLSelectElement>('experience-select'), xrButton = get<HTMLButtonElement>('enter-xr');
  const status = get('experience-status'), freeButton = get<HTMLButtonElement>('free-explore');
  const preview = get('portal-preview-html'), destination = get<HTMLSelectElement>('portal-destination');
  let handle: ExperienceHandle | undefined, selected = config.experiences[0]?.id ?? '';
  let queue: Promise<void> = Promise.resolve(), generation = 0, loading = false, activeXR = false, free = false;
  let returnFocus: HTMLElement | null = null, portalFocus: HTMLElement | null = null;
  let preferences = readPreferences();
  const motion = get<HTMLSelectElement>('motion'), captions = get<HTMLInputElement>('captions'), showroomMotion = get<HTMLInputElement>('showroom-motion');
  const apply = () => { motion.value = preferences.motion; captions.checked = preferences.captions; applyPreferences(preferences); const reduced = prefersReducedMotion(preferences); showroomMotion.checked = reduced; handle?.setReducedMotion(reduced); };
  apply();
  motion.addEventListener('change', () => { preferences.motion = motion.value as 'system' | 'reduced'; savePreferences(preferences); apply(); });
  showroomMotion.addEventListener('change', () => { preferences.motion = showroomMotion.checked ? 'reduced' : 'system'; savePreferences(preferences); apply(); });
  captions.addEventListener('change', () => { preferences.captions = captions.checked; savePreferences(preferences); apply(); });
  get('reset-preferences').addEventListener('click', () => { preferences = resetPreferences(); apply(); });
  matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', apply);
  const mode = (value: boolean) => {
    free = value; freeButton.setAttribute('aria-pressed', String(value)); freeButton.textContent = value ? 'Finish free exploration' : 'Free exploration';
    get('navigation-help').textContent = value ? 'WASD / arrow keys move while the view has focus. Hold the right mouse button and drag to look. Escape stops free exploration. Click a sculpture to inspect it.' : 'Choose an exhibit or use Previous / Next. Overview returns to the entrance. Select a sculpture to discover its capability.';
  };
  const showPortal = (data: PortalPreview | null) => {
    if (!data) {
      const hadFocus = preview.contains(document.activeElement); preview.hidden = true;
      if (hadFocus && !activeXR) (portalFocus?.isConnected ? portalFocus : get('preview-portal')).focus(); return;
    }
    if (preview.hidden) portalFocus = document.activeElement as HTMLElement;
    get('portal-title').textContent = data.title; get('portal-summary').textContent = data.summary;
    get('portal-status').textContent = data.status; get('portal-message').textContent = data.message;
    get<HTMLButtonElement>('portal-inspect').disabled = !data.canInspect; destination.value = data.id; preview.dataset.state = data.status;
    preview.hidden = activeXR; if (!activeXR) preview.focus();
  };
  const choose = (id: string, updateUrl = true, focus = true) => {
    const item = config.experiences.find(x => x.id === id); if (!item) return;
    selected = id; select.value = id; handle?.select(id, focus);
    get('exhibit-title').textContent = item.title; get('exhibit-summary').textContent = item.summary;
    get('exhibit-details').textContent = item.paragraphs.join(' '); get('exhibit-status').textContent = statusLabel(item.status);
    if (updateUrl) history.replaceState(null, '', `#experience-${id}`);
  };
  const fromHash = () => { if (location.hash.startsWith('#experience-')) choose(location.hash.slice(12), false); };
  fromHash(); window.addEventListener('hashchange', fromHash);
  const close = () => {
    generation++; loading = false; const previous = handle; handle = undefined; activeXR = false; mode(false); preview.hidden = true;
    xrButton.disabled = true; xrButton.textContent = 'Enter XR';
    queue = queue.catch(() => {}).then(async () => { await previous?.dispose(); container.replaceChildren(); });
    if (dialog.open) dialog.close(); returnFocus?.focus();
  };
  const open = (id?: string) => {
    if (loading || handle) { if (id) choose(id); return; }
    if (!config.presentation.immersive.enabled) return;
    returnFocus = document.activeElement as HTMLElement; dialog.showModal(); choose(id || selected, false, false);
    status.textContent = 'Loading the optional showroom. The website remains available through Return to website.';
    loading = true; const token = ++generation;
    queue = queue.catch(() => {}).then(async () => {
      if (token !== generation) return;
      try {
        const { createExperience } = await import('../engine-adapters/iwsdk/experience');
        if (token !== generation) return;
        const created = await createExperience(container, config, {
          select: id => { if (token === generation) choose(id); }, close: () => { if (token === generation) close(); },
          status: text => { if (token === generation) status.textContent = text; },
          mode: value => { if (token === generation) mode(value); }, portal: data => { if (token === generation) showPortal(data); },
          xr: active => {
            if (token !== generation) return;
            activeXR = active; preview.hidden = true; freeButton.disabled = active;
            // Modal top-layer DOM would cover IWER's immersive canvas on desktop.
            if (dialog.open) dialog.close();
            if (active) dialog.show(); else dialog.showModal();
            xrButton.textContent = active ? 'Exit XR' : 'Enter XR';
            status.textContent = active ? 'XR session active. Use the spatial controls to explore or return.' : 'Showroom ready. Guided navigation and optional free exploration are available.';
          },
        });
        if (token !== generation) { await created.dispose(); return; }
        handle = created; loading = false; freeButton.disabled = false; apply(); choose(selected, false, !!id);
        status.textContent = 'Showroom ready. Explore the architecture, select an exhibit, or preview the signature portal.';
        const supported = await navigator.xr?.isSessionSupported('immersive-vr').catch(() => false);
        if (token !== generation) return; xrButton.disabled = !supported;
        if (!supported) xrButton.textContent = 'XR unavailable';
      } catch (error) {
        if (token !== generation) return; loading = false; handle = undefined;
        status.textContent = 'The showroom could not load. Return to the website for every capability and contact option.';
        console.error('Showroom initialization failed', error);
      }
    });
  };
  document.querySelectorAll<HTMLButtonElement>('[data-enter]').forEach(button => { button.hidden = false; button.addEventListener('click', () => open(button.dataset.enter)); });
  get('close-experience').addEventListener('click', close);
  dialog.addEventListener('cancel', event => { event.preventDefault(); if (free) handle?.freeExplore(false); else if (!preview.hidden) handle?.closePortal(); else close(); });
  select.addEventListener('change', () => choose(select.value));
  const step = (delta: number) => { const n = config.experiences.length; if (n) choose(config.experiences[(config.experiences.findIndex(x => x.id === selected) + delta + n) % n].id); };
  get('previous-exhibit').addEventListener('click', () => step(-1)); get('next-exhibit').addEventListener('click', () => step(1));
  get('overview').addEventListener('click', () => handle?.overview());
  freeButton.addEventListener('click', () => handle?.freeExplore(!free));
  get('preview-portal').addEventListener('click', () => handle?.previewPortal());
  destination.addEventListener('change', () => handle?.previewPortal(destination.value));
  get('portal-back').addEventListener('click', () => handle?.closePortal());
  get('portal-inspect').addEventListener('click', () => handle?.inspectPortal());
  xrButton.addEventListener('click', () => { if (activeXR) handle?.exitXR(); else handle?.enterXR(); });
}
