# AnimeStream Project TODO

## Database & Schema
- [x] Design anime table schema (title, description, genre, episodes, cover image, etc.)
- [x] Design user subscription table (premium status, expiry date, etc.)
- [x] Design admin logs table (for tracking admin actions)
- [x] Extend drizzle schema with anime, subscription, and admin tables
- [x] Push database migrations with `pnpm db:push`

## Backend API (tRPC Procedures)
- [x] Create anime listing procedure (public, with filtering/pagination)
- [x] Create anime detail procedure (public)
- [x] Create anime upload procedure (admin/owner only)
- [x] Create anime update procedure (admin/owner only)
- [x] Create anime delete procedure (admin/owner only)
- [x] Create user subscription management procedures
- [x] Create admin user management procedures (promote to admin, manage roles)
- [x] Create admin logs/audit trail procedures

## Frontend Pages & Components
- [x] Create anime-style dark theme (colors, fonts, styling in index.css)
- [x] Build landing/home page with featured anime
- [x] Build anime listing page with search, filter, pagination
- [x] Build anime detail page with full information
- [ ] Build user profile/account page
- [x] Build admin panel layout (dashboard)
- [x] Build admin anime upload/management interface
- [x] Build admin user management interface
- [ ] Build premium subscription page/modal

## Authentication & Authorization
- [x] Implement role-based access control (user, admin, owner)
- [x] Add owner identification (gtartup@gmail.com)
- [x] Protect admin routes and procedures
- [x] Add role badges/indicators in UI
- [x] Implement permission checks for anime upload/edit/delete

## User Features
- [x] Add favorite/watchlist functionality for regular users
- [x] Add premium tier features (ad-free, higher quality, etc.)
- [ ] Add user profile customization
- [ ] Add notification system for new anime

## Admin Features
- [x] Admin dashboard with statistics
- [x] Anime upload interface with form validation
- [x] Bulk anime management (via admin panel)
- [x] User management interface (view, promote to admin, manage subscriptions)
- [x] Activity logs and audit trail

## UI/UX Polish
- [x] Responsive design for mobile/tablet/desktop
- [x] Loading states and skeletons
- [x] Error handling and user feedback (toasts)
- [x] Empty states for lists
- [x] Anime-style animations and transitions

## Testing & Deployment
- [x] Test authentication flow
- [x] Test role-based access control
- [x] Test anime upload/edit/delete
- [ ] Create checkpoint before deployment
- [ ] Deploy to production

## Optional Enhancements
- [x] Search functionality with autocomplete
- [ ] Anime recommendations based on genre
- [ ] User ratings and reviews
- [ ] Social features (sharing, following)
- [ ] Email notifications
