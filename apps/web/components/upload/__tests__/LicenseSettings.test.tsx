import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import LicenseSettings from '../LicenseSettings'

describe('LicenseSettings', () => {
  const onLicenseChange = jest.fn()

  beforeEach(() => jest.clearAllMocks())

  it('renders license type cards', () => {
    render(<LicenseSettings onLicenseChange={onLicenseChange} />)
    expect(screen.getByText('License Type')).toBeInTheDocument()
    expect(screen.getByText('Free License')).toBeInTheDocument()
    expect(screen.getByText('Commercial License')).toBeInTheDocument()
  })

  it('changes to commercial shows pricing', () => {
    render(<LicenseSettings onLicenseChange={onLicenseChange} />)
    fireEvent.click(screen.getByText('Commercial License'))
    expect(screen.getByText('Pricing')).toBeInTheDocument()
  })
})


