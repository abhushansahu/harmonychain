'use client'

import React, { useState, useEffect, Suspense } from 'react'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import DocViewer from '@/components/docs/DocViewer'
import { useSearchParams } from 'next/navigation'

const DOCS_STRUCTURE = [
  {
    id: 'index',
    title: 'Overview',
    path: '/docs/index.md'
  },
  {
    id: 'architecture',
    title: 'Architecture',
    path: '/docs/architecture.md'
  },
  {
    id: 'components',
    title: 'Components',
    path: '/docs/components.md'
  },
  {
    id: 'developer-guide',
    title: 'Developer Guide',
    path: '/docs/developer-guide.md'
  },
  {
    id: 'user-guide',
    title: 'User Guide',
    path: '/docs/user-guide.md'
  },
  {
    id: 'glossary',
    title: 'Glossary',
    path: '/docs/glossary.md'
  },
  {
    id: 'roadmap',
    title: 'Roadmap',
    path: '/docs/roadmap.md'
  }
]

function DocsContent() {
  const [selectedDoc, setSelectedDoc] = useState('index')
  const [searchQuery, setSearchQuery] = useState('')
  const searchParams = useSearchParams()
  
  useEffect(() => {
    const doc = searchParams.get('doc')
    if (doc) {
      setSelectedDoc(doc)
    }
  }, [searchParams])

  const filteredDocs = DOCS_STRUCTURE.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-24">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Documentation</h2>
                
                {/* Search */}
                <div className="mb-6">
                  <input
                    type="text"
                    placeholder="Search docs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                {/* Navigation */}
                <nav className="space-y-2">
                  {filteredDocs.map((doc) => (
                    <button
                      key={doc.id}
                      onClick={() => setSelectedDoc(doc.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedDoc === doc.id
                          ? 'bg-blue-100 text-blue-900'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {doc.title}
                    </button>
                  ))}
                </nav>
                
                {/* API Docs Link */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <a
                    href="http://localhost:3001/api-docs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    API Documentation
                  </a>
                </div>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <DocViewer docId={selectedDoc} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default function DocsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DocsContent />
    </Suspense>
  )
}
