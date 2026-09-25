import { Group, Mesh, TorusGeometry, IcosahedronGeometry } from '@iwsdk/core';
import { drum, bronze, charcoal, jade, glow } from './showroom-materials';
// Floor-contact origin; 2.8m wide x 3.6m high. Articulated orbital assembly.
export const focalSculpture = new Group(); focalSculpture.name = 'Possibility instrument';
drum(focalSculpture, 'Recessed base', 1.48, .08, .04, charcoal);
drum(focalSculpture, 'Circular limestone dais', 1.42, .36, .26);
drum(focalSculpture, 'Bronze top reveal', 1.43, .035, .457, bronze);
drum(focalSculpture, 'Central support', .15, .54, .73, bronze);
const assembly = new Group(); assembly.name = 'Orbital assembly'; assembly.position.y = 2.08; focalSculpture.add(assembly);
for (let i = 0; i < 3; i++) {
  const ring = new Mesh(new TorusGeometry(1.13 - i * .15, .035 + i * .006, 10, 80), i === 1 ? jade : bronze);
  ring.name = `Orbital band ${i}`; ring.rotation.set(.32 + i * .72, i * .95, .3); assembly.add(ring);
}
const seed = new Mesh(new IcosahedronGeometry(.36, 1), glow); seed.name = 'Luminous seed'; assembly.add(seed);
