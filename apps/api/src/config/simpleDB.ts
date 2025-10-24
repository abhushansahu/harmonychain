import fs from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

/**
 * Simple JSON-based database for development
 * Provides basic CRUD operations with validation and duplicate prevention
 */
const DB_DIR = path.join(process.cwd(), 'orbitdb')
const DB_FILES = {
  users: path.join(DB_DIR, 'users.json'),
  tracks: path.join(DB_DIR, 'tracks.json'),
  artists: path.join(DB_DIR, 'artists.json'),
  nfts: path.join(DB_DIR, 'nfts.json'),
  playlists: path.join(DB_DIR, 'playlists.json'),
  licenses: path.join(DB_DIR, 'licenses.json'),
  proposals: path.join(DB_DIR, 'proposals.json'),
  votes: path.join(DB_DIR, 'votes.json'),
  transactions: path.join(DB_DIR, 'transactions.json'),
  analytics: path.join(DB_DIR, 'analytics.json')
}

// Ensure database directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true })
}

// Initialize empty database files
Object.values(DB_FILES).forEach(file => {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, '[]')
  }
})

/**
 * SimpleDB - JSON-based database with validation and duplicate prevention
 * 
 * Features:
 * - Data validation before write operations
 * - Duplicate prevention by ID checking
 * - File locking to prevent race conditions
 * - Data cleanup and reset utilities
 * - Export/import for migrations
 */
export class SimpleDB {
  // File locking mechanism
  private static locks = new Map<string, boolean>()

  /**
   * Read data from file with error handling
   * @param store - Database store name
   * @returns Array of records or empty array on error
   */
  static read<T>(store: keyof typeof DB_FILES): T[] {
    try {
      const data = fs.readFileSync(DB_FILES[store], 'utf8')
      const parsed = JSON.parse(data)
      return Array.isArray(parsed) ? parsed : []
    } catch (error) {
      console.error(`Error reading ${store}:`, error)
      return []
    }
  }

  /**
   * Write data to file with validation and locking
   * @param store - Database store name
   * @param data - Array of records to write
   */
  static write<T>(store: keyof typeof DB_FILES, data: T[]): void {
    // Validate data before writing
    if (!Array.isArray(data)) {
      console.error(`Invalid data format for ${store}: expected array`)
      return
    }

    // Check for file lock
    if (this.locks.get(store)) {
      console.warn(`File ${store} is locked, skipping write`)
      return
    }

    try {
      // Set lock
      this.locks.set(store, true)
      
      // Validate each record has required fields
      const validatedData = data.filter(record => {
        if (typeof record === 'object' && record !== null) {
          return 'id' in record && record.id
        }
        return false
      })

      fs.writeFileSync(DB_FILES[store], JSON.stringify(validatedData, null, 2))
    } catch (error) {
      console.error(`Error writing ${store}:`, error)
    } finally {
      // Release lock
      this.locks.set(store, false)
    }
  }

  /**
   * Create a new record with duplicate prevention
   * @param store - Database store name
   * @param data - Record data
   * @returns Created record with ID and timestamps
   */
  static create<T>(store: keyof typeof DB_FILES, data: T): T & { id: string; createdAt: string; updatedAt: string } {
    const records = this.read<T>(store)
    const id = uuidv4()
    const newRecord = { 
      ...data, 
      id, 
      createdAt: new Date().toISOString(), 
      updatedAt: new Date().toISOString() 
    } as T & { id: string; createdAt: string; updatedAt: string }
    
    // Check for duplicates by ID (shouldn't happen with UUID, but safety check)
    const existingRecord = records.find((record: any) => record.id === id)
    if (existingRecord) {
      console.warn(`Duplicate ID detected for ${store}: ${id}`)
      return existingRecord
    }
    
    records.push(newRecord)
    this.write(store, records)
    return newRecord
  }

  /**
   * Get a record by ID
   * @param store - Database store name
   * @param id - Record ID
   * @returns Record or null if not found
   */
  static get<T>(store: keyof typeof DB_FILES, id: string): T | null {
    if (!id || typeof id !== 'string') {
      console.warn(`Invalid ID for ${store}: ${id}`)
      return null
    }
    
    const records = this.read<T>(store)
    return records.find((record: any) => record.id === id) || null
  }

  /**
   * Get all records from a store
   * @param store - Database store name
   * @returns Array of all records
   */
  static getAll<T>(store: keyof typeof DB_FILES): T[] {
    return this.read<T>(store)
  }

  /**
   * Update a record by ID
   * @param store - Database store name
   * @param id - Record ID
   * @param data - Partial data to update
   * @returns Updated record or null if not found
   */
  static update<T extends { id: string }>(store: keyof typeof DB_FILES, id: string, data: Partial<T>): T | null {
    if (!id || typeof id !== 'string') {
      console.warn(`Invalid ID for update in ${store}: ${id}`)
      return null
    }
    
    const records = this.read<T>(store)
    const index = records.findIndex((record: any) => record.id === id)
    if (index === -1) {
      console.warn(`Record not found for update in ${store}: ${id}`)
      return null
    }
    
    records[index] = { 
      ...records[index], 
      ...data, 
      updatedAt: new Date().toISOString() 
    }
    this.write(store, records)
    return records[index]
  }

  /**
   * Delete a record by ID (soft delete by default)
   * @param store - Database store name
   * @param id - Record ID
   * @param hardDelete - Whether to permanently delete or soft delete
   * @returns True if deleted, false if not found
   */
  static delete<T extends { id: string }>(store: keyof typeof DB_FILES, id: string, hardDelete: boolean = false): boolean {
    if (!id || typeof id !== 'string') {
      console.warn(`Invalid ID for delete in ${store}: ${id}`)
      return false
    }
    
    const records = this.read<T>(store)
    const index = records.findIndex((record: any) => record.id === id)
    if (index === -1) {
      console.warn(`Record not found for delete in ${store}: ${id}`)
      return false
    }
    
    if (hardDelete) {
      // Hard delete - remove from array
      const filteredRecords = records.filter((record: any) => record.id !== id)
      this.write(store, filteredRecords)
    } else {
      // Soft delete - mark as deleted
      records[index] = { 
        ...records[index], 
        deletedAt: new Date().toISOString(),
        isDeleted: true
      } as any
      this.write(store, records)
    }
    
    return true
  }

  /**
   * Query records with filter function
   * @param store - Database store name
   * @param filter - Optional filter function
   * @returns Filtered array of records
   */
  static query<T>(store: keyof typeof DB_FILES, filter?: (item: T) => boolean): T[] {
    const records = this.read<T>(store)
    if (!filter) return records
    
    // Filter out soft-deleted records by default
    const activeRecords = records.filter((record: any) => !record.isDeleted)
    return activeRecords.filter(filter)
  }

  /**
   * Search records by text query across specified fields
   * @param store - Database store name
   * @param query - Search query string
   * @param fields - Fields to search in
   * @returns Array of matching records
   */
  static search<T>(store: keyof typeof DB_FILES, query: string, fields: string[]): T[] {
    if (!query || typeof query !== 'string') {
      console.warn(`Invalid search query: ${query}`)
      return []
    }
    
    const records = this.read<T>(store)
    const lowercaseQuery = query.toLowerCase()
    
    // Filter out soft-deleted records and search
    return records.filter((record: any) => 
      !record.isDeleted && fields.some(field => {
        const value = record[field]
        return value && value.toString().toLowerCase().includes(lowercaseQuery)
      })
    )
  }

  /**
   * Paginate results with metadata
   * @param items - Array of items to paginate
   * @param page - Page number (1-based)
   * @param limit - Items per page
   * @returns Paginated data with metadata
   */
  static paginate<T>(items: T[], page: number = 1, limit: number = 10) {
    // Validate inputs
    const validPage = Math.max(1, Math.floor(page))
    const validLimit = Math.max(1, Math.min(100, Math.floor(limit))) // Cap at 100 items
    
    const startIndex = (validPage - 1) * validLimit
    const endIndex = startIndex + validLimit
    
    return {
      data: items.slice(startIndex, endIndex),
      pagination: {
        page: validPage,
        limit: validLimit,
        total: items.length,
        pages: Math.ceil(items.length / validLimit),
        hasNext: endIndex < items.length,
        hasPrev: validPage > 1
      }
    }
  }

  /**
   * Data management utilities
   */
  
  /**
   * Clear all data from a store
   * @param store - Database store name
   */
  static clear(store: keyof typeof DB_FILES): void {
    this.write(store, [])
    console.log(`Cleared all data from ${store}`)
  }

  /**
   * Clear all data from all stores
   */
  static clearAll(): void {
    Object.keys(DB_FILES).forEach(store => {
      this.clear(store as keyof typeof DB_FILES)
    })
    console.log('Cleared all data from all stores')
  }

  /**
   * Export data from a store
   * @param store - Database store name
   * @returns JSON string of data
   */
  static export(store: keyof typeof DB_FILES): string {
    const data = this.read(store)
    return JSON.stringify(data, null, 2)
  }

  /**
   * Import data to a store (replaces existing data)
   * @param store - Database store name
   * @param jsonData - JSON string of data
   */
  static import(store: keyof typeof DB_FILES, jsonData: string): void {
    try {
      const data = JSON.parse(jsonData)
      if (Array.isArray(data)) {
        this.write(store, data)
        console.log(`Imported ${data.length} records to ${store}`)
      } else {
        console.error(`Invalid data format for import to ${store}`)
      }
    } catch (error) {
      console.error(`Error importing data to ${store}:`, error)
    }
  }

  /**
   * Get database statistics
   * @returns Object with record counts for each store
   */
  static getStats(): Record<string, number> {
    const stats: Record<string, number> = {}
    Object.keys(DB_FILES).forEach(store => {
      const data = this.read(store as keyof typeof DB_FILES)
      stats[store] = data.length
    })
    return stats
  }

  /**
   * Remove duplicate records based on ID
   * @param store - Database store name
   * @returns Number of duplicates removed
   */
  static removeDuplicates(store: keyof typeof DB_FILES): number {
    const records = this.read(store)
    const seen = new Set()
    const uniqueRecords = records.filter((record: any) => {
      if (seen.has(record.id)) {
        return false
      }
      seen.add(record.id)
      return true
    })
    
    const removed = records.length - uniqueRecords.length
    if (removed > 0) {
      this.write(store, uniqueRecords)
      console.log(`Removed ${removed} duplicate records from ${store}`)
    }
    
    return removed
  }
}

export default SimpleDB
