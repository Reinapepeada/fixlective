---
name: Field Technician Modular Spec
colors:
  surface: '#f8faf9'
  surface-dim: '#d8dada'
  surface-bright: '#f8faf9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f3'
  surface-container: '#eceeed'
  surface-container-high: '#e6e9e8'
  surface-container-highest: '#e1e3e2'
  on-surface: '#191c1c'
  on-surface-variant: '#48464b'
  inverse-surface: '#2e3131'
  inverse-on-surface: '#eff1f0'
  outline: '#79767b'
  outline-variant: '#c9c5cb'
  surface-tint: '#605d62'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1c1b1f'
  on-primary-container: '#868388'
  inverse-primary: '#c9c5cb'
  secondary: '#825500'
  on-secondary: '#ffffff'
  secondary-container: '#fdab17'
  on-secondary-container: '#684300'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1a1c1c'
  on-tertiary-container: '#838484'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e6e1e7'
  primary-fixed-dim: '#c9c5cb'
  on-primary-fixed: '#1c1b1f'
  on-primary-fixed-variant: '#48464b'
  secondary-fixed: '#ffddb3'
  secondary-fixed-dim: '#ffb952'
  on-secondary-fixed: '#291800'
  on-secondary-fixed-variant: '#633f00'
  tertiary-fixed: '#e3e2e2'
  tertiary-fixed-dim: '#c7c6c6'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#464747'
  background: '#f8faf9'
  on-background: '#191c1c'
  surface-variant: '#e1e3e2'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '300'
    lineHeight: 36px
    letterSpacing: -0.03em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '300'
    lineHeight: 28px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '300'
    lineHeight: 24px
    letterSpacing: -0.02em
  headline-sm:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '100'
    lineHeight: 18px
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '100'
    lineHeight: 16px
    letterSpacing: 0.01em
  body-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '100'
    lineHeight: 14px
    letterSpacing: 0.02em
  label-lg:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 14px
    letterSpacing: 0.06em
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '400'
    lineHeight: 12px
    letterSpacing: 0.08em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 9px
    fontWeight: '400'
    lineHeight: 10px
    letterSpacing: 0.1em
spacing:
  gutter: 1rem
  gutter-sm: 0.5rem
  margin: 1.5rem
  margin-sm: 0.75rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system draws direct inspiration from high-precision laboratory measuring equipment, Dieter Rams-era functionalism, and the mechanical clarity of modern Swedish industrial synthesizers. It is crafted for hardware hackers, electronics engineers, microelectronics technicians, and bench scientists.

The emotional core is unyielding utility: an interface that feels like milled aluminum, chemically etched silkscreens, and monolithic lab instruments. Surfaces avoid ornamental software artifacts (no gradients, blurs, or drop shadows). Spatial structure is derived entirely from mechanical housing boundaries, sharp cutouts, and deliberate ink distribution. Every line, readout, and bezel serves a distinct semantic purpose.

## Colors

The palette operates on calibrated contrast tiers calibrated for bench lighting and bright shop environments:

- **Canvas Mist (`#f6f8f7`)**: The foundational surface base. Emulates powder-coated metal casing and industrial instrument panels.
- **Deep Carbon (`#0f0e12`)**: The structural anchor. Applied to monolithic top bars, inverted modular blocks, primary action modules, and key readouts.
- **Ink Black (`#000000`)**: Laser-sharp typographic foreground. Used across high-priority labels, metric outputs, and terminal glyphs.
- **Warning Amber (`#f0a000`)**: The sole chromatic accent. Reserved exclusively for test-point indicators, warning states, active toggles, and live probe signals. Never used decoratively.
- **Steel Gray (`#e5e5e5`)**: Hairline boundary rules (`1px`) partitioning sub-panels and modular cell grids.
- **Graphite (`#b2b2b2`)**: Secondary rules, mechanical ticks, crosshairs, deactivated states, and precision markers.

## Typography

Typographic execution mimics engineering blueprints, silkscreened chassis plates, and test-bench oscilloscope displays. 

- **Primary Typeface (`Inter`)**: Deployed for titles, system status banners, and explanatory documentation. Uses hairline weight `100` for body prose to maintain an airy, technical, schematic feel, balanced with weight `300` on headlines for crisp mechanical definition.
- **Data & Readout Typeface (`JetBrains Mono`)**: Mandatory for all input values, units of measurement, coordinates, technical labels, and register readings. All labels are formatted in uppercase with wide letter-spacing (`0.06em` to `0.1em`) to mimic stamped faceplates.
- **Vertical Metric**: Line heights are kept exceptionally tight to emulate hardware matrices and dense data printouts.

## Layout & Spacing

The layout is built upon a rigid, modular instrument-rack grid.

- **Grid Architecture**: 12-column desktop grid collapsing to 6-column on tablet and 2-column or 1-column modular strips on mobile. Panels dock directly to adjacent borders; gutters function as mechanical joints.
- **Rhythm**: Spacing follows a 4px mechanical base unit. Gaps between distinct hardware modules use `gutter` (`1rem`), while inner control clusters compress tightly to `space-xs` (`0.25rem`) and `space-sm` (`0.5rem`) to convey tight hardware packing.
- **Full Bleed Strips**: High-contrast Deep Carbon bands (`#0f0e12`) span the full width of their module container without edge offsets, functioning as mounting rails for tools and sub-menus.

## Elevation & Depth

This system strictly rejects faux lighting:
- **No Drop Shadows**: Elevation is never indicated via blur radii or directional light drops.
- **No Gradient Fills**: Surfaces are flat coats of solid pigment.
- **Structural Partitioning**: Visual hierarchy is created through:
  1. **Hairline Seams**: `1px solid #e5e5e5` for intra-card partitions; `1px solid #b2b2b2` for peripheral module borders.
  2. **Inverted Carbon Blocks**: Stacking a `#0f0e12` module onto the `#f6f8f7` canvas signals top-level authority or primary state focus.
  3. **Hairline Nested Framing**: Secondary panels are enclosed in nested rectangular wireframes, reproducing the visual language of schematic diagrams.

## Shapes

Every component features a sharp `0px` border-radius with no exceptions. 

Corners mimic sheet-metal stampings and machine-milled PCB edges. Push-buttons, switch toggles, popover panels, dialog boxes, and input boxes are all right-angled polygons. When active elements touch adjacent cells, they share straight hairline boundaries to maintain the look of a physical hardware rack.

## Components

### Buttons & Actuators
- **Primary / Action**: Solid `#0f0e12` fill, text in `#f6f8f7` (`JetBrains Mono`, uppercase, weight 400). `0px` radius. Border: `1px solid #0f0e12`. Active state reverses to `#f0a000` fill with `#0f0e12` text.
- **Secondary / Ghost**: Background transparent, border `1px solid #b2b2b2`, text in `#000000`. Hover fills background with `#e5e5e5`.
- **System Trigger**: `#f0a000` solid fill with `#0f0e12` text for critical commands (e.g., FLASH, WRITE, PURGE).

### Input Fields & Parameter Steppers
- **Text & Numeric Inputs**: Hairline frame (`1px solid #b2b2b2`), background `#ffffff`. Typography in `JetBrains Mono` (`body-md`), weight `400`.
- **Labels**: Fixed above the field or integrated as an inverted black badge in the top-left corner (`label-sm`).
- **Focus State**: Hairline border darkens instantly to `1px solid #0f0e12`; no outer glow ring. Cursor is a non-rounded solid amber `#f0a000` block.

### Cards & Chassis Units
- **Base Panel**: Surface `#f6f8f7`, bounded by a `1px solid #e5e5e5` perimeter.
- **Header Band**: Optional `#0f0e12` top bar housing the module ID (e.g., `MOD_01 // VOLTAGE_REG`) in `#f6f8f7` `label-sm`.
- **Sub-partitions**: Internal data columns separated by `1px solid #e5e5e5` vertical rules.

### Checkboxes, Radios & Binary Toggles
- **Checkbox**: `14px x 14px` square, border `1px solid #000000`, `0px` radius. Checked state fills the box with `#0f0e12` and displays a centered `#f0a000` pixel dot (`4px x 4px`).
- **Radio**: `14px x 14px` square (retaining sharp 0px corners), border `1px solid #000000`. Selected state features an interior `#0f0e12` solid square inset by `2px`.
- **Toggle Switch**: Segmented dual-box rocker `[OFF | ON]`. Inactive segment is `#f6f8f7` with `#b2b2b2` text; active segment is `#0f0e12` with `#f0a000` text.

### Chips & Parameter Badges
- **Status Chips**: Sharp rectangular tags. Border `1px solid #b2b2b2`, background transparent, `label-sm` text.
- **Live State Badge**: Solid `#f0a000` fill, text `#0f0e12`, prefixed with a unicode bullet `● RUNNING`.

### Test Bench Extras
- **Oscilloscope / Canvas Viewports**: Pure `#0f0e12` carbon ground framed by `1px solid #000000`, with internal grid lines in `rgba(240, 160, 0, 0.15)` and live waveforms rendered in razor-sharp `#f0a000`.
- **Rotary / Matrix Inputs**: Stepper components displayed as numerical increment stacks partitioned by horizontal `1px` lines, with discrete tap targets for `+` and `-`.