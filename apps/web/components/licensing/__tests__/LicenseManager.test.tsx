import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import LicenseManager from '../LicenseManager'

describe('LicenseManager', () => {
  it('renders header and tabs', () => {
    render(<LicenseManager trackId="track-1" />)
    expect(screen.getByText('License Manager')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Requests'))
    expect(screen.getByText(/Approve|Reject/)).toBeInTheDocument()
  })
})


