// ============================================
// EDIT EVENT PAGE
// ============================================
// Route: /events/[id]/edit (e.g., /events/1/edit)
// Form to edit an existing event

'use client'

import { useState, useEffect, use } from 'react' // ← ADDED: use hook
import EventForm from '@/components/EventForm'
import Link from 'next/link'

// ============================================
// PAGE COMPONENT
// ============================================
export default function EditEventPage({ params }) {
  // ============================================
  // UNWRAP PARAMS PROMISE
  // ============================================
  // In Next.js 15+, params is a Promise and must be unwrapped
  const unwrappedParams = use(params)
  const eventId = unwrappedParams.id
  
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  
  // ============================================
  // FETCH EVENT DATA
  // ============================================
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/events/${eventId}`)
        
        if (!response.ok) {
          setError(true)
          setLoading(false)
          return
        }
        
        const data = await response.json()
        setEvent(data)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching event:', err)
        setError(true)
        setLoading(false)
      }
    }
    
    if (eventId) {
      fetchEvent()
    }
  }, [eventId])
  
  // ============================================
  // LOADING STATE
  // ============================================
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        <p className="text-gray-600 font-medium">Loading event data...</p>
      </div>
    )
  }
  
  // ============================================
  // ERROR STATE
  // ============================================
  if (error || !event) {
    return (
      <div className="text-center py-16">
        <div className="text-8xl mb-6">❌</div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Event Not Found</h1>
        <p className="text-gray-600 text-lg mb-8">
          The event you're trying to edit doesn't exist or has been deleted.
        </p>
        <Link
          href="/events"
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
        >
          <span className="text-2xl">📋</span>
          Back to All Events
        </Link>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      {/* ============================================ */}
      {/* PAGE HEADER */}
      {/* ============================================ */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
          <span className="text-5xl">✏️</span>
          Edit Event
        </h1>
        <p className="text-gray-600 text-lg">
          Update the details for <strong>"{event.title}"</strong>
        </p>
      </div>

      {/* ============================================ */}
      {/* EVENT FORM COMPONENT */}
      {/* ============================================ */}
      <EventForm mode="edit" event={event} />

      {/* ============================================ */}
      {/* METADATA INFO */}
      {/* ============================================ */}
      <div className="max-w-3xl mx-auto bg-gray-50 border-2 border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="text-2xl">ℹ️</span>
          Event Information
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
          {/* Created */}
          <div className="flex items-start gap-2">
            <span className="text-xl">📝</span>
            <div>
              <div className="font-semibold text-gray-700">Created</div>
              <div>
                {new Date(event.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </div>
          
          {/* Last Updated */}
          <div className="flex items-start gap-2">
            <span className="text-xl">🔄</span>
            <div>
              <div className="font-semibold text-gray-700">Last Updated</div>
              <div>
                {new Date(event.updatedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </div>
          
          {/* Event ID */}
          <div className="flex items-start gap-2">
            <span className="text-xl">🔢</span>
            <div>
              <div className="font-semibold text-gray-700">Event ID</div>
              <div className="font-mono">{event.id}</div>
            </div>
          </div>
          
          {/* Event Type */}
          <div className="flex items-start gap-2">
            <span className="text-xl">{event.isRecurring ? '🔁' : '📅'}</span>
            <div>
              <div className="font-semibold text-gray-700">Event Type</div>
              <div className="capitalize">
                {event.isRecurring 
                  ? `${event.frequency} Recurring` 
                  : 'One-Time Event'
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* TIPS SECTION */}
      {/* ============================================ */}
      <div className="max-w-3xl mx-auto bg-yellow-50 border-2 border-yellow-300 rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
          <span className="text-2xl">⚠️</span>
          Important Notes
        </h3>
        
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold mt-1">•</span>
            <span>
              Changing recurrence settings will affect all future occurrences of this event.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold mt-1">•</span>
            <span>
              Past occurrences of recurring events cannot be modified individually.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold mt-1">•</span>
            <span>
              If you change the start date, make sure the end date is updated accordingly.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold mt-1">•</span>
            <span>
              Converting a recurring event to a one-time event will remove all recurrence patterns.
            </span>
          </li>
        </ul>
      </div>
    </div>
  )
}
