import { createSystem, LocomotionSystem, Vector3, Euler, type Object3D, type InputActionBinding } from '@iwsdk/core';
import { ShowroomState } from './portal-component';
/** Browser camera policy only. IWSDK owns movement, collision, and XR tracking. */
export class ShowroomNavigationSystem extends createSystem({ state: { required: [ShowroomState] } }) {
  private position = new Vector3(); private target = new Vector3(); private offset = new Vector3();
  private angles = new Euler(0, 0, 0, 'YXZ');
  private bindings: InputActionBinding[] = []; private bound = false; private dragging = false;
  private free = false;
  onMode: (free: boolean) => void = () => {};
  init() {
    const canvas = this.world.renderer.domElement;
    canvas.tabIndex = 0; canvas.setAttribute('aria-label', 'Showroom view. Enable free exploration for WASD movement and right-drag look.');
    this.world.input.actions.enableDefaultBindings('browser-first-person', { keyboard: true, gamepad: false });
    this.bindings = this.world.input.actions.getBindings().filter(b => b.source === 'keyboard');
    for (const binding of this.bindings) this.world.input.actions.removeBinding(binding);
    const focus = () => this.syncBindings();
    const down = (event: PointerEvent) => { if (!this.free || this.world.session || event.button !== 2) return; this.dragging = true; canvas.setPointerCapture(event.pointerId); canvas.focus(); };
    const up = () => { this.dragging = false; };
    const move = (event: PointerEvent) => {
      if (!this.dragging || !this.free || this.world.session) return;
      this.angles.setFromQuaternion(this.world.camera.quaternion, 'YXZ');
      this.angles.y -= event.movementX * .003; this.angles.x = Math.max(-1.15, Math.min(1.15, this.angles.x - event.movementY * .003));
      this.world.camera.quaternion.setFromEuler(this.angles);
    };
    const context = (event: Event) => { if (this.free) event.preventDefault(); };
    const keys = (event: KeyboardEvent) => {
      if (!this.free || this.world.session) return;
      if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); this.setFree(false); }
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(event.key)) event.preventDefault();
    };
    canvas.addEventListener('focus', focus); canvas.addEventListener('blur', focus); canvas.addEventListener('pointerdown', down);
    canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up); canvas.addEventListener('pointermove', move);
    canvas.addEventListener('contextmenu', context); canvas.addEventListener('keydown', keys);
    this.cleanupFuncs.push(() => {
      canvas.removeEventListener('focus', focus); canvas.removeEventListener('blur', focus); canvas.removeEventListener('pointerdown', down);
      canvas.removeEventListener('pointerup', up); canvas.removeEventListener('pointercancel', up); canvas.removeEventListener('pointermove', move);
      canvas.removeEventListener('contextmenu', context); canvas.removeEventListener('keydown', keys);
      for (const binding of this.bindings) this.world.input.actions.removeBinding(binding);
    });
  }
  private syncBindings() {
    const enabled = this.free && !this.world.session && document.activeElement === this.world.renderer.domElement;
    if (enabled === this.bound) return;
    for (const binding of this.bindings) enabled ? this.world.input.actions.addBinding(binding) : this.world.input.actions.removeBinding(binding);
    this.bound = enabled;
  }
  setFree(free: boolean) {
    this.free = free && !this.world.session; this.dragging = false;
    for (const state of this.queries.state.entities) state.setValue(ShowroomState, 'freeExplore', this.free);
    if (this.free) this.world.renderer.domElement.focus(); this.syncBindings(); this.onMode(this.free);
  }
  private place(x: number, z: number, tx: number, ty: number, tz: number) {
    if (this.world.session) return;
    this.setFree(false); this.position.set(x, 0, z);
    this.world.getSystem(LocomotionSystem)?.setPlayerPosition(this.position);
    this.world.player.rotation.set(0, 0, 0); this.world.camera.position.set(0, 1.7, 0);
    this.world.player.updateMatrixWorld(true); this.target.set(tx, ty, tz); this.world.camera.lookAt(this.target);
  }
  overview() { this.place(0, 4.8, 0, 2.1, -7); for (const state of this.queries.state.entities) state.setValue(ShowroomState, 'overview', true); }
  focusObject(object: Object3D, distance = 3.4) {
    object.getWorldPosition(this.target); this.offset.set(0, 0, distance).applyQuaternion(object.quaternion).add(this.target);
    this.place(this.offset.x, this.offset.z, this.target.x, this.target.y + 1.35, this.target.z);
    for (const state of this.queries.state.entities) state.setValue(ShowroomState, 'overview', false);
  }
  update() { this.syncBindings(); }
}
