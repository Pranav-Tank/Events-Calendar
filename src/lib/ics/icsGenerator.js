// ============================================
// ICS FILE GENERATOR
// ============================================
// Generate .ics files for exporting events to calendar apps
// Compatible with Google Calendar, Apple Calendar, Outlook, etc.

/**
 * Generate ICS file content for a single event
 * @param {Object} event - Event object from database
 * @returns {string} ICS file content
 */
export function generateICS(event) {
  // Format date to ICS format: YYYYMMDDTHHMMSSZ
  const formatICSDate = (date) => {
    const d = new Date(date)
    const year = d.getUTCFullYear()
    const month = String(d.getUTCMonth() + 1).padStart(2, '0')
    const day = String(d.getUTCDate()).padStart(2, '0')
    const hours = String(d.getUTCHours()).padStart(2, '0')
    const minutes = String(d.getUTCMinutes()).padStart(2, '0')
    const seconds = String(d.getUTCSeconds()).padStart(2, '0')
    return `${year}${month}${day}T${hours}${minutes}${seconds}Z`
  }

  const start = formatICSDate(event.startDate)
  const end = formatICSDate(event.endDate)
  const created = formatICSDate(event.createdAt)
  const modified = formatICSDate(event.updatedAt)
  const uid = `event-${event.id}@event-calendar.com`

  // Build recurrence rule for recurring events
  let rrule = ''
  if (event.isRecurring) {
    if (event.frequency === 'daily') {
      rrule = 'RRULE:FREQ=DAILY'
    } else if (event.frequency === 'weekly' && event.daysOfWeek) {
      const dayMap = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA']
      const days = event.daysOfWeek.split(',').map(d => dayMap[parseInt(d)]).join(',')
      rrule = `RRULE:FREQ=WEEKLY;BYDAY=${days}`
    } else if (event.frequency === 'monthly') {
      rrule = 'RRULE:FREQ=MONTHLY'
    }
  }

  // Escape special characters in description
  const escapeText = (text) => {
    if (!text) return ''
    return text
      .replace(/\\/g, '\\\\')
      .replace(/;/g, '\\;')
      .replace(/,/g, '\\,')
      .replace(/\n/g, '\\n')
  }

  // Build ICS content
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Event Calendar//Event Calendar App//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${created}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${escapeText(event.title)}`,
    event.description ? `DESCRIPTION:${escapeText(event.description)}` : '',
    `CREATED:${created}`,
    `LAST-MODIFIED:${modified}`,
    rrule,
    'STATUS:CONFIRMED',
    'TRANSP:OPAQUE',
    'END:VEVENT',
    'END:VCALENDAR'
  ]
    .filter(line => line) // Remove empty lines
    .join('\r\n')

  return icsContent
}

/**
 * Generate ICS file for multiple events
 * @param {Array} events - Array of event objects
 * @returns {string} ICS file content
 */
export function generateMultipleICS(events) {
  const formatICSDate = (date) => {
    const d = new Date(date)
    const year = d.getUTCFullYear()
    const month = String(d.getUTCMonth() + 1).padStart(2, '0')
    const day = String(d.getUTCDate()).padStart(2, '0')
    const hours = String(d.getUTCHours()).padStart(2, '0')
    const minutes = String(d.getUTCMinutes()).padStart(2, '0')
    const seconds = String(d.getUTCSeconds()).padStart(2, '0')
    return `${year}${month}${day}T${hours}${minutes}${seconds}Z`
  }

  const escapeText = (text) => {
    if (!text) return ''
    return text
      .replace(/\\/g, '\\\\')
      .replace(/;/g, '\\;')
      .replace(/,/g, '\\,')
      .replace(/\n/g, '\\n')
  }

  const eventBlocks = events.map(event => {
    const start = formatICSDate(event.startDate)
    const end = formatICSDate(event.endDate)
    const created = formatICSDate(event.createdAt)
    const modified = formatICSDate(event.updatedAt)
    const uid = `event-${event.id}@event-calendar.com`

    let rrule = ''
    if (event.isRecurring) {
      if (event.frequency === 'daily') {
        rrule = 'RRULE:FREQ=DAILY'
      } else if (event.frequency === 'weekly' && event.daysOfWeek) {
        const dayMap = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA']
        const days = event.daysOfWeek.split(',').map(d => dayMap[parseInt(d)]).join(',')
        rrule = `RRULE:FREQ=WEEKLY;BYDAY=${days}`
      } else if (event.frequency === 'monthly') {
        rrule = 'RRULE:FREQ=MONTHLY'
      }
    }

    return [
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${created}`,
      `DTSTART:${start}`,
      `DTEND:${end}`,
      `SUMMARY:${escapeText(event.title)}`,
      event.description ? `DESCRIPTION:${escapeText(event.description)}` : '',
      `CREATED:${created}`,
      `LAST-MODIFIED:${modified}`,
      rrule,
      'STATUS:CONFIRMED',
      'TRANSP:OPAQUE',
      'END:VEVENT'
    ]
      .filter(line => line)
      .join('\r\n')
  })

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Event Calendar//Event Calendar App//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    ...eventBlocks,
    'END:VCALENDAR'
  ].join('\r\n')

  return icsContent
}

/**
 * Download ICS file
 * @param {string} content - ICS file content
 * @param {string} filename - Filename for download
 */
export function downloadICS(content, filename = 'event.ics') {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' })
  const link = document.createElement('a')
  link.href = window.URL.createObjectURL(blob)
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(link.href)
}
