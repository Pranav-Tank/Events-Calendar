// ============================================
// EVENTS LIST PAGE WITH SEARCH & FILTER
// ============================================
// Route: /events
// Shows all events in a list view with search and filtering

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { formatDate, getDayNames } from '@/lib/eventUtils'

// ============================================
// PAGE COMPONENT
// ============================================
export default function EventsPage() {
  // ============================================
  // STATE MANAGEMENT
  // ============================================
  const [events, setEvents] = useState([])
  const [filteredEvents, setFilteredEvents] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all') // all, oneTime, recurring
  const [filterFrequency, setFilterFrequency] = useState('all') // all, daily, weekly, monthly
  
  // ============================================
  // FETCH EVENTS ON MOUNT
  // ============================================
  useEffect(() => {
    fetchEvents()
  }, [])
  
  const fetchEvents = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/events')
      const data = await response.json()
      setEvents(data)
      setFilteredEvents(data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching events:', error)
      setLoading(false)
    }
  }
  
  // ============================================
  // FILTER EVENTS WHEN FILTERS CHANGE
  // ============================================
  useEffect(() => {
    let filtered = [...events]
    
    // Filter by search term (title or description)
    if (searchTerm) {
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (event.description && event.description.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }
    
    // Filter by event type (one-time or recurring)
    if (filterType !== 'all') {
      if (filterType === 'oneTime') {
        filtered = filtered.filter(event => !event.isRecurring)
      } else if (filterType === 'recurring') {
        filtered = filtered.filter(event => event.isRecurring)
      }
    }
    
    // Filter by frequency (for recurring events)
    if (filterFrequency !== 'all') {
      filtered = filtered.filter(event => 
        event.isRecurring && event.frequency === filterFrequency
      )
    }
    
    setFilteredEvents(filtered)
  }, [searchTerm, filterType, filterFrequency, events])
  
  // ============================================
  // CLEAR ALL FILTERS
  // ============================================
  const clearFilters = () => {
    setSearchTerm('')
    setFilterType('all')
    setFilterFrequency('all')
  }
  
  // ============================================
  // DELETE EVENT HANDLER
  // ============================================
  const handleDelete = async (eventId, eventTitle) => {
    if (confirm(`Are you sure you want to delete "${eventTitle}"? This action cannot be undone.`)) {
      try {
        const response = await fetch(`/api/events/${eventId}`, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          setEvents(events.filter(e => e.id !== eventId))
          alert('Event deleted successfully!')
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
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    )
  }
  
  return (
    <div className="space-y-8">
      {/* ============================================ */}
      {/* PAGE HEADER */}
      {/* ============================================ */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
            <span className="text-5xl">📋</span>
            All Events
          </h1>
          <p className="text-gray-600 mt-2">
            Showing <strong>{filteredEvents.length}</strong> of <strong>{events.length}</strong> events
          </p>
        </div>
        
        {/* Create Event Button */}
        <Link
          href="/events/new"
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-bold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
        >
          <span className="text-xl">➕</span>
          Create Event
        </Link>
      </div>

      {/* ============================================ */}
      {/* SEARCH & FILTER SECTION */}
      {/* ============================================ */}
      <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span className="text-3xl">🔍</span>
            Search & Filter
          </h2>
          
          {/* Clear Filters Button */}
          {(searchTerm || filterType !== 'all' || filterFrequency !== 'all') && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-red-100 text-red-600 rounded-lg font-semibold hover:bg-red-200 transition-all duration-200"
            >
              ✖️ Clear Filters
            </button>
          )}
        </div>
        
        <div className="grid md:grid-cols-3 gap-4">
          {/* Search Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Search Events
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title or description..."
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-200 transition-all duration-200"
            />
          </div>
          
          {/* Event Type Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Event Type
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-200 transition-all duration-200"
            >
              <option value="all">All Events</option>
              <option value="oneTime">One-Time Only</option>
              <option value="recurring">Recurring Only</option>
            </select>
          </div>
          
          {/* Frequency Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Frequency
            </label>
            <select
              value={filterFrequency}
              onChange={(e) => setFilterFrequency(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-200 transition-all duration-200"
            >
              <option value="all">All Frequencies</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </div>
        
        {/* Active Filters Display */}
        {(searchTerm || filterType !== 'all' || filterFrequency !== 'all') && (
          <div className="flex flex-wrap gap-2 pt-2">
            <span className="text-sm font-semibold text-gray-600">Active Filters:</span>
            {searchTerm && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                Search: "{searchTerm}"
              </span>
            )}
            {filterType !== 'all' && (
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                Type: {filterType === 'oneTime' ? 'One-Time' : 'Recurring'}
              </span>
            )}
            {filterFrequency !== 'all' && (
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium capitalize">
                Frequency: {filterFrequency}
              </span>
            )}
          </div>
        )}
      </div>

      {/* ============================================ */}
      {/* EMPTY STATE - NO EVENTS */}
      {/* ============================================ */}
      {events.length === 0 && (
        <div className="bg-white rounded-xl shadow-lg p-16 text-center">
          <div className="text-8xl mb-6">📭</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">No Events Yet</h2>
          <p className="text-gray-600 text-lg mb-8">
            Start organizing your schedule by creating your first event!
          </p>
          <Link
            href="/events/new"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          >
            <span className="text-2xl">➕</span>
            Create Your First Event
          </Link>
        </div>
      )}

      {/* ============================================ */}
      {/* EMPTY STATE - NO FILTERED RESULTS */}
      {/* ============================================ */}
      {events.length > 0 && filteredEvents.length === 0 && (
        <div className="bg-white rounded-xl shadow-lg p-16 text-center">
          <div className="text-8xl mb-6">🔍</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">No Events Found</h2>
          <p className="text-gray-600 text-lg mb-8">
            No events match your current filters. Try adjusting your search criteria.
          </p>
          <button
            onClick={clearFilters}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          >
            <span className="text-2xl">✖️</span>
            Clear All Filters
          </button>
        </div>
      )}

      {/* ============================================ */}
      {/* EVENTS LIST */}
      {/* ============================================ */}
      {filteredEvents.length > 0 && (
        <div className="grid gap-6">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-200 overflow-hidden group"
            >
              <div className="flex flex-col md:flex-row">
                {/* ============================================ */}
                {/* LEFT: Date Badge */}
                {/* ============================================ */}
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white p-6 flex flex-col items-center justify-center min-w-[160px]">
                  <div className="text-4xl font-bold">
                    {new Date(event.startDate).getDate()}
                  </div>
                  <div className="text-lg font-semibold uppercase">
                    {new Date(event.startDate).toLocaleDateString('en-US', { month: 'short' })}
                  </div>
                  <div className="text-sm opacity-90">
                    {new Date(event.startDate).getFullYear()}
                  </div>
                  
                  {event.isRecurring && (
                    <div className="mt-3 px-3 py-1 bg-white/20 rounded-full text-xs font-semibold backdrop-blur-sm">
                      🔁 Recurring
                    </div>
                  )}
                </div>

                {/* ============================================ */}
                {/* CENTER: Event Details */}
                {/* ============================================ */}
                <div className="flex-1 p-6">
                  <Link 
                    href={`/events/${event.id}`}
                    className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors duration-200 mb-2 block"
                  >
                    {event.title}
                  </Link>
                  
                  {event.description && (
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {event.description}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">📅</span>
                      <span>
                        {formatDate(event.startDate)}
                        {event.startDate !== event.endDate && ` - ${formatDate(event.endDate)}`}
                      </span>
                    </div>
                    
                    {event.isRecurring && (
                      <>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🔁</span>
                          <span className="capitalize font-medium">
                            {event.frequency}
                          </span>
                        </div>
                        
                        {event.frequency === 'weekly' && event.daysOfWeek && (
                          <div className="flex items-center gap-2">
                            <span className="text-lg">📆</span>
                            <span className="font-medium">
                              {getDayNames(event.daysOfWeek)}
                            </span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* ============================================ */}
                {/* RIGHT: Action Buttons */}
                {/* ============================================ */}
                <div className="p-6 flex md:flex-col gap-3 border-t md:border-t-0 md:border-l border-gray-200 bg-gray-50">
                  <Link
                    href={`/events/${event.id}`}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-all duration-200 hover:scale-105 shadow-md"
                  >
                    <span>👁️</span>
                    <span className="hidden sm:inline">View</span>
                  </Link>
                  
                  <Link
                    href={`/events/${event.id}/edit`}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600 transition-all duration-200 hover:scale-105 shadow-md"
                  >
                    <span>✏️</span>
                    <span className="hidden sm:inline">Edit</span>
                  </Link>
                  
                  <button
                    type="button"
                    onClick={() => handleDelete(event.id, event.title)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-all duration-200 hover:scale-105 shadow-md"
                  >
                    <span>🗑️</span>
                    <span className="hidden sm:inline">Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
