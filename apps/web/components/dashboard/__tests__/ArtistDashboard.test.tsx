import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import ArtistDashboard from '../ArtistDashboard'

describe('ArtistDashboard', () => {
  it('renders and switches tabs', () => {
    render(<ArtistDashboard artistId="artist-1" /> as any)
    expect(screen.getByText('Artist Dashboard')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Analytics'))
    expect(screen.getByText('Analytics Overview')).toBeInTheDocument()
  })
})


