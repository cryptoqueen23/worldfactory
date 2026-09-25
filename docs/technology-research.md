# World Factory technology and repository research

Research date: **September 25, 2026**.

Scope: read-only inspection of official repositories, licenses, documentation,
examples, and the already installed IWSDK package declarations. This report is
the only new deliverable. No packages were installed, repositories cloned,
source code copied into the application, resources provisioned, or application
files changed. No competing engine was executed or benchmarked.

## Decision summary

**Keep Meta IWSDK as the default `EngineAdapter`.** This research found useful
complementary capabilities, but no compelling reason to replace the verified
IWSDK foundation or combine complete engines in one application.

World Factory must retain ownership of business logic, content and CMS/data
models, recipes, identities, permissions, and reusable application systems.
Engine components and vendor services must not become the business model.

| Technology | Research disposition for World Factory |
| --- | --- |
| Meta IWSDK | Current implementation foundation; reuse its documented runtime and development tooling |
| Needle ecosystem | Active source of independently usable asset tools and a possible iOS XR delivery route; study its networking and accessibility patterns |
| Needle Engine as a whole | Active commercial alternative, but not an additional World Factory runtime dependency |
| 8th Wall community MIT modules | Conditional future evaluation for a specific mobile-AR gap; verify exact module and binary dependencies first |
| 8th Wall proprietary tracking binary | Not cleared for a commercial world-building platform; licensing and maintenance questions prevent recommendation |
| JanusWeb | Actively maintained older architecture worth studying for portals and connected worlds; do not add as a World Factory runtime dependency |
| Infinite Reality / iR Engine | Reference architecture for social worlds, room instances, networking, and operations; CPAL obligations and no verified public development since July 2025 prevent recommending adoption |
| Legacy 8th Wall hosted platform and archived examples | Historical references only; not a deployment dependency |

### Evidence conventions

- **Documented** means an official source describes the capability; it is not
  a successful World Factory integration test.
- **Observed locally** means the installed `@iwsdk/core` package or generated
  starter was inspected. Our installed version is **1.0.0-rc.2**.
- **Assessment** and **candidate** denote research conclusions, not vendor guarantees.
- **Not verified** means no adequate evidence was established in this pass;
  it does not prove that a feature cannot exist.
- Activity dates below are dated evidence visible in fetched pages, not a claim
  that a cached GitHub page contains the absolute latest commit.
- Licensing conclusions summarize published terms. Exact artifacts and any
  platform redistribution arrangement require license review before adoption.

## CURRENT IMPLEMENTATION CANDIDATES

### Meta IWSDK — retained immersive foundation

| Research question | Finding |
| --- | --- |
| 1. Maintenance/activity | Active. The retrieved history includes August 27, 2026 work and August runtime/editor fixes. The live documentation identifies v1.0.0-rc.2, matching the installed package. Release-candidate status warrants version pinning, not an unsolicited upgrade. [History](https://github.com/facebook/immersive-web-sdk/commits/main/), [documentation](https://iwsdk.dev/) |
| 2. License/commercial use | MIT permits commercial use and modification with required copyright/license notices. Third-party dependencies and downloaded models/media retain their own terms. [License](https://github.com/facebook/immersive-web-sdk/blob/main/LICENSE) |
| 3. Major capabilities | WebXR runtime, controller/hand input, grabbing, locomotion, physics, spatial audio, spatial UI, and scene understanding. [Official repository](https://github.com/facebook/immersive-web-sdk) |
| 4. Architecture/concepts | Three.js plus an entity-component system: entities combine data components; systems implement behavior. The starter separates project configuration, scene composition, asset/component catalogs, and registered systems. Observed locally in `iwsdk.config.json`, `src/index.ts`, `src/assets.ts`, and `src/components.ts`. |
| 5. Gaps in our current foundation | No complete business/CMS/recipe layer, federated portal protocol, production multiplayer service, voice conferencing service, avatar identity service, or automatic accessible HTML experience was established in the installed starter. These are product/integration gaps, not reasons to replace rendering. |
| 6. Do not duplicate | Reuse existing input, ray/poke/grab interaction, locomotion, spatial UI, asset lifecycle, audio, physics, and supported scene-understanding systems. Do not introduce another ECS or controller stack merely to obtain an unrelated feature. [Repository](https://github.com/facebook/immersive-web-sdk), [examples](https://iwsdk.dev/examples/) |
| 7. Independent integration | Official packages already divide core, input, locomotion, development, and reference responsibilities. New capabilities should adapt to the existing world and renderer rather than start a second rendering loop. [Package overview](https://github.com/facebook/immersive-web-sdk) |
| 8. Browser/mobile/VR/AR/MR | Browser 3D and immersive WebXR are supported paths. Desktop emulation is a development tool, not proof of mobile AR or physical-headset compatibility. Plane/mesh detection, hit testing, and other XR features depend on browser/device support. Touch navigation still needs deliberate product design. [Browser-first systems](https://iwsdk.dev/guides/16-browser-first-systems.html) |
| 9. Multiplayer/networking | No turnkey authoritative room/presence backend was found in the inspected core exports or starter. Plan a separate `RealtimeProvider`; do not confuse the development command bridge with end-user networking. |
| 10. Voice/video | Spatial audio and browser camera facilities are documented. They do not supply signaling, participant management, TURN relays, or group-call media routing. A `VoiceProvider` remains separate from audio positioning. [Browser-first systems](https://iwsdk.dev/guides/16-browser-first-systems.html) |
| 11. Assets/optimization | Installed asset declarations expose GLTF/GLB loading, Draco/KTX2 configuration, caching, deduplication, preload priorities, and load limits/timeouts. Loading compressed assets is not an offline optimizer or an automatic progressive-LOD pipeline. See local evidence below. |
| 12. Spatial UI/interaction | UIKitML, ray interaction, near/distance grabbing, and controller/hand support are existing strengths. UIKitML is rendered spatial UI; HTML-like markup does not establish semantic DOM or screen-reader access. [Spatial UI overview](https://iwsdk.dev/), [examples](https://iwsdk.dev/examples/) |
| 13. Portals/world linking | Scene loading and interaction are useful primitives. A reusable destination model, navigation history, cross-world authorization, arrival state, and external-world handoff remain World Factory concerns; a complete portal network was not verified. |
| 14. AI/agent development | Official project skills, managed browser, CLI/MCP scene and runtime inspection, emulated input, screenshots, ECS debugging, and reference search already support agent development. These are development tools, not a hosted conversational-agent product. [AI workflow](https://iwsdk.dev/ai/), [MCP tools](https://iwsdk.dev/ai/mcp-tools.html) |
| 15. Accessibility | Useful input and comfort primitives exist; a WCAG 2.2 AA claim was not established. Preserve essential HTML journeys and apply the project's accessibility requirements across both presentations. |
| 16. Commercial suitability in 2026 | **Yes as the default foundation**, with a pinned release, dependency/license review, device testing, and World Factory-owned business interfaces. The user has verified this starter in browser and desktop XR emulation; other-device verification remains separate. |

#### Specific IWSDK capabilities to reuse

- `SceneUnderstandingSystem`, `XRPlane`, `XRMesh`, and `XRAnchor` cover supported
  real-world geometry and stable placement. Tracking-loss stability does not
  establish persistent, shared, cross-session cloud anchors or geospatial VPS.
  [Scene understanding](https://iwsdk.dev/guides/11-scene-understanding.html)
- Environment hit testing and anchors are already documented; do not substitute
  image recognition for these different tasks.
  [Environment raycast](https://iwsdk.dev/guides/14-environment-raycast.html)
- Depth occlusion, physics, grabbing, locomotion, layers, and UI have official
  examples and generated specialist skills. Consult those before implementing
  replacements. [Examples](https://iwsdk.dev/examples/)
- Keep `iwsdk.config.json` as project configuration and use the official managed
  development command. Retain one compatible Three.js runtime: the local starter
  pins the `super-three@0.181.0` alias. Compatibility with another library cannot
  be inferred merely because both advertise Three.js support.

Local evidence inspected, without modifying or executing new dependencies:

- `node_modules/@iwsdk/core/package.json` and `dist/index.d.ts`.
- `node_modules/@iwsdk/core/dist/asset/asset-manager.d.ts` and
  `dist/asset/loaders/gltf-loader.d.ts`.
- `node_modules/@iwsdk/reference/README.md`: reference search/API tooling uses
  a separately warmed corpus/model. No warmup/download was performed for this research.
- Existing generated `AGENTS.md` and `.agents/skills/`: use `iwsdk-dev` for future
  implementation and its appropriate specialists for models, composition, UI,
  interaction, physics, and debugging. Research does not invoke their build workflows.

## ACTIVE TECHNOLOGIES WORTH INTEGRATING OR ADAPTING

This section identifies candidates for later bounded evaluation. It authorizes
neither dependencies nor implementation.

### Needle Engine and the Needle tools ecosystem

The supplied URL is an organization, not one uniformly licensed product.
Distinguish Needle Engine/Cloud, standalone libraries, asset tools, and the
Needle Go delivery service.

| Research question | Finding |
| --- | --- |
| 1. Maintenance/activity | Active. The organization lists Engine support updated September 23, 2026, samples September 21, and `gltf-progressive` September 14. These are repository update signals; the support repo is not the complete engine source. [Organization](https://github.com/needle-tools) |
| 2. License/commercial use | Engine/Cloud use a commercial EULA: commercial work requires paid contributing-user seats; branding and service entitlements depend on the plan. A public support repo is not evidence of an MIT engine license. The separate `gltf-progressive` library is MIT. [Terms](https://cloud.needle.tools/eula), [library license](https://github.com/needle-tools/gltf-progressive/blob/main/LICENSE) |
| 3. Major capabilities | Browser/VR/AR applications, Unity and Blender authoring, TypeScript components, collaboration, media, and glTF optimization. [Engine repository overview](https://github.com/needle-tools/needle-engine-support) |
| 4. Architecture/concepts | Scene/component authoring exported to glTF; runtime behaviors accompany exported data. Useful concepts include deferred scene loading, serializable component references, and separation of authoring from delivery. Needle-specific behavior extensions do not become portable simply because their container is glTF. [Export architecture](https://engine.needle.tools/docs/explanation/exporting-to-gltf) |
| 5. Value beyond our starter | More integrated DCC authoring/optimization, progressive asset delivery, room synchronization, VoIP, accessibility mirroring, and an iOS App Clip route. These fill different gaps and must be evaluated separately. [Optimization](https://engine.needle.tools/docs/how-to-guides/optimization/), [networking](https://engine.needle.tools/docs/networking.html), [iOS](https://engine.needle.tools/docs/how-to-guides/xr/ios-webxr-app-clip) |
| 6. IWSDK overlap | Rendering, lifecycle/components, XR input, physics, locomotion, audio, and spatial interactions overlap with IWSDK. Adding Needle Engine alongside IWSDK would duplicate responsibilities and introduce licensing and runtime ownership costs. Assessment based on both engines' documented capabilities. |
| 7. Independent integration | `gltf-progressive` explicitly supports ordinary Three.js projects; it does not require Needle Engine. Mesh Baker exports standard GLB. Needle Go documents a URL route for non-Needle Three.js WebXR apps. Engine-specific synchronized/UI components are not documented as standalone IWSDK modules. [Loader](https://github.com/needle-tools/gltf-progressive), [Mesh Baker](https://engine.needle.tools/docs/products/needle-mesh-baker), [Needle Go](https://engine.needle.tools/docs/how-to-guides/xr/ios-webxr-app-clip) |
| 8. Browser/mobile/VR/AR/MR | Documented desktop/mobile browser and WebXR support, including Quest and Vision Pro paths. On iPhone/iPad, Needle Go launches an ARKit-backed App Clip: this is not immersive WebXR running directly in ordinary Safari. Feature support varies by route. [XR guide](https://engine.needle.tools/docs/xr.html), [App Clip guide](https://engine.needle.tools/docs/how-to-guides/xr/ios-webxr-app-clip) |
| 9. Multiplayer/networking | Rooms, synchronized transforms/fields, ownership, joining-state snapshots, and player synchronization. The managed service documents Workers/Durable Objects; the self-hosted package has a Node server workflow. Do not assume that package is deployable unchanged to Workers. [Networking](https://engine.needle.tools/docs/networking.html), [architecture](https://engine.needle.tools/docs/explanation/networking/architecture), [self hosting](https://engine.needle.tools/docs/how-to-guides/networking/custom-servers) |
| 10. Voice/video | VoIP and screen sharing use WebRTC/PeerJS; spatial audio is supported. This is evidence of capabilities, not a benchmark for large events or a turnkey scalable SFU service. [Networking](https://engine.needle.tools/docs/networking.html), [samples](https://engine.needle.tools/samples/) |
| 11. Assets/optimization | Draco/Meshopt, KTX2, generated LODs, progressive textures/meshes, and lazy loading are documented. Mesh Baker can reduce geometry and bake materials into portable GLB assets. Authoring/build services have distinct terms from the MIT runtime loader. [Optimization](https://engine.needle.tools/docs/how-to-guides/optimization/), [Mesh Baker](https://engine.needle.tools/docs/products/needle-mesh-baker) |
| 12. Spatial UI/interaction | Built-in text, buttons, canvas UI, pointer/touch/XR interaction, and HTML integrations. Study workflow patterns; retain IWSDK's spatial UI and input implementation. [Components](https://engine.needle.tools/docs/reference/components.html) |
| 13. Portals/world linking | Official samples demonstrate stencil portal rendering and separate scene switching. These do not establish a federated world identity, permission, or session-transfer protocol. [Samples](https://engine.needle.tools/samples/) |
| 14. AI/agent development | Coding skills, MCP/Inspector integration, semantic documentation search, and local log access are documented. Valuable as tooling references; not a reason to replace IWSDK's existing agent workflow. [AI guide](https://engine.needle.tools/docs/ai/), [MCP](https://engine.needle.tools/docs/ai/needle-mcp-server.html) |
| 15. Accessibility | Since v4.15, an accessibility manager mirrors interactive elements into a hidden DOM with labels/roles and focus/live-region facilities. Adapt the intent, not an assumption of WCAG conformance: visible focus, meaningful labels, non-drag controls, and complete HTML journeys still need testing. [Accessibility](https://engine.needle.tools/docs/how-to-guides/accessibility) |
| 16. Commercial suitability in 2026 | **Selective use is appropriate; whole-engine adoption is unnecessary here.** MIT loader evaluation is plausible. Paid tools/services require their own commercial terms; a generated-world platform's redistribution and customer authoring rights need explicit confirmation rather than assuming one developer seat covers every customer. [Terms](https://cloud.needle.tools/eula) |

#### Needle candidates, ordered by independence

1. **Offline asset preparation:** Evaluate Mesh Baker outputs through
   `AssetProvider` when heavy models require optimization. Its documentation
   allows commercial output use, subject to rights in source assets. The
   application can consume GLB without adopting Needle's runtime or hosting.
   [Tool and output terms](https://engine.needle.tools/docs/products/needle-mesh-baker)
2. **Progressive loading:** Evaluate MIT `@needle-tools/gltf-progressive` only
   when asset sizes justify it. It needs appropriately prepared progressive
   assets, not merely any GLB. Verify access to a supported IWSDK loader hook,
   shared renderer/Three.js compatibility, lifetime/disposal, sidecar URLs,
   and XR performance. The library is independent; its asset-generation
   workflow may introduce separate tooling/service costs.
   [Library](https://github.com/needle-tools/gltf-progressive),
   [format and workflow](https://engine.needle.tools/docs/gltf-progressive/)
3. **iOS delivery:** Needle Go is a possible `XRProvider` launch route without
   another engine. Do not promise it works with this starter until tested.
   Verify commercial platform use, branding, session/cookie behavior, and
   accessibility. Its guide marks anchors and light estimation as work in
   progress. Native WebXR image-tracking support and Quick Look are different
   routes; avoid inferring one route's capabilities from another.
   [App Clip guide](https://engine.needle.tools/docs/how-to-guides/xr/ios-webxr-app-clip),
   [image tracking](https://engine.needle.tools/docs/webxr-image-tracking.html)
4. **Patterns to adapt:** room ownership, snapshots, input-to-shared-action
   mapping, and accessible semantic representations. Do not import the entire
   engine to obtain these patterns or assume its managed networking terms apply
   to a non-Needle platform.

#### Gaussian splats and spatial media

Needle documents a `GaussianSplat` component, while its Cloud documentation
still marks splat ingestion as forthcoming. Runtime display and a hosted asset
pipeline are separate claims. [Component catalog](https://engine.needle.tools/docs/api/modules/Built-in_Components.html),
[Cloud formats](https://engine.needle.tools/docs/cloud/)

An independently scoped candidate is **Spark**, discovered through the Needle
organization's fork. The upstream project is a MIT Three.js splat renderer
with mesh integration and multiple splat formats; no Needle Engine adoption is
required. This is a supplementary lead, not a full vendor review or verified
IWSDK integration. Evaluate it behind `SpatialMediaProvider` only if a recipe
requires splats. [Upstream Spark](https://github.com/sparkjsdev/spark)

Assessment: splat rendering does not automatically supply collision geometry,
navigation surfaces, accessible descriptions, or suitable mobile/headset frame
times. Retain authored proxy geometry and conventional content alternatives.

### 8th Wall — distinguish the current community project from legacy hosting

| Research question | Finding |
| --- | --- |
| 1. Maintenance/activity | The community MIT repository is active, with August 14, 2026 commits visible. The former hosted platform ended editing/login access February 28, 2026; legacy hosting is scheduled through February 28, 2027. Do not classify all 8th Wall technology as dead, or the old hosted service as available for new projects. [History](https://github.com/8thwall/8thwall/commits/main/), [transition announcement](https://8thwall.org/blog/8th-wall-open-source), [migration FAQ](https://8thwall.org/docs/migration/faq) |
| 2. License/commercial use | The community framework/modules are MIT; SLAM tracking is separately distributed under a proprietary binary license. The binary restricts competitive products and paid offerings deriving substantial value from it. World Factory's platform/toolkit model is a material unresolved fit question. Do not treat the binary as MIT or commercially cleared. [MIT repository](https://github.com/8thwall/8thwall), [binary license, sections 1.1–1.3](https://github.com/8thwall/engine/blob/main/LICENSE) |
| 3. Major capabilities | Mobile camera AR, world tracking, image targets, face and sky effects; Studio offers a 3D editor/ECS. Distribution differs between open modules and binary tracking. [Repository](https://github.com/8thwall/8thwall), [binary inventory](https://github.com/8thwall/engine) |
| 4. Architecture/concepts | XR8 camera pipeline modules separate camera rendering, tracking, and application callbacks. Studio's ECS is another layer, not mandatory for every XR8 integration. [Engine integration](https://8thwall.org/docs/engine/overview) |
| 5. Value beyond our starter | Browser-camera mobile AR and image/face/sky tracking are the clearest complementary areas. They do not make Quest scene understanding, persistent cloud anchors, or VPS interchangeable features. [Engine inventory](https://github.com/8thwall/engine) |
| 6. IWSDK overlap | A second Studio ECS, renderer, general scene editor, physics/interaction stack, or agent toolchain would duplicate substantial IWSDK responsibilities. Evaluate a tracking capability only, not Studio as the new World Factory application model. |
| 7. Independent integration | Documented Three.js/A-Frame camera-pipeline integration shows Studio is avoidable. It does not prove an IWSDK adapter is ready: camera ownership, rendering loop, transforms, input, licensing, and teardown must be resolved. The documented image/world example loads the `slam` binary chunk, so do not assume an MIT image-target tool eliminates proprietary runtime dependencies. [Integration guide](https://8thwall.org/docs/engine/overview) |
| 8. Browser/mobile/VR/AR/MR | Mobile camera AR is the main differentiator; desktop testing is documented. Exact 2026 headset VR/MR parity with IWSDK was not verified. Camera-based mobile tracking and standards-based headset WebXR require separate capability checks. [Desktop/mobile workflow](https://8thwall.org/docs/engine/overview) |
| 9. Multiplayer/networking | No supported current first-party authoritative room/presence service was established in the reviewed community runtime docs. Treat custom networking or former examples as separate integrations. Do not assume retired hosted services remain available. |
| 10. Voice/video | Audio/video playback events are documented; this does not establish spatial conferencing, signaling, or an SFU. No independently reusable voice service was verified. [Media events](https://8thwall.org/docs/api/studio/events/assets) |
| 11. Assets/optimization | Studio handles glTF models and SPZ splats. Splat documentation warns about file/performance limits and missing lighting/shadow behavior. No independent production optimization pipeline suitable for IWSDK was validated. [Assets](https://8thwall.org/docs/api/studio/events/assets), [splats](https://8thwall.org/docs/studio/guides/splats) |
| 12. Spatial UI/interaction | Studio/ECS and XR helpers provide authoring and interaction paths; camera coaching and device fallback components are useful concepts. They are not an accessibility guarantee or a replacement for IWSDK spatial UI. [Repository package inventory](https://github.com/8thwall/8thwall) |
| 13. Portals/world linking | AR portal effects are feasible rendering concepts; no portable cross-world linking/session standard was established. World Factory should own destination semantics regardless of tracking provider. |
| 14. AI/agent development | The transition announcement/FAQ identify MCP tooling in the release plan. This pass did not validate a current supported standalone agent server against IWSDK. Former Asset Lab availability must not be inferred from historical demos. [Transition announcement](https://8thwall.org/blog/8th-wall-open-source), [FAQ](https://8thwall.org/docs/migration/faq) |
| 15. Accessibility | Device landing pages and coaching overlays can help onboarding; no WCAG 2.2 AA evidence was established. Camera permission, scan/gesture requirements, tracking loss, captions, and non-AR alternatives need explicit World Factory handling. |
| 16. Commercial suitability in 2026 | **Conditional for specific MIT modules; not recommended as the platform foundation.** Defer proprietary SLAM until written licensing clarification covers World Factory's business model and maintenance needs. Do not rely on retired hosting. |

The migration FAQ promised binary maintenance through March 2026, a date now
past. That is not evidence of continued fixes through September. Conversely,
community repository activity does not prove proprietary-binary maintenance.
The binary omits VPS, Maps, and hand tracking; preserve this distinction when
assessing anchors, scene understanding, and mobile AR.
[Migration FAQ](https://8thwall.org/docs/migration/faq),
[binary inventory](https://github.com/8thwall/engine)

Before considering an MIT module, establish its exact build/runtime dependencies
and redistribution terms. The defensible candidate is an isolated `XRProvider`
experiment for a proven missing capability, not adding the full 8th Wall engine
because a demo works.

## REFERENCE ARCHITECTURES

### OLDER PROJECTS THAT ARE USEFUL TO STUDY BUT SHOULD NOT BECOME WORLD FACTORY DEPENDENCIES

This classification is about dependency fit, not an assertion that every older
project is abandoned. In particular, JanusWeb has meaningful 2026 activity.

### JanusWeb — connected-world and portal reference

| Research question | Finding |
| --- | --- |
| 1. Maintenance/activity | Active community maintenance is visible: July 20, 2026 version work and August 15 Three.js r185/editor changes. Older README sections coexist with newer work; do not use its old WebVR device list as the 2026 support matrix. [History](https://github.com/jbaicoianu/janusweb/commits/master/) |
| 2. License/commercial use | MIT permits commercial use with notices; external services, assets, and dependencies require their own review. Licensing is not the main reason to avoid adding it here. [License](https://github.com/jbaicoianu/janusweb/blob/master/LICENSE) |
| 3. Major capabilities | URL-addressed immersive rooms, declarative room markup, networked users, positional audio, models, and video surfaces. [Repository](https://github.com/jbaicoianu/janusweb) |
| 4. Architecture/concepts | A room browser built around Janus markup, an Elation-based runtime, and Three.js. Repository modules separate rooms, portals, remote players, multiplayer management, and media. Study room identity and transitions; do not adopt its runtime as World Factory's CMS schema. [Module inventory](https://github.com/jbaicoianu/janusweb/tree/master/scripts), [portal implementation](https://github.com/jbaicoianu/janusweb/blob/master/scripts/portal.js) |
| 5. Value beyond our starter | An explicit connected-room/portal model and established multiuser concepts. These are useful design references for World Factory's own destinations, presence, and arrival behavior. |
| 6. IWSDK overlap | Renderer, player/input lifecycle, scene management, interaction, and audio duplicate existing IWSDK areas. Janus's runtime and Three.js revision would also introduce compatibility work. [Module inventory](https://github.com/jbaicoianu/janusweb/tree/master/scripts), [history](https://github.com/jbaicoianu/janusweb/commits/master/) |
| 7. Independent integration | Portal ideas are independently reusable. The inspected portal code directly references Janus rooms, player, Elation events, assets, and renderer state; it is not a drop-in IWSDK portal library. External world URLs can be ordinary outbound links without embedding Janus. [Portal implementation](https://github.com/jbaicoianu/janusweb/blob/master/scripts/portal.js) |
| 8. Browser/mobile/VR/AR/MR | Desktop/mobile/VR are advertised. Current XR-player code exists, but old WebVR claims and new runtime changes require actual device testing. Modern mobile image tracking, AR anchors, and MR scene understanding were not verified. [README](https://github.com/jbaicoianu/janusweb), [modules](https://github.com/jbaicoianu/janusweb/tree/master/scripts) |
| 9. Multiplayer/networking | Built-in networking, presence server configuration, remote-player modules, and a separate presence-server ecosystem are visible. Server health, moderation, authorization, scale, and SLA were not validated. [README](https://github.com/jbaicoianu/janusweb), [modules](https://github.com/jbaicoianu/janusweb/tree/master/scripts) |
| 10. Voice/video | Video textures include stereo/360 formats and positional sound. Voice evidence is mixed: README still labels a VoIP option disabled while linking a WebRTC gateway ecosystem. Do not present that as verified production spatial voice. [README](https://github.com/jbaicoianu/janusweb) |
| 11. Assets/optimization | Multiple model formats are documented. No current standalone optimizer, progressive-asset pipeline, or Gaussian-splat provider was verified. [README](https://github.com/jbaicoianu/janusweb) |
| 12. Spatial UI/interaction | Player, portal, text, paragraph, and web-surface components; recent editor work includes focusable XR panels. That is useful interaction history, not WCAG proof. [Modules](https://github.com/jbaicoianu/janusweb/tree/master/scripts), [history](https://github.com/jbaicoianu/janusweb/commits/master/) |
| 13. Portals/world linking | Concrete portal options include destination URL/title, preview thumbnail, preload, external navigation, and seamless mode. Separate destination meaning from rendering effects and room loading. [Portal implementation](https://github.com/jbaicoianu/janusweb/blob/master/scripts/portal.js) |
| 14. AI/agent development | Scriptable and experimental headless/bot use is described. No official current Codex skill/MCP runtime toolchain comparable to IWSDK's was established. [README](https://github.com/jbaicoianu/janusweb) |
| 15. Accessibility | Recent focus/keyboard fixes show attention to interaction, not complete accessibility certification. Keep conventional navigation, readable content, and keyboard alternatives independent of the 3D room browser. [History](https://github.com/jbaicoianu/janusweb/commits/master/) |
| 16. Commercial suitability in 2026 | **Legally plausible under MIT, but reference-only for this product.** A second runtime adds cost without a compelling advantage over adapting its connected-world concepts to IWSDK. This is a World Factory fit assessment, not a claim that JanusWeb is unusable. |

### Legacy 8th Wall material

The archived [`8thwall/web`](https://github.com/8thwall/web) repository and older
hosted-platform tutorials can explain mobile-AR onboarding, camera pipelines,
and interaction patterns. They must not establish current service availability,
license rights, or a requirement for World Factory to use legacy hosting.
Keep these references separate from the active community MIT repository.

### Infinite Reality / iR Engine — social-world platform reference

**Disposition: REFERENCE ARCHITECTURE. Keep IWSDK as the default engine.**
The useful material is the separation of social services, world instances,
media transport, and engine state. No iR Engine package is recommended for
World Factory, and no CPAL source was copied into this project. Findings below
come from documentation and remote source inspection, not execution.

#### Maintenance, licensing, and commercial suitability in 2026

The GitHub API returned `archived: false`, default branch `dev`, and a last
push of **July 17, 2025** for the requested repository. Its developer-docs
repository last recorded a push on **May 21, 2025**. The visible default-branch
history also ends in July 2025. Thus it remains publicly available, but this
pass found no evidence of ongoing 2026 development in these repositories.
This does not establish the status of private development or successor
products. The README mixes Infinite Reality and Napster naming; branding alone
is not evidence of continuing maintenance. Several documentation pages are
placeholders, so capability claims need source inspection and eventual testing.
[Repository metadata](https://api.github.com/repos/ir-engine/ir-engine),
[documentation metadata](https://api.github.com/repos/ir-engine/developer-docs),
[commit history](https://github.com/ir-engine/ir-engine/commits/dev/).

**License: CPAL 1.0, not a prohibition on commercial use.** Commercial use is
permitted subject to its conditions. Sections 3 and 15 require source
availability for covered code/modifications in applicable distribution and
external network deployment. Section 14 and Exhibit B require prominent
attribution, including in larger works; Exhibit B specifies Infinite Reality
branding. Section 3.7 permits combining covered code with separately licensed
code, so this is not simply a requirement to publish every unrelated business
module. Extracting a small source file does not remove its obligations.
Any future adoption would require artifact-specific legal review; no such
adoption is proposed. Architectural ideas here are described independently in
original prose. [Repository license, including Sections 3, 14–15 and Exhibit B](https://github.com/ir-engine/ir-engine/blob/dev/LICENSE).

**Commercial assessment:** useful to study, unsuitable as a new World Factory
dependency on the evidence available. Maintenance uncertainty, operational
weight, engine coupling, and attribution/source obligations outweigh the
benefit of importing its integrated platform.

#### Capability and architecture findings

| Area | Evidence and limitations | Useful World Factory concept |
| --- | --- | --- |
| Multiplayer architecture | Documentation separates world networks for environment state from media networks for audio/video. A user identity can have multiple device peers. Entity ownership and transferable control authority are different concepts. [Networking guide](https://github.com/ir-engine/developer-docs/blob/main/docs/manual/03_modules/01_engine/05_networking.md) | Separate durable identity, temporary connections, and object-control permissions. Keep media transport independent of room-state messages. |
| World/room instances | A location references a scene and has an access type and maximum users per instance. Documentation describes creating another instance when capacity is reached. [Location administration](https://github.com/ir-engine/developer-docs/blob/main/docs/manual/03_modules/05_infrastructure/d_02_adminPanel/05_locations.md) | Distinguish a published world from a running room session. One world may have several rooms; a room is not a new copy of the business content. |
| Presence | Attendance records distinguish instance, user, peer, scene, channel/world attendance, and ended status. This is evidence of a presence model, not proof of fault-free reconnect handling. [Attendance schema](https://github.com/ir-engine/ir-engine/blob/dev/packages/common/src/schemas/networking/instance-attendance.schema.ts) | Model presence per connection, aggregate it per person, expire stale connections, and make reconnect behavior explicit. |
| Avatars and avatar networking | Avatar state handles spawn, appearance URL/name changes, and removal alongside network entities. Avatar documentation supports VRM 0/1 and glTF avatars with Mixamo-style rigs; it also describes external avatar creators, whose present service availability was not verified. [Avatar network state](https://github.com/ir-engine/ir-engine/blob/dev/packages/engine/src/avatar/state/AvatarNetworkState.tsx), [avatar formats](https://github.com/ir-engine/developer-docs/blob/main/docs/manual/02_concepts/08_avatars/04_avatarModels.md) | Keep avatar identity/appearance separate from transient pose. `AvatarProvider` can translate a neutral avatar description into IWSDK rendering without owning user accounts. |
| Spatial voice | The positional-audio system associates remote media with avatar owners, updates panners from avatar head positions, and updates the listener from the viewer. It uses Web Audio and an immersive-media setting. It was not audio-tested. [Positional audio system](https://github.com/ir-engine/ir-engine/blob/dev/packages/client-core/src/systems/PositionalAudioSystem.tsx) | `VoiceProvider` supplies tracks and participant controls; an engine-side audio adapter applies position. Offer a non-spatial listening option. |
| WebRTC voice/video | The instance-server manifest uses mediasoup, with separate channel-server commands and dependencies on engine/server packages. The README also advertises peer-to-peer WebRTC; this pass did not verify every transport mode. [Instance-server manifest](https://github.com/ir-engine/ir-engine/blob/dev/packages/instanceserver/package.json), [platform overview](https://github.com/ir-engine/ir-engine) | Use a separate media service behind `VoiceProvider`. A selective forwarding unit (SFU) forwards participants' media streams without making the game-state service carry the audio/video. |
| Friends, groups, social systems | The README advertises chat, groups, friends, and blocking. Source verifies relationship states for requests, pending acceptance, friends, and directional blocks. Group membership behavior was not independently validated; the social concept page is a placeholder. [Relationship types](https://github.com/ir-engine/ir-engine/blob/dev/packages/common/src/schemas/user/user-relationship-type.schema.ts), [social documentation limitation](https://github.com/ir-engine/developer-docs/blob/main/docs/d__partials/concepts/typescript/social/description.md) | Persist social relationships and organization memberships outside the renderer. Do not confuse a temporary media channel with a permanent organization or group. |
| Blocking and moderation | The repository includes reports, attachments, bans, and administration components. Ban records connect users, optional locations/reports, reasons, status, and actor/timestamp fields. No end-to-end enforcement audit was performed. [Ban schema](https://github.com/ir-engine/ir-engine/blob/dev/packages/common/src/schemas/moderation/moderation-ban.schema.ts), [moderation services](https://github.com/ir-engine/ir-engine/tree/dev/packages/server-core/src/moderation) | Separate personal mute/block from moderator removal/ban. Enforce admission and media authorization on the server; retain appropriate audit records and accessible reporting controls. |
| Authentication and identity | Identity-provider records link login mechanisms to a stable user ID. The schema includes guest, password, email/SMS, and several OAuth provider types. Listed types do not prove that every integration still works in 2026. [Identity-provider schema](https://github.com/ir-engine/ir-engine/blob/dev/packages/common/src/schemas/user/identity-provider.schema.ts) | World Factory owns user IDs and organization permissions. Login providers, room peers, and avatars reference that identity rather than becoming it. |
| Networked physics | The platform advertises Rapier physics. Serialization code handles body position, rotation, and linear/angular velocity with change masks. This does not demonstrate deterministic lockstep, complete rollback, or cheat resistance. [Physics serialization](https://github.com/ir-engine/ir-engine/blob/dev/packages/spatial/src/physics/PhysicsSerialization.ts) | Specify who may control each shared object, what state is replicated, and how corrections work. Do not replace IWSDK's physics merely to copy a network design. |
| World editing | The platform includes an editor; its project model packages scenes, assets, custom code, and configuration. Production loads projects through database/storage services while local development uses project directories. [Project architecture](https://github.com/ir-engine/developer-docs/blob/main/docs/manual/02_concepts/01_projects.md) | Separate published world content, editable drafts, and runtime state. Reuse IWSDK's scene/editor workflow for engine-specific authoring; retain World Factory's CMS model. |
| Administration | Instance administration exposes location/channel, current users, address, and Kubernetes pod, with instance management actions. Project administration tracks versions and commit IDs, access, files, and updates; parts of that guide carry TODO notes. [Instance administration](https://github.com/ir-engine/developer-docs/blob/main/docs/manual/03_modules/05_infrastructure/d_02_adminPanel/06_instances.md), [project administration](https://github.com/ir-engine/developer-docs/blob/main/docs/manual/03_modules/05_infrastructure/d_02_adminPanel/03_projects.md) | Treat room health, participant management, content version, and permissions as operational concerns with a conventional HTML interface. |
| Scalable server infrastructure | Deployment guidance uses Kubernetes, Agones, ingress, and Redis. Redis coordinates Feathers service synchronization; Agones manages available/allocated instance servers. The guide warns that restarting Redis can interrupt running instances. This is an operational design, not a verified capacity benchmark. [Infrastructure guide](https://github.com/ir-engine/developer-docs/blob/main/docs/manual/03_modules/05_infrastructure/03_devopsDeployment/03_AWSSetup/08_agonesNginxRedis.md) | Isolate room failures, drain active sessions during upgrades, and separate room allocation from content storage. World Factory does not need this cluster stack for its first recipe. |
| Plugin/project architecture | Git-backed projects supply routes, services, lifecycle hooks, assets, scenes, and world initialization. This is extensibility inside iR Engine, not a portable plugin standard. [Project configuration](https://github.com/ir-engine/developer-docs/blob/main/docs/manual/02_concepts/01_projects.md) | Version recipe manifests and define narrow service contracts. Treat executable extensions as trusted code; ordinary recipe content should remain data. |
| Portals and world linking | Portal source models destination location, linked portal, spawn transforms, effects, preview, and activation cooldown. Some preview/spawn lookup code is commented out with a refactoring TODO; seamless world traversal is not established. [Portal component](https://github.com/ir-engine/ir-engine/blob/dev/packages/engine/src/scene/components/PortalComponent.ts) | `PortalProvider` resolves a destination and admission result; the renderer supplies a visual doorway. The same destination needs an ordinary HTML link. Cross-domain identity and seamless XR session transfer are separate problems. |
| Asset pipeline and spatial media | Model transformation source uses glTF Transform, meshoptimizer, texture compression, pruning, and simplification. It is coupled to iR services. Volumetric-media components exist, but this pass did not establish a production Gaussian-splat pipeline. [Model transforms](https://github.com/ir-engine/ir-engine/blob/dev/packages/common/src/model/ModelTransformFunctions.ts), [scene components](https://github.com/ir-engine/ir-engine/tree/dev/packages/engine/src/scene/components) | Study offline optimization and asset variants behind `AssetProvider`; evaluate original upstream tools independently rather than importing this pipeline. Keep spatial media behind `SpatialMediaProvider`. |

**Devices, interaction, AI, and accessibility:** the README advertises browser
WebGL on desktop/iOS/Android and 2D/3D/XR avatars, including inverse kinematics
(estimating body joints from tracked poses). That is not proof of identical
VR/AR/MR support on every browser. This pass did not verify mobile image
tracking, persistent anchors, scene understanding, or a reason to supersede
IWSDK's XR input and spatial UI. AI-oriented repository files and Hyperflux's
use of “agent” do not establish a ready-made conversational-agent product.
Hyperflux describes reactive/networked state, not an LLM service.
[Platform overview](https://github.com/ir-engine/ir-engine),
[Hyperflux description](https://github.com/ir-engine/ir-engine/blob/dev/packages/hyperflux/readme.md).

No WCAG 2.2 AA audit or equivalent XR accessibility validation was established.
World Factory must retain its own requirements: keyboard-operable HTML for
joining/leaving, participant lists, mute/block/report actions and essential
content; captions/transcripts where applicable; scalable text; reduced motion;
and comfortable seated/standing interaction. A 3D avatar or proximity voice
must never be the only way to participate. These are World Factory requirements,
not claims that iR Engine already meets them.

#### Independently usable components: distinguish upstream from iR code

- **Hyperflux:** a separately described/publishable state library, but its
  inspected manifest explicitly declares CPAL and depends on React/Hookstate.
  Modularity does not remove licensing or integration costs. Do not adopt it.
  [Hyperflux manifest](https://github.com/ir-engine/ir-engine/blob/dev/packages/hyperflux/package.json)
- **iR instance server:** marked private and directly dependent on its engine,
  spatial, ECS, Hyperflux, projects, and server-core packages. It is not an
  independent IWSDK multiplayer add-on. Its inspected package version is
  `1.0.3`; that is a repository manifest value, not a verified current release.
  [Instance-server dependencies](https://github.com/ir-engine/ir-engine/blob/dev/packages/instanceserver/package.json)
- **mediasoup upstream:** an independent ISC-licensed media server library.
  Its repository API recorded a September 25, 2026 push and no archive flag.
  This is a viable future research candidate for `VoiceProvider`, acquired
  directly from upstream with its own dependency review. It needs media-server
  operations and signaling; it does not supply World Factory accounts, rooms,
  moderation policy, or positional audio. No iR wrapper is needed or approved.
  [mediasoup upstream](https://github.com/versatica/mediasoup),
  [maintenance metadata](https://api.github.com/repos/versatica/mediasoup)
- **Other upstream tools:** the asset optimizers and physics library used by
  iR are leads for separate evaluation, not blanket approval to import them.
  No iR-owned component was identified as both sufficiently independent and
  appropriately licensed/maintained to recommend for World Factory now.

#### Comparison with IWSDK and the planned Cloudflare architecture

This is an architectural assessment, not a deployment plan or provisioning task.
The IWSDK findings earlier in this report remain authoritative for the installed
starter: reuse its ECS, rendering, assets, input/interactions, spatial UI,
locomotion, physics, scene tooling, and XR emulation. Social identity, room
allocation, moderation, and a hosted media service are platform responsibilities
outside the currently verified starter. They do not require adopting another
complete renderer or engine.

| Responsibility | World Factory direction | Boundary to preserve |
| --- | --- | --- |
| Website and API | Workers with Static Assets for HTML/application delivery and application APIs | Business services remain independent of Workers bindings and IWSDK. |
| Durable business data | D1 for worlds, recipes, users, organizations, memberships, permissions, and appropriate social/moderation records | Room connections and per-frame avatar poses are not business records to continually write to D1. |
| Large assets | R2 for avatar models, world assets, media, and generated variants | Store asset references/metadata in the content model; apply authorization and delivery policy separately. |
| Room state and presence | Later evaluate one Durable Object per room/session, with WebSockets and reconnect/expiry rules behind `RealtimeProvider` | This is a candidate mapping, not proof that a room can support an arbitrary number of users or a high-frequency physics workload. |
| Voice/video | Evaluate Cloudflare Realtime SFU or another independent media service behind `VoiceProvider` | Durable Object room coordination is not itself WebRTC audio/video forwarding. |
| Physics synchronization | Reuse IWSDK locally; introduce explicit ownership, validation, and replication only when needed | A distributed simulation may need a dedicated service; do not presume Workers or Durable Objects reproduce iR's server runtime. |
| Cache/configuration | Optional KV for suitable read-heavy data | Do not make KV authoritative for admission, bans, memberships, or relational content. |
| Recipes and editing | World Factory owns recipes/CMS; IWSDK remains `EngineAdapter` | Engine scene files are one presentation of structured content, not the universal business schema. |

Cloudflare documents Durable Object WebSocket hibernation, including restoring
connection attachments when an object wakes. That supports investigating room
coordination, but persistent connections do not imply permanent in-memory state.
Reconnects, state recovery, room limits, and failure behavior require explicit
design and testing. [Durable Object WebSocket example](https://developers.cloudflare.com/durable-objects/examples/websocket-hibernation-server/).

Cloudflare Realtime SFU is a separate media capability worth evaluating later;
it is not automatically provided by the Workers/D1/R2/KV plan. Authentication,
room authorization, mute/block enforcement, captions, and spatial positioning
remain integration responsibilities. No service selection, pricing commitment,
or resource creation is made here.
[Cloudflare Realtime SFU](https://developers.cloudflare.com/realtime/sfu/).

The self-hosted mediasoup design uses native media workers/subprocesses. Workers'
Node compatibility does not turn an ordinary Worker into that server environment.
Treat a self-hosted media server as a separate deployment, or use a managed media
service; do not port iR's Kubernetes/Redis stack into the starter.
[mediasoup architecture](https://mediasoup.org/documentation/v3/mediasoup/),
[Workers Node compatibility](https://developers.cloudflare.com/workers/runtime-apis/nodejs/).

#### Patterns to retain, without implementing them yet

1. Keep **world definition, room instance, user identity, device connection,
   avatar, and media participant** distinct, connected by stable identifiers.
2. Give room admission and permissions a server-authoritative decision, while
   separately defining authority over interactive objects. Client simulation
   ownership must not confer business or moderator privileges.
3. Separate world messages from media tracks. Let `RealtimeProvider`,
   `VoiceProvider`, and `AvatarProvider` coordinate through World Factory IDs.
4. Make `PortalProvider` navigation work in HTML as well as IWSDK. Resolve room
   capacity, permissions, accessible arrival, and failure before transitioning.
5. Keep publication/versioning and administration outside the engine; retain
   operational visibility into room health and moderation actions.
6. Keep `XRProvider`, `AssetProvider`, and `SpatialMediaProvider` replaceable
   where practical without recreating features already supplied by IWSDK.

These findings do not expand the first milestone. `ImmersiveWebsiteRecipe`
still comes first; multiplayer, avatars, social graphs, media servers, and
networked physics remain future requirements, not current implementation work.

## Reusable concepts and provider boundaries to carry into architecture work

These are research conclusions for a later architecture proposal, not a mandate
to create eight interfaces or an elaborate plugin framework immediately.

| Boundary | World Factory owns | Reuse or evaluate behind it |
| --- | --- | --- |
| `EngineAdapter` | Application-facing scene/action contracts | IWSDK by default; one world/render lifecycle |
| `XRProvider` | Capability reporting, session intent, fallback policy | IWSDK/WebXR first; optional iOS launch route or isolated tracking provider later |
| `PortalProvider` | Destination identity, navigation, arrival, permissions, history | IWSDK presentation; Janus portal concepts and Needle rendering examples as references |
| `AssetProvider` | Asset identifiers, metadata, variants, accessibility metadata | IWSDK loading; optional independent preparation/progressive loader; R2 storage |
| `RealtimeProvider` | Room membership, presence model, authority, shared events | Future Cloudflare Durable Objects; study synchronized-room patterns without importing an engine |
| `VoiceProvider` | Join/mute/leave intent, participant mapping, accessibility controls | A separately evaluated media transport; local spatial playback uses existing engine audio |
| `AvatarProvider` | User-to-avatar identity, representation preferences, pose contracts | Independent avatar assets/animation integration; no engine-specific identity records |
| `SpatialMediaProvider` | Media type, variants, captions/descriptions, playback intent | Existing texture/layer facilities; a bounded independent splat renderer if needed |

### Portals and interconnected immersive websites

Assessment: distinguish three capabilities before designing `PortalProvider`:

1. **A destination link:** a stable world/content URL with an accessible HTML
   link and a spatial representation. This is sufficient for initial website navigation.
2. **An in-application transition:** load/unload content, preserve relevant
   state, choose arrival pose, restore focus, and report loading/failure.
3. **A rendered window into another world:** stencil/render-target effects,
   preview loading, clipping, and possibly continuous traversal. This is an
   optional rendering feature, not the definition of a portal.

Janus separates external navigation, preloading, and seamless behavior in its
portal implementation; Needle demonstrates stencil portals. Neither establishes
that arbitrary third-party worlds share identity, sessions, or trusted scripts.
[Janus portal](https://github.com/jbaicoianu/janusweb/blob/master/scripts/portal.js),
[Needle samples](https://engine.needle.tools/samples/)

World Factory should own the link record and action, and allow both HTML and XR
to activate it. Treat loading untrusted world data separately from executing
third-party code. Browser navigation may end an immersive session; do not
promise seamless cross-origin XR traversal without testing and an explicit protocol.

### Multiplayer, presence, avatars, and spatial voice

Assessment: these are related but distinct services. Presence reports who is in
a room; replication conveys permitted state changes; avatar rendering consumes
poses; voice transports audio. An avatar is not a user account, and a shared
transform is not an authorized business transaction.

Needle's room/ownership model is a useful reference. Its documentation identifies
a Workers/Durable Objects managed backend, but this does not make its engine
client or self-hosted server a ready-made World Factory dependency.
[Networking architecture](https://engine.needle.tools/docs/explanation/networking/architecture),
[deployment distinctions](https://engine.needle.tools/docs/how-to-guides/networking/custom-servers)

A later voice evaluation must cover real network conditions, TURN, mesh versus
SFU scaling, spatial playback, mute/block/report controls, and captions/text
alternatives. Durable Objects room coordination should not be mistaken for a
complete voice/video media service. No voice vendor is selected by this report.

### Mobile AR, anchors, and scene understanding

| Need | Research result |
| --- | --- |
| Quest/WebXR planes, meshes, hit tests, anchors | Use supported IWSDK systems first; check actual session features |
| Image tracking | Different from scene understanding; Needle offers documented device-dependent routes; 8th Wall needs module/binary boundary review |
| iPhone/iPad AR | Needle Go is an independent launch candidate; 8th Wall camera tracking is technically relevant but license-sensitive |
| Persistent shared anchors/geospatial localization | Not established by an ordinary session anchor; no provider selected |
| Hand tracking | Use IWSDK/WebXR where supported; the 8th Wall distributed binary explicitly omits its former hand-tracking feature |
| Gaussian splats | A visual representation, not a tracking system or navigation mesh; assess separately |

The sources for these distinctions are the
[IWSDK scene guide](https://iwsdk.dev/guides/11-scene-understanding.html),
[Needle iOS feature list](https://engine.needle.tools/docs/how-to-guides/xr/ios-webxr-app-clip),
and [8th Wall binary inventory](https://github.com/8thwall/engine).

### Accessibility and cross-device requirements remain World Factory-owned

None of the reviewed sources establishes that adopting an engine makes a
complete recipe conform to WCAG 2.2 AA. Needle's semantic mirroring is a useful
pattern, but hidden accessible elements alone do not solve visible focus,
reflow, input alternatives, understandable content, or complete task access.
[Needle accessibility](https://engine.needle.tools/docs/how-to-guides/accessibility)

Apply [World Factory's accessibility requirements](accessibility-requirements.md)
to shared content, reusable UI, preferences, locomotion, media, and validation.
Preserve the same records across HTML and XR. Test essential tasks without XR,
with keyboard/screen reader, touch, zoom/reflow, reduced motion, and seated use.
Physical-device and assistive-technology testing remains necessary.

### Commercial and integration gates before any future adoption

- Verify the exact package/version/license, transitive dependencies, and asset rights.
- Demonstrate the capability independently before considering another engine.
- Preserve IWSDK's renderer, input ownership, asset lifecycle, and local workflow.
- Measure download size, memory, frame time, failure recovery, and device support.
- Keep Cloudflare-first delivery and replaceable backend implementations; do not
  import a vendor hosting dependency just because its tutorial uses one.
- Separate build-time asset services from runtime dependencies and account contracts.
- Keep development agents separate from production user-facing AI agents and permissions.

## Unresolved questions and limits of this research

1. No Needle/8th Wall/Janus runtime was run in the workspace. Proposed IWSDK
   integration points, frame rates, mobile compatibility, and commercial SLAs
   remain unverified.
2. Needle documentation provides several iOS paths and versioned image-tracking
   APIs. Device/OS and route-specific support must be checked at evaluation time;
   no universal marker-count or anchor guarantee is made here.
3. 8th Wall's FAQ includes historical transition language. The current repository
   confirms the MIT project exists, but does not expand the separate binary license
   or establish ongoing binary support beyond its stated transition period.
4. Janus documentation mixes old and new workflows. Two multiplayer-related raw
   source fetches were unavailable, so detailed current voice transport behavior
   was not verified; the conflicting README voice statements are left explicit.
5. An independent commercial voice service, avatar standard/IK implementation,
   persistent shared-anchor provider, and mobile image-tracking provider are not
   selected. Naming these gaps is preferable to recommending whole engines.

## Outcome for ImmersiveWebsiteRecipe

Retain the existing IWSDK baseline. The first recipe needs World Factory-owned
structured content and accessible conventional navigation before advanced
portals, synchronized avatars, voice, splats, or mobile tracking become required.
The research supports selective capability evaluation later, not an engine
change or immediate expansion of dependencies.

No implementation follows this report.
