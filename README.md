# Ultramed.az Monorepo

Medical clinic website for Ultramed, Azerbaijan.

## Tech Stack
- **Frontend**: Next.js (Apps/Web)
- **Backend**: NestJS (Apps/API)
- **Database**: MySQL with Prisma (Packages/Database)
- **Styling**: Tailwind CSS & Shadcn UI
- **Languages**: Azerbaijani, English, Russian (i18n)
- **DevOps**: Docker & Docker Compose

## Structure
- `apps/web`: Next.js frontend
- `apps/api`: NestJS backend
- `packages/database`: Shared Prisma client and schema
- `packages/ui`: Shared UI components (Radix + Tailwind)

## Setup
1. Install dependencies: `npm install`
2. Configure environment: Copy `.env.example` to `.env` (once created)
3. Run development: `npm run dev`

## Admin Media Management and Orphan Cleanup

This project includes a safe media lifecycle flow for uploaded files.

### Why this was added

When admins upload images, two things are created:
- a physical file under `/uploads`
- a `Media` row in the database

Over time, some media records become unreferenced (orphan media).  
Without cleanup, storage grows and management becomes harder.

### Backend behavior

Implemented in:
- `apps/api/src/modules/admin/admin.service.ts`
- `apps/api/src/modules/admin/admin.controller.ts`
- `apps/api/src/modules/admin/admin.constants.ts`

Key points:
- `GET /admin/media` now returns usage counts (`services`, `doctors`, `blogPosts`, `galleryItems`, `total`) and `isOrphan`.
- `DELETE /admin/media/:id` is protected:
  - if media is still referenced, it returns `409 MEDIA_IN_USE`.
- `POST /admin/media/cleanup-orphans` supports safe batch cleanup.
- Cleanup is **dry-run by default** (if `dryRun` is not provided, no delete happens).
- Cleanup supports:
  - `limit`
  - `olderThanHours`
  - `dryRun`

Default limits:
- `DEFAULT_MEDIA_CLEANUP_GRACE_HOURS = 24`
- `DEFAULT_MEDIA_CLEANUP_BATCH_LIMIT = 100`

### API examples

- List all media:
  - `GET /admin/media?limit=100`
- List orphan-only media:
  - `GET /admin/media?orphansOnly=true&olderThanHours=24&limit=100`
- Dry-run cleanup:
  - `POST /admin/media/cleanup-orphans?dryRun=true&olderThanHours=24&limit=100`
- Execute cleanup:
  - `POST /admin/media/cleanup-orphans?dryRun=false&olderThanHours=24&limit=100`

### Admin panel usage

UI route:
- `/{locale}/admin/media`  
  Examples:
  - `/az/admin/media`
  - `/en/admin/media`
  - `/ru/admin/media`

Implemented in:
- `apps/web/src/app/[locale]/admin/media/page.tsx`
- `apps/web/src/components/admin/Sidebar.tsx`
- `apps/web/src/lib/admin-api.ts`

How to use:
1. Open **Admin > Media** from the sidebar.
2. Set filters:
   - `Limit`
   - `Older than hours`
   - `Orphans only` (optional)
3. Click **Dry-run** first and review the candidate list.
4. If the output is correct, click **Cleanup başlat** to execute deletion.
5. Use **Refresh** to reload current media state.

Safety notes:
- Single-item delete is disabled for in-use media in UI and also enforced by backend.
- Cleanup can skip records that become referenced during execution (`skipped_in_use`).
- Cleanup output includes file deletion states:
  - `deleted`
  - `deleted_file_missing`
  - `deleted_file_error`
