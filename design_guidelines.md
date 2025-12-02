# Design Guidelines: Ultra-Premium Real Estate CRM Platform

## Design Approach

**Selected Approach:** Hybrid Reference-Based (Follow Up Boss + Notion + Linear + Modern SaaS)

This is a complex, data-rich SaaS dashboard requiring both visual sophistication and functional efficiency. We'll blend the clean card aesthetics of Follow Up Boss, Notion's organizational clarity, Linear's typography precision, and modern glassmorphism for a premium, Silicon Valley-style experience.

**Core Principles:**
- Premium minimalism with intentional whitespace
- Subtle depth through glassmorphism and soft shadows
- Smooth microinteractions and transitions
- Information density balanced with breathing room
- Professional elegance over flashy elements

---

## Typography System

**Font Stack:**
- **Primary:** Inter (Google Fonts) - weights 400, 500, 600, 700
- **Secondary:** Outfit (for headings/emphasis) - weights 500, 600, 700

**Hierarchy:**
- **Page Titles:** text-3xl font-semibold (Outfit)
- **Section Headers:** text-xl font-semibold (Outfit)
- **Card Titles:** text-lg font-medium (Inter)
- **Body Text:** text-base font-normal (Inter)
- **Metadata/Labels:** text-sm font-medium uppercase tracking-wide
- **Captions:** text-xs font-normal

---

## Layout System

**Spacing Primitives:** Use Tailwind units of **2, 4, 6, 8, 12, 16, 20, 24**

**Core Layout Structure:**
- **Sidebar:** w-64 collapsible to w-16 (icon-only)
- **Main Container:** max-w-screen-2xl mx-auto px-8
- **Content Padding:** py-8 px-6 to py-12 px-8 for major sections
- **Card Spacing:** gap-6 for grids, space-y-6 for stacks
- **Section Margins:** mb-12 to mb-16 between major sections

**Grid Patterns:**
- **Dashboard KPIs:** grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6
- **Property Cards:** grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
- **Pipeline Kanban:** Horizontal scroll with min-w-80 columns, gap-4
- **Forms:** max-w-2xl single column with organized sections

---

## Component Library

### Navigation
**Sidebar:**
- Fixed left, glassmorphic backdrop with subtle blur
- Height: full viewport with smooth collapse animation (300ms ease)
- Section groupings with dividers (border-t with low opacity)
- Icons: Lucide React, size-5, with text-sm labels
- Active state: subtle background glow + accent border-l-3
- Hover: background opacity increase with 150ms transition

**Top Navbar:**
- h-16, glassmorphic with border-b
- Left: Organization switcher dropdown (with logo thumbnail)
- Center: Global search with ⌘K shortcut hint
- Right: Notification bell + user avatar menu

### Cards & Containers
**Standard Card:**
- Rounded-xl with subtle shadow-lg
- Border with very low opacity (border-white/10 dark mode)
- Padding: p-6 to p-8
- Hover state: subtle shadow increase + minimal translate-y-[-2px] (200ms)

**Property Listing Cards:**
- Aspect ratio 4:3 hero image with rounded-t-xl
- Gradient overlay on image for text readability
- Status badge: absolute top-4 right-4, rounded-full px-3 py-1, glassmorphic
- Price: Bold text-2xl on image overlay
- Quick actions: Blur backdrop buttons (backdrop-blur-md bg-white/20) at bottom overlay
- Card body below image: p-4, property details with icon+text pairs

**Dashboard Carousel:**
- Full-width hero section with h-[500px]
- Swiper/Embla carousel with smooth transitions
- Each slide: split layout (60/40) with feature image right, content left
- Pagination dots with active state glow
- Auto-advance with pause on hover

### Forms & Inputs
**Input Fields:**
- Rounded-lg with border, h-11 to h-12
- Focus state: ring-2 with accent color, border color shift
- Labels: text-sm font-medium mb-2, required asterisk in accent color
- Helper text: text-xs mt-1 with muted color
- Error state: ring-red-500, text-red-600 helper

**Dropdowns & Selects:**
- Headless UI Listbox with custom styling
- Dropdown menu: glassmorphic backdrop-blur-xl, shadow-2xl, rounded-xl
- Options: hover bg with smooth transition, checkmark for selected

**Buttons:**
- Primary: h-11 px-6 rounded-lg font-medium, solid background
- Secondary: border with hover fill transition
- Ghost: hover background fade-in
- Icon buttons: size-10 rounded-lg
- All buttons: active:scale-[0.98] transform (100ms)
- On images: backdrop-blur-md bg-white/20 border border-white/30

### Data Display
**Pipeline Kanban:**
- Horizontal scrollable container with snap-x
- Column: min-w-80 max-w-96, glassmorphic background
- Column header: sticky top-0, p-4, count badge
- Deal cards: stacked with gap-3, draggable with hover lift
- Empty state: dashed border with centered icon+text

**Tables:**
- Minimal borders, zebra striping with very subtle alternation
- Header: sticky top-0, backdrop-blur, font-medium text-sm uppercase
- Row hover: background shift with smooth transition
- Actions column: opacity-0 to opacity-100 on row hover

**Stats/KPI Cards:**
- Large number: text-4xl font-bold
- Metric label: text-sm uppercase tracking-wide
- Trend indicator: icon + percentage with color coding
- Sparkline/mini chart optional in card footer

### Overlays & Modals
**Modal Dialogs:**
- Headless UI Dialog with backdrop-blur-sm overlay
- Content: max-w-2xl rounded-2xl shadow-2xl
- Header: border-b pb-4, title text-2xl
- Footer: border-t pt-4, action buttons right-aligned gap-3
- Close button: absolute top-4 right-4, rounded-full hover state

**Slide-overs:**
- Right-side panel, w-96 to w-[500px]
- Full height with shadow-2xl
- For detail views (property details, contact info, activity timeline)

### Special Components
**AI Generation Button:**
- Gradient background with subtle animation
- Icon: sparkles/stars, positioned left
- Loading state: pulsing glow effect
- Disabled state: opacity reduction with cursor-not-allowed

**Media Upload Zone:**
- Dashed border rounded-xl, min-h-48
- Drag-active state: border solid, background glow
- Preview thumbnails in grid below with remove icon overlay on hover

---

## Animations & Microinteractions

**Global Transitions:**
- Page transitions: fade + slide 300ms ease-out
- Sidebar collapse: width + opacity 300ms ease-in-out
- Modal enter/exit: scale 200ms + opacity 150ms

**Microinteractions:**
- Button clicks: scale-[0.98] 100ms
- Card hovers: translateY(-2px) + shadow 200ms
- Toggle switches: smooth 200ms background slide
- Ripple effect on major actions (property save, deal moved)
- Loading skeletons: shimmer animation for async content

**Scroll Behaviors:**
- Smooth scroll for navigation jumps
- Parallax very subtle on dashboard hero (optional)
- Sticky headers with shadow appearance on scroll

---

## Images & Visual Assets

**Hero Section (Dashboard):**
- Large background image: Premium office/real estate agency workspace, 1920x1080
- Subtle gradient overlay for text contrast
- Glassmorphic content card centered with welcome message and quick stats

**Property Cards:**
- High-quality property photos (exterior/interior), 16:9 aspect ratio
- Placeholder: Use gradient backgrounds with property icon for properties without images

**Empty States:**
- Friendly illustrations (undraw.co style) for "No properties yet", "No deals in pipeline"
- Center-aligned with icon, heading, description, and CTA button

**Icons:**
- Lucide React throughout (Building2, Users, Sparkles, Calendar, BarChart3, Settings, etc.)
- size-5 for sidebar, size-4 for inline, size-6 to size-8 for empty states

**Avatars & Logos:**
- Rounded-full for user avatars (size-8 to size-10)
- Rounded-lg for organization logos
- Fallback: Initials with gradient backgrounds

---

## Platform-Specific Patterns

**Multi-Column Strategy:**
- Dashboard: 4-column KPI grid on large screens
- Properties: 3-column card grid with filters sidebar (left, w-64)
- Pipeline: Horizontal columns (not vertical grid), scrollable
- Forms: Single column max-w-2xl for optimal reading/input
- Settings: 2-column layout (sidebar navigation + content panel)

**Viewport Management:**
- No forced 100vh sections
- Natural content flow with proper padding
- Sticky elements: top navbar (z-50), sidebar (z-40), table headers (z-30)

---

This design system creates a cohesive, premium experience that balances visual sophistication with functional clarity—perfect for a professional real estate CRM platform that competes with top-tier SaaS products.