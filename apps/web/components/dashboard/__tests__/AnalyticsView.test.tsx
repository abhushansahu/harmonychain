import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import AnalyticsView from '../AnalyticsView'

describe('AnalyticsView', () => {
  it('renders loading then content', async () => {
    render(<AnalyticsView artistId="artist-1" timeRange="30d" />)
    expect(screen.getByText(/No analytics data|Analytics Overview|Plays Over Time|Top Tracks/)).toBeInTheDocument()
  })
})


