# Property Pulse

A rental property browsing app built as a learning project. This repository currently focuses on the frontend; property data and photos are stored locally so the app can run without a database or external service accounts.

## Current features

- Home page with featured and recent properties
- Property listing with location and type filters
- Pagination that preserves the selected filters
- Individual property pages with rates, amenities, contact details, and photo galleries
- Responsive page layouts and custom error / not-found pages

Authentication, adding and editing listings, messages, bookmarks, image uploads, and a database are planned for later stages. Some navigation controls for these features are currently visual placeholders.

## Built with

- Next.js 16 (App Router), React 19, and TypeScript
- Tailwind CSS 4 and React Icons
- Local JSON data and images during the frontend phase

## Run locally

Install dependencies and start the development server:

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`. No environment variables or database are required for the current version.

To check the project:

```bash
npm run lint
npm run build
```

## Project structure

| Path | Purpose |
| --- | --- |
| `app/page.tsx` | Home page |
| `app/properties/page.tsx` | Browse, filter, and paginate properties |
| `app/properties/[id]/page.tsx` | Property details |
| `app/components/` | Shared UI components |
| `data/properties.json` | Temporary sample listings |
| `data/properties.ts` | Property type and local image helper |
| `public/images/properties/` | Sample property photos |

## Learning project credit

This is an independent practice implementation inspired by Brad Traversy's Property Pulse project and its supplied HTML theme. It is being built step by step, with a database and other backend features to follow. The current sample photos and branding come from the reference materials.
