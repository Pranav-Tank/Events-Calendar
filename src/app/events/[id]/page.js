// ============================================
// EVENT DETAILS PAGE
// ============================================
// Route: /events/[id] (e.g., /events/1, /events/5)
// Shows detailed view of a single event

'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { formatDate, getDayNames } from '@/lib/eventUtils'
import { generateICS, downloadICS } from '@/lib/ics/icsGenerator'

// ============================================
// PAGE COMPONENT
// ============================================
export default function EventDetailPage({ params }) {
  // ============================================
  // UNWRAP PARAMS PROMISE
  // ============================================
  // In Next.js 15+, params is a Promise and must be unwrapped
  const unwrappedParams = use(params)
  const eventId = unwrappedParams.id
  
  const router = useRouter()
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
  // EXPORT HANDLER
  // ============================================
  const handleExport = () => {
    try {
      const icsContent = generateICS(event)
      downloadICS(icsContent, `${event.title.replace(/[^a-z0-9]/gi, '_')}.ics`)
    } catch (error) {
      console.error('Error exporting event:', error)
      alert('Failed to export event')
    }
  }
  
  // ============================================
  // DELETE HANDLER
  // ============================================
  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete "${event.title}"? This action cannot be undone.`)) {
      try {
        const response = await fetch(`/api/events/${event.id}`, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          alert('Event deleted successfully!')
          router.push('/events')
        } else {
          alert('Failed to delete event')
        }
      } catch (error) {
        console.error('Error deleting event:', error)
        alert('Error deleting event')
      }
    }
  }
  
  // ============================================
  // LOADING STATE
  // ============================================
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        <p className="text-gray-600 font-medium">Loading event details...</p>
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
          The event you're looking for doesn't exist or has been deleted.
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
    <div className="space-y-8">
      {/* ============================================ */}
      {/* PAGE HEADER */}
      {/* ============================================ */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div className="flex-1">
          <h1 className="text-5xl font-bold text-gray-800 mb-4 flex items-center gap-4 flex-wrap">
            <span className="text-6xl">📋</span>
            {event.title}
          </h1>
          
          {/* Recurring badge */}
          {event.isRecurring && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 border-2 border-blue-300 rounded-lg">
              <span className="text-2xl">🔁</span>
              <span className="font-bold text-blue-800 capitalize">
                {event.frequency} Recurring Event
              </span>
            </div>
          )}
        </div>
        
        {/* Action buttons */}
        <div className="flex gap-3 flex-wrap">
          <Link
            href={`/events/${event.id}/edit`}
            className="flex items-center gap-2 px-6 py-3 bg-yellow-500 text-white rounded-lg font-bold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          >
            <span className="text-xl">✏️</span>
            Edit
          </Link>
          
          <Link
            href="/events"
            className="flex items-center gap-2 px-6 py-3 bg-gray-500 text-white rounded-lg font-bold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          >
            <span className="text-xl">📋</span>
            All Events
          </Link>
        </div>
      </div>

      {/* ============================================ */}
      {/* EVENT DETAILS CARD */}
      {/* ============================================ */}
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8">
          <h2 className="text-3xl font-bold mb-2">Event Details</h2>
          <p className="text-blue-100">
            Created on {formatDate(event.createdAt)}
          </p>
        </div>

        {/* Details section */}
        <div className="p-8 space-y-6">
          {/* ============================================ */}
          {/* DESCRIPTION */}
          {/* ============================================ */}
          {event.description && (
            <div>
              <h3 className="text-lg font-bold text-gray-700 mb-2 flex items-center gap-2">
                <span className="text-2xl">📝</span>
                Description
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed bg-gray-50 p-4 rounded-lg">
                {event.description}
              </p>
            </div>
          )}

          {/* ============================================ */}
          {/* DATE INFORMATION */}
          {/* ============================================ */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Start Date */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-700 mb-3 flex items-center gap-2">
                <span className="text-2xl">🟢</span>
                Start Date
              </h3>
              <p className="text-2xl font-bold text-green-800">
                {formatDate(event.startDate)}
              </p>
              {/*<p className="text-sm text-green-700 mt-2">
                {new Date(event.startDate).toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>*/}
            </div>

            {/* End Date */}
            <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-300 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-700 mb-3 flex items-center gap-2">
                <span className="text-2xl">🔴</span>
                End Date
              </h3>
              <p className="text-2xl font-bold text-red-800">
                {formatDate(event.endDate)}
              </p>
              {/*<p className="text-sm text-red-700 mt-2">
                {new Date(event.endDate).toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>*/}
            </div>
          </div>

          {/* ============================================ */}
          {/* RECURRENCE INFORMATION */}
          {/* ============================================ */}
          {event.isRecurring && (
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-300 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
                <span className="text-2xl">🔁</span>
                Recurrence Pattern
              </h3>
              
              <div className="space-y-3">
                {/* Frequency */}
                <div className="flex items-center gap-3">
                  <div className="w-32 font-semibold text-gray-700">Frequency:</div>
                  <div className="flex-1">
                    <span className="px-4 py-2 bg-blue-500 text-white rounded-lg font-bold capitalize inline-block">
                      {event.frequency}
                    </span>
                  </div>
                </div>

                {/* Days of week (for weekly events) */}
                {event.frequency === 'weekly' && event.daysOfWeek && (
                  <div className="flex items-center gap-3">
                    <div className="w-32 font-semibold text-gray-700">Days:</div>
                    <div className="flex-1">
                      <span className="px-4 py-2 bg-green-500 text-white rounded-lg font-bold inline-block">
                        {getDayNames(event.daysOfWeek)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Explanation */}
                <div className="mt-4 p-4 bg-white rounded-lg border-2 border-blue-200">
                  <p className="text-gray-700 font-medium">
                    {event.frequency === 'daily' && '📅 This event repeats every day.'}
                    {event.frequency === 'weekly' && event.daysOfWeek && `📆 This event repeats every week on ${getDayNames(event.daysOfWeek)}.`}
                    {event.frequency === 'monthly' && `🗓️ This event repeats on the ${new Date(event.startDate).getDate()}${getOrdinalSuffix(new Date(event.startDate).getDate())} of every month.`}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ============================================ */}
          {/* TIMESTAMPS */}
          {/* ============================================ */}
          <div className="border-t-2 border-gray-200 pt-6">
            <h3 className="text-lg font-bold text-gray-700 mb-4">Metadata</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <span className="text-xl">📝</span>
                <div>
                  <div className="font-semibold text-gray-700">Created</div>
                  <div>{formatDate(event.createdAt)}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-gray-600">
                <span className="text-xl">🔄</span>
                <div>
                  <div className="font-semibold text-gray-700">Last Updated</div>
                  <div>{formatDate(event.updatedAt)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* ACTION BUTTONS */}
      {/* ============================================ */}
      <div className="flex gap-4 justify-center flex-wrap">
        <Link
          href={`/events/${event.id}/edit`}
          className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
        >
          <span className="text-2xl">✏️</span>
          Edit Event
        </Link>
        
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
        >
          <span className="text-2xl">📥</span>
          Export to Calendar
        </button>
        
        <button
          onClick={handleDelete}
          className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
        >
          <span className="text-2xl">🗑️</span>
          Delete Event
        </button>
      </div>
    </div>
  )
}

// ============================================
// HELPER FUNCTION
// ============================================
function getOrdinalSuffix(num) {
  const j = num % 10
  const k = num % 100
  
  if (j === 1 && k !== 11) return 'st'
  if (j === 2 && k !== 12) return 'nd'
  if (j === 3 && k !== 13) return 'rd'
  return 'th'
}
