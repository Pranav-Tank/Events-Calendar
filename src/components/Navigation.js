// ============================================
// NAVIGATION COMPONENT
// ============================================
// A beautiful navigation bar that appears on every page
// Shows links to Calendar, Events List, and Create Event

'use client' // This is a Client Component (can use hooks, events, etc.)

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navigation() {
 
  // GET CURRENT PATH
  // Example: If URL is /events/new, pathname = "/events/new"
  const pathname = usePathname()

  // Array of navigation items
  const navItems = [
    { name: 'Calendar', href: '/', icon: '📅' },
    { name: 'All Events', href: '/events', icon: '📋' },
    { name: 'Create Event', href: '/events/new', icon: '➕' }
  ]

  // CHECK IF LINK IS ACTIVE
  const isActive = (href) => {
    // Exact match for home page
    if (href === '/') return pathname === '/'

    return pathname.startsWith(href)
  }

  return (
 
    // NAVIGATION CONTAINER
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center justify-between h-16">
          
          <Link 
            href="/" 
            className="flex items-center space-x-2 text-white font-bold text-xl hover:text-gray-200 transition"
          >
            <span className="text-3xl">🗓️</span>
            <span>Event Calendar</span>
          </Link>
          
     
          {/* NAVIGATION LINKS */}
          <div className="flex space-x-4">
          
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