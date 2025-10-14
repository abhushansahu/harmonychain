import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import MetadataForm from '../MetadataForm'

describe('MetadataForm', () => {
  const onSubmit = jest.fn()
  const onCancel = jest.fn()

  beforeEach(() => jest.clearAllMocks())

  it('renders form sections', () => {
    render(<MetadataForm onSubmit={onSubmit} onCancel={onCancel} />)
    expect(screen.getByText('Basic Information')).toBeInTheDocument()
    expect(screen.getByText('Tags')).toBeInTheDocument()
    expect(screen.getByText('Technical Details')).toBeInTheDocument()
  })

  it('validates required fields', () => {
    render(<MetadataForm onSubmit={onSubmit} onCancel={onCancel} />)
    fireEvent.click(screen.getByText('Save Metadata'))
    expect(screen.getByText('Title is required')).toBeInTheDocument()
    expect(screen.getByText('Artist is required')).toBeInTheDocument()
    expect(screen.getByText('Genre is required')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('submits valid data', () => {
    render(<MetadataForm onSubmit={onSubmit} onCancel={onCancel} />)
    fireEvent.change(screen.getByPlaceholderText('Enter track title'), { target: { value: 'Song' } })
    fireEvent.change(screen.getByPlaceholderText('Enter artist name'), { target: { value: 'Artist' } })
    fireEvent.change(screen.getByDisplayValue(''), { target: { value: 'Electronic' } })
    fireEvent.click(screen.getByText('Save Metadata'))
    expect(onSubmit).toHaveBeenCalled()
  })
})


