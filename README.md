# Property Pulse

🔗 **Live demo:** [amirmohammad-dev.ir/projects/property-pulse](https://amirmohammad-dev.ir/projects/property-pulse)

A rental property browsing app built as a learning project, based on Brad Traversy's Property Pulse course.

## ✨ Features

- 🏠 Home page with featured and recent properties
- 🔍 Property listing with location and type filters
- 📄 Pagination that keeps the selected filters
- 📍 Property details with rates, amenities, contact info, and photo gallery
- 📱 Responsive layouts and custom error / not-found pages

## 🛠️ Built with

| Technology | Icon |
| --- | --- |
| Next.js 16 (App Router) | ![Next.js](https://img.shields.io/badge/Next.js_16-000000?logo=nextdotjs&logoColor=white) |
| React 19 | ![React](https://img.shields.io/badge/React_19-61DAFB?logo=react&logoColor=black) |
| TypeScript | ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white) |
| Tailwind CSS 4 | ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?logo=tailwindcss&logoColor=white) |
| React Icons | ![React Icons](https://img.shields.io/badge/React_Icons-E91E63?logo=react&logoColor=white) |

## 🚀 Run locally
```bash
npm ci
npm run dev
```

## 📁 Project structure

| Path | Purpose |
| --- | --- |
| `app/page.tsx` | Home page |
| `app/properties/page.tsx` | Browse, filter, and paginate properties |
| `app/properties/[id]/page.tsx` | Property details |
| `app/components/` | Shared UI components |
| `data/properties.json` | Sample listings |
| `data/properties.ts` | Property type and image helper |
| `public/images/properties/` | Sample property photos |

## 🙏 Credit

An independent practice implementation inspired by [Brad Traversy](https://github.com/bradtraversy)'s Property Pulse project and its HTML theme. Sample photos and branding come from the reference materials.
