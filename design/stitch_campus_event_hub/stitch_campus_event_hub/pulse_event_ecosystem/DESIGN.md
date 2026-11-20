---
name: Pulse Event Ecosystem
colors:
  surface: '#121318'
  surface-dim: '#121318'
  surface-bright: '#38393f'
  surface-container-lowest: '#0d0e13'
  surface-container-low: '#1a1b21'
  surface-container: '#1e1f25'
  surface-container-high: '#292a2f'
  surface-container-highest: '#34343a'
  on-surface: '#e3e1e9'
  on-surface-variant: '#cdc2d8'
  inverse-surface: '#e3e1e9'
  inverse-on-surface: '#2f3036'
  outline: '#968da1'
  outline-variant: '#4b4455'
  surface-tint: '#d4bbff'
  primary: '#d4bbff'
  on-primary: '#41008b'
  primary-container: '#8a3ffc'
  on-primary-container: '#faf1ff'
  inverse-primary: '#7825ea'
  secondary: '#ffb5a0'
  on-secondary: '#5f1500'
  secondary-container: '#d73b00'
  on-secondary-container: '#fffbff'
  tertiary: '#00dbe9'
  on-tertiary: '#00363a'
  tertiary-container: '#007c84'
  on-tertiary-container: '#d7fbff'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ebdcff'
  primary-fixed-dim: '#d4bbff'
  on-primary-fixed: '#270058'
  on-primary-fixed-variant: '#5d00c2'
  secondary-fixed: '#ffdbd1'
  secondary-fixed-dim: '#ffb5a0'
  on-secondary-fixed: '#3b0900'
  on-secondary-fixed-variant: '#862200'
  tertiary-fixed: '#7df4ff'
  tertiary-fixed-dim: '#00dbe9'
  on-tertiary-fixed: '#002022'
  on-tertiary-fixed-variant: '#004f54'
  background: '#121318'
  on-background: '#e3e1e9'
  surface-variant: '#34343a'
typography:
  display-hero:
    fontFamily: Space Grotesk
    fontSize: 56px
    fontWeight: '700'
    lineHeight: 64px
    letterSpacing: -0.03em
  display-hero-mobile:
    fontFamily: Space Grotesk
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 42px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Space Grotesk
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: 0em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-mono-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.04em
  label-mono-xs:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '600'
    lineHeight: 12px
    letterSpacing: 0.06em
  label-ui:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.01em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2.5rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

The design system embodies the spontaneous, electric atmosphere of campus culture translated into a focused, high-utility digital canvas. The platform is targeted at three distinct demographics operating within a shared ecosystem: discovery-driven undergraduate students, detail-oriented campus organizers, and compliance-minded university administrators. 

The aesthetic marries **Glassmorphism** with **High-Contrast Digital Modernism**. Dense, obsidian substrates recede into the backdrop, allowing neon-infused glass surfaces, lucid status pills, and reactive energy states to dictate visual priority. The emotional response is intentional: anticipation, effortless control, and modern collegiate prestige. 

Atmospheric layers rely on directional light sources, frosted refraction filters, and vibrant color spikes that trigger dopamine without causing optical fatigue during late-night event discovery or ticketing blitzes.

## Colors

The color architecture is built strictly on an emissive dark spectrum where light glows outward from interactive nodes rather than reflecting downward.

- **Primary (`#8A3FFC` - Electric Violet)**: The navigational spine and primary interaction signal. Used for core interactive elements, key callouts, selected role states, and glass highlight borders.
- **Secondary (`#FF5722` - Neon Coral/Amber)**: The velocity and urgency trigger. Drives live counters, "Selling Out" alerts, ticket access states, and pulse badges.
- **Tertiary (`#00F0FF` - Cyan Spike)**: Used sparingly for real-time telemetry, mock user indicator states, active scanner confirmations, and role distinction for administrators.
- **Neutral (`#0A0B10` - Deep Void)**: An ink-toned, blue-black foundation that prevents the dirty gray tone common to standard dark modes. 

### Surface Roles
- **Base Canvas**: `#0A0B10`
- **Surface Elevation 1 (Deep Cards)**: `rgba(20, 22, 34, 0.75)`
- **Surface Glass (Interactive Cards)**: `rgba(29, 32, 51, 0.60)` with `backdrop-filter: blur(16px)`
- **Border Subtle**: `rgba(255, 255, 255, 0.08)`
- **Border Active / Edge Glow**: `rgba(138, 63, 252, 0.40)`
- **Text High-Contrast**: `#F4F5F8`
- **Text Subdued**: `#9496A8`

## Typography

Typography drives the collision between high-octane editorial energy and technical precision:

- **Display & Headlines (`Space Grotesk`)**: Geometric and sharp. Gives student headlines and event line-ups an architectural, modern look while maintaining extreme legibility at glance speed.
- **Body & Interface (`Plus Jakarta Sans`)**: Neutralized, friendly, and highly legible across dense schedules and ticket configuration panels.
- **Technical & Indicators (`JetBrains Mono`)**: Strict, tabular, and compact. Exclusively reserved for system state badges, countdown timers, role identifiers, and Mock User telemetry strings (`ID: #STU-9921`).

Headlines at or above 32px automatically step down on mobile breakpoints to preserve horizontal line-budget in multi-column ticket views.

## Layout & Spacing

The layout is built around a dynamic 12-column responsive fluid grid pinned within an outer max-width container of `1440px`.

- **Desktop (>= 1200px)**: 12-column layout with `2.5rem` outer margins and `1.5rem` gutters. Accommodates multi-column discovery feeds, secondary role-management toolbars, and event preview drawers.
- **Tablet (768px - 1199px)**: 8-column layout with `1.5rem` outer margins and `1.25rem` gutters. Sidebars fold into an expandable floating overlay drawer.
- **Mobile (< 768px)**: 4-column layout with `1rem` outer canvas padding and `1rem` gutters. Top nav collapses into a bottom thumb-anchored navigation dock, maintaining quick access to role pickers and quick pass displays.

Spacing follows an explicit `4px` grid (`0.25rem` intervals), eliminating arbitrary margins. Component gaps favor high density in data views (e.g., ticket tables) and breathability in high-retention discovery feeds.

## Elevation & Depth

Visual hierarchy uses **Glassmorphism stacked over deep tonal planes** rather than physical drop shadows.

1. **Canvas Layer (Base)**: Solid `#0A0B10`. Carries faint radial glows (`rgba(138, 63, 252, 0.08)`) positioned under featured events or role-toggles.
2. **Level 1 (Structural Modules & Shelves)**: Solid translucent slate (`rgba(18, 20, 31, 0.85)`), hairline top border `rgba(255, 255, 255, 0.05)`.
3. **Level 2 (Interactive Event Cards)**: Frosted glass composition (`background: rgba(29, 32, 51, 0.60)`, `backdrop-filter: blur(16px)`). Bound by a dual stroke: an inner hairline border of `rgba(255, 255, 255, 0.10)` and an ambient bottom drop glow `0 12px 32px -8px rgba(0, 0, 0, 0.7)`.
4. **Level 3 (Modals, Role Panels, Dropdowns)**: Elevated frosted glass (`rgba(22, 24, 38, 0.92)`, `backdrop-filter: blur(24px)`), rim light border `1px solid rgba(138, 63, 252, 0.35)`, deep occlusion drop shadow `0 24px 48px -12px rgba(0, 0, 0, 0.85)`.
5. **Interactive Glow**: Hovering interactive items triggers an internal light reflection (`box-shadow: inset 0 0 16px rgba(138, 63, 252, 0.2)`) and edge transition to `rgba(255, 87, 34, 0.5)`.

## Shapes

The design system uses a calibrated rounded geometry (Token `2` - Base `0.5rem` / `8px`):

- **Micro elements (Badges, Monospace IDs, Checkbox hooks)**: `0.375rem` (`6px`) for clean structural cohesion.
- **Controls & Buttons**: `0.5rem` (`8px`) maintains a tactile, digital feel without the generic softness of pill buttons.
- **Containers & Glass Cards**: `1rem` (`16px`) creates distinct silhouette boundaries against the dark void.
- **Overlays, Floating Navigation Docks, & Dialogs**: `1.5rem` (`24px`) gives major modals a confident, framed appearance.

## Components

### Buttons
- **Primary (Electric Action)**: Gradient background `linear-gradient(135deg, #8A3FFC 0%, #6929C4 100%)`, text white, `0.5rem` border radius, padding `0.625rem 1.25rem`. Glow shadow `0 4px 16px rgba(138, 63, 252, 0.35)`.
- **Secondary / Urgent (Neon Coral)**: Gradient `linear-gradient(135deg, #FF5722 0%, #D84315 100%)`, white text. Reserved for purchase/RSVP and live events.
- **Ghost / Glass**: Background `rgba(255, 255, 255, 0.05)`, border `1px solid rgba(255, 255, 255, 0.12)`, hover state `background: rgba(255, 255, 255, 0.10)`.

### Role-Switching Dropdown & Mock User ID Selector
- **Container**: Elevated glass capsule placed in the global header or navigation dock. Features dual interactive zones.
- **Role Indicator Segment**: Displays a role-coded badge (`Student`: `#8A3FFC`, `Organizer`: `#FF5722`, `Admin`: `#00F0FF`). Clicking reveals a frosted menu listing roles with permission summaries and instant hot-switching animation.
- **Mock User ID Segment**: Compact `JetBrains Mono` string (e.g., `UID: #STU-4819`) adjacent to an avatar chip. Interacting triggers an identity selector drawer allowing previewing as test student cohorts, campus org heads, or system auditors.

### Glassmorphism Cards
- Composed of 16px blurred acrylic layer with subtle top-to-bottom border gradients (top: `rgba(255, 255, 255, 0.18)`, bottom: `rgba(255, 255, 255, 0.02)`).
- Visual header holds an image or dynamic gradient canvas, followed by event timestamp, category chip, and an instant RSVP button on hover.

### Badges & Dynamic Indicators
- **Live Indicator**: Pill shaped, background `rgba(255, 87, 34, 0.15)`, text `#FF5722`, containing a 6px pulsing dot (`animation: pulse 1.5s infinite`).
- **Role Pills**: Monospaced small label (`label-mono-xs`), border `1px solid currentColor`, uppercase with letter-spacing `0.06em`.

### Form Inputs & Select Fields
- Dark well background `rgba(10, 11, 16, 0.6)`.
- Border `1px solid rgba(255, 255, 255, 0.1)`. Focus state creates a sharp transition: border changes to `#8A3FFC` accompanied by an exterior glow `0 0 0 3px rgba(138, 63, 252, 0.25)`.
- Helper labels render in `JetBrains Mono` to cleanly separate meta-instruction from user input.

### Checkboxes & Segmented Toggles
- Custom square-rounded boxes (`0.25rem` radius). Unchecked: `rgba(255, 255, 255, 0.1)` border. Checked: `#8A3FFC` fill with a crisp white check vector.