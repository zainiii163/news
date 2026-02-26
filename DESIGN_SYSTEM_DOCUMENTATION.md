# TG Calabria News Frontend - Design System Documentation

## Overview

This document provides a comprehensive overview of the design system, UI implementation, color schemes, layouts, and component usage across the TG Calabria News Frontend application.

## Table of Contents
1. [Architecture & Design Philosophy](#architecture--design-philosophy)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Layout System](#layout-system)
5. [Component Library](#component-library)
6. [Page Layouts](#page-layouts)
7. [Responsive Design](#responsive-design)
8. [Theme Implementation](#theme-implementation)
9. [CSS Classes & Utilities](#css-classes--utilities)
10. [Design Patterns](#design-patterns)

---

## Architecture & Design Philosophy

### Design Philosophy
The TG Calabria News Frontend follows a **CNN-inspired design system** with a modern, clean aesthetic focused on news delivery. The design emphasizes:

- **Readability**: Clear typography and high contrast
- **Professionalism**: Clean, news-worthy appearance
- **Accessibility**: Semantic HTML and ARIA compliance
- **Performance**: Optimized images and lazy loading
- **Responsive**: Mobile-first approach

### Technology Stack
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with custom CNN-themed classes
- **Components**: React with TypeScript
- **State Management**: React Context (Auth, Language, Query)
- **Icons**: Inline SVG components

---

## Color System

### Primary Color Palette

#### CNN Theme Colors
```css
/* Primary Brand Colors */
--cnn-red: #ff0000;          /* Primary accent color */
--cnn-black: #000000;         /* Primary background */
--cnn-white: #ffffff;         /* Text on dark backgrounds */
--cnn-gray-100: #f3f4f6;     /* Light backgrounds */
--cnn-gray-200: #e5e7eb;     /* Borders */
--cnn-gray-400: #9ca3af;     /* Muted text */
--cnn-gray-600: #4b5563;     /* Secondary text */
--cnn-gray-800: #1f2937;     /* Dark text */
--cnn-gray-900: #111827;     /* Darkest text */
```

#### Semantic Color Usage
- **Red (#ff0000)**: Primary branding, breaking news, hover states, active states
- **Black (#000000)**: Navbar background, footer background, high-contrast elements
- **White (#ffffff)**: Text on dark backgrounds, card backgrounds
- **Gray Gradients**: Used for subtle backgrounds, borders, and text hierarchy

### Color Implementation

#### Global CSS Variables
```css
:root {
  --background: #ffffff;
  --foreground: #171717;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
}
```

#### CNN-Specific Classes
```css
.cnn-navbar {
  background-color: #000 !important;
  border-bottom: 1px solid #333 !important;
}

.cnn-nav-link {
  color: #fff !important;
  font-size: 14px !important;
  font-weight: 500 !important;
}

.cnn-nav-link:hover {
  color: #ff0000 !important;
}

.cnn-logo {
  color: #ff0000 !important;
  font-size: 24px !important;
  font-weight: 700 !important;
}
```

---

## Typography

### Font System
```css
body {
  font-family: CNN, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}
```

#### Google Fonts Integration
```typescript
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false,
  fallback: ["monospace"],
});
```

### Typography Scale
- **Headlines**: Bold, large sizes for news titles
- **Body Text**: Regular weight, optimized for readability
- **Navigation**: Medium weight, 14px for navbar items
- **Meta Information**: Small, gray-colored text for timestamps and categories

---

## Layout System

### Container Structure
```typescript
<div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 max-w-7xl">
  {/* Content */}
</div>
```

### Grid System
- **Responsive Grid**: Uses Tailwind's grid system
- **News Cards**: Responsive grid layout (1 column mobile, 2 tablet, 3+ desktop)
- **Footer**: 6-column grid on desktop, stacks on mobile

### Layout Hierarchy
```
RootLayout (app/layout.tsx)
├── ErrorBoundary
├── QueryProvider
├── LanguageProvider
├── AuthProvider
├── ToastProvider
├── BehaviorTracker
├── AdsWrapper
├── BreakingNewsManager
└── Page Content
```

---

## Component Library

### Core UI Components

#### 1. Navigation Components
- **Navbar** (`src/components/ui/navbar.tsx`): Main navigation with CNN styling
- **UtilityBar**: Top utility links and language switcher
- **CategoryNav**: Horizontal category navigation
- **MobileMenu**: Responsive mobile navigation
- **SearchDropdown**: Search functionality with dropdown

#### 2. Content Components
- **NewsCard** (`src/components/ui/news-card.tsx`): News article cards with hover effects
- **HeroSlider**: Featured news carousel
- **TrendingBar**: Trending topics display
- **OptimizedImage**: Lazy-loaded images with optimization

#### 3. Layout Components
- **Footer** (`src/components/ui/footer.tsx`): Comprehensive footer with multiple sections
- **FormModal**: Modal dialogs for forms
- **Loading**: Loading states and spinners

#### 4. Interactive Components
- **BookmarkButton**: Save articles functionality
- **VideoPlayer**: Embedded video content
- **Toast**: Notification system

### Component Design Patterns

#### News Card Structure
```typescript
<div className="bg-white rounded-lg shadow-md overflow-hidden h-full">
  {/* Image/Video Section */}
  <div className="relative w-full overflow-hidden h-48">
    <OptimizedImage />
    {/* Breaking Badge */}
    {/* Bookmark Button */}
  </div>
  
  {/* Content Section */}
  <div className="p-4">
    {/* Category & Time */}
    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
      <span className="text-red-600 font-semibold">{category}</span>
      <span>•</span>
      <span>{time}</span>
    </div>
    
    {/* Title */}
    <h3 className="font-bold mb-2 line-clamp-2 group-hover:text-red-600 transition">
      {title}
    </h3>
    
    {/* Summary */}
    <p className="text-gray-600 text-sm line-clamp-3">{summary}</p>
  </div>
</div>
```

---

## Page Layouts

### 1. Main Layout (`app/layout.tsx`)
- **Background**: Black theme (`bg-black text-white`)
- **Providers**: Wraps entire app with necessary context providers
- **Structure**: Error boundary → Query → Language → Auth → Toast → Behavior → Content

### 2. Admin Layout (`app/admin/layout.tsx`)
- **Theme**: Light gray background (`bg-gray-100`)
- **Structure**: Sidebar + Main Content Area
- **Features**: Collapsible sidebar, mobile menu, role-based access

#### Admin Layout Structure
```typescript
<div className="flex min-h-screen bg-gray-100">
  {/* Desktop Sidebar */}
  <div className="hidden lg:block">
    <AdminSidebar />
  </div>
  
  {/* Mobile Menu Overlay & Sidebar */}
  {/* Main Content */}
  <div className="flex-1 flex flex-col">
    <AdminNavbar />
    <main>{children}</main>
  </div>
</div>
```

### 3. Advertiser Layout (`app/advertiser/layout.tsx`)
- Similar to admin layout but advertiser-specific
- Different sidebar navigation
- Role-based routing

---

## CNN-Inspired Page Layouts

### 1. Homepage Layout (`app/page.tsx`)

#### CNN-Style Homepage Structure
```
┌─────────────────────────────────────────────────────────────┐
│ BLACK NAVIGATION BAR                                        │
│ [CNN LOGO] [Menu] [World] [Politics] [Business] [Opinion]  │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│ BREAKING NEWS BANNER (RED)                                 │
│ 🚨 BREAKING: [Latest Breaking News Headline]               │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│ HERO SECTION                                                │
│ ┌─────────────────┐ ┌─────────────────────────────────────┐ │
│ │ MAIN STORY      │ │ TRENDING NOW                       │ │
│ │ Large Image     │ │ • Trending Story 1                 │ │
│ │ Bold Headline   │ │ • Trending Story 2                 │ │
│ │ Summary Text    │ │ • Trending Story 3                 │ │
│ │ Read More →     │ │ • Trending Story 4                 │ │
│ └─────────────────┘ └─────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│ LATEST NEWS GRID                                            │
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐         │
│ │Card1│ │Card2│ │Card3│ │Card4│ │Card5│ │Card6│         │
│ │Img  │ │Img  │ │Img  │ │Img  │ │Img  │ │Img  │         │
│ │Title│ │Title│ │Title│ │Title│ │Title│ │Title│         │
│ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘         │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│ CATEGORY SECTIONS                                           │
│ ┌─────────────────────┐ ┌─────────────────────────────────┐ │
│ │ WORLD NEWS          │ │ POLITICS                        │ │
│ │ [3-column grid]     │ │ [3-column grid]                 │ │
│ └─────────────────────┘ └─────────────────────────────────┘ │
│ ┌─────────────────────┐ ┌─────────────────────────────────┐ │
│ │ BUSINESS            │ │ SPORTS                          │ │
│ │ [3-column grid]     │ │ [3-column grid]                 │ │
│ └─────────────────────┘ └─────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│ VIDEO SECTION                                               │
│ Featured Video Player + Video Grid                         │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│ OPINION SECTION                                             │
│ Columnist Images + Opinion Articles Grid                   │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│ BLACK FOOTER                                                │
│ [CNN Logo] [Links] [Social Media] [Copyright]             │
└─────────────────────────────────────────────────────────────┘
```

#### Homepage Implementation Details
```typescript
// Hero Section - CNN Style
<section className="bg-black text-white">
  <div className="container mx-auto px-4">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-8">
      {/* Main Story */}
      <div className="lg:col-span-2">
        <div className="relative">
          <OptimizedImage src={mainStory.image} className="w-full h-96 object-cover" />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
            <span className="text-red-500 font-bold text-sm">BREAKING NEWS</span>
            <h1 className="text-3xl lg:text-4xl font-bold mt-2">{mainStory.title}</h1>
            <p className="text-gray-300 mt-2">{mainStory.summary}</p>
          </div>
        </div>
      </div>
      
      {/* Trending Sidebar */}
      <div className="bg-gray-900 p-6">
        <h2 className="text-red-500 font-bold text-lg mb-4">TRENDING NOW</h2>
        <div className="space-y-4">
          {trendingStories.map((story, index) => (
            <div key={index} className="flex items-start space-x-3">
              <span className="text-red-500 font-bold">{index + 1}</span>
              <div>
                <h3 className="font-semibold hover:text-red-500 cursor-pointer">
                  {story.title}
                </h3>
                <span className="text-gray-400 text-sm">{story.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
</section>

// News Grid - CNN Style
<section className="bg-white py-8">
  <div className="container mx-auto px-4">
    <h2 className="text-2xl font-bold mb-6 border-b-2 border-red-500 pb-2">LATEST NEWS</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {newsCards.map((article) => (
        <NewsCard key={article.id} article={article} />
      ))}
    </div>
  </div>
</section>
```

### 2. News Detail Page Layout (`app/news/[slug]/page.tsx`)

#### CNN Article Layout Structure
```
┌─────────────────────────────────────────────────────────────┐
│ BLACK NAVIGATION BAR                                        │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│ ARTICLE HEADER                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Category: WORLD POLITICS                                │ │
│ │                                                         │ │
│ │ Article Title in Large Bold Text                        │ │
│ │                                                         │ │
│ │ By Author Name • Published 2 hours ago                  │ │
│ │ Updated 1 hour ago • 5 min read                         │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│ ARTICLE BODY LAYOUT                                         │
│ ┌─────────────────────┐ ┌─────────────────────────────────┐ │
│ │ MAIN CONTENT        │ │ SIDEBAR                         │ │
│ │                     │ │                                 │ │
│ │ [Featured Image]    │ │ • MOST READ                     │ │
│ │                     │ │   1. Story Title               │ │
│ │ Article Body Text   │ │   2. Story Title               │ │
│ │ with proper         │ │   3. Story Title               │ │
│ │ typography and      │ │                                 │ │
│ │ spacing             │ │ • RELATED STORIES               │ │
│ │                     │ │   [Related Article Cards]       │ │
│ │ [Subheadings]       │ │                                 │ │
│ │ [Quotes]            │ │ • VIDEO SECTION                 │ │
│ │ [Images]            │ │   [Video Player]                │ │
│ │                     │ │                                 │ │
│ │                     │ │ • NEWSLETTER SIGNUP             │ │
│ │                     │ │   [Email Form]                  │ │
│ └─────────────────────┘ └─────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│ COMMENTS SECTION                                             │
│ [Comment Form] + [Comments List]                           │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│ RELATED ARTICLES GRID                                        │
│ [3-4 related article cards]                                 │
└─────────────────────────────────────────────────────────────┘
```

#### Article Page Implementation
```typescript
// Article Header
<header className="bg-white border-b">
  <div className="container mx-auto px-4 py-6">
    <nav className="text-sm text-gray-600 mb-4">
      <Link href="/">Home</Link> / <Link href="/world">World</Link> / 
      <span className="text-black"> Article Title</span>
    </nav>
    <h1 className="text-3xl lg:text-5xl font-bold text-black leading-tight">
      {article.title}
    </h1>
    <div className="flex items-center space-x-4 mt-4 text-gray-600">
      <span>By {article.author}</span>
      <span>•</span>
      <span>{formatDate(article.publishedAt)}</span>
      <span>•</span>
      <span>{article.readTime} min read</span>
    </div>
  </div>
</header>

// Article Body Layout
<div className="container mx-auto px-4 py-8">
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
    {/* Main Content */}
    <article className="lg:col-span-2">
      <div className="prose prose-lg max-w-none">
        <OptimizedImage 
          src={article.featuredImage} 
          className="w-full h-96 object-cover rounded-lg mb-6"
        />
        <div dangerouslySetInnerHTML={{ __html: article.content }} />
      </div>
    </article>
    
    {/* Sidebar */}
    <aside className="space-y-8">
      {/* Most Read */}
      <div className="bg-gray-100 p-6">
        <h3 className="font-bold text-lg mb-4 border-b-2 border-red-500 pb-2">
          MOST READ
        </h3>
        <div className="space-y-3">
          {mostRead.map((story, index) => (
            <div key={index} className="flex space-x-3">
              <span className="text-red-500 font-bold">{index + 1}</span>
              <Link href={story.url} className="hover:text-red-500">
                {story.title}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </aside>
  </div>
</div>
```

### 3. Category Page Layout (`app/category/[category]/page.tsx`)

#### CNN Category Page Structure
```
┌─────────────────────────────────────────────────────────────┐
│ BLACK NAVIGATION BAR                                        │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│ CATEGORY HEADER                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ WORLD                                                   │ │
│ │                                                         │ │
│ │ Subcategory tabs: [All] [Africa] [Asia] [Europe] [US]   │ │
│ │                                                         │ │
│ │ Filter: [Latest] [Most Read] [Most Shared]              │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│ FEATURED STORY SECTION                                      │
│ [Large featured story with image and summary]              │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│ NEWS GRID                                                   │
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐         │
│ │Card1│ │Card2│ │Card3│ │Card4│ │Card5│ │Card6│         │
│ │Img  │ │Img  │ │Img  │ │Img  │ │Img  │ │Img  │         │
│ │Title│ │Title│ │Title│ │Title│ │Title│ │Title│         │
│ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘         │
│                                                             │
│ [Load More Button]                                         │
└─────────────────────────────────────────────────────────────┘
```

### 4. Search Results Layout (`app/search/page.tsx`)

#### CNN Search Results Structure
```
┌─────────────────────────────────────────────────────────────┐
│ BLACK NAVIGATION BAR                                        │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│ SEARCH HEADER                                               │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 🔍 Search: "climate change"                              │ │
│ │                                                         │ │
│ │ Results: 1,234 articles                                 │ │
│ │                                                         │ │
│ │ Filters: [All Time] [Past Week] [Past Month] [Sort by]  │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│ SEARCH RESULTS                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Result 1:                                               │ │
│ │ [Thumbnail] Title with highlighted search terms        │ │
│ │ Summary with highlighted terms • Date • Category       │ │
│ └─────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Result 2:                                               │ │
│ │ [Thumbnail] Title with highlighted search terms        │ │
│ │ Summary with highlighted terms • Date • Category       │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ [Pagination]                                               │
└─────────────────────────────────────────────────────────────┘
```

### 5. Admin Dashboard Layout (`app/admin/page.tsx`)

#### CNN-Style Admin Dashboard Structure
```
┌─────────────────────────────────────────────────────────────┐
│ ADMIN NAVIGATION BAR                                        │
│ [Admin Panel] [Dashboard] [Articles] [Users] [Analytics]   │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│ DASHBOARD OVERVIEW                                           │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────┐ │
│ │ Total       │ │ Published   │ │ Draft       │ │ Views   │ │
│ │ Articles    │ │ Articles    │ │ Articles    │ │ Today   │ │
│ │ 1,234       │ │ 892         │ │ 342         │ │ 45.2K   │ │
│ └─────────────┘ └─────────────┘ └─────────────┘ └─────────┘ │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│ QUICK ACTIONS                                               │
│ [New Article] [New Category] [Manage Users] [View Analytics] │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│ RECENT ACTIVITY                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ • John Doe published "Climate Change Impact"            │ │
│ │ • Jane Smith created draft "Economic Update"           │ │
│ │ • Admin added new category "Technology"                │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 6. User Profile Layout (`app/profile/page.tsx`)

#### CNN Profile Page Structure
```
┌─────────────────────────────────────────────────────────────┐
│ BLACK NAVIGATION BAR                                        │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│ PROFILE HEADER                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ [Avatar] User Name                                      │ │
│ │                                                         │ │
│ │ Email: user@example.com                                 │ │
│ │ Member since: January 2024                             │ │
│ │                                                         │ │
│ │ [Edit Profile] [Settings] [Logout]                      │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│ USER CONTENT TABS                                           │
│ [Bookmarks] [Reading History] [Comments] [Preferences]     │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│ BOOKMARKED ARTICLES                                         │
│ [Grid of bookmarked article cards]                         │
└─────────────────────────────────────────────────────────────┘
```

### 7. Contact/About Layout (`app/about/page.tsx`)

#### CNN About Page Structure
```
┌─────────────────────────────────────────────────────────────┐
│ BLACK NAVIGATION BAR                                        │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│ PAGE HEADER                                                  │
│ About TG Calabria News                                      │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│ CONTENT SECTIONS                                            │
│ ┌─────────────────────┐ ┌─────────────────────────────────┐ │
│ │ Our Mission         │ │ Our Team                       │ │
│ │                     │ │                                 │ │
│ │ Mission statement   │ │ [Team member cards with photos] │
│ │ and values          │ │                                 │ │
│ └─────────────────────┘ └─────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Contact Information                                      │ │
│ │                                                         │ │
│ │ Email: info@tgcalabrianews.com                          │ │
│ │ Phone: +39 123 456 789                                 │ │
│ │ Address: Calabria, Italy                               │ │
│ │                                                         │ │
│ │ [Contact Form]                                         │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## Mobile-First Responsive Design

### Mobile Layout Adaptations

#### Homepage Mobile (< 768px)
```
┌─────────────────────────┐
│ ☰ CNN                  │
├─────────────────────────┤
│ 🚨 BREAKING NEWS       │
│ [Headline]             │
├─────────────────────────┤
│ [Main Story Image]     │
│ Bold Title             │
│ Summary Text           │
│ Read More →            │
├─────────────────────────┤
│ TRENDING               │
│ 1. Story Title         │
│ 2. Story Title         │
│ 3. Story Title         │
├─────────────────────────┤
│ [News Card]            │
│ [News Card]            │
│ [News Card]            │
├─────────────────────────┤
│ WORLD →                │
│ POLITICS →             │
│ BUSINESS →             │
├─────────────────────────┤
│ Footer Links           │
└─────────────────────────┘
```

#### Article Mobile Layout
```
┌─────────────────────────┐
│ ← Back Article Title    │
├─────────────────────────┤
│ [Featured Image]        │
│ By Author • 2h ago     │
├─────────────────────────┤
│ Article Content         │
│ (Optimized for mobile)  │
├─────────────────────────┤
│ MOST READ               │
│ 1. Story Title         │
│ 2. Story Title         │
├─────────────────────────┤
│ Related Stories         │
│ [Card] [Card]           │
├─────────────────────────┤
│ Comments                │
└─────────────────────────┘
```

### Tablet Layout (768px - 1024px)
- 2-column grids instead of 3-4 columns
- Sidebar appears but smaller
- Navigation adapts to horizontal layout
- Images scale appropriately

### Desktop Layout (> 1024px)
- Full multi-column layouts
- Complete sidebar content
- Hover states and interactions
- Larger typography and spacing

---

## Component Design Specifications

### News Card Component
```typescript
interface NewsCardProps {
  article: {
    id: string;
    title: string;
    summary: string;
    image: string;
    category: string;
    publishedAt: string;
    author: string;
    readTime: number;
    isBreaking?: boolean;
  };
  variant?: 'default' | 'featured' | 'compact';
}

// CNN-Style News Card Variants
const variants = {
  default: "bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow",
  featured: "bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow border-l-4 border-red-500",
  compact: "bg-white rounded shadow-sm overflow-hidden hover:shadow-md transition-shadow"
};
```

### Navigation Component
```typescript
// CNN Navigation Structure
const navigationItems = [
  { name: 'World', href: '/world', active: true },
  { name: 'Politics', href: '/politics' },
  { name: 'Business', href: '/business' },
  { name: 'Opinion', href: '/opinion' },
  { name: 'Sports', href: '/sports' },
  { name: 'Entertainment', href: '/entertainment' },
  { name: 'Travel', href: '/travel' },
  { name: 'Style', href: '/style' }
];
```

### Footer Component
```typescript
// CNN Footer Structure
const footerSections = [
  {
    title: 'News',
    links: ['World', 'Politics', 'Business', 'Opinion', 'Sports']
  },
  {
    title: 'Features',
    links: ['Video', 'Audio', 'Photos', 'Live TV', 'Shop']
  },
  {
    title: 'More',
    links: ['About', 'Contact', 'Careers', 'Privacy Policy', 'Terms of Use']
  }
];
```

---

## Responsive Design

### Breakpoint System
```css
/* Mobile First Approach */
sm: 640px   /* Small tablets */
md: 768px   /* Tablets */
lg: 1024px  /* Small desktops */
xl: 1280px  /* Desktops */
2xl: 1536px /* Large desktops */
```

### Mobile Optimizations
- **Touch Targets**: Minimum 44px for buttons
- **Mobile Menu**: Slide-out navigation with overlay
- **Image Optimization**: Responsive image sizes
- **Typography**: Readable font sizes on mobile

### Desktop Features
- **Hover States**: Interactive elements respond to hover
- **Larger Layouts**: More columns for content grids
- **Keyboard Navigation**: Full keyboard accessibility

---

## Theme Implementation

### CSS Architecture
- **Global Styles**: `app/globals.css`
- **Component Styles**: Tailwind classes with custom CSS variables
- **Theme Overrides**: CNN-specific classes with `!important` for consistency

### Custom CSS Classes

#### Navigation Classes
```css
.cnn-navbar              /* Main navigation bar */
.cnn-nav-link           /* Navigation links */
.cnn-nav-link:hover     /* Hover state */
.cnn-nav-link.active    /* Active state */
.cnn-logo              /* Logo styling */
.cnn-sign-in-btn       /* Sign in button */
.cnn-search-btn        /* Search button */
.cnn-more-dropdown     /* Dropdown menu */
.cnn-search-input      /* Search input field */
```

#### Utility Classes
```css
.scrollbar-hide        /* Hide scrollbars */
.line-clamp-2          /* Limit to 2 lines */
.line-clamp-3          /* Limit to 3 lines */
.group-hover:scale-105 /* Hover scale effect */
```

---

## Design Patterns

### 1. Color Usage Patterns
- **Red Accent**: Used for branding, breaking news, interactive states
- **Black Background**: Navigation and footer for contrast
- **White Cards**: Content containers for readability
- **Gray Hierarchy**: Different shades for text importance

### 2. Layout Patterns
- **Container Pattern**: Consistent max-width and padding
- **Card Pattern**: White backgrounds with shadows for content
- **Grid Pattern**: Responsive grids for news listings
- **Sidebar Pattern**: Collapsible navigation for admin areas

### 3. Interaction Patterns
- **Hover Effects**: Scale transforms on cards and images
- **Color Transitions**: Smooth color changes on interactive elements
- **Loading States**: Consistent loading indicators
- **Error Boundaries**: Graceful error handling

### 4. Component Patterns
- **Compound Components**: Related components that work together
- **Render Props**: Flexible component composition
- **Higher-Order Components**: Cross-cutting concerns
- **Context Providers**: Global state management

---

## Usage Guidelines

### When to Use CNN Theme Classes
- Use `cnn-*` classes for navigation and branding elements
- Use Tailwind classes for layout and spacing
- Combine both for custom components

### Color Usage Rules
- **Red**: Use sparingly for accents and CTAs
- **Black**: Use for navigation and high-contrast areas
- **White**: Use for content cards and text on dark
- **Gray**: Use for subtle backgrounds and muted text

### Typography Guidelines
- **Headlines**: Bold, larger sizes for hierarchy
- **Body Text**: Regular weight for readability
- **Navigation**: Medium weight, consistent sizing
- **Meta Info**: Small, gray-colored for secondary info

---

## Performance Considerations

### Image Optimization
- **Lazy Loading**: All images use `loading="lazy"`
- **Responsive Images**: Different sizes for different viewports
- **Quality Settings**: Optimized quality (75) for balance
- **Modern Formats**: WebP support when available

### CSS Optimization
- **PurgeCSS**: Unused CSS removed in production
- **Critical CSS**: Above-the-fold CSS inlined
- **Minification**: CSS minified in production build

### Component Optimization
- **React.memo**: Prevent unnecessary re-renders
- **useMemo**: Expensive calculations cached
- **Code Splitting**: Dynamic imports for large components

---

## Accessibility Features

### Semantic HTML
- **Proper Landmarks**: `<nav>`, `<main>`, `<footer>`, `<section>`
- **Heading Hierarchy**: Proper h1-h6 structure
- **ARIA Labels**: Screen reader support

### Keyboard Navigation
- **Tab Order**: Logical tab navigation
- **Focus States**: Visible focus indicators
- **Skip Links**: Jump to main content

### Color Contrast
- **WCAG Compliance**: 4.5:1 contrast ratio for text
- **Color Independence**: Information not conveyed by color alone

---

## Future Enhancements

### Planned Improvements
- **Dark Mode**: Complete dark theme implementation
- **Custom Properties**: More CSS variables for theming
- **Component Library**: Storybook integration
- **Design Tokens**: Centralized design system

### Maintenance Guidelines
- **Consistent Updates**: Keep design patterns consistent
- **Documentation**: Update this doc with any changes
- **Code Reviews**: Ensure design system compliance
- **Testing**: Visual regression testing for UI changes

---

## Conclusion

This design system provides a comprehensive foundation for the TG Calabria News Frontend, ensuring consistency, performance, and maintainability across the application. The CNN-inspired theme creates a professional news platform while maintaining modern web standards and best practices.

For any questions or contributions to the design system, please refer to this documentation and ensure consistency with existing patterns.
