// ============================================
// CALENDAR COMPONENT
// ============================================
// A beautiful monthly calendar that displays events
// Features:
// - Monthly grid view (7 columns × 6 rows)
// - Previous/Next month navigation
// - Today highlighting
// - Event display in each day cell
// - Recurring events support

'use client'

import { useState, useEffect } from 'react'
import { getEventsForMonth } from '@/lib/eventUtils'
import Link from 'next/link'

export default function Calendar() {
  // ============================================
  // STATE MANAGEMENT
  // ============================================
  // useState hook creates reactive state variables
  // When state changes, component re-renders
  
  const [currentDate, setCurrentDate] = useState(new Date())
  // currentDate: The month/year being displayed
  // setCurrentDate: Function to update currentDate
  // new Date(): Initial value (today's date)
  
  const [events, setEvents] = useState([])
  // events: All events from database
  // setEvents: Function to update events
  // []: Initial value (empty array)
  
  const [monthEvents, setMonthEvents] = useState([])
  // monthEvents: Events for the currently displayed month
  // Includes recurring event instances
  
  const [loading, setLoading] = useState(true)
  // loading: True while fetching data, false when done
  
  // ============================================
  // FETCH EVENTS FROM API
  // ============================================
  // useEffect runs after component renders
  // Empty dependency array [] means run once on mount
  useEffect(() => {
    fetchEvents()
  }, [])
  
  const fetchEvents = async () => {
    try {
      setLoading(true) // Show loading state
      
      // Fetch data from our API
      const response = await fetch('/api/events')
      const data = await response.json()
      
      setEvents(data) // Store events in state
      setLoading(false) // Hide loading state
    } catch (error) {
      console.error('Error fetching events:', error)
      setLoading(false)
    }
  }

  // ============================================
  // GENERATE MONTH EVENTS
  // ============================================
  // useEffect runs whenever events or currentDate changes
  useEffect(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    
    // Generate recurring event instances for this month
    const eventsForMonth = getEventsForMonth(events, year, month)
    setMonthEvents(eventsForMonth)
  }, [events, currentDate])
  // Dependency array: Re-run when events or currentDate changes

  // ============================================
  // NAVIGATION FUNCTIONS
  // ============================================
  const previousMonth = () => {
    // Go back one month
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    // Go forward one month
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const goToToday = () => {
    // Reset to current month
    setCurrentDate(new Date())
  }

  // ============================================
  // CALENDAR GRID CALCULATION
  // ============================================
  const getCalendarDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    
    // First day of the month
    const firstDay = new Date(year, month, 1)
    const startingDayOfWeek = firstDay.getDay() // 0=Sunday, 1=Monday, etc.
    
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate() // How many days in this month?
    
    // Calculate previous month info (for grayed out dates)
    const prevMonth = month === 0 ? 11 : month - 1
    const prevMonthYear = month === 0 ? year - 1 : year
    const daysInPrevMonth = new Date(prevMonthYear, prevMonth + 1, 0).getDate()
    
    const days = []
    
    // ============================================
    // ADD PREVIOUS MONTH DAYS (grayed out)
    // ============================================
    // Fill the first week with days from previous month
    // Example: If month starts on Wednesday, add Sun, Mon, Tue from prev month
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(prevMonthYear, prevMonth, daysInPrevMonth - i),
        isCurrentMonth: false // Mark as not current month (will be grayed)
      })
    }
    
    // ============================================
    // ADD CURRENT MONTH DAYS
    // ============================================
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true // Mark as current month
      })
    }
    
    // ============================================
    // ADD NEXT MONTH DAYS (grayed out)
    // ============================================
    // Fill remaining cells to complete 6 weeks (42 days total)
    const remainingDays = 42 - days.length // 7 columns × 6 rows = 42 cells
    const nextMonth = month === 11 ? 0 : month + 1
    const nextMonthYear = month === 11 ? year + 1 : year
    
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(nextMonthYear, nextMonth, i),
        isCurrentMonth: false
      })
    }
    
    return days // Array of 42 day objects
  }

  // ============================================
  // GET EVENTS FOR SPECIFIC DAY
  // ============================================
  const getEventsForDay = (date) => {
    return monthEvents.filter(event => {
      const eventDate = new Date(event.displayDate)
      return eventDate.toDateString() === date.toDateString()
    })
    // Returns array of events for this specific day
  }

  // ============================================
  // CHECK IF DATE IS TODAY
  // ============================================
  const isToday = (date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  // ============================================
  // CONSTANTS
  // ============================================
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  // ============================================
  // RENDER COMPONENT
  // ============================================
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        {/* Loading spinner */}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-2xl p-8">
      
      {/* ============================================ */}
      {/* CALENDAR HEADER */}
      {/* ============================================ */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
          <span className="text-5xl">📅</span>
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        
        {/* Navigation buttons */}
        <div className="flex gap-3">
          <button
            onClick={previousMonth}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
          >
            ← Previous
          </button>
          
          <button
            onClick={goToToday}
            className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
          >
            Today
          </button>
          
          <button
            onClick={nextMonth}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
          >
            Next →
          </button>
        </div>
      </div>

      {/* ============================================ */}
      {/* DAY NAMES HEADER */}
      {/* ============================================ */}
      <div className="grid grid-cols-7 gap-3 mb-3">
    
        {dayNames.map(day => (
          <div
            key={day}
            className="text-center font-bold text-gray-600 py-3 text-lg bg-gray-50 rounded-lg"
          >
            {day}
          </div>
        ))}
      </div>

      {/* ============================================ */}
      {/* CALENDAR GRID */}
      {/* ============================================ */}
      <div className="grid grid-cols-7 gap-3">
        {getCalendarDays().map((day, index) => {
          const dayEvents = getEventsForDay(day.date)
          const isTodayDate = isToday(day.date)
          
          return (
            <div
              key={index}
              className={`
                min-h-[120px] border-2 rounded-lg p-3 transition-all duration-200
                ${day.isCurrentMonth 
                  ? 'bg-white hover:bg-gray-50' 
                  : 'bg-gray-50'
                }
                ${isTodayDate 
                  ? 'ring-4 ring-blue-400 shadow-lg' 
                  : 'border-gray-200'
                }
                hover:shadow-md
              `}
           
            >
              {/* Day number */}
              <div
                className={`
                  text-sm font-bold mb-2
                  ${day.isCurrentMonth ? 'text-gray-800' : 'text-gray-400'}
                  ${isTodayDate ? 'text-blue-600 text-lg' : ''}
                `}
              >
                {day.date.getDate()}
              </div>
              
              {/* Events for this day */}
              <div className="space-y-1">
                {/* Show maximum 3 events */}
                {dayEvents.slice(0, 3).map((event, i) => (
                  <Link
                    key={`${event.id}-${i}`}
                    href={`/events/${event.id}`}
                    className="block text-xs bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded px-2 py-1 truncate hover:from-blue-200 hover:to-purple-200 transition-all duration-200 font-medium shadow-sm"
                    title={event.title}
                  >
                    {event.title}
                  </Link>
                ))}
                
                {/* Show "+X more" if there are more than 3 events */}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-gray-500 px-2 font-medium">
                    +{dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ============================================
// REACT HOOKS EXPLAINED
// ============================================
/*
1. useState:
   const [value, setValue] = useState(initialValue)
   - Creates a reactive state variable
   - When state changes, component re-renders
   - setValue() updates the state

2. useEffect:
   useEffect(() => { code  }, [dependencies])
   - Runs after component renders
   - Dependencies: re-run when these values change
   - Empty []: run once on mount
   - [value]: run when 'value' changes

3. Component Lifecycle:
   1. Component mounts (appears on screen)
   2. useEffect with [] runs → fetch data
   3. State updates → component re-renders
   4. useEffect with [deps] runs when deps change
*/
