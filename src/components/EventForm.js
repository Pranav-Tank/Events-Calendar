// ============================================
// EVENT FORM COMPONENT
// ============================================
// Reusable form for creating and editing events
// Features:
// - Basic event info (title, description, dates)
// - Recurring options (daily, weekly, monthly)
// - Day selection for weekly events
// - Form validation
// - Beautiful UI with Tailwind CSS

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { formatDateForInput } from '@/lib/eventUtils'

export default function EventForm({ event = null, mode = 'create' }) {
  // ============================================
  // PROPS EXPLANATION
  // ============================================
  // event: Event object (for edit mode), null for create mode
  // mode: 'create' or 'edit'
  
  const router = useRouter() // For navigation after submit
  
  // ============================================
  // FORM STATE
  // ============================================
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    isRecurring: false,
    frequency: 'daily',
    daysOfWeek: []
  })
  
  const [errors, setErrors] = useState({}) // Validation errors
  const [loading, setLoading] = useState(false) // Submit loading state

  // ============================================
  // POPULATE FORM (Edit Mode)
  // ============================================
  // When event prop changes, populate the form
  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || '',
        description: event.description || '',
        startDate: formatDateForInput(event.startDate),
        endDate: formatDateForInput(event.endDate),
        isRecurring: event.isRecurring || false,
        frequency: event.frequency || 'daily',
        daysOfWeek: event.daysOfWeek ? event.daysOfWeek.split(',') : []
      })
    }
  }, [event])

  // ============================================
  // HANDLE INPUT CHANGES
  // ============================================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    
    // For checkboxes, use 'checked' instead of 'value'
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // Explanation:
    // ...prev = Keep all existing form data
    // [name]: value = Update the specific field
    // Example: If name="title", this becomes { title: value }
  }

  // ============================================
  // HANDLE DAY SELECTION (Weekly Events)
  // ============================================
  const handleDayToggle = (day) => {
    setFormData(prev => {
      const days = [...prev.daysOfWeek] // Copy current days array
      
      // Toggle: if day exists, remove it; if not, add it
      if (days.includes(day)) {
        return {
          ...prev,
          daysOfWeek: days.filter(d => d !== day) // Remove day
        }
      } else {
        return {
          ...prev,
          daysOfWeek: [...days, day].sort() // Add day and sort
        }
      }
    })
  }

  // ============================================
  // VALIDATE FORM
  // ============================================
  const validate = () => {
    const newErrors = {}
    
    // Check required fields
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }
    
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required'
    }
    
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required'
    }
    
    // Check if end date is after start date
    if (formData.startDate && formData.endDate) {
      if (new Date(formData.endDate) < new Date(formData.startDate)) {
        newErrors.endDate = 'End date must be after start date'
      }
    }
    
    // Check weekly events have at least one day selected
    if (formData.isRecurring && formData.frequency === 'weekly' && formData.daysOfWeek.length === 0) {
      newErrors.daysOfWeek = 'Please select at least one day for weekly events'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0 // Return true if no errors
  }

  // ============================================
  // HANDLE FORM SUBMIT
  // ============================================
  const handleSubmit = async (e) => {
    e.preventDefault() // Prevent page reload
    
    // Validate form
    if (!validate()) {
      return // Stop if validation fails
    }
    
    setLoading(true)
    
    try {
      // Prepare data for API
      const submitData = {
        ...formData,
        daysOfWeek: formData.daysOfWeek.length > 0 
          ? formData.daysOfWeek.join(',') // Convert array to string: [1,3,5] → "1,3,5"
          : null
      }
      
      // API request
      const url = mode === 'create' 
        ? '/api/events' 
        : `/api/events/${event.id}`
      
      const method = mode === 'create' ? 'POST' : 'PUT'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      })
      
      if (!response.ok) {
        throw new Error('Failed to save event')
      }
      
      // Success! Navigate to events page
      router.push('/events')
      router.refresh() // Refresh to show new data
      
    } catch (error) {
      console.error('Error saving event:', error)
      setErrors({ submit: 'Failed to save event. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  // ============================================
  // DAY BUTTONS DATA
  // ============================================
  const weekDays = [
    { value: '0', label: 'Sun' },
    { value: '1', label: 'Mon' },
    { value: '2', label: 'Tue' },
    { value: '3', label: 'Wed' },
    { value: '4', label: 'Thu' },
    { value: '5', label: 'Fri' },
    { value: '6', label: 'Sat' }
  ]

  // ============================================
  // RENDER FORM
  // ============================================
  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-2xl p-8 max-w-3xl mx-auto">
      {/* Container with beautiful styling */}
      
      <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
        <span className="text-4xl">{mode === 'create' ? '➕' : '✏️'}</span>
        {mode === 'create' ? 'Create New Event' : 'Edit Event'}
      </h2>

      {/* ============================================ */}
      {/* TITLE FIELD */}
      {/* ============================================ */}
      <div className="mb-6">
        <label className="block text-gray-700 font-semibold mb-2">
          Event Title *
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={`
            w-full px-4 py-3 border-2 rounded-lg transition-all duration-200
            focus:outline-none focus:ring-4
            ${errors.title 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
            }
          `}
          placeholder="Enter event title"
        />
        {/* 
          Input styling:
          - w-full = Full width
          - px-4 py-3 = Padding
          - border-2 = 2px border
          - rounded-lg = Rounded corners
          - focus:outline-none = Remove default outline
          - focus:ring-4 = Add ring on focus
          
          Conditional styling:
          - If error: red border and ring
          - If no error: gray border, blue on focus
        */}
        
        {errors.title && (
          <p className="text-red-500 text-sm mt-2">❌ {errors.title}</p>
        )}
      </div>

      {/* ============================================ */}
      {/* DESCRIPTION FIELD */}
      {/* ============================================ */}
      <div className="mb-6">
        <label className="block text-gray-700 font-semibold mb-2">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:border-blue-500 focus:ring-blue-200 transition-all duration-200"
          placeholder="Enter event description (optional)"
        />
      </div>

      {/* ============================================ */}
      {/* DATE FIELDS (Side by Side) */}
      {/* ============================================ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* 
          Responsive grid:
          - grid-cols-1 = 1 column on mobile
          - md:grid-cols-2 = 2 columns on medium screens and up
          - gap-6 = Gap between columns
        */}
        
        {/* Start Date */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Start Date *
          </label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className={`
              w-full px-4 py-3 border-2 rounded-lg transition-all duration-200
              focus:outline-none focus:ring-4
              ${errors.startDate 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
              }
            `}
          />
          {errors.startDate && (
            <p className="text-red-500 text-sm mt-2">❌ {errors.startDate}</p>
          )}
        </div>

        {/* End Date */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            End Date *
          </label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className={`
              w-full px-4 py-3 border-2 rounded-lg transition-all duration-200
              focus:outline-none focus:ring-4
              ${errors.endDate 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
              }
            `}
          />
          {errors.endDate && (
            <p className="text-red-500 text-sm mt-2">❌ {errors.endDate}</p>
          )}
        </div>
      </div>

      {/* ============================================ */}
      {/* RECURRING CHECKBOX */}
      {/* ============================================ */}
      <div className="mb-6">
        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            name="isRecurring"
            checked={formData.isRecurring}
            onChange={handleChange}
            className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-4 focus:ring-blue-200 transition-all duration-200"
          />
          <span className="text-gray-700 font-semibold group-hover:text-blue-600 transition-colors duration-200">
            🔁 This is a recurring event
          </span>
        </label>
      </div>

      {/* ============================================ */}
      {/* RECURRING OPTIONS (Show only if recurring) */}
      {/* ============================================ */}
      {formData.isRecurring && (
        <div className="bg-blue-50 rounded-lg p-6 mb-6 border-2 border-blue-200">
          {/* Frequency Selection */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-3">
              Repeat Frequency
            </label>
            <div className="grid grid-cols-3 gap-3">
              {/* Daily Button */}
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, frequency: 'daily' }))}
                className={`
                  py-3 px-4 rounded-lg font-semibold transition-all duration-200
                  ${formData.frequency === 'daily'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-300'
                  }
                `}
              >
                📅 Daily
              </button>

              {/* Weekly Button */}
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, frequency: 'weekly' }))}
                className={`
                  py-3 px-4 rounded-lg font-semibold transition-all duration-200
                  ${formData.frequency === 'weekly'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-300'
                  }
                `}
              >
                🗓️ Weekly
              </button>

              {/* Monthly Button */}
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, frequency: 'monthly' }))}
                className={`
                  py-3 px-4 rounded-lg font-semibold transition-all duration-200
                  ${formData.frequency === 'monthly'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-300'
                  }
                `}
              >
                📆 Monthly
              </button>
            </div>
          </div>

          {/* Day Selection (Show only for weekly) */}
          {formData.frequency === 'weekly' && (
            <div>
              <label className="block text-gray-700 font-semibold mb-3">
                Select Days *
              </label>
              <div className="grid grid-cols-7 gap-2">
                {weekDays.map(day => (
                  <button
                    key={day.value}
                    type="button"
                    onClick={() => handleDayToggle(day.value)}
                    className={`
                      py-3 px-2 rounded-lg font-semibold text-sm transition-all duration-200
                      ${formData.daysOfWeek.includes(day.value)
                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg transform scale-105'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-300'
                      }
                    `}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
              {errors.daysOfWeek && (
                <p className="text-red-500 text-sm mt-2">❌ {errors.daysOfWeek}</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* ============================================ */}
      {/* SUBMIT ERROR */}
      {/* ============================================ */}
      {errors.submit && (
        <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-lg p-4">
          <p className="text-red-600 font-medium">❌ {errors.submit}</p>
        </div>
      )}

      {/* ============================================ */}
      {/* SUBMIT BUTTONS */}
      {/* ============================================ */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className={`
            flex-1 py-4 rounded-lg font-bold text-lg transition-all duration-200
            ${loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
            }
          `}
        >
          {loading ? '⏳ Saving...' : mode === 'create' ? '✅ Create Event' : '💾 Save Changes'}
        </button>

        <button
          type="button"
          onClick={() => router.back()}
          className="px-8 py-4 bg-gray-200 text-gray-700 rounded-lg font-bold text-lg hover:bg-gray-300 transition-all duration-200"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

// ============================================
// KEY CONCEPTS EXPLAINED
// ============================================
/*
1. CONTROLLED COMPONENTS:
   - Input value is controlled by React state
   - value={formData.title}
   - onChange={handleChange}
   - Single source of truth (state)

2. FORM VALIDATION:
   - Check required fields
   - Check data types and formats
   - Show error messages
   - Prevent submit if invalid

3. CONDITIONAL RENDERING:
   {condition && <Component />}
   - Only render if condition is true
   - Used for showing/hiding recurring options

4. DYNAMIC STYLING:
   className={`base ${condition ? 'active' : 'inactive'}`}
   - Change styles based on state
   - Used for selected buttons, error states

5. PROPS:
   <EventForm event={event} mode="edit" />
   - Pass data from parent to child
   - Makes component reusable
*/
