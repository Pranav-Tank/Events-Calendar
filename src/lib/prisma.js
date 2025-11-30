// ============================================
// PRISMA CLIENT INSTANCE
// ============================================
// This file creates and exports a Prisma Client to interact with the database
// We use a singleton pattern to avoid creating multiple connections

// Import PrismaClient class from the generated package
import { PrismaClient } from '@prisma/client'

// ============================================
// SINGLETON PATTERN EXPLANATION
// ============================================
// In development, Next.js hot-reloads code frequently
// Without this pattern, each reload would create a NEW database connection
// This could cause: "Too many connections" error
// Solution: Store the client in a global variable that persists between reloads

// Access Node.js global object
const globalForPrisma = global

// ============================================
// CREATE OR REUSE PRISMA CLIENT
// ============================================
// If global.prisma exists (from previous reload), use it
// Otherwise, create a new PrismaClient
const prisma = globalForPrisma.prisma || new PrismaClient({
  log: ['query', 'error', 'warn'], // Log database queries (helpful for debugging)
})

// ============================================
// SAVE TO GLOBAL IN DEVELOPMENT
// ============================================
// In development mode, save the client to global
// This prevents creating multiple instances on hot reload
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Export the Prisma Client instance
// Other files will import this to interact with the database
export default prisma

// ============================================
// HOW TO USE THIS FILE
// ============================================
// In any other file, import like this:
// import prisma from '@/lib/prisma'
// 
// Then use it to query the database:
// const events = await prisma.event.findMany()
// const event = await prisma.event.create({ data: {...} })
// const updated = await prisma.event.update({ where: {id: 1}, data: {...} })
// const deleted = await prisma.event.delete({ where: {id: 1} })
