# Tribunal Design System & Tokens

Visual specification based on the reference UI mockup for **Tribunal — "Your code. Put on trial."**

## Core Color Palette
| Token Name | Hex Code | Usage |
| :--- | :--- | :--- |
| `page-cream` | `#F6F3EE` | Global background canvas |
| `card-surface` | `#FBFAF8` | Card backgrounds, panels, modals |
| `card-border` | `#E8E2D8` | Card borders, subtle divider lines |
| `hero-charcoal` | `#151517` | Courtroom hero banner base |
| `hero-stone` | `#3C3538` | Courtroom stone pillars, darker accents |
| `wood-dark` | `#2A1D19` | Courtroom dark mahogany bench / trim |
| `wood-light` | `#40312D` | Courtroom secondary wood accent |
| `gold-primary` | `#B67F3D` | Primary brand accent, gavel highlights, judge badges |
| `gold-light` | `#E5C994` | Subtle gold tint, badge backgrounds, borders |
| `teal-accent` | `#43877C` | Active pills, secondary highlights, status indicators |
| `charcoal-text` | `#1E1E20` | Primary typography |
| `muted-text` | `#6E6966` | Secondary labels, timestamps, line numbers |

## Judge & Category Specific Accents
| Character / Category | Hex Code | Purpose |
| :--- | :--- | :--- |
| **Prosecutor** (Logic / Critical) | `#9B2C2C` (Crimson) / `#4A86C5` (Blue accent per mockup) | Prosecutor owl, critical findings, strict citations |
| **Defense Attorney** (Security / Maintainability) | `#E0A64A` (Amber) | Defense owl, mitigation arguments, concrete fixes |
| **Judge** | `#3D9A85` (Court Green) / `#B67F3D` (Gold) | Final ruling, balance scales, verdict stamp |

> **Strict Constraint**: **NO navy blue anywhere.**

## Typography
- **Headings & Display**: `Playfair Display`, serif (Courtroom hero titles, Section headings, Verdict rulings).
- **Body & UI**: `Inter`, sans-serif (Buttons, labels, descriptions, table cells).
- **Code & Cites**: `ui-monospace`, `SFMono-Regular`, `Menlo`, `Monaco`, `Consolas`, monospace (Code editor, line numbers, file paths).

## Layout & Geometry
- **Sidebar Width**: 240px (desktop), collapsible on mobile.
- **Top Bar Height**: 64px, fixed / sticky.
- **Border Radius**:
  - Cards: `rounded-2xl` (`16px`)
  - Badges & Buttons: `rounded-lg` (`8px`) or `rounded-full`
  - Hero Banner: `rounded-2xl` (`16px`)
- **Shadows**:
  - Cards: `0 2px 8px -2px rgba(42, 29, 25, 0.05), 0 4px 16px -4px rgba(42, 29, 25, 0.08)`
  - Hero: `0 8px 30px rgba(21, 21, 23, 0.3)`

## Key Interactive Animations
- **Typing Animator**: Smooth step-by-step text reveal simulating characters speaking.
- **OBJECTION! Trigger**: 
  - Screen shake keyframes (`translateX(-6px)` to `translateX(6px)`).
  - High-impact red/gold overlay banner.
- **Verdict Stamp**: 
  - Scale down + rotate (`scale(1.4) rotate(-8deg)` to `scale(1) rotate(-4deg)`) simulating ink stamp impact.
