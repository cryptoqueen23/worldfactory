# World Factory Cloudflare architecture requirements

World Factory will use a Cloudflare-first deployment and backend architecture.
This document defines requirements only; it does not authorize infrastructure
provisioning or changes to the working IWSDK application.

## Hosting and application

- Cloudflare Workers with Static Assets is the preferred deployment target.
- Do not introduce Vercel as a dependency for World Factory.
- The IWSDK application must remain usable during local development.
- Deployment infrastructure must not be tightly coupled to 3D/XR application code.

## Data

Cloudflare D1 is the preferred relational database for structured data.
Structured data may eventually include:

- Businesses
- Worlds
- Recipes
- Users
- Organizations
- Memberships
- Events
- Products
- Publications
- Content
- Configuration

These are potential data domains, not a requirement to create all tables now.
The same structured data must serve conventional HTML, mobile, and XR
presentations, consistent with the accessibility requirements.

## Asset storage

Cloudflare R2 is the preferred object-storage system for large assets, including:

- Images
- Video
- Audio
- 360 media
- GLB/3D models
- Textures
- Immersive media
- Generated media

## Real-time systems

Cloudflare Durable Objects may be used later for systems requiring coordinated
real-time state, such as:

- Multiplayer rooms
- Presence
- Collaborative sessions
- Events
- Live experiences

Introduce these capabilities only when a concrete product requirement needs them.

## Cache and configuration

- Cloudflare KV may be used where appropriate for cache or read-heavy
  configuration data.
- Do not use KV as a substitute for relational data that belongs in D1.
- Keep authoritative relational records in D1; any cached copies must have
  explicit consistency and invalidation expectations.

## Architecture boundaries

World Factory business logic must not directly depend on Cloudflare-specific
APIs throughout the application. Use clean service and repository interfaces
where practical so infrastructure implementations can be replaced later.

Examples of possible interfaces:

| Interface | Responsibility |
| --- | --- |
| `ContentRepository` | Access to structured content |
| `BusinessRepository` | Access to business records |
| `AssetStorage` | Storage and retrieval of asset files |
| `SessionStore` | Persistence and retrieval of session state |
| `RealtimeProvider` | Coordinated real-time interactions and state |

Cloudflare implementations may sit behind these interfaces. Keep Cloudflare
bindings, SDK types, and storage-specific details inside infrastructure adapters,
rather than exposing them through business contracts or IWSDK systems.

These names illustrate boundaries; they do not mandate creating every interface
immediately. Introduce abstractions as real features require them and keep the
architecture lean. The appropriate session storage implementation remains a
later decision based on its requirements.

## Current scope restrictions

- Do not provision Cloudflare resources yet.
- Do not create D1 databases yet.
- Do not create R2 buckets yet.
- Do not configure Durable Objects yet.
- Do not change the working IWSDK application.
- This task is documentation and architecture requirements only.

## Related requirements

- [Platform architecture](platform-architecture.md)
- [Accessibility and responsive design](accessibility-requirements.md)
