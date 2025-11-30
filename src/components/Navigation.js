// ============================================
// NAVIGATION COMPONENT
// ============================================
// A beautiful navigation bar that appears on every page
// Shows links to Calendar, Events List, and Create Event

'use client' // This is a Client Component (can use hooks, events, etc.)

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navigation() {
  // ============================================
  // GET CURRENT PATH
  // ============================================
  // usePathname() returns the current URL path
  // Example: If URL is /events/new, pathname = "/events/new"
  const pathname = usePathname()
  
  // ============================================
  // NAVIGATION LINKS DATA
  // ============================================
  // Array of navigation items
  const navItems = [
    { name: 'Calendar', href: '/', icon: '📅' },
    { name: 'All Events', href: '/events', icon: '📋' },
    { name: 'Create Event', href: '/events/new', icon: '➕' }
  ]
  
  // ============================================
  // CHECK IF LINK IS ACTIVE
  // ============================================
  // Returns true if the current page matches this link
  const isActive = (href) => {
    // Exact match for home page
    if (href === '/') return pathname === '/'
    
    // For other pages, check if path starts with href
    // Example: /events/new starts with /events
    return pathname.startsWith(href)
  }

  return (
    // ============================================
    // NAVIGATION CONTAINER
    // ============================================
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
      {/* 
        Tailwind Classes Explained:
        - bg-gradient-to-r = Background gradient from left to right
        - from-blue-600 = Start color (blue)
        - to-purple-600 = End color (purple)
        - shadow-lg = Large shadow effect
      */}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 
          Container with responsive padding:
          - max-w-7xl = Maximum width of 80rem (1280px)
          - mx-auto = Center horizontally (margin left/right auto)
          - px-4 = Padding left/right 1rem (16px)
          - sm:px-6 = On small screens and up, padding 1.5rem (24px)
          - lg:px-8 = On large screens and up, padding 2rem (32px)
        */}
        
        <div className="flex items-center justify-between h-16">
          {/* 
            Flexbox layout:
            - flex = Display as flexbox
            - items-center = Align items vertically center
            - justify-between = Space items apart (logo left, links right)
            - h-16 = Height of 4rem (64px)
          */}
          
          {/* ============================================ */}
          {/* LOGO / BRAND */}
          {/* ============================================ */}
          <Link 
            href="/" 
            className="flex items-center space-x-2 text-white font-bold text-xl hover:text-gray-200 transition"
          >
            {/* 
              Link styling:
              - flex items-center = Flex layout with vertical center
              - space-x-2 = Horizontal spacing between children (0.5rem)
              - text-white = White text
              - font-bold = Bold font weight
              - text-xl = Extra large text (1.25rem / 20px)
              - hover:text-gray-200 = On hover, change to light gray
              - transition = Smooth transition for hover effects
            */}
            <span className="text-3xl">🗓️</span>
            <span>Event Calendar</span>
          </Link>
          
          {/* ============================================ */}
          {/* NAVIGATION LINKS */}
          {/* ============================================ */}
          <div className="flex space-x-4">
            {/* 
              Links container:
              - flex = Display as flexbox
              - space-x-4 = Horizontal spacing between links (1rem / 16px)
            */}
            
            {/* Map through navigation items */}
            {navItems.map((item) => {
              const active = isActive(item.href)
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center space-x-1 px-4 py-2 rounded-lg
                    font-medium transition-all duration-200
                    ${active 
                      ? 'bg-white text-blue-600 shadow-md' 
                      : 'text-white hover:bg-white/20'
                    }
                  `}
                  /* 
                    Dynamic className using template literals:
                    - flex items-center = Flex with vertical center
                    - space-x-1 = Small spacing between icon and text
                    - px-4 py-2 = Padding horizontal 1rem, vertical 0.5rem
                    - rounded-lg = Large rounded corners
                    - font-medium = Medium font weight
                    - transition-all = Animate all properties
                    - duration-200 = Transition takes 200ms
                    
                    Conditional styling (active vs inactive):
                    If active:
                      - bg-white = White background
                      - text-blue-600 = Blue text
                      - shadow-md = Medium shadow
                    If not active:
                      - text-white = White text
                      - hover:bg-white/20 = On hover, white with 20% opacity
                  */
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}

// ============================================
// TAILWIND CSS CONCEPTS EXPLAINED
// ============================================
/*
1. RESPONSIVE DESIGN:
   - sm: = Small screens (640px+)
   - md: = Medium screens (768px+)
   - lg: = Large screens (1024px+)
   - xl: = Extra large screens (1280px+)

2. SPACING SCALE:
   - 0 = 0px
   - 1 = 0.25rem (4px)
   - 2 = 0.5rem (8px)
   - 4 = 1rem (16px)
   - 8 = 2rem (32px)
   - 16 = 4rem (64px)

3. COLORS:
   - blue-600 = #2563eb (medium blue)
   - purple-600 = #9333ea (medium purple)
   - white = #ffffff
   - gray-200 = #e5e7eb (light gray)

4. HOVER STATES:
   - hover:bg-blue-600 = On mouse hover, apply bg-blue-600
   - Always combined with 'transition' for smooth effect

5. OPACITY:
   - bg-white/20 = White background with 20% opacity
   - bg-black/50 = Black background with 50% opacity

6. FLEXBOX:
   - flex = display: flex
   - items-center = align-items: center (vertical center)
   - justify-between = justify-content: space-between (spread apart)
   - space-x-4 = gap-x: 1rem (horizontal gap between children)

7. GRADIENTS:
   - bg-gradient-to-r = Gradient from left to right
   - bg-gradient-to-b = Gradient from top to bottom
   - from-blue-600 = Starting color
   - to-purple-600 = Ending color
*/

// ============================================
// NEXT.JS LINK COMPONENT
// ============================================
/*
<Link href="/path">
  - Client-side navigation (no page reload)
  - Prefetches pages in the background
  - Faster than <a> tags
  - Automatically handles browser history
*/

// ============================================
// CLIENT COMPONENT ('use client')
// ============================================
/*
'use client' is required when using:
  - React hooks (useState, useEffect, etc.)
  - Browser APIs (window, document)
  - Event handlers (onClick, onChange)
  - usePathname, useRouter (Next.js navigation hooks)
*/
