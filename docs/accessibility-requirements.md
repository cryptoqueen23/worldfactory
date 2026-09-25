# World Factory accessibility and responsive design requirements

Status: requirements for future development. This document does not implement
features or certify the existing IWSDK starter as accessible.

## Standards and scope

- Target [WCAG 2.2 Level AA](https://www.w3.org/TR/WCAG22/) for conventional
  web interfaces, including complete user journeys and applicable A and AA criteria.
- Follow [W3C XR Accessibility User Requirements](https://www.w3.org/TR/xaur/)
  where applicable to immersive experiences. XAUR informs design and testing;
  it is not a separate WCAG-style conformance certification.
- Accessibility and responsive design are core recipe requirements, owned by
  reusable World Factory components and systems.

## Shared content and behavior

Maintain one structured content and business-data model across desktop, mobile,
and XR. Recipes describe content and available actions independently of IWSDK.
HTML and immersive presentations consume the same identifiers, permissions,
validation, actions, and state. Presentation-specific layout and interaction
metadata may differ; business records must not be duplicated by device type.

Essential content and actions must be available without entering 3D or XR.
Provide semantic HTML interfaces for these journeys. The conventional interface
must remain usable when WebXR is unavailable, the 3D renderer fails, or the user
chooses not to load it. A canvas or spatial text panel alone is not an accessible
HTML alternative. Changing presentation must preserve relevant user progress.

## Reusable responsibilities

These are architecture boundaries, not instructions to build all systems now:

| Responsibility | Requirement |
| --- | --- |
| Content and recipes | Shared content, actions, meaningful labels, text alternatives, captions, transcripts, and other necessary media alternatives |
| Conventional HTML components | Semantic structure, navigation, forms, dialogs, focus management, and accessible feedback |
| Input handling | Translate supported input methods into the same application actions |
| IWSDK adapter | Present shared content through documented IWSDK APIs and apply immersive comfort preferences |
| Accessibility preferences | Share user choices across presentations and support persistence |
| Recipe validation | Identify missing accessibility content and unsupported essential action paths |

Start with the components required by the first recipe. Generalize repeated
behavior instead of creating speculative systems for future products. Recipe
authors must supply meaningful content; reusable components cannot compensate
for missing captions or inaccurate text alternatives.

## Device and input support

Support desktop, laptop, tablet, mobile phone, large displays, and VR/XR headsets.
Use responsive layouts and capability detection rather than device-name rules.
Support touch, mouse, keyboard, XR controllers, and hand tracking where available.
Do not require a particular input method for essential tasks.

Provide alternatives to dragging and gesture-only actions. A user must be able
to achieve the same result through accessible controls. Preserve keyboard focus
and selection predictably when changing views or input methods.

## Conventional interface requirements

- Use semantic HTML first, with appropriate ARIA where native semantics are insufficient.
- Provide keyboard navigation, visible focus, logical reading order, and screen-reader support.
- Provide text alternatives and applicable captions, transcripts, and audio descriptions.
- Maintain sufficient color contrast and communicate meaning beyond color alone.
- Support scalable text, zoom, reflow, and responsive layouts across display sizes.
- Provide adequate touch targets and spacing.
- Honor reduced-motion preferences and offer controls for unnecessary motion.
- Make errors, status updates, labels, and instructions understandable and accessible.

These requirements do not replace a review of all applicable WCAG A and AA criteria.

## Immersive requirements

Support seated and standing use, reachable controls, teleportation, and comfortable
locomotion choices. Avoid making physical walking, sustained arm positions,
precise gestures, or forced camera motion necessary for essential tasks.
Provide ways to recenter, adjust presentation, and leave the immersive session.
Carry meaningful visual and audio information into appropriate alternative forms.

Use documented IWSDK capabilities where available. Keep any additional World
Factory behavior reusable and isolated from recipe-specific business logic.

## Persistent preferences

Support reduced motion, text and readability choices, captions, input options,
and immersive comfort settings as needs arise. Respect system preferences by
default and allow explicit user overrides. Support persistence for guests on
their device and, when accounts exist, optional user-profile persistence. Keep
preferences independent of IWSDK objects, versionable, and resettable.

## Verification before releasing recipes

Verify essential journeys through the HTML interface with keyboard and screen
reader use, touch input, zoom/reflow, contrast checks, and reduced motion.
Combine automated checks with manual testing and testing with disabled users.
Check that different presentations operate on the same content and business state.

Verify immersive comfort and input alternatives in desktop XR emulation and on
supported physical headsets. Emulation alone does not establish headset or
assistive-technology accessibility. Record tested combinations and remaining gaps;
do not claim compliance from component reuse or automated checks alone.

The verified starter checkpoint remains
`8dcafb15ad5bdda6e88fb80d8c6a07a489c514fe`. Application implementation requires
the next development instruction.
