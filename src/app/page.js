// ============================================
// HOME PAGE - Calendar View
// ============================================
// Route: / (root)
// This is the main landing page showing the calendar

import Calendar from '@/components/Calendar'
import Link from 'next/link'

// ============================================
// METADATA (SEO for this page)
// ============================================
export const metadata = {
  title: 'Calendar View - Event Calendar',
  description: 'View all your events in a beautiful monthly calendar. Navigate between months and see recurring events.',
}

// ============================================
// HOME PAGE COMPONENT
// ============================================
export default function HomePage() {
  return (
    <div className="space-y-8">
      {/* 
        space-y-8 = Vertical spacing between children (2rem / 32px)
      */}
      
      {/* ============================================ */}
      {/* PAGE HEADER */}
      {/* ============================================ */}
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-4">
          <span className="text-6xl">🗓️</span>
          Welcome to Your Event Calendar
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Organize your life with our beautiful calendar. Create one-time or recurring events with daily, weekly, and monthly options.
        </p>
        
        {/* Quick Action Button */}
        <div className="mt-6">
          <Link
            href="/events/new"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          >
            <span className="text-2xl">➕</span>
            Create Your First Event
          </Link>
        </div>
      </div>

      {/* ============================================ */}
      {/* FEATURE HIGHLIGHTS */}
      {/* ============================================ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {/* Feature 1 */}
        <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-200 hover:scale-105">
          <div className="text-5xl mb-4">📅</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">One-Time Events</h3>
          <p className="text-gray-600">
            Create single events for meetings, appointments, and special occasions.
          </p>
        </div>

        {/* Feature 2 */}
        <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-200 hover:scale-105">
          <div className="text-5xl mb-4">🔁</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Recurring Events</h3>
          <p className="text-gray-600">
            Set up daily, weekly, or monthly recurring events. Perfect for routines!
          </p>
        </div>

        {/* Feature 3 */}
        <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-200 hover:scale-105">
          <div className="text-5xl mb-4">🗂️</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Flexible Scheduling</h3>
          <p className="text-gray-600">
            Choose specific weekdays for weekly events. Complete control over your schedule.
          </p>
        </div>
      </div>

      {/* ============================================ */}
      {/* CALENDAR COMPONENT */}
      {/* ============================================ */}
      <div>
        <Calendar />
      </div>

      {/* ============================================ */}
      {/* QUICK LINKS */}
      {/* ============================================ */}
      <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/events"
            className="px-6 py-3 bg-white text-gray-800 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
          >
            📋 View All Events
          </Link>
          <Link
            href="/events/new"
            className="px-6 py-3 bg-white text-gray-800 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
          >
            ➕ Create New Event
          </Link>
        </div>
      </div>
    </div>
  )
}

// ============================================
// NEXT.JS PAGE COMPONENTS
// ============================================
/*
PAGE COMPONENT RULES:
1. Must be default export
2. File must be named page.js
3. Can be async (for data fetching)
4. Automatically becomes a route

FOLDER STRUCTURE → ROUTES:
app/page.js → /
app/about/page.js → /about
app/events/page.js → /events
app/events/[id]/page.js → /events/1, /events/2, etc.

METADATA:
- Export metadata object for SEO
- Sets page title and description
- Appears in browser tab
- Used by search engines
*/

// ============================================
// COMPONENT STRUCTURE EXPLAINED
// ============================================
/*
This page follows a common structure:

1. HEADER SECTION:
   - Page title
   - Description
   - Call-to-action button

2. FEATURES SECTION:
   - 3-column grid (responsive)
   - Highlights key features
   - Icons + text

3. MAIN CONTENT:
   - Calendar component
   - Core functionality

4. FOOTER SECTION:
   - Quick links
   - Additional navigation

This structure is:
- User-friendly
- Visually appealing
- Mobile responsive
- SEO optimized
*/
