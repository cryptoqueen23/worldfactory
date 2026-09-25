import { createSystem, Pressed, Hovered, Mesh, MeshStandardMaterial, type Entity } from '@iwsdk/core';
import { Portal, ShowroomState, AmbientMotion } from './portal-component';
/** One intent path for canvas pointers and XR rays. Stable IDs remain recipe-owned. */
export class PortalSystem extends createSystem({ portals: { required: [Portal] }, activated: { required: [Portal, Pressed] }, state: { required: [ShowroomState] }, motion: { required: [AmbientMotion] } }) {
  onActivate: (id: string, hero: boolean) => void = () => {};
  private elapsed = 0;
  init() {
    const prepare = (entity: Entity) => {
      const materials: MeshStandardMaterial[] = [];
      entity.object3D?.traverse(object => {
        if (!(object instanceof Mesh) || !/Portal light|Bronze plinth lip/.test(object.name)) return;
        const material = (object.material as MeshStandardMaterial).clone(); object.material = material; materials.push(material);
        this.cleanupFuncs.push(() => material.dispose());
      });
      if (entity.object3D) entity.object3D.userData.feedbackMaterials = materials;
    };
    this.cleanupFuncs.push(this.queries.portals.subscribe('qualify', prepare));
    for (const entity of this.queries.portals.entities) prepare(entity);
    this.cleanupFuncs.push(this.queries.activated.subscribe('qualify', entity => this.onActivate(entity.getValue(Portal, 'experienceId') ?? '', !!entity.getValue(Portal, 'hero'))));
  }
  select(id: string) {
    for (const entity of this.queries.portals.entities) entity.setValue(Portal, 'selected', entity.getValue(Portal, 'experienceId') === id);
  }
  update(delta: number) {
    const state = this.queries.state.entities.values().next().value;
    const reduced = state?.getValue(ShowroomState, 'reducedMotion') ?? false;
    if (!reduced) this.elapsed += Math.min(delta, .05);
    for (const entity of this.queries.motion.entities) {
      if (!reduced && entity.object3D) entity.object3D.rotation.y += Math.min(delta, .05) * (entity.getValue(AmbientMotion, 'speed') ?? .065);
    }
    for (const entity of this.queries.portals.entities) {
      const availability = entity.getValue(Portal, 'availability');
      const highlighted = entity.hasComponent(Hovered) || entity.getValue(Portal, 'selected');
      const preview = entity.getValue(Portal, 'preview');
      const color = availability === 'inactive' ? '#52635d' : availability === 'coming-soon' ? '#c8954e' : '#94d5b2';
      const materials = entity.object3D?.userData.feedbackMaterials as MeshStandardMaterial[] | undefined;
      if (!materials) continue;
      for (const material of materials) {
        material.emissive.set(color);
        material.emissiveIntensity = availability === 'inactive' ? .12 : preview ? 2 : highlighted ? 1.4 : .55 + (reduced ? 0 : Math.sin(this.elapsed * .6) * .08);
      }
    }
  }
}
