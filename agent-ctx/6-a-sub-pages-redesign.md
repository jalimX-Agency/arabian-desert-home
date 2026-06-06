# Task 6-a — Sub-pages Redesign Agent

## Task
Redesign sub-pages for "Desert Aurora" — les-tentes, suite-chorfa, suite-junior, suite-familiale

## Files Modified

1. **`/src/app/les-tentes/page.tsx`** — Complete rewrite
   - Added `useLanguage` import and usage
   - All `terracotta` → `amber`, `obsidian` → `warm-black`
   - Hero: gradient-warm + gradient-amber overlays, blob shapes, grain-overlay, scroll indicator with amber dot
   - Section numbers: text-amber/10
   - Suite cards: rounded-2xl images, rounded-full feature pills, amber accents, amber subtle glow
   - Featured badge: rounded-full bg-amber/90
   - CTA: bg-warm-black, btn-primary, divider-accent-wide, decorative blobs

2. **`/src/components/arabian/SuiteDetailPage.tsx`** — Complete rewrite
   - All `terracotta` → `amber`, `obsidian` → `warm-black`
   - Hero: gradient-warm + gradient-diagonal-warm + gradient-amber, blob, grain-overlay
   - Image nav: rounded-full glass circles with backdrop-blur-xl
   - Image dots: rounded-full amber pills (active: bg-amber w-8 h-2)
   - Quick stats: rounded-full pills with bg-white/[0.06] backdrop-blur
   - Features: glass-card card-warm rounded cards with rounded-full checkmark icons
   - Gallery: rounded-2xl images with amber hover tint + rounded-xl inner frame
   - Sidebar: glass-card card-warm for price + amenities cards
   - Sidebar icons: rounded-full border-amber/15 bg-amber/10 containers
   - Book button: btn-primary rounded-full pill
   - Bottom CTA: bg-warm-black, btn-primary, decorative blobs, grain-overlay

3. **`/src/app/suite-chorfa/page.tsx`** — No changes (thin wrapper)
4. **`/src/app/suite-junior/page.tsx`** — No changes (thin wrapper)
5. **`/src/app/suite-familiale/page.tsx`** — No changes (thin wrapper)

## Key Design Decisions
- Suite detail wrapper pages left unchanged since they correctly delegate to SuiteDetailPage component
- Desert Aurora CSS utility classes used consistently: glass-card, card-warm, grain-overlay, gradient-warm, gradient-amber, gradient-diagonal-warm, divider-accent, divider-accent-wide, btn-primary, blob-1/2/3, pattern-dots
- All smooth easing: [0.25, 0.46, 0.45, 0.94]
- All clickable elements: cursor-pointer
- Lint: zero errors
