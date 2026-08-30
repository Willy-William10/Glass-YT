# Glass YT version log

## 2.5.0 — Surface and Shorts correction

- Restored the normal-height YouTube masthead and removed the card-zoom controls and transforms.
- Removed the redundant search submit button while retaining keyboard search with Enter.
- Replaced the YouTube wordmark with the Glass YT icon in a single circular glass surface.
- Changed the page canvas from white/transparent fallback to a tinted translucent liquid-glass background.
- Restored the native vertical Shorts player layout while ensuring its video frame remains crisp.
- Consolidated the visual system so blur is limited to intentional glass surfaces: top bar, sidebar, search surface, and category pills.
- Added a lightweight, optional Ad Blocker that hides known YouTube ad slots and uses YouTube's own skip control when it appears.

## 2.0.0 — Liquid surface repair

- Added full-page theme/background tokens, not only button styling.
- Removed the logo background tile and flattened nested hover surfaces.
- Added persistent card hover zoom/lift controls.
- Added text-only, soft-pill, and glass-pill chip modes.
- Added an optional animated glow sweep; it is off by default.
- Added rounded, single-surface menu hover states for Home, Shorts, Subscriptions, and You.
- Added version markers to the manifest, popup, options page, and README.
- v2.0 polish: compacted the masthead, cropped the native logo to a glass play circle, and added a single sticky settings header surface.

## Verification status

- Source syntax, manifest JSON, CSS brace balance, and configuration normalization validated.
- Live Brave tab was connected earlier for DOM inspection and physical card-hover testing.
- Live DOM inspection confirmed YouTube promotes the playing thumbnail into a global `#video-preview` overlay; v2.0 now styles that overlay directly.
- The latest logo-crop/header rules require a manual extension reload before the final screenshot verification.
