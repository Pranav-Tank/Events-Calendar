// ============================================
// CREATE EVENT PAGE
// ============================================
// Route: /events/new
// Form to create a new event

import EventForm from '@/components/EventForm'

// ============================================
// METADATA
// ============================================
export const metadata = {
  title: 'Create New Event - Event Calendar',
  description: 'Create a new one-time or recurring event. Choose from daily, weekly, or monthly recurrence options.',
}

// ============================================
// PAGE COMPONENT
// ============================================
export default function CreateEventPage() {
  return (
    <div className="space-y-6">
      {/* ============================================ */}
      {/* PAGE HEADER */}
      {/* ============================================ */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
          <span className="text-5xl">➕</span>
          Create New Event
        </h1>
        <p className="text-gray-600 text-lg">
          Fill in the details below to create your event. You can set it as a one-time or recurring event.
        </p>
      </div>

      {/* ============================================ */}
      {/* EVENT FORM COMPONENT */}
      {/* ============================================ */}
      <EventForm mode="create" />
      {/* 
        EventForm component with props:
        - mode="create" = Tells form we're creating (not editing)
        - event is not passed = Form starts empty
      */}

      {/* ============================================ */}
      {/* HELP SECTION */}
      {/* ============================================ */}
      <div className="max-w-3xl mx-auto bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="text-2xl">💡</span>
          Quick Tips
        </h3>
        
        <div className="space-y-3 text-gray-700">
          <div className="flex gap-3">
            <span className="text-xl">📅</span>
            <div>
              <strong>One-Time Events:</strong> Perfect for meetings, appointments, or special occasions that happen once.
            </div>
          </div>
          
          <div className="flex gap-3">
            <span className="text-xl">🔁</span>
            <div>
              <strong>Daily Recurring:</strong> Great for daily habits like exercise, meditation, or work schedules.
            </div>
          </div>
          
          <div className="flex gap-3">
            <span className="text-xl">📆</span>
            <div>
              <strong>Weekly Recurring:</strong> Ideal for classes, meetings, or activities that happen on specific days each week (e.g., Monday, Wednesday, Friday).
            </div>
          </div>
          
          <div className="flex gap-3">
            <span className="text-xl">🗓️</span>
            <div>
              <strong>Monthly Recurring:</strong> Perfect for bill payments, monthly meetings, or events that happen on the same date each month.
            </div>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* EXAMPLES SECTION */}
      {/* ============================================ */}
      <div className="max-w-3xl mx-auto">
        <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Example Use Cases
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          {/* Example 1 */}
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
            <div className="font-bold text-gray-800 mb-2">🏋️ Gym Class</div>
            <div className="text-sm text-gray-600">
              <strong>Type:</strong> Weekly Recurring<br />
              <strong>Days:</strong> Mon, Wed, Fri<br />
              <strong>Time:</strong> 6:00 AM - 7:00 AM
            </div>
          </div>
          
          {/* Example 2 */}
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
            <div className="font-bold text-gray-800 mb-2">💰 Rent Payment</div>
            <div className="text-sm text-gray-600">
              <strong>Type:</strong> Monthly Recurring<br />
              <strong>Date:</strong> 1st of each month<br />
              <strong>Reminder:</strong> Don't forget!
            </div>
          </div>
          
          {/* Example 3 */}
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-purple-500">
            <div className="font-bold text-gray-800 mb-2">📝 Standup Meeting</div>
            <div className="text-sm text-gray-600">
              <strong>Type:</strong> Daily Recurring<br />
              <strong>Time:</strong> 9:00 AM - 9:15 AM<br />
              <strong>Days:</strong> Weekdays
            </div>
          </div>
          
          {/* Example 4 */}
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-red-500">
            <div className="font-bold text-gray-800 mb-2">🎂 Birthday Party</div>
            <div className="text-sm text-gray-600">
              <strong>Type:</strong> One-Time Event<br />
              <strong>Date:</strong> December 25, 2024<br />
              <strong>Time:</strong> 6:00 PM - 10:00 PM
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// PAGE STRUCTURE EXPLAINED
// ============================================
/*
This page follows a simple structure:

1. HEADER:
   - Page title with icon
   - Brief description

2. MAIN CONTENT:
   - EventForm component
   - Handles all form logic and submission

3. HELP SECTION:
   - Tips for using different event types
   - Educational content

4. EXAMPLES:
   - Real-world use cases
   - Shows practical applications
   - Inspires users

Benefits of this structure:
- Clear and focused
- Educational (helps new users)
- Provides context
- Improves user experience
*/

// ============================================
// COMPONENT REUSABILITY
// ============================================
/*
Notice how we reuse EventForm:
- Same form for create AND edit
- Pass different props to change behavior
- Reduces code duplication
- Easier to maintain

Create page:
<EventForm mode="create" />

Edit page:
<EventForm mode="edit" event={eventData} />

This is the power of component-based architecture!
*/
