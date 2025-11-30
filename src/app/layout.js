// ============================================
// ROOT LAYOUT
// ============================================
// This is the root layout that wraps ALL pages
// It includes:
// - HTML structure
// - Head metadata
// - Global styles
// - Navigation bar
// - Footer

import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'

// ============================================
// FONT CONFIGURATION
// ============================================
// Load Inter font from Google Fonts
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap', // Swap to web font when loaded (prevents flash)
})

// ============================================
// METADATA (SEO)
// ============================================
// This metadata appears in browser tabs and search engines
export const metadata = {
  title: 'Event Calendar - Manage Your Events',
  description: 'A beautiful event calendar app with recurring events support. Create, manage, and organize your events with daily, weekly, and monthly recurring options.',
  keywords: 'calendar, events, recurring events, schedule, planning',
  authors: [{ name: 'Your Name' }],
  viewport: 'width=device-width, initial-scale=1',
}

// ============================================
// ROOT LAYOUT COMPONENT
// ============================================
export default function RootLayout({ children }) {
  // children = The content of each page
  // This layout wraps around every page in the app
  
  return (
    <html lang="en" className={inter.className}>
      {/* 
        HTML element with:
        - lang="en" = English language (accessibility)
        - className={inter.className} = Apply Inter font
      */}
      
      <body className="min-h-screen flex flex-col">
        {/* 
          Body styling:
          - min-h-screen = Minimum height of viewport (100vh)
          - flex flex-col = Flexbox layout, vertical direction
          
          This ensures the footer stays at the bottom even with little content
        */}
        
        {/* ============================================ */}
        {/* NAVIGATION BAR */}
        {/* ============================================ */}
        <Navigation />
        
        {/* ============================================ */}
        {/* MAIN CONTENT AREA */}
        {/* ============================================ */}
        <main className="flex-1 container mx-auto px-4 py-8">
          {/* 
            Main content styling:
            - flex-1 = Take up remaining space (pushes footer down)
            - container = Max width container with responsive padding
            - mx-auto = Center horizontally
            - px-4 = Horizontal padding (1rem / 16px)
            - py-8 = Vertical padding (2rem / 32px)
          */}
          
          <div className="animate-fade-in">
            {/* Fade in animation for page transitions */}
            {children}
            {/* This is where page content appears */}
          </div>
        </main>
        
        {/* ============================================ */}
        {/* FOOTER */}
        {/* ============================================ */}
        <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
          {/* 
            Footer styling:
            - bg-white = White background
            - border-t = Top border
            - border-gray-200 = Light gray border color
            - py-6 = Vertical padding (1.5rem / 24px)
            - mt-auto = Push to bottom (with flex-1 on main)
          */}
          
          <div className="container mx-auto px-4 text-center text-gray-600">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* 
                Responsive layout:
                - flex-col = Stack vertically on mobile
                - md:flex-row = Horizontal on medium screens+
                - items-center = Center items
                - justify-between = Space items apart
                - gap-4 = Gap between items
              */}
              
              {/* Copyright */}
              <p className="text-sm">
                © {new Date().getFullYear()} Event Calendar. Built with Next.js & Prisma.
              </p>
              
              {/* Links */}
              <div className="flex gap-6 text-sm">
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium"
                >
                  GitHub
                </a>
                <a 
                  href="https://nextjs.org" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium"
                >
                  Next.js Docs
                </a>
                <a 
                  href="https://www.prisma.io" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium"
                >
                  Prisma Docs
                </a>
              </div>
            </div>
            
            {/* Tech Stack Badge */}
            <div className="mt-4 flex justify-center gap-2 flex-wrap">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                Next.js 14
              </span>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold">
                Prisma
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                SQLite
              </span>
              <span className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-xs font-semibold">
                Tailwind CSS
              </span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}

// ============================================
// LAYOUT COMPONENT EXPLANATION
// ============================================
/*
NEXT.JS LAYOUTS:
- layout.js wraps all pages in the same folder
- Root layout (app/layout.js) wraps ENTIRE app
- Nested layouts wrap specific sections

EXAMPLE STRUCTURE:
app/
  layout.js ← Root (wraps everything)
  page.js ← Home page
  events/
    layout.js ← Events layout (optional, wraps all /events/* pages)
    page.js ← Events list page

LAYOUT BENEFITS:
1. Shared UI (navbar, footer) on all pages
2. Persistent state between pages
3. No re-render of shared components on navigation
4. Better performance

CHILDREN PROP:
- Automatically passed by Next.js
- Contains the page content
- Different for each route

METADATA:
- Set in layout for SEO
- Appears in browser tab
- Used by search engines
- Can be overridden in pages
*/

// ============================================
// FLEXBOX LAYOUT PATTERN
// ============================================
/*
This layout uses the "Sticky Footer" flexbox pattern:

<body class="min-h-screen flex flex-col">
  <header>...</header>
  <main class="flex-1">...</main>  ← Takes remaining space
  <footer class="mt-auto">...</footer>  ← Pushed to bottom
</body>

How it works:
1. Body is flexbox with column direction
2. Body has minimum height of 100vh (full viewport)
3. Main has flex-1 (grows to fill space)
4. Footer has mt-auto (pushed to bottom)

Result: Footer always at bottom, even with little content!
*/
