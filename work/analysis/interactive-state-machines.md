# Interactive State Machines & Transitions (Replit Ground Truth)

## 1. Top Mega-Navbar State Machine
- **State `activeDropdown: null | 'Products' | 'Solutions' | 'Resources'`**
- **Transitions:**
  - `onMouseEnter(title)` / `onClick(title)`: sets `activeDropdown = title`.
  - `onMouseLeave()`: with 150ms debounce grace period, resets `activeDropdown = null`.
  - `onKeyDown(Escape)`: closes open menu.
- **Mobile Menu State:** `isMobileMenuOpen: boolean` with toggle button.

## 2. Hero Prompt Builder State Machine
- **Category Tab State:** `selectedCategory: string` (default: `'website'`).
  - Available: `['website', 'mobile', 'design', 'slides', 'animation', 'data-viz', '3d-game', 'document', 'spreadsheet']`
- **Prompt Input State:** `promptText: string` (default: `''`).
- **Pill Click Handler:**
  - `onClickPill(example)`: sets `promptText = example.prompt` and focuses textarea.
- **Form Submit Action:**
  - Navigates or triggers Replit Agent initialization with current `promptText`.

## 3. "Maximize Making on Replit" Bento State Machine
- **Mode Selector State:** `activeMode: 'free' | 'power' | 'max'` (default: `'power'`).
- **Interactive Chat Preview:**
  - Animates `Sarah` conversational turns based on selected mode.
  - Highlights token efficiency metrics and frontier model routing badges.

## 4. Template Gallery State Machine
- **Filter State:** `activeFilter: string` (default: `'Featured'`).
  - Available filters: `['Featured', 'Landing Pages', 'Mobile', 'Prototypes', 'Posters', 'Social Posts', 'Email']`.
- **Card Filtering:**
  - When `activeFilter === 'Featured'`: renders all featured templates.
  - Otherwise: filters by exact category match (`card.category === activeFilter`).

## 5. Platform Infrastructure Tabs State Machine
- **Top Level View:** `primaryTab: 'describe' | 'publish'` (default: `'describe'`).
- **Sub-Tab Feature Selector:** `activeInfraTab: 'auth' | 'db' | 'hosting' | 'monitoring'` (default: `'auth'`).
- **Card State:**
  - Selecting sub-tab updates the animated code snippet / architecture graphic preview panel.

## 6. Testimonial Carousel State Machine
- **Index State:** `currentIndex: number` (range: `0 <= currentIndex < items.length - visibleCount`).
- **Controls:**
  - `handlePrev()`: `currentIndex = Math.max(0, currentIndex - 1)`.
  - `handleNext()`: `currentIndex = Math.min(maxIndex, currentIndex + 1)`.
- **Transitions:** Smooth CSS `transform: translateX(-X%)` with `cubic-bezier(0.16, 1, 0.3, 1)` easing.

## 7. Pricing Matrix & Billing Toggle State Machine
- **Toggle State:** `billingCycle: 'monthly' | 'yearly'` (default: `'yearly'`).
- **Pricing Derivation:**
  - `price = billingCycle === 'yearly' ? tier.yearlyPrice : tier.monthlyPrice`.
  - Shows `Save $120` badge and `Save 10%` indicator on yearly cycle.
