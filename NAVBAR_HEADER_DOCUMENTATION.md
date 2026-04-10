# TG Calabria Frontend - Navbar and Header Documentation

## Overview

This document explains how the navbar and header components work in the TG Calabria frontend application. The implementation follows CNN's design patterns and includes both desktop and mobile responsive layouts with bilingual support (English/Italian).

## Architecture

### Main Components

1. **CNNHeaderExact** (`/src/components/ui/cnn-header-exact.tsx`) - Main header component
2. **Navbar** (`/src/components/ui/navbar.tsx`) - Primary navigation component  
3. **CNNHeaderRight** (`/src/components/ui/cnn-header-right.tsx`) - Right-side header actions
4. **CNNNavbar** (`/src/components/ui/cnn-navbar.tsx`) - Alternative navbar implementation

### Styling Files

- `/src/styles/cnn-header.css` - Header-specific styles
- `/src/styles/cnn-navbar.css` - Navbar-specific styles
- `/src/styles/cnn-header-exact.css` - Exact CNN header styles
- `/src/styles/cnn-navbar-exact.css` - Exact CNN navbar styles

## Header Implementation

### CNNHeaderExact Component

The main header component (`CNNHeaderExact`) is used in the root layout and provides:

```tsx
// Key Features:
- Sticky header with advertisement banner
- Navigation bar with logo and menu items
- Mobile responsive hamburger menu
- Right-side actions (Watch, Listen, Search, Sign In)
- Advertisement feedback modal
- Bilingual support (English/Italian)
```

#### Structure:

```tsx
<CNNHeaderExact />
├── Advertisement Banner (276px height)
│   ├── Ad slot with iframe
│   └── Ad feedback button
├── Navigation Bar (56px height)
│   ├── Left Section
│   │   ├── Hamburger Menu Icon (mobile only)
│   │   └── TG Calabria Logo
│   ├── Center Section
│   │   └── Navigation Links (desktop only)
│   └── Right Section
│       ├── Watch Link
│       ├── Listen Link
│       ├── Search Icon
│       └── Sign In / User Profile
└── Mobile Menu (overlay)
    └── Full navigation items list
```

#### Key Features:

**1. Sticky Behavior:**
- Header wrapper positioned sticky with `-276px` top offset
- Becomes visible when scrolling past 100px threshold
- Smooth transitions using cubic-bezier easing

**2. Advertisement Integration:**
- 970x90px desktop banner, 320x50px mobile
- Simulated ad loading with 1.5s delay
- Feedback modal for user ad experience

**3. Mobile Menu:**
- Full-screen overlay with slide animation
- Body scroll prevention when open
- Touch-optimized interactions
- Auto-close on route change

## Navbar Implementation

### Main Navbar Component

The primary navbar (`Navbar`) provides navigation with CNN-style design:

```tsx
// Key Features:
- Bilingual menu items (English/Italian)
- "More" dropdown for overflow items
- Active state highlighting
- Hover effects with red accent color
- Mobile responsive design
```

#### Menu Structure:

```tsx
const TG_CALABRIA_MENU_ITEMS = [
  { nameEn: "US", nameIt: "USA", href: "/category/us" },
  { nameEn: "World", nameIt: "Mondo", href: "/category/world" },
  { nameEn: "Politics", nameIt: "Politica", href: "/category/politics" },
  { nameEn: "Business", nameIt: "Economia", href: "/category/business" },
  { nameEn: "Health", nameIt: "Salute", href: "/category/health" },
  { nameEn: "Entertainment", nameIt: "Intrattenimento", href: "/category/entertainment" },
  { nameEn: "Style", nameIt: "Stile", href: "/category/style" },
  { nameEn: "Travel", nameIt: "Viaggi", href: "/category/travel" },
  // More items...
];
```

#### Key Features:

**1. Responsive Navigation:**
- Shows first 8 items on desktop
- Remaining items in "More" dropdown
- Full list in mobile menu

**2. Active State Management:**
- Uses `usePathname()` for route detection
- Highlights current section with red color
- Supports nested route matching

**3. Touch Interactions:**
- Debounced touch handlers to prevent double-taps
- Pointer events for better mobile support
- Outside click detection for dropdowns

## Styling System

### CNN Design Language

The components follow CNN's design system:

```css
/* Typography */
font-family: 'CNN', 'Helvetica Neue', Helvetica, Arial, sans-serif;

/* Colors */
--primary-red: #CC0000;
--text-black: #000000;
--border-gray: #e6e6e6;
--background-light: #f5f5f5;

/* Transitions */
transition: all 0.15s ease (hover states)
transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1) (animations)
```

### Responsive Breakpoints:

```css
/* Desktop */
@media (min-width: 993px) {
  /* Full navigation visible */
}

/* Tablet */
@media (max-width: 992px) {
  /* Mobile menu enabled */
}

/* Mobile */
@media (max-width: 768px) {
  /* Compact layout */
}
```

## State Management

### Key State Variables:

```tsx
// Header State
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
const [isMoreOpen, setIsMoreOpen] = useState(false);
const [isHeaderSticky, setIsHeaderSticky] = useState(false);
const [scrollY, setScrollY] = useState(0);

// Auth State
const { isAuthenticated } = useAuth();

// Language State
const { language } = useLanguage();
```

### Effects:

1. **Scroll Detection:** Monitors scroll position for sticky header
2. **Outside Click:** Closes dropdowns when clicking outside
3. **Route Change:** Auto-closes mobile menu on navigation
4. **Body Lock:** Prevents background scroll when mobile menu is open

## Integration with Layout

The header/navbar is integrated into the main layout:

```tsx
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundary>
          <QueryProvider>
            <LanguageProvider>
              <AuthProvider>
                <ToastProvider>
                  <BehaviorTracker>
                    <AdsWrapper />
                    <BreakingNewsManager />
                    <div className="min-h-screen bg-[#FFFFFF]">
                      <CNNHeaderExact />  {/* Header/Navbar here */}
                      <MainContent>
                        {children}
                      </MainContent>
                      <MegaFooter />
                    </div>
                  </BehaviorTracker>
                </ToastProvider>
              </AuthProvider>
            </LanguageProvider>
          </QueryProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
```

## Key Features Explained

### 1. Bilingual Support

The system supports English and Italian languages:

```tsx
const displayName = language === "it" ? item.nameIt : item.nameEn;
```

### 2. Advertisement Integration

- Simulated ad loading with realistic timing
- Feedback system for user experience
- Responsive sizing (desktop/mobile)

### 3. Mobile Optimization

- Touch-friendly interactions
- Slide animations with hardware acceleration
- Body scroll prevention
- Responsive typography

### 4. Accessibility

- ARIA labels and roles
- Keyboard navigation support
- Focus management
- Screen reader compatibility

### 5. Performance

- Lazy loading for mobile menu
- Debounced event handlers
- Optimized re-renders
- CSS transitions over JavaScript animations

## Customization

### Adding New Menu Items:

```tsx
// Add to TG_CALABRIA_MENU_ITEMS array
{ nameEn: "Technology", nameIt: "Tecnologia", href: "/category/technology" }
```

### Modifying Colors:

```css
/* Update CSS variables */
:root {
  --primary-red: #CC0000;  /* Change to desired brand color */
}
```

### Adjusting Breakpoints:

```css
/* Modify media queries */
@media (max-width: 1024px) {  /* Custom breakpoint */
  /* Custom styles */
}
```

## File Structure

```
src/
├── components/ui/
│   ├── cnn-header-exact.tsx     # Main header component
│   ├── navbar.tsx               # Primary navbar
│   ├── cnn-header-right.tsx     # Right-side actions
│   └── cnn-navbar.tsx           # Alternative navbar
├── styles/
│   ├── cnn-header.css           # Header styles
│   ├── cnn-navbar.css           # Navbar styles
│   ├── cnn-header-exact.css     # Exact header styles
│   └── cnn-navbar-exact.css     # Exact navbar styles
└── providers/
    ├── AuthProvider.tsx         # Authentication state
    └── LanguageProvider.tsx     # Language state
```

## Conclusion

The TG Calabria header/navbar system provides a professional, CNN-inspired navigation experience with:

- Responsive design for all devices
- Bilingual support
- Modern interactions and animations
- Advertisement integration
- Accessibility compliance
- Performance optimization

The modular architecture allows for easy customization and maintenance while maintaining consistency with CNN's design standards.
