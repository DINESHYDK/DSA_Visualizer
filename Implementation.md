# DSA Visualizer - Implementation Task List

## Previous Work (Phases 1-4.2) — COMPLETED

All original feature development is complete:
- 6 sorting algorithms (Bubble, Selection, Insertion, Merge, Quick, Heap)
- Data structures (Array, LinkedList, Stack, Queue)
- Tree structures (BST, Heap, AVL)
- Graph algorithms (BFS, DFS, Dijkstra)
- Search algorithms (Linear, Binary)
- Interactive playground with scenario testing
- Algorithm customization interface
- Educational features (complexity analysis, step-by-step learning)

---

## V2 Restructuring — LeetCode-Inspired Professional Redesign

### Problems Identified in V1
1. **Animations dumped at once** — Multiple unsynchronized setState calls, stale closures in animation loop, no CSS transitions between states
2. **Unprofessional design** — Yellow glow effects, heavy shadows, oversized 2rem "curvy" borders
3. **No routing** — useState-based page switching, no URLs, no browser back button
4. **Dead code** — Entire `src_new/` duplicate directory (11 files), performance stub components never integrated
5. **Fragmented state** — Dual AnimationContext + useAnimationEngine, 8 separate useState calls in SortingVisualization
6. **Hardcoded dimensions** — 70px elements, 800px containers, not responsive
7. **Type safety gaps** — `any` types scattered, duplicate SortingStep/AnimationStep definitions

---

## **Phase R0: Cleanup**

[x] **R0.1** Delete Dead Code
- Priority: H
- Dependencies: None
- Subtasks:
  * [x] Delete entire `src/src_new/` directory (11 unused duplicate files)
  * [x] Delete `src/components/performance/WebWorkerManager.tsx` (stub, never integrated)
  * [x] Delete `src/components/performance/ProgressiveRenderer.tsx` (stub, never integrated)
  * [x] Delete `src/components/performance/MemoryManager.tsx` (stub, never integrated)
  * [x] Delete `src/components/performance/LoadingStateManager.tsx` (stub, never integrated)
  * [x] Delete `src/components/performance/ResponsiveScaler.tsx` (stub, never integrated)
  * [x] Keep `src/components/performance/ErrorBoundary.tsx`

[x] **R0.2** Resolve Naming Conflicts & Clean References
- Priority: H
- Dependencies: R0.1
- Subtasks:
  * [x] Rename `src/components/datastructures/ArrayVisualization.tsx` → `ArrayDataStructure.tsx`
  * [x] Update all imports referencing the renamed file
  * [x] Remove all `console.log` statements (SortingVisualization.tsx, SortingPage.tsx)

[x] **R0.3** Remove Dead Pages & Routes
- Priority: M
- Dependencies: R0.1
- Subtasks:
  * [x] Delete `src/pages/PerformanceOptimizationPage.tsx` (depends on deleted stubs)
  * [x] Remove PerformanceOptimizationPage import and route from `src/App.tsx`

---

## **Phase R1: Design System — LeetCode-Inspired**

[x] **R1.1** New Color Token System
- Priority: H
- Dependencies: R0.3
- Subtasks:
  * [x] Rewrite `:root` CSS custom properties in `src/index.css` with new palette:
    - Backgrounds: `#1a1a2e` (primary), `#282828` (secondary), `#303030` (cards), `#3e3e3e` (elevated)
    - Borders: `#3e3e3e` (default), `#525252` (hover)
    - Text: `#eff1f6` (primary), `#eff1f6bf` (secondary), `#ffffff80` (muted)
    - Accent: `#ffa116` (LeetCode orange)
    - Status: `#2cbb5d` (success), `#ffc01e` (warning), `#ff375f` (error)
    - Visualization: `#7c3aed` (compare), `#ec4899` (swap), `#2cbb5d` (sorted), `#ffa116` (active), `#f97316` (pivot)
  * [x] Replace border radius tokens: `4px` (sm), `6px` (md), `8px` (lg) — no more 2rem
  * [x] Replace shadow tokens: minimal `0 1px 2px rgba(0,0,0,0.3)` max — NO glow effects
  * [x] Remove all gradient custom properties

[x] **R1.2** Update Tailwind Configuration
- Priority: H
- Dependencies: R1.1
- Subtasks:
  * [x] Replace all custom colors in `tailwind.config.js` with new token references
  * [x] Remove `rounded-curvy*` border radius variants
  * [x] Remove `shadow-curvy*` and `shadow-glow*` variants
  * [x] Add monospace font family (`'Fira Code', 'JetBrains Mono', monospace`)

[x] **R1.3** Rewrite Global CSS Classes
- Priority: H
- Dependencies: R1.2
- Subtasks:
  * [x] Remove ALL old classes: `.rounded-curvy*`, `.shadow-curvy*`, `.shadow-glow*`, `.hover-lift`, `.hover-glow`, `.animate-pulse-glow`, `.bg-gradient-*`
  * [x] Remove conflicting utility classes that duplicate Tailwind (`.bg-primary`, `.text-primary`, `.text-secondary`, etc.)
  * [x] Rewrite `.btn-primary`: flat `#ffa116` bg, dark text, `6px` radius, no glow
  * [x] Rewrite `.btn-secondary`: transparent bg, `1px` border `#3e3e3e`
  * [x] Rewrite `.element-*` classes with `transition: 250ms ease` baked in
  * [x] Update form element styles (inputs, selects, range sliders) with new colors
  * [x] Update table and code block styles

[x] **R1.4** Create Reusable UI Primitive Components
- Priority: H
- Dependencies: R1.3
- Subtasks:
  * [x] Create `src/components/ui/Card.tsx` — flat bg `#303030`, 1px border `#3e3e3e`, 8px radius
  * [x] Create `src/components/ui/Button.tsx` — primary (orange), secondary (ghost), danger (red) variants
  * [x] Create `src/components/ui/Badge.tsx` — for difficulty/status (easy/medium/hard colors)
  * [x] Create `src/components/ui/Tabs.tsx` — LeetCode-style underline tab navigation

---

## **Phase R2: Infrastructure**

[x] **R2.1** Add React Router
- Priority: H
- Dependencies: R1.4
- Subtasks:
  * [x] Install `react-router-dom` v7 (API-compatible with v6)
  * [x] Rewrite `src/App.tsx` with `<BrowserRouter>`, `<Routes>`, `<Route>`
  * [x] Define routes: `/` (home), `/sorting`, `/data-structures`, `/trees`, `/playground`, `/complexity`
  * [x] Wrap ALL routes in persistent `MainLayout` via `<Outlet />`

[x] **R2.2** Fix Layout Components for Router
- Priority: H
- Dependencies: R2.1
- Subtasks:
  * [x] Rewrite `src/components/layout/MainLayout.tsx` to use `<Outlet>` for child rendering
  * [x] Rewrite `src/components/layout/Header.tsx` — replaced `<a>` with `<NavLink>`, orange active color
  * [x] Rewrite `src/components/layout/Sidebar.tsx` — replaced `<a>` with `<NavLink>`, orange left-border active state
  * [x] Rewrite `src/components/layout/Footer.tsx` — minimal single-row footer
  * [x] Style all nav items with new design tokens (flat, no glow)

[x] **R2.3** Extract Home Page
- Priority: M
- Dependencies: R2.1
- Subtasks:
  * [x] Create `src/pages/HomePage.tsx` (extracted inline home page from `App.tsx`)
  * [x] Clean hero section: white title, muted subtitle, no gradients
  * [x] Flat navigation cards with 1px borders using Card/Badge UI primitives

[x] **R2.4** Consolidate State Management
- Priority: H
- Dependencies: R2.1
- Subtasks:
  * [x] Delete `src/contexts/AnimationContext.tsx`
  * [x] Remove `<AnimationProvider>` from `App.tsx`
  * [x] Consolidated `SortingVisualization.tsx` 8 separate `useState` into single `useReducer`
  * [x] All components already used `useAnimationEngine` directly — no other changes needed

[x] **R2.5** Fix Type System
- Priority: M
- Dependencies: R2.4
- Subtasks:
  * [x] Made `SortingStep` a type alias: `Omit<AnimationStep, 'id' | 'duration'>` (removes duplication, zero breakage)
  * [x] Replaced `any` on `VisualElement.data` with `Record<string, unknown>`
  * [x] Removed `VisualizationProps` (unused) and `ThemeColors` interface
  * [x] Added `goToStep?` to `AnimationControls`

---

## **Phase R3: Animation Engine Rewrite** ← MOST CRITICAL

> Split into two parts. Part 1 = engine fix (this chat). Part 2 = element visuals + swap animation (next chat).

### R3 — Part 1: Fix the Engine

[x] **R3.2** Fix Step Handler — Single Dispatch Per Step *(completed in R2.4)*
- File: `src/components/sorting/SortingVisualization.tsx`
- Already done: 8 useState → single useReducer, one dispatch per step

[x] **R3.1** Fix Animation Loop — Stale Closure Bug
- Priority: H
- Dependencies: R2.4
- File: `src/hooks/useAnimationEngine.ts`
- Root cause: `animationLoop` closes over stale `state.isPlaying` / `state.currentStep` from useState — the RAF callback never sees updated values, so all steps fire in the same frame.
- Subtasks:
  * [x] Replace `useState` for isPlaying/currentStep with `useRef` for mutable animation state
  * [x] Rewrote `tick` callback with empty dep array — reads exclusively from refs (never stale)
  * [x] Single `setUiState` per tick for UI re-render only
  * [x] Minimum step duration = 400ms (longer than CSS transition 250ms)
  * [x] `stepBackward`: calls `onReset()` then replays steps 0→target (React 18 batches into one re-render)
  * [x] RAF cancelled on pause, reset, unmount, and algorithm change
  * [x] Added `onReset` callback prop to engine, wired into `SortingVisualization` via new `RESET_ELEMENTS` reducer action
  * [x] Stored `initialElements` in VizState so reset has a clean starting point

---

### R3 — Part 2: Element Visuals + Swap Animation *(completed)*

[x] **R3.3** Fix AnimatedArrayElement — Pure CSS Transitions
- Priority: H
- File: `src/components/animation/AnimatedArrayElement.tsx`
- Subtasks:
  * [x] Removed internal `isAnimating` useState and useEffect timers
  * [x] Removed `displayValue` state — value comes directly from props
  * [x] Visual state driven entirely by `state` prop → `stateClass` map → CSS class
  * [x] Removed inline `transform: scale(1.1) rotate(1deg)` hack
  * [x] Added `style` prop passthrough so parent can inject translateX for swap animation

[x] **R3.4** Simplified Swap Animation *(brought back — educational value)*
- Priority: M
- File: `src/components/animation/ArrayVisualization.tsx`
- Subtasks:
  * [x] Detects the two elements in 'swapping' state, computes their translateX offsets based on stride (elementWidth + gap)
  * [x] Applies `translateX(offset) translateY(-8px)` via inline style during swap — elements visually cross past each other
  * [x] Clears transform after 270ms via setTimeout (CSS transition = 250ms)
  * [x] `zIndex: 10` on swapping elements so they render above neighbours

> **Cut items (confirmed):**
> - ~~R3.5 ComparisonHighlight / TransitionEffects rewrite~~ — cosmetic, no visual understanding benefit

---

## **Phase R4: Page-by-Page Redesign**

[x] **R4.6** Layout Polish *(completed in R2.2)*
- Footer rewritten to single-row minimal bar
- Sidebar collapses on mobile via translate-x
- All pages now wrapped in consistent MainLayout

[x] **R4.1** Global Style Migration (All Components) *(completed alongside R3 Part 2)*
- Priority: H
- Subtasks:
  * [x] `rounded-curvy` / variants → `rounded-lg` / `rounded-md` / etc. (sed across all tsx)
  * [x] `shadow-curvy` / variants → `shadow-sm` / `shadow-md` (sed)
  * [x] `shadow-glow` / `shadow-glow-hover` → removed (sed)
  * [x] `hover-lift` → removed (sed)
  * [x] `bg-gradient-dark` → `bg-bg-primary` (sed)
  * [x] `animate-pulse-glow` → removed (sed)
  * [x] `bg-primary/X` → `bg-accent/X`, `border-primary` → `border-accent` (sed)
  * [x] `bg-accent/20` (old gray tint) → `bg-bg-elevated/50` (sed)
  * [x] `hover:bg-primary` → `hover:bg-accent-hover` (sed)
  * [x] Removed redundant `min-h-screen bg-bg-primary` + `max-w-7xl` wrapper divs from all 5 pages (MainLayout already provides both)

[ ] **R4.2** Sorting Page Redesign
- Priority: H
- Dependencies: R4.1
- Subtasks:
  * [ ] Redesign `src/pages/SortingPage.tsx` — flat cards, consistent borders
  * [ ] Redesign `src/components/sorting/AlgorithmComparison.tsx` — use `Tabs` UI primitive for algorithm selector
  * [ ] Redesign `src/components/sorting/CodeDisplay.tsx` — dark bg `#1e1e1e`, `font-mono`, clean line highlighting
  * [ ] Redesign `src/components/sorting/EnhancedCustomInputPanel.tsx` — clean inputs, orange focus ring
  * [ ] Redesign `src/components/animation/AnimationControlPanel.tsx` — flat orange play button, thin progress bar, clean speed slider, remove status indicator section

[ ] **R4.3** Data Structures Page Redesign
- Priority: H
- Dependencies: R4.1
- Subtasks:
  * [ ] Redesign `src/pages/DataStructuresPage.tsx` — flat cards
  * [ ] Update `src/components/datastructures/ArrayDataStructure.tsx` styling
  * [ ] Update `src/components/datastructures/LinkedListVisualization.tsx` styling
  * [ ] Update `src/components/datastructures/StackQueueVisualization.tsx` styling

[ ] **R4.4** Trees Page Redesign
- Priority: H
- Dependencies: R4.1
- Subtasks:
  * [ ] Redesign `src/pages/TreesPage.tsx` — flat cards
  * [ ] Update `src/components/trees/BinarySearchTreeVisualization.tsx` — clean node circles, thin borders
  * [ ] Update `src/components/trees/HeapVisualization.tsx` styling
  * [ ] Update `src/components/trees/AVLTreeVisualization.tsx` styling
  * [ ] Update `src/components/animation/TreeVisualization.tsx` — clean SVG node rendering

[ ] **R4.5** Playground & Complexity Pages Redesign
- Priority: M
- Dependencies: R4.1
- Subtasks:
  * [ ] Redesign `src/pages/PlaygroundPage.tsx` — consistent card/input styling
  * [ ] Update `src/components/playground/*` styling (MultiLevelInputSystem, AdvancedScenarioTesting, AlgorithmCustomization)
  * [ ] Redesign `src/pages/ComplexityAnalysisPage.tsx` — clean card layout
  * [ ] Update `src/components/educational/*` styling

---

## **Phase R5: Polish & Production Quality**

[ ] **R5.1** Responsive Design *(simplified — no ResizeObserver)*
- Priority: H
- Dependencies: R4.5
- Approach: CSS flexbox + percentage widths instead of JS-measured containers. Simpler, no layout jank.
- Subtasks:
  * [ ] Replace hardcoded `elementWidth={70}`, `elementHeight={70}` — use `w-full flex` layout so elements size by container
  * [ ] Replace hardcoded `containerWidth={800}` in ComparisonHighlight — derive from element count and flex gap
  * [ ] Grid layout: code display stacks below visualization on screens < 1024px (already `lg:grid-cols-2`)
  * [ ] Verify sidebar toggle works on mobile

> **Cut:** ~~ResizeObserver~~ — CSS flex handles this cleanly. ~~Bar-chart mode for large arrays~~ — out of scope.

[ ] **R5.2** Accessibility *(simplified — labels only)*
- Priority: M
- Dependencies: R5.1
- Note: `prefers-reduced-motion` already handled in R1 (`index.css`).
- Subtasks:
  * [ ] Add `aria-label` to all icon-only buttons (play, pause, step forward/back, reset)
  * [ ] Verify keyboard shortcuts still work (Space, Arrow keys, R, C) — should be fine post-router

> **Cut:** ~~progressbar ARIA~~ — verbose, no real-world benefit for a portfolio project. ~~Color-only state indicators~~ — text description already shown below the array.

> **Cut entirely:**
> - ~~R5.3 React.memo / React.lazy~~ — premature optimization, arrays are small, React is fast enough
> - ~~R5.4 page transition fade in/out~~ — visual fluff

[ ] **R5.3** Final Touches *(kept, lightweight)*
- Priority: M
- Dependencies: R5.2
- Subtasks:
  * [ ] Create `src/pages/NotFoundPage.tsx` — simple 404 with link back to home
  * [ ] Add `document.title` updates per route (e.g., "Sorting — DSA Visualizer")
  * [ ] Verify sidebar active state syncs with current route (NavLink already handles this)
  * [ ] Final cross-browser smoke test

---

## Dependencies Installed

| Package | Version | Purpose |
|---------|---------|---------|
| `react-router-dom` | v7.13.2 | Client-side routing ✓ |

No other new libraries. CSS transitions over Framer Motion.

---

## File Operations Summary

| Action | Count | Details |
|--------|-------|---------|
| **Deleted** | 17 files | `src_new/` (11), performance stubs (5), AnimationContext (1) ✓ |
| **Created** | 6 files | UI primitives (4), HomePage, NotFoundPage (pending) ✓ partial |
| **Remaining** | ~15 files | useAnimationEngine, AnimatedArrayElement, ArrayVisualization, all page/component files |

---

## Current Status

### Completion: Phase R3 + R4.1 Done

- [x] Phase R0: Cleanup
- [x] Phase R1: Design System
- [x] Phase R2: Infrastructure
- [x] Phase R3 Part 1: Fix animation engine stale closure
- [x] Phase R3 Part 2: Element visuals + swap animation
- [x] Phase R4.1: Global style migration (all old class names replaced)
- [ ] Phase R4.2–R4.5: Per-page redesigns ← **next**
- [ ] Phase R5: Polish & Production Quality

---

## Design Reference: LeetCode Dark Mode

| Element | Value |
|---------|-------|
| Primary BG | `#1a1a2e` |
| Card BG | `#303030` |
| Nav BG | `#282828` |
| Border | `#3e3e3e` |
| Accent | `#ffa116` (orange) |
| Text Primary | `#eff1f6` |
| Text Secondary | `#eff1f6bf` |
| Text Muted | `#ffffff80` |
| Success/Easy | `#2cbb5d` |
| Warning/Medium | `#ffc01e` |
| Error/Hard | `#ff375f` |
| Border Radius | 4-8px max |
| Shadows | Minimal, no glow |
| Font (code) | Fira Code / JetBrains Mono |

---

## Verification Checklist

- [ ] `npm run dev` — app loads without errors
- [ ] Navigate all routes — proper URL updates, browser back button works
- [ ] Run bubble sort — smooth step-by-step animation, no "dumping"
- [ ] Test backward stepping — correct array state restoration
- [ ] Resize browser — responsive element sizing, no overflow
- [ ] Check all pages — consistent LeetCode-style design, no glow/curvy remnants
- [ ] Keyboard shortcuts work — Space (play/pause), Arrow keys (step), R (reset)
- [ ] Mobile view — sidebar collapses, controls stack properly
