# Corporación La Otra Ciudad — Design System

## 1. Visual Theme & Atmosphere

La Otra Ciudad's system takes the structural discipline of a precision design tool — granular variable-weight typography, tight tracking, pill-and-circle geometry, selection-handle focus outlines — and warms it through. Where the source aesthetic kept its interface strictly black-and-white and let color live only in product content, LOC inverts that decision deliberately: this is a brand with a voice, so warmth and color belong in the chrome itself.

The base is not pure neutral but a warm off-black (`#1a1410`) on a warm off-white (`#f7f3ee`), giving the whole surface an earthy, paper-like temperature rather than the clinical contrast of `#000`/`#fff`. Against that warm ground sits a four-color brand palette — burnt orange, teal, cobalt, and a hot pink-red — deployed through gradients rather than flat fills. The hero gradient runs orange → pink → teal; a softer accent gradient moves teal → olive. This is the signature: a tool-grade typographic skeleton wearing the colors of a youth-led, community-rooted urbanism practice in Medellín.

Typography carries the sophistication. Fraunces — a variable serif with optical-size, softness, and "wonk" axes — handles display and editorial moments, set soft and high-contrast at large optical sizes. Inter, variable across weight and optical size, does all the structural and body work. The body register sits light (weight 250–300, below typical "regular"), creating an airy, considered reading texture. Tracking is negative almost everywhere, compressing display text hard (-1.72px) and keeping even body text quietly tight. Space Mono in uppercase, with positive letter-spacing, provides technical signpost labels.

**Key Characteristics:**
- Warm off-black `#1a1410` on warm off-white `#f7f3ee` — never pure black/white for type and ground
- Four-color brand palette (orange, teal, cobalt, pink) expressed through gradients, present in the chrome by design
- Fraunces variable serif (opsz / SOFT / WONK / wght) for display and editorial; Inter variable for everything structural
- Light-weight body register (250–300) for an airy, editorial feel
- Negative letter-spacing throughout — even body text at -0.14px to -0.26px
- Pill (50px) and circular (50%) button geometry
- Dashed 2px focus outlines — a deliberate, accessible signature
- Space Mono uppercase labels with positive tracking
- OpenType `"kern"`, `"liga"`, `"calt"` enabled globally

## 2. Color Palette & Roles

### Brand
- **Burnt Orange** (`#e2611d`): Primary brand color; gradient anchor.
- **Teal** (`#609d92`): Secondary brand color; gradient terminus and accent.
- **Cobalt** (`#3b6bdc`): Tertiary brand accent for links, highlights, and data emphasis.
- **Pink-Red** (`#e6224f`): High-energy accent; midpoint of the hero gradient.

### Base
- **Warm Off-Black** (`#1a1410`): All primary text, solid dark buttons, borders. The brand's "black."
- **Warm Off-White** (`#f7f3ee`): Primary page background and warm surfaces.
- **Pure White** (`#ffffff`): Reserved for elevated card surfaces that need to lift off the warm ground.

### Foreground tints (warm-derived)
- **fg1** `#1a1410`: Primary text.
- **fg2** `rgba(26, 20, 16, 0.55)`: Secondary text, captions.
- **fg3** `rgba(26, 20, 16, 0.35)`: Tertiary text, disabled states.

### Background surfaces
- **bg1** `#f7f3ee`: Primary warm background.
- **bg2** `#f5f4f0`: Subtly differentiated panel background.
- **bg-dark** `#1a1208`: Deep warm background for footers and dark sections.

### Glass overlays
- **Glass Dark** `rgba(0, 0, 0, 0.08)`: Secondary circular buttons on light surfaces.
- **Glass Light** `rgba(255, 255, 255, 0.20)`: Frosted overlay for buttons on dark/colored surfaces.

### Gradient system
- **Hero Gradient** `linear-gradient(135deg, #e2611d 0%, #e6224f 45%, #609d92 100%)`: Orange → pink → teal. The visual signature; used full-width behind hero content.
- **Soft Accent Gradient** `linear-gradient(135deg, #609d92 0%, #a4a97d 100%)`: Teal → olive. Calmer sections, secondary showcases.

*Note: Unlike the monochrome source aesthetic, LOC intentionally carries brand color into the interface chrome. The warm base palette keeps it grounded; color appears as gradient, not flat fill.*

## 3. Typography Rules

### Font Families
- **Display / Serif**: `Fraunces`, fallbacks `Georgia, serif`. Variable axes: opsz, SOFT, WONK, wght. Has an Italic axis.
- **Body / UI**: `Inter`, fallbacks `system-ui, helvetica, sans-serif`. Variable axes: opsz, wght. Has an Italic axis.
- **Mono / Labels**: `Space Mono`, fallbacks `SF Mono, Menlo, monospace`. Google Fonts fallback — no brand mono provided.

### Variable weight stops

| Token | Value | Role |
|-------|-------|------|
| Hairline | 200 | Lightest body |
| Thin | 250 | Default body weight |
| Extralight | 300 | Light sub-heads, light body |
| Regular | 400 | Display, buttons, base |
| Medium | 500 | Emphasis |
| Semibold | 600 | Sub-heading emphasis |
| Bold | 700 | Feature titles |

### Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |
|------|------|------|--------|-------------|----------------|-------|
| Display (Serif) | Fraunces | 86px (5.375rem) | 400 | 1.00 | -1.72px | Hero headline; `opsz 144, SOFT 50, WONK 0` |
| Display (Sans) | Inter | 86px (5.375rem) | 400 | 1.00 | -1.72px | Alternate display when serif is too editorial |
| Section Heading (H1) | Inter | 64px (4rem) | 400 | 1.10 | -0.96px | Feature section titles |
| Sub-heading (H2) | Inter | 26px (1.625rem) | 600 | 1.35 | -0.26px | Emphasized section text |
| Sub-heading Light | Inter | 26px (1.625rem) | 300 | 1.35 | -0.26px | Light-weight section text |
| Feature Title (H3) | Inter | 24px (1.5rem) | 700 | 1.45 | normal | Bold card headings |
| Body Large | Inter | 20px (1.25rem) | 250 | 1.35 | -0.14px | Descriptions, intros |
| Body | Inter | 16px (1rem) | 250 | 1.40 | -0.14px | Standard body, nav, buttons |
| Body Light | Inter | 18px (1.125rem) | 200 | 1.45 | -0.26px | Light-weight body text |
| Mono Label | Space Mono | 18px (1.125rem) | 400 | 1.30 | 0.54px | Uppercase section labels |
| Mono Small | Space Mono | 12px (0.75rem) | 400 | 1.00 | 0.60px | Uppercase tiny tags |

### Principles
- **Serif for voice, sans for structure**: Fraunces appears at display sizes and editorial moments; Inter does all structural and body work. Don't set long body copy in Fraunces.
- **Optical sizing matters**: Fraunces display is set at high optical size (`opsz 144`) with softened terminals (`SOFT 50`) for a warm, high-contrast headline. Inter inherits its optical axis automatically at size.
- **Light as the base**: Body text uses weight 250 (Thin) — lighter than typical 400 — for an airy, editorial reading texture. Body Light drops to 200.
- **Kern everywhere**: `"kern"`, `"liga"`, and `"calt"` are enabled globally — not optional.
- **Negative tracking by default**: Body sits at -0.14px to -0.26px; display compresses to -0.96px and -1.72px.
- **Mono for structure**: Space Mono in uppercase with positive letter-spacing (0.54px–0.60px) creates technical signpost labels.

## 4. Component Stylings

### Buttons

All buttons: inline-flex, centered, `gap 8px`, no border, `"kern"` enabled, `opacity 0.82` on hover (150ms linear), and a **dashed 2px focus outline** (`outline: 2px dashed currentColor; outline-offset: 3px`).

**Black Solid (Pill)**
- Background: Warm Off-Black `#1a1410`
- Text: Warm Off-White `#f7f3ee`
- Radius: pill (50px) · Padding: `10px 20px`
- Maximum emphasis

**White Pill**
- Background: Warm Off-White `#f7f3ee`
- Text: Warm Off-Black `#1a1410`
- Radius: pill (50px) · Padding: `8px 18px 10px` (asymmetric vertical)
- Standard CTA on dark/colored surfaces

**Glass Dark**
- Background: `rgba(0, 0, 0, 0.08)`
- Text: Warm Off-Black · Radius: circle (50%) · 40×40px
- Secondary action on light surfaces

**Glass Light**
- Background: `rgba(255, 255, 255, 0.20)`
- Text: Warm Off-White · Radius: circle (50%) · 40×40px
- Secondary action on dark/colored surfaces

### Cards & Containers
- Background: Pure White `#ffffff` (lifts off the warm ground) or bg2 `#f5f4f0`
- Radius: 6px (small containers), 8px (cards, images, dialogs)
- Shadow: subtle to medium elevation (see §6)

### Navigation
- Clean horizontal nav on warm off-white
- Logo: LOC wordmark in warm off-black
- Links: warm off-black text, 1px underline; hover via cobalt or opacity
- CTA: Black pill button

### Distinctive Components

**Hero Gradient Section**
- Full-width `135deg` orange → pink → teal gradient
- White or warm off-white text overlay with 86px display heading (Fraunces)
- White pill CTA floating within the gradient

**Dashed Focus Indicators**
- All interactive elements use `dashed 2px` outline on focus — the signature accessibility pattern

## 5. Layout Principles

### Spacing System
- Base unit: 8px
- Scale: 4px, 8px, 12px, 16px, 24px, 32px, 40px, 48px, 64px, 80px

### Border Radius Scale
- **xs** (2px): Small link elements
- **sm** (6px): Small containers, dividers
- **md** (8px): Cards, images, dialogs
- **pill** (50px): Buttons, tabs, CTAs
- **full** (50%): Icon buttons, circular elements

### Whitespace Philosophy
- **Editorial pacing**: Generous spacing lets each section breathe.
- **Color as punctuation**: Gradient sections provide chromatic rhythm against the calmer warm-neutral sections.

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat (Level 0) | No shadow | Page background, most text |
| Surface (Level 1) | `--shadow-sm`: `0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)` | Resting cards |
| Elevated (Level 2) | `--shadow-md`: `0 4px 16px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)` | Floating cards, hover |
| Lifted (Level 3) | `--shadow-lg`: `0 12px 40px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.08)` | Modals, key surfaces |

**Shadow Philosophy**: Used sparingly. Primary depth comes from background contrast — white cards on the warm ground, and content on the colored gradients.

## 7. Do's and Don'ts

### Do
- Use the warm base: `#1a1410` text on `#f7f3ee` ground — it's the brand's temperature
- Carry brand color into the chrome through gradients (hero: orange→pink→teal; soft: teal→olive)
- Use Fraunces for display and editorial moments only; Inter for everything structural
- Keep the body register light (weight 250) for an airy, editorial feel
- Apply dashed 2px focus outlines — the signature accessibility pattern
- Enable `"kern"`, `"liga"`, `"calt"` on all text
- Use Space Mono uppercase with positive letter-spacing for labels
- Apply negative letter-spacing on display and body; positive only on mono labels
- Use pill (50px) and circular (50%) geometry for interactive elements

### Don't
- Don't use pure `#000`/`#fff` for text and ground — the warmth is the point (pure white is allowed only for elevated card surfaces)
- Don't set long body copy in Fraunces — it's a display/editorial serif here
- Don't push body weight above 400 — the light register is core
- Don't use solid focus outlines — dashed is the signature
- Don't use sharp corners on buttons — pill and circular only
- Don't use positive letter-spacing on body text — it's always negative
- Don't make `fg2`/`fg3` neutral gray — derive them from the warm black (`rgba(26, 20, 16, …)`)

## 8. Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|------|-------|-------------|
| Small Mobile | <560px | Compact, stacked layout |
| Tablet | 560–768px | Minor adjustments |
| Small Desktop | 768–960px | 2-column layouts |
| Desktop | 960–1280px | Standard layout |
| Large Desktop | 1280–1440px | Expanded |
| Ultra-wide | 1440–1920px | Maximum width |

### Collapsing Strategy
- Hero display: 86px → 64px → 48px
- Feature sections: stacked single column on mobile
- Footer: multi-column → stacked

## 9. Agent Prompt Guide

### Quick Color Reference
- Text / dark surfaces: "Warm Off-Black (#1a1410)"
- Ground / light surfaces: "Warm Off-White (#f7f3ee)"
- Card surfaces: "Pure White (#ffffff)"
- Brand: orange #e2611d, teal #609d92, cobalt #3b6bdc, pink #e6224f
- Hero gradient: "135deg, #e2611d → #e6224f (45%) → #609d92"
- Soft gradient: "135deg, #609d92 → #a4a97d"
- Glass Dark: "rgba(0, 0, 0, 0.08)" · Glass Light: "rgba(255, 255, 255, 0.20)"

### Example Component Prompts
- "Create a hero on the LOC hero gradient (135deg orange→pink→teal). Headline in Fraunces 86px weight 400, line-height 1.0, letter-spacing -1.72px, opsz 144 / SOFT 50. Warm off-white text. White pill CTA (50px radius, 8px 18px padding)."
- "Build a section label: Space Mono 18px, uppercase, letter-spacing 0.54px, warm off-black. Kern enabled."
- "Create body text in Inter 20px weight 250, line-height 1.35, letter-spacing -0.14px. Warm off-black on warm off-white."
- "Design a feature card: pure white surface, 8px radius, shadow-sm, H3 title in Inter 24px weight 700."

### Iteration Guide
1. Warm base always — `#1a1410` on `#f7f3ee`, never pure black/white for type/ground
2. Fraunces = display/editorial only; Inter = structure and body
3. Body register stays light (weight 250); never above 400
4. Dashed 2px focus outlines, not solid
5. Letter-spacing negative on display/body, positive on mono labels
6. Color enters via gradients; pill (50px) for buttons, circle (50%) for icon buttons
