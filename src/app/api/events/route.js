// ============================================
// API ROUTE: /api/events
// ============================================
// This file handles:
// - GET /api/events → Fetch all events
// - POST /api/events → Create a new event

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// ============================================
// GET /api/events - Fetch All Events
// ============================================
// This function runs when someone makes a GET request to /api/events
// Example: fetch('/api/events')
export async function GET() {
  try {
    // ============================================
    // STEP 1: Query Database
    // ============================================
    // prisma.event.findMany() = "SELECT * FROM events"
    const events = await prisma.event.findMany({
      orderBy: {
        startDate: 'asc' // Sort by start date, oldest first
        // 'asc' = ascending (1, 2, 3...)
        // 'desc' = descending (3, 2, 1...)
      }
    })
    
    // ============================================
    // STEP 2: Return JSON Response
    // ============================================
    // NextResponse.json() converts JavaScript object to JSON
    // Status 200 (OK) is default
    return NextResponse.json(events)
    
  } catch (error) {
    // ============================================
    // ERROR HANDLING
    // ============================================
    // Log error to server console (you'll see this in terminal)
    console.error('Error fetching events:', error)
    
    // Return error response to client
    return NextResponse.json(
      { error: 'Failed to fetch events' }, // Error message
      { status: 500 }                       // 500 = Internal Server Error
    )
  }
}

// ============================================
// POST /api/events - Create New Event
// ============================================
// This function runs when someone makes a POST request to /api/events
// Example: fetch('/api/events', { method: 'POST', body: {...} })
export async function POST(request) {
  try {
    // ============================================
    // STEP 1: Parse Request Body
    // ============================================
    // request.json() reads the JSON data sent by the client
    const body = await request.json()
    
    // Example body:
    // {
    //   title: "Team Meeting",
    //   description: "Weekly standup",
    //   startDate: "2024-12-25",
    //   endDate: "2024-12-25",
    //   isRecurring: true,
    //   frequency: "weekly",
    //   daysOfWeek: "1,3,5"
    // }
    
    // ============================================
    // STEP 2: Validation
    // ============================================
    // Check if required fields are present
    if (!body.title || !body.startDate || !body.endDate) {
      return NextResponse.json(
        { error: 'Title, start date, and end date are required' },
        { status: 400 } // 400 = Bad Request
      )
    }

    // Additional validation for weekly recurring events
    if (body.isRecurring && body.frequency === 'weekly' && !body.daysOfWeek) {
      return NextResponse.json(
        { error: 'Days of week are required for weekly recurring events' },
        { status: 400 }
      )
    }

    // ============================================
    // STEP 3: Create Event in Database
    // ============================================
    // prisma.event.create() = "INSERT INTO events VALUES (...)"
    const event = await prisma.event.create({
      data: {
        title: body.title,
        description: body.description || null,    // If empty, store null
        startDate: new Date(body.startDate),      // Convert string to Date object
        endDate: new Date(body.endDate),
        isRecurring: body.isRecurring || false,   // Default to false
        frequency: body.frequency || null,
        daysOfWeek: body.daysOfWeek || null,
      }
    })
    
    // Explanation of Date conversion:
    // "2024-12-25" (string) → new Date("2024-12-25") → Date object
    
    // Explanation of || (OR operator):
    // body.isRecurring || false
    // If body.isRecurring is undefined/null/false, use false as default

    // ============================================
    // STEP 4: Return Created Event
    // ============================================
    return NextResponse.json(event, { status: 201 })
    // 201 = Created (successful creation)
    
  } catch (error) {
    // ============================================
    // ERROR HANDLING
    // ============================================
    console.error('Error creating event:', error)
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    )
  }
}

// ============================================
// HTTP STATUS CODES EXPLAINED
// ============================================
// 200 OK - Request successful
// 201 Created - Resource created successfully
// 400 Bad Request - Client sent invalid data
// 404 Not Found - Resource doesn't exist
// 500 Internal Server Error - Server error

// ============================================
// HOW TO TEST THIS API
// ============================================
/*
// Test GET request (in browser or Postman):
http://localhost:3000/api/events

// Test POST request (using fetch in browser console):
fetch('http://localhost:3000/api/events', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: "Test Event",
    startDate: "2024-12-25",
    endDate: "2024-12-25",
    isRecurring: false
  })
})
*/
