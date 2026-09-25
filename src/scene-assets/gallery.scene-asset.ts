import { Group, Mesh, TorusGeometry } from '@iwsdk/core';
import { arch, block, drum, stone, forest, bronze, charcoal, glow, jade } from './showroom-materials';
// Reusable open salon, 22 x 23 m. Floor at y=0; entry +Z, rear -Z.
export const galleryShell = new Group(); galleryShell.name = 'Open architectural salon';
block(galleryShell, 'Continuous limestone floor', [22, .24, 23], [0, -.12, -4], stone);
block(galleryShell, 'Rear forest wall', [22, 6.6, .32], [0, 3.3, -15.3], forest);
block(galleryShell, 'Rear stone dado', [22, .65, .24], [0, .325, -15.05], charcoal);
for (const side of [-1, 1]) {
  block(galleryShell, `Side enclosure ${side}`, [.25, 6.5, 23], [side * 10.9, 3.25, -4], forest);
  for (let i = 0; i < 5; i++) {
    const bay = arch(1.8, 2.8, .18, .3, stone); bay.name = `Colonnade opening ${side} ${i}`;
    bay.rotation.y = Math.PI / 2; bay.position.set(side * 9.8, 0, 3.5 - i * 4); galleryShell.add(bay);
  }
  block(galleryShell, `Low perimeter bench ${side}`, [.8, .45, 18], [side * 9.3, .225, -5], charcoal);
  block(galleryShell, `Bronze floor inlay ${side}`, [.025, .008, 20], [side * 8.6, .005, -4], bronze, .001);
}
for (let i = 0; i < 12; i++) block(galleryShell, `Rear wall flute ${i}`, [.045, 5.3, .13], [-10 + i * 1.82, 3.6, -15.07], bronze, .005);
for (const z of [-12, -6, 0]) {
  block(galleryShell, `Suspended roof rib ${z}`, [21, .22, .34], [0, 6.35, z], charcoal);
  block(galleryShell, `Roof luminous reveal ${z}`, [18.8, .035, .07], [0, 6.22, z], glow, .005);
}
// Three exhibit vocabularies. The stone stands contact the floor at y=0.
function exhibit(kind: number) {
  const root = new Group(); root.name = ['Threshold study', 'Terraced study', 'Orbital study'][kind];
  drum(root, 'Foot shadow reveal', .78, .06, .03, charcoal);
  drum(root, 'Stone display plinth', .74, .68, .4);
  drum(root, 'Bronze plinth lip', .75, .035, .755, bronze);
  if (kind === 0) {
    const a = arch(.49, .7, .1, .18); a.position.set(0, .78, -.1); root.add(a);
    const b = arch(.33, .48, .07, .12, jade); b.position.set(.08, .78, -.32); b.name = 'Receding inner opening'; root.add(b);
  } else if (kind === 1) {
    for (let i = 0; i < 4; i++) {
      const terrace = block(root, `Cantilevered terrace ${i}`, [1.03 - i * .17, .14, .85 - i * .12], [i * .06, .9 + i * .27, 0], i % 2 ? bronze : stone, .035);
      terrace.rotation.y = i * .22;
      block(root, `Terrace support ${i}`, [.19, .2, .22], [0, .78 + i * .27, 0], charcoal);
    }
  } else {
    drum(root, 'Orbital socket', .14, .26, .9, bronze);
    const ring = new Mesh(new TorusGeometry(.48, .055, 10, 48), jade); ring.name = 'Orbit'; ring.position.y = 1.42; root.add(ring);
    const ring2 = ring.clone(); ring2.name = 'Crossing orbit'; ring2.rotation.y = 1.1; root.add(ring2);
  }
  return root;
}
export const exhibitThreshold = exhibit(0), exhibitTerraces = exhibit(1), exhibitOrbit = exhibit(2);
export const portalFrame = exhibitThreshold;
export const centerpiece = exhibitOrbit;
