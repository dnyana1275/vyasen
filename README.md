# School SMS

The initial School SMS monorepo scaffold uses pnpm workspaces and Turborepo.
The first frontend slice is a static React 19 application; it does not connect
to authentication, an API, or a database yet.

## Requirements

- Node.js 24 or newer
- pnpm 12

## Getting started

```sh
pnpm install
pnpm dev
```

The Vite app runs at `http://localhost:3000`. To validate the workspace:

```sh
pnpm typecheck
pnpm build
```

Copy `.env.example` to `.env` if you want to customize local frontend settings.

## Workspace layout

```text
apps/
  api/              Reserved for future API work; intentionally unimplemented
  web/              React, Vite, TanStack Router and Query
packages/
  config/           Reserved for shared configuration
  contracts/        Shared role schema and TypeScript types
  database/         Reserved for future database work
```

The router uses a pathless authenticated route group for the dashboard and
settings pages, so their browser paths are `/dashboard` and `/settings`.
Settings include `/settings/appearance` and `/settings/sidebar`. Appearance
and sidebar preferences are validated and saved in the browser's local storage;
they are not yet synchronized between devices or stored per user or school.
The sidebar supports left, right, top, and bottom placement, and its preview
navigation changes with the selected demo role.

The current profile role selector and school switcher are visual previews only:
authentication, role permissions, and tenant isolation must be enforced by
future backend services, not by this static UI. Role-based navigation is not an
authorization boundary.
