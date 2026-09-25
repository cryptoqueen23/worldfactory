import { createComponent, Types } from '@iwsdk/core';
export const Portal = createComponent('Portal', {
  portalId: { type: Types.String, default: '' },
  experienceId: { type: Types.String, default: '' },
  availability: { type: Types.String, default: 'inactive' },
  hero: { type: Types.Boolean, default: false },
  preview: { type: Types.Boolean, default: false },
  selected: { type: Types.Boolean, default: false },
});
export const ShowroomState = createComponent('ShowroomState', {
  selectedId: { type: Types.String, default: '' },
  freeExplore: { type: Types.Boolean, default: false },
  reducedMotion: { type: Types.Boolean, default: false },
  overview: { type: Types.Boolean, default: true },
});
export const AmbientMotion = createComponent('AmbientMotion', { speed: { type: Types.Float32, default: .065 } });
