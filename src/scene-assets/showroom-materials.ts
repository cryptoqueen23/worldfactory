import { Group, Mesh, MeshStandardMaterial, Shape, Path, ExtrudeGeometry, CylinderGeometry } from '@iwsdk/core';
import { bevelBox } from './lib/hardsurface';
export const stone = new MeshStandardMaterial({ color: '#b8bdac', roughness: .78 });
export const forest = new MeshStandardMaterial({ color: '#203c32', roughness: .78 });
export const bronze = new MeshStandardMaterial({ color: '#c7a772', metalness: .65, roughness: .32 });
export const charcoal = new MeshStandardMaterial({ color: '#10261f', roughness: .64 });
export const glow = new MeshStandardMaterial({ color: '#eed7a2', emissive: '#dfb969', emissiveIntensity: 1.3, roughness: .45 });
export const jade = new MeshStandardMaterial({ color: '#73ad94', metalness: .25, roughness: .32 });
export function block(parent: Group, name: string, size: [number, number, number], p: [number, number, number], material = stone, bevel = .025) {
  const mesh = new Mesh(bevelBox(...size, bevel), material); mesh.name = name; mesh.position.set(...p); parent.add(mesh); return mesh;
}
export function drum(parent: Group, name: string, radius: number, height: number, y: number, material = stone) {
  const mesh = new Mesh(new CylinderGeometry(radius, radius, height, 48), material); mesh.name = name; mesh.position.y = y; parent.add(mesh); return mesh;
}
/** Continuous round-headed arch. Feet at y=0, facade faces +Z. */
export function arch(radius: number, spring: number, thickness: number, depth: number, material = bronze) {
  // A single contour follows the outside, threshold and inside: no touching hole edges.
  const shape = new Shape(), r = radius - thickness;
  shape.moveTo(-radius, 0); shape.lineTo(-radius, spring);
  shape.absarc(0, spring, radius, Math.PI, 0, true); shape.lineTo(radius, 0);
  shape.lineTo(r, 0); shape.lineTo(r, spring); shape.absarc(0, spring, r, 0, Math.PI, false);
  shape.lineTo(-r, 0); shape.closePath();
  const mesh = new Mesh(new ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: .015, bevelThickness: .015, curveSegments: 28 }), material);
  mesh.name = 'Continuous arch'; return mesh;
}
