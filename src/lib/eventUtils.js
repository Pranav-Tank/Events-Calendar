// ============================================
// EVENT UTILITY FUNCTIONS
// ============================================
// This file contains helper functions for:
// 1. Generating recurring event instances
// 2. Formatting dates
// 3. Working with days of the week

// ============================================
// FUNCTION 1: Generate Recurring Events
// ============================================
/**
 * Generate all occurrences of a recurring event for a given time range
 * @param {Object} event - The event object from database
 * @param {Date} monthStart - First day of the month to generate events for
 * @param {Date} monthEnd - Last day of the month
 * @returns {Array} Array of event occurrences with display dates
 */
export function generateRecurringEvents(event, monthStart, monthEnd) {
  // ============================================
  // STEP 1: Handle One-Time Events
  // ============================================
  // If the event is NOT recurring, just check if it falls in the date range
  if (!event.isRecurring) {
    const eventDate = new Date(event.startDate)
    // Check if event date is between monthStart and monthEnd
    if (eventDate >= monthStart && eventDate <= monthEnd) {
      return [{ ...event, displayDate: eventDate }]
      // Return array with one event (with displayDate added)
    }
    return [] // Event is outside the date range, return empty array
  }

  // ============================================
  // STEP 2: Handle Recurring Events
  // ============================================
  const occurrences = [] // Will store all occurrences
  const startDate = new Date(event.startDate)
  const endDate = new Date(event.endDate)
  
  // Start from the later of: event start date OR month start
  // Example: If event starts on Jan 15 and we're viewing February,
  // start from Feb 1 (not Jan 15)
  let currentDate = new Date(Math.max(startDate.getTime(), monthStart.getTime()))
  
  // ============================================
  // STEP 3: Parse Days of Week (for weekly events)
  // ============================================
  // daysOfWeek is stored as "0,1,5" (Sunday, Monday, Friday)
  // Split into array: ["0", "1", "5"]
  // Convert to numbers: [0, 1, 5]
  const daysOfWeek = event.daysOfWeek 
    ? event.daysOfWeek.split(',').map(Number) 
    : []

  // ============================================
  // STEP 4: Loop Through Each Day in Range
  // ============================================
  // We'll check each day to see if it matches the recurrence pattern
  while (currentDate <= monthEnd) {
    let shouldAdd = false // Flag: should we add this date?

    // ============================================
    // DAILY FREQUENCY
    // ============================================
    // Every single day is an occurrence
    if (event.frequency === 'daily') {
      shouldAdd = true
    } 
    
    // ============================================
    // WEEKLY FREQUENCY
    // ============================================
    // Only specific days of the week
    else if (event.frequency === 'weekly') {
      // Get day of week: 0=Sunday, 1=Monday, 2=Tuesday, etc.
      const dayOfWeek = currentDate.getDay()
      
      // Check if this day is in the selected days
      // Example: If daysOfWeek = [1, 3, 5] (Mon, Wed, Fri)
      // and today is Monday (1), then shouldAdd = true
      shouldAdd = daysOfWeek.includes(dayOfWeek)
    } 
    
    // ============================================
    // MONTHLY FREQUENCY
    // ============================================
    // Same date each month (e.g., 15th of every month)
    else if (event.frequency === 'monthly') {
      // Check if current date matches the day of month from start date
      // Example: If event starts on Jan 15, then every 15th is an occurrence
      shouldAdd = currentDate.getDate() === startDate.getDate()
    }

    // ============================================
    // STEP 5: Add Occurrence if Valid
    // ============================================
    // Make sure the date is after (or on) the event's start date
    if (shouldAdd && currentDate >= startDate) {
      occurrences.push({
        ...event,                     // Spread all event properties
        displayDate: new Date(currentDate) // Add the specific occurrence date
      })
    }

    // ============================================
    // STEP 6: Move to Next Day
    // ============================================
    // Add 1 day and continue loop
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return occurrences
}

// ============================================
// FUNCTION 2: Get Events for Specific Month
// ============================================
/**
 * Get all events (including recurring instances) for a specific month
 * @param {Array} events - All events from database
 * @param {number} year - Year to display (e.g., 2024)
 * @param {number} month - Month to display (0-11, JavaScript style: 0=Jan, 11=Dec)
 * @returns {Array} All event occurrences for that month
 */
export function getEventsForMonth(events, year, month) {
  // ============================================
  // STEP 1: Calculate Month Boundaries
  // ============================================
  // First day of month at 00:00:00
  const monthStart = new Date(year, month, 1)
  
  // Last day of month at 23:59:59
  // month + 1 = next month, day 0 = last day of previous month
  const monthEnd = new Date(year, month + 1, 0, 23, 59, 59)

  // ============================================
  // STEP 2: Generate Occurrences for Each Event
  // ============================================
  const allOccurrences = []

  // Loop through each event in the database
  events.forEach(event => {
    // Generate all occurrences of this event for the month
    const occurrences = generateRecurringEvents(event, monthStart, monthEnd)
    
    // Add all occurrences to the result array
    allOccurrences.push(...occurrences) // Spread operator adds all items
  })

  return allOccurrences
}

// ============================================
// FUNCTION 3: Format Date for Input Fields
// ============================================
/**
 * Convert Date object to YYYY-MM-DD string format (for HTML date inputs)
 * @param {Date} date - Date object
 * @returns {string} Formatted date string "2024-12-25"
 */
export function formatDateForInput(date) {
  const d = new Date(date)
  const year = d.getFullYear()                          // 2024
  const month = String(d.getMonth() + 1).padStart(2, '0')  // "01" to "12"
  const day = String(d.getDate()).padStart(2, '0')      // "01" to "31"
  
  return `${year}-${month}-${day}` // "2024-12-25"
  
  // Explanation:
  // - d.getMonth() returns 0-11, so we add 1
  // - padStart(2, '0') ensures 2 digits: 5 becomes "05"
}

// ============================================
// FUNCTION 4: Format Date for Display
// ============================================
/**
 * Convert Date object to readable string
 * @param {Date} date - Date object
 * @returns {string} Formatted date like "Mon, Dec 25, 2024"
 */
export function formatDate(date) {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', { 
    weekday: 'short',  // "Mon"
    year: 'numeric',   // "2024"
    month: 'short',    // "Dec"
    day: 'numeric'     // "25"
  })
  // Result: "Mon, Dec 25, 2024"
}

// ============================================
// FUNCTION 5: Convert Days of Week to Names
// ============================================
/**
 * Convert days of week string to readable names
 * @param {string} daysOfWeek - "0,1,5" format (0=Sun, 1=Mon, etc.)
 * @returns {string} "Sun, Mon, Fri"
 */
export function getDayNames(daysOfWeek) {
  if (!daysOfWeek) return '' // If no days selected, return empty string
  
  // Array of day names (index matches JavaScript's getDay())
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  
  // Split "0,1,5" into ["0", "1", "5"]
  // Convert to numbers: [0, 1, 5]
  const days = daysOfWeek.split(',').map(Number)
  
  // Map each number to day name: [0, 1, 5] -> ["Sun", "Mon", "Fri"]
  // Join with comma: "Sun, Mon, Fri"
  return days.map(d => dayNames[d]).join(', ')
}

// ============================================
// USAGE EXAMPLES
// ============================================
/*
// Example 1: Get events for December 2024
const events = await prisma.event.findMany()
const decemberEvents = getEventsForMonth(events, 2024, 11) // 11 = December

// Example 2: Format date for input
const dateString = formatDateForInput(new Date()) // "2024-12-25"

// Example 3: Format date for display
const displayDate = formatDate(new Date()) // "Mon, Dec 25, 2024"

// Example 4: Get day names
const days = getDayNames("1,3,5") // "Mon, Wed, Fri"
*/
