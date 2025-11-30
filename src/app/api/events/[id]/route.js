// ============================================
// API ROUTE: /api/events/[id]
// ============================================
// This file handles:
// - GET /api/events/1 → Fetch event with ID 1
// - PUT /api/events/1 → Update event with ID 1
// - DELETE /api/events/1 → Delete event with ID 1
//
// [id] is a dynamic route parameter
// Example URLs: /api/events/1, /api/events/5, /api/events/42

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// ============================================
// GET /api/events/[id] - Fetch Single Event
// ============================================
// Example: GET /api/events/5
export async function GET(request, { params }) {
  try {
    // ============================================
    // STEP 1: UNWRAP PARAMS PROMISE (Next.js 15+)
    // ============================================
    // In Next.js 15+, params is a Promise and must be awaited
    const resolvedParams = await params
    const id = parseInt(resolvedParams.id)
    
    // ============================================
    // STEP 2: Query Database
    // ============================================
    // prisma.event.findUnique() = "SELECT * FROM events WHERE id = ?"
    const event = await prisma.event.findUnique({
      where: { id } // ES6 shorthand for { id: id }
    })

    // ============================================
    // STEP 3: Handle Not Found
    // ============================================
    // If event doesn't exist, findUnique returns null
    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 } // 404 = Not Found
      )
    }

    // ============================================
    // STEP 4: Return Event
    // ============================================
    return NextResponse.json(event)
    
  } catch (error) {
    console.error('Error fetching event:', error)
    return NextResponse.json(
      { error: 'Failed to fetch event' },
      { status: 500 }
    )
  }
}

// ============================================
// PUT /api/events/[id] - Update Event
// ============================================
// Example: PUT /api/events/5 with body {...}
export async function PUT(request, { params }) {
  try {
    // ============================================
    // STEP 1: UNWRAP PARAMS PROMISE AND PARSE BODY
    // ============================================
    const resolvedParams = await params
    const id = parseInt(resolvedParams.id)
    const body = await request.json()
    
    // Example body:
    // {
    //   title: "Updated Team Meeting",
    //   description: "New description",
    //   startDate: "2024-12-25",
    //   endDate: "2024-12-25",
    //   isRecurring: true,
    //   frequency: "weekly",
    //   daysOfWeek: "1,3,5"
    // }

    // ============================================
    // STEP 2: Validation
    // ============================================
    if (!body.title || !body.startDate || !body.endDate) {
      return NextResponse.json(
        { error: 'Title, start date, and end date are required' },
        { status: 400 }
      )
    }

    // Validate weekly events have days selected
    if (body.isRecurring && body.frequency === 'weekly' && !body.daysOfWeek) {
      return NextResponse.json(
        { error: 'Days of week are required for weekly recurring events' },
        { status: 400 }
      )
    }

    // ============================================
    // STEP 3: Update Event in Database
    // ============================================
    // prisma.event.update() = "UPDATE events SET ... WHERE id = ?"
    const event = await prisma.event.update({
      where: { id }, // Which event to update
      data: {        // New values
        title: body.title,
        description: body.description || null,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        isRecurring: body.isRecurring || false,
        frequency: body.frequency || null,
        daysOfWeek: body.daysOfWeek || null,
      }
    })
    
    // NOTE: updatedAt is automatically updated by Prisma
    // (remember @updatedAt in schema?)

    // ============================================
    // STEP 4: Return Updated Event
    // ============================================
    return NextResponse.json(event)
    
  } catch (error) {
    // ============================================
    // ERROR HANDLING
    // ============================================
    // If event with this ID doesn't exist, Prisma throws error
    console.error('Error updating event:', error)
    
    // Check if error is because record not found
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 }
    )
  }
}

// ============================================
// DELETE /api/events/[id] - Delete Event
// ============================================
// Example: DELETE /api/events/5
export async function DELETE(request, { params }) {
  try {
    // ============================================
    // STEP 1: UNWRAP PARAMS PROMISE
    // ============================================
    const resolvedParams = await params
    const id = parseInt(resolvedParams.id)

    // ============================================
    // STEP 2: Delete Event from Database
    // ============================================
    // prisma.event.delete() = "DELETE FROM events WHERE id = ?"
    await prisma.event.delete({
      where: { id }
    })
    
    // We don't need to store the result since we're just deleting

    // ============================================
    // STEP 3: Return Success Message
    // ============================================
    return NextResponse.json({ 
      message: 'Event deleted successfully',
      deletedId: id
    })
    
  } catch (error) {
    console.error('Error deleting event:', error)
    
    // ============================================
    // ERROR HANDLING
    // ============================================
    // If event doesn't exist, Prisma throws error with code P2025
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    )
  }
}

// ============================================
// NEXT.JS 15+ CHANGES FOR API ROUTES
// ============================================
/*
IMPORTANT CHANGE IN NEXT.JS 15+:

Old way (Next.js 14):
export async function GET(request, { params }) {
  const id = parseInt(params.id)  // ❌ No longer works
}

New way (Next.js 15+):
export async function GET(request, { params }) {
  const resolvedParams = await params  // ✅ Unwrap Promise
  const id = parseInt(resolvedParams.id)  // ✅ Now works
}

Why?
- Performance optimization
- Better async handling
- Consistent with other Next.js APIs

This applies to ALL API routes with dynamic segments!
*/

// ============================================
// DYNAMIC ROUTES EXPLANATION
// ============================================
// Folder name: [id]
// This creates a dynamic route that matches any value
//
// Examples:
// /api/events/1     → params.id = "1"
// /api/events/5     → params.id = "5"
// /api/events/42    → params.id = "42"
// /api/events/abc   → params.id = "abc" (will fail parseInt)

// ============================================
// PRISMA ERROR CODES
// ============================================
// P2025 = Record not found
// P2002 = Unique constraint violation
// P2003 = Foreign key constraint violation

// ============================================
// HOW TO TEST THIS API
// ============================================
/*
// Test GET single event:
fetch('http://localhost:3000/api/events/1')

// Test UPDATE event:
fetch('http://localhost:3000/api/events/1', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: "Updated Event",
    startDate: "2024-12-25",
    endDate: "2024-12-25",
    isRecurring: false
  })
})

// Test DELETE event:
fetch('http://localhost:3000/api/events/1', {
  method: 'DELETE'
})
*/
