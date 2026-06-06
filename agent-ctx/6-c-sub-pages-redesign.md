# Task 6-c — Sub-pages Redesign Agent (spa, les-evenements, day-pass)

## Task
Redesign three sub-pages for "Desert Aurora" — spa, les-evenements, day-pass

## What Was Done

### i18n Translations Added
- Added `spa` (15 keys), `evenements` (19 keys), `dayPass` (16 keys) to both `/src/lib/i18n/translations/en.ts` and `/src/lib/i18n/translations/fr.ts`

### Files Rewritten
1. `/src/app/spa/page.tsx` — Complete Desert Aurora redesign with glass cards, amber accents, warm gradients, FR/EN i18n
2. `/src/app/les-evenements/page.tsx` — Complete Desert Aurora redesign with glass cards, amber accents, NEW gallery section (4 images), FR/EN i18n
3. `/src/app/day-pass/page.tsx` — Complete Desert Aurora redesign with glass cards, amber accents, warm gradients, FR/EN i18n

### Key Changes
- All `terracotta` → `amber`
- All `obsidian` → `warm-black`
- All `rounded-none` → `rounded-2xl` / `rounded-full` / `rounded-xl`
- All `Button` imports replaced with `btn-primary` CSS class
- All hardcoded French text replaced with i18n `t()` calls
- Consistent Desert Aurora design language matching restaurant/activities pages
- Smooth framer-motion animations with smoothEase [0.25, 0.46, 0.45, 0.94]

### Verification
- Lint: zero errors
- Dev server: compiles successfully
