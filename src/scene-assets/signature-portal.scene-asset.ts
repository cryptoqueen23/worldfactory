import { Group, Mesh, Shape, ShapeGeometry } from '@iwsdk/core';
import { arch, block, stone, bronze, charcoal, glow, jade } from './showroom-materials';
// 5.4m wide, 5.5m high, 2.5m deep. Floor-contact origin, facade +Z.
export const signaturePortal = new Group(); signaturePortal.name = 'Signature threshold';
block(signaturePortal, 'Flush threshold', [5.4, .07, 2.6], [0, .035, -.9], charcoal);
for (let i = 0; i < 5; i++) {
  const frame = arch(2.55 - i * .23, 2.85 - i * .14, i === 0 ? .25 : .11, i === 0 ? .42 : .12, i === 0 ? stone : bronze);
  frame.name = `Receding arch ${i}`; frame.position.z = -i * .43; signaturePortal.add(frame);
  const line = arch(2.29 - i * .23, 2.85 - i * .14, .026, .025, glow);
  line.name = `Portal light ${i}`; line.position.z = .025 - i * .43; signaturePortal.add(line);
}
const shape = new Shape(); shape.moveTo(-1.4, 0); shape.lineTo(-1.4, 2.2); shape.absarc(0, 2.2, 1.4, Math.PI, 0, true); shape.lineTo(1.4, 0); shape.closePath();
const backdrop = new Mesh(new ShapeGeometry(shape, 32), charcoal); backdrop.name = 'Destination horizon'; backdrop.position.z = -2.1; signaturePortal.add(backdrop);
block(signaturePortal, 'Destination horizon light', [2.6, .022, .025], [0, 1.05, -2.05], jade, .002);
for (const side of [-1, 1]) block(signaturePortal, `Threshold track ${side}`, [.026, .012, 2.3], [side * 1.2, .08, -.9], glow, .002);
