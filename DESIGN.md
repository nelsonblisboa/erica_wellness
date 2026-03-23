# Design System Specification: Editorial Organicism

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Living Editorial."**

Unlike standard health and wellness platforms that rely on clinical whites and rigid grids, this system adopts the persona of a high-end wellness boutique. It prioritizes the "human" over the "scientific" through a layout philosophy that treats the browser window like the page of a premium coffee-table magazine. We achieve this by breaking the traditional container-bound grid with **intentional asymmetry**, **overlapping "arched" frames**, and a **massive typographical scale** that creates a rhythmic journey through the content. The interface should feel like it's breathing, utilizing high negative space to reduce cognitive load and evoke a sense of calm, premium care.

---

## 2. Colors
Our palette is rooted in the "Elegante," "Autêntica," and "Cuidadosa" philosophy, moving away from high-contrast black/white into a sophisticated tonal range of forest greens and earthy golds.

### Tonal Logic
* **Primary (`#0d3621` / `#264d36`):** Reserved for moments of absolute authority. Used for hero headings and primary call-to-actions.
* **Secondary (`#725b32` / `#9b8155`):** Our "Autêntica" accent. Used to highlight nutritional expertise, organic growth, and warmth.
* **Background & Surfaces (`#f0fde9` / `#d4e1cd`):** A Pale Mint foundation that prevents the "coldness" of pure white.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders to define sections. Content boundaries must be established exclusively through:
1. **Background Shifts:** Transitioning from `surface` to `surface-container-low`.
2. **Negative Space:** Using the `20` (7rem) or `24` (8.5rem) spacing tokens to create mental "chapters" in the scroll.

### Surface Hierarchy & Nesting
Treat the UI as a series of layered, fine-milled papers.
* **Bottom Layer:** `surface` (#f0fde9)
* **Intermediate Cards:** `surface-container-low` (#ebf8e3)
* **Elevated Details:** `surface-container-lowest` (#ffffff) for maximum "pop" without shadows.

### Glass & Signature Textures
To add "soul," use a subtle linear gradient on main CTAs: `primary` to `primary-container`. For floating navigation or arched overlays, implement **Glassmorphism**: use `surface-variant` at 60% opacity with a `backdrop-blur` of 20px.

---

## 3. Typography
The typography system balances the authoritative heritage of Noto Serif with the modern, approachable clarity of Manrope.

* **The Hero Scale:** `display-lg` (3.5rem) should be used with tight letter-spacing (-0.02em) to create a "Signature" look.
* **The Editorial Note:** Use `headline-sm` in Noto Serif (Italic, if available) for pull-quotes or client testimonials to break the monotony of body text.
* **Functional Clarity:** All functional UI (labels, buttons, inputs) must use Manrope. This separates the "Brand Voice" (Serif) from the "User Action" (Sans-Serif).

---

## 4. Elevation & Depth
Depth is a tool for focus, not just decoration. We use **Tonal Layering** to define hierarchy.

* **The Layering Principle:** Place a `surface-container-lowest` (#ffffff) card directly onto a `surface-container-low` (#ebf8e3) background. This creates a natural, soft "lift" that mimics physical paper stock.
* **Ambient Shadows:** If a shadow is required for a floating arched frame, use the `on-surface` color (#141e12) at 4% opacity with a 40px blur and 10px Y-offset. It should feel like a soft glow of light, not a drop shadow.
* **The Ghost Border:** For input fields or secondary chips, use the `outline-variant` token at 20% opacity.

---

## 5. Components

### Arched Frames (Signature Component)
All primary imagery must be housed in an arched frame (Top-left and Top-right radius: `xl` or `full`). This mirrors the reference aesthetic and softens the digital edge.

### Buttons
* **Primary:** Background: `primary_container`; Text: `on_primary`. Shape: `full` (pill).
* **Secondary:** Background: `transparent`; Border: `outline-variant` (20%); Text: `primary`.
* **Interaction:** On hover, the Primary button should transition to `secondary` (#725b32) to evoke "warmth" upon engagement.

### Input Fields
* **Style:** Minimalist. No background. Only a bottom border using `outline-variant` (40%).
* **Focus State:** The bottom border transforms into a 2px `secondary` (#725b32) line.

### Cards & Lists
* **Strict Rule:** No dividers. Use `spacing-8` (2.75rem) to separate list items.
* **Nutrition Plan Cards:** Use `surface-container-high` with an arched top-right corner to signify a "custom" or "bespoke" feel.

### Selection Chips
* Used for selecting dietary preferences. Use `surface-container-highest` for unselected and `primary` with `on_primary` text for selected states. Shape: `md`.

---

## 6. Do's and Don'ts

### Do:
* **DO** use "Overlapping Content": Allow an arched image to partially overlap a `headline-lg` text block.
* **DO** use extreme vertical padding. If it feels like "too much" white space, it’s probably just right for this premium tier.
* **DO** align text to the left for body copy but experiment with centered `display-md` headings for a "Manifesto" feel.

### Don't:
* **DON'T** use 100% black. Always use `on_surface` (#141e12) for text to keep the contrast "soft."
* **DON'T** use hard corners. Every component should have at least a `DEFAULT` (1rem) radius to stay consistent with the "Organic" theme.
* **DON'T** use standard "Success" green. Use the `primary` forest green for success states to keep the branding cohesive. Use the `secondary` gold for highlights.

---

## 7. Spacing & Rhythm
This system relies on **8px-based rhythmic breathing**.
* **Section Gaps:** `24` (8.5rem)
* **Component Grouping:** `6` (2rem)
* **Text Stack (Heading to Body):** `3` (1rem)

Use the `spacing-20` (7rem) token for horizontal page margins to force the content into a central, focused column that mimics a magazine layout.
