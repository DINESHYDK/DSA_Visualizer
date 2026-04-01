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

[ ] **R3.1** Fix Animation Loop — Stale Closure Bug
- Priority: H
- Dependencies: R2.4
- File: `src/hooks/useAnimationEngine.ts`
- Subtasks:
  * [ ] Replace `useState` for isPlaying/currentStep with `useRef` for mutable animation state
  * [ ] Rewrite `animationLoop` callback to read from refs (not closed-over state)
  * [ ] Sync refs to React state with single `setState` call per frame
  * [ ] Set minimum step duration >= 350ms (must exceed CSS transition duration)
  * [ ] Add `computeArrayStateAtStep(steps, targetStep)` for correct backward stepping
  * [ ] Clean up RAF properly on unmount and pause

[ ] **R3.2** Fix Step Handler — Single Dispatch Per Step
- Priority: H
- Dependencies: R3.1
- File: `src/components/sorting/SortingVisualization.tsx`
- Subtasks:
  * [ ] Replace `handleStepChange` (currently 4 separate setState = 4 re-renders) with single `useReducer` dispatch
  * [ ] New dispatch computes: elements state, highlighted indices, operation text, metrics — all in one update
  * [ ] Implement `computeVisualizationState(stepIndex)` that derives correct array state from step data
  * [ ] Ensure backward stepping correctly restores previous array state

[ ] **R3.3** Fix AnimatedArrayElement — Pure CSS Transitions
- Priority: H
- Dependencies: R3.2
- File: `src/components/animation/AnimatedArrayElement.tsx`
- Subtasks:
  * [ ] Remove `isAnimating` useState and useEffect timers
  * [ ] Remove `displayValue` internal state
  * [ ] Element visual state determined ENTIRELY by `state` prop via CSS classes
  * [ ] CSS handles smooth transitions: `transition: background-color 200ms ease, border-color 200ms ease, transform 200ms ease`
  * [ ] Remove inline `transform: scale(1.1) rotate(1deg)` hack

[ ] **R3.4** Add Proper Swap Animation
- Priority: M
- Dependencies: R3.3
- File: `src/components/animation/ArrayVisualization.tsx`
- Subtasks:
  * [ ] When 'swap' step is active, compute `translateX` offset for each swapping element
  * [ ] Two-phase animation: visual translateX move (CSS transition) → actual array reorder (after transition completes)
  * [ ] Lift swapping elements with subtle `translateY(-8px)` during swap

[ ] **R3.5** Clean Up Animation Support Components
- Priority: M
- Dependencies: R3.3
- Subtasks:
  * [ ] Simplify `ComparisonHighlight.tsx` — remove pulseGlow, use subtle border/underline indicator
  * [ ] Simplify `TransitionEffects.tsx` — remove glow effects, simplify swap/slide animations
  * [ ] Remove `AnimationControls.tsx` if redundant with `AnimationControlPanel.tsx`

---

## **Phase R4: Page-by-Page Redesign**

[ ] **R4.1** Global Style Migration (All Components)
- Priority: H
- Dependencies: R3.5
- Subtasks:
  * [ ] Find-and-replace across ALL files: `rounded-curvy` → `rounded-lg`
  * [ ] Find-and-replace: `shadow-curvy` → remove or `shadow-sm`
  * [ ] Find-and-replace: `shadow-glow` → remove entirely
  * [ ] Find-and-replace: `hover-lift` → `hover:bg-[#3e3e3e]` or remove
  * [ ] Find-and-replace: `bg-gradient-dark` → `bg-[var(--color-bg-primary)]`
  * [ ] Find-and-replace: `animate-pulse-glow` → remove
  * [ ] Find-and-replace: `bg-bg-card` → use Card component or new token

[ ] **R4.2** Sorting Page Redesign
- Priority: H
- Dependencies: R4.1
- Subtasks:
  * [ ] Redesign `src/pages/SortingPage.tsx` with flat cards, consistent borders
  * [ ] Redesign `src/components/sorting/AlgorithmComparison.tsx` — tab-style selector with orange active
  * [ ] Redesign `src/components/sorting/CodeDisplay.tsx` — dark bg (#1e1e1e), monospace font, clean line highlighting
  * [ ] Redesign `src/components/sorting/EnhancedCustomInputPanel.tsx` — clean inputs, orange focus
  * [ ] Redesign `src/components/animation/AnimationControlPanel.tsx`:
    - Flat orange play button (no glow)
    - Thin progress bar with orange fill
    - Clean speed slider
    - Remove redundant status indicator section
  * [ ] Compact metrics display — inline stats bar instead of 4 separate hover-lift cards

[ ] **R4.3** Data Structures Page Redesign
- Priority: H
- Dependencies: R4.1
- Subtasks:
  * [ ] Redesign `src/pages/DataStructuresPage.tsx` with flat cards, consistent layout
  * [ ] Update `src/components/datastructures/ArrayDataStructure.tsx` (renamed) styling
  * [ ] Update `src/components/datastructures/LinkedListVisualization.tsx` styling
  * [ ] Update `src/components/datastructures/StackQueueVisualization.tsx` styling

[ ] **R4.4** Trees Page Redesign
- Priority: H
- Dependencies: R4.1
- Subtasks:
  * [ ] Redesign `src/pages/TreesPage.tsx` with flat cards
  * [ ] Update `src/components/trees/BinarySearchTreeVisualization.tsx` — clean node circles, thin borders
  * [ ] Update `src/components/trees/HeapVisualization.tsx` styling
  * [ ] Update `src/components/trees/AVLTreeVisualization.tsx` styling
  * [ ] Update `src/components/animation/TreeVisualization.tsx` — clean node rendering

[ ] **R4.5** Playground & Complexity Pages Redesign
- Priority: M
- Dependencies: R4.1
- Subtasks:
  * [ ] Redesign `src/pages/PlaygroundPage.tsx` — consistent card/input styling
  * [ ] Update `src/components/playground/MultiLevelInputSystem.tsx`
  * [ ] Update `src/components/playground/AdvancedScenarioTesting.tsx`
  * [ ] Update `src/components/playground/AlgorithmCustomization.tsx`
  * [ ] Redesign `src/pages/ComplexityAnalysisPage.tsx` — clean card layout
  * [ ] Update `src/components/educational/*` components styling

[ ] **R4.6** Layout Polish
- Priority: M
- Dependencies: R4.2
- Subtasks:
  * [ ] Update `src/components/layout/Footer.tsx` — minimal, dark bg, single line
  * [ ] Ensure sidebar collapses properly on mobile
  * [ ] Verify all pages have consistent padding and max-width

---

## **Phase R5: Polish & Production Quality**

[ ] **R5.1** Responsive Design
- Priority: H
- Dependencies: R4.6
- Subtasks:
  * [ ] Remove hardcoded 70px element widths — compute from container: `Math.max(32, Math.min(64, containerWidth / n))`
  * [ ] Remove hardcoded 800px container widths — use ResizeObserver
  * [ ] For large arrays (>15 elements), switch to bar-chart mode (thin vertical bars, height = value)
  * [ ] Stack code display below visualization on mobile
  * [ ] Test all breakpoints: 320px, 768px, 1024px, 1440px

[ ] **R5.2** Accessibility
- Priority: H
- Dependencies: R5.1
- Subtasks:
  * [ ] Add `aria-label` to all interactive buttons
  * [ ] Add `role="progressbar"` with `aria-valuenow`/`aria-valuemin`/`aria-valuemax` to progress bars
  * [ ] Add `prefers-reduced-motion` media query to disable/simplify all animations
  * [ ] Ensure keyboard navigation works with React Router (tab order, Enter/Space)
  * [ ] Ensure color is not the only state indicator (add text labels or icons)

[ ] **R5.3** Performance Optimization
- Priority: M
- Dependencies: R5.1
- Subtasks:
  * [ ] Add `React.memo` to `AnimatedArrayElement` (avoid re-rendering unchanged elements)
  * [ ] Add `React.memo` to `CodeDisplay` (only re-render on step/algorithm change)
  * [ ] Add `React.lazy` + `Suspense` for page-level code splitting in router
  * [ ] Profile and fix any remaining unnecessary re-renders

[ ] **R5.4** Final Touches
- Priority: M
- Dependencies: R5.3
- Subtasks:
  * [ ] Create `src/pages/NotFoundPage.tsx` — 404 page for unknown routes
  * [ ] Add `document.title` updates per route
  * [ ] Add simple page transition (fade in/out)
  * [ ] Verify sidebar active state syncs with current route
  * [ ] Test all keyboard shortcuts with new routing

---

## Dependencies to Install

| Package | Version | Purpose |
|---------|---------|---------|
| `react-router-dom` | ^6.x | Client-side routing |

No other new libraries. CSS transitions over Framer Motion for performance.

---

## File Operations Summary

| Action | Count | Details |
|--------|-------|---------|
| **Delete** | ~17 files | `src_new/` (11), performance stubs (5), AnimationContext (1) |
| **Create** | ~7 files | UI primitives (4), HomePage, NotFoundPage, tokens |
| **Modify** | ~25 files | Every component, all pages, config files, types, hooks |

---

## Current Status

### Completion: Phase R2 Done

- [x] Phase R0: Cleanup
- [x] Phase R1: Design System
- [x] Phase R2: Infrastructure
- [ ] Phase R3: Animation Engine Rewrite
- [ ] Phase R4: Page-by-Page Redesign
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
