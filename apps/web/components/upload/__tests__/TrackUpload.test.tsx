import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import TrackUpload from '../TrackUpload'

// Mock IPFSUploadService used inside TrackUpload
jest.mock('../IPFSUploadService', () => ({
  IPFSUploadService: class {
    async uploadFile(_file: File, onProgress?: (p: number) => void) {
      onProgress?.(50)
      onProgress?.(100)
      return 'QmMockHash'
    }
  }
}))

describe('TrackUpload', () => {
  const onUploadComplete = jest.fn()
  const onUploadError = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders and shows basic UI', () => {
    render(<TrackUpload onUploadComplete={onUploadComplete} onUploadError={onUploadError} />)
    expect(screen.getByText('Upload your music')).toBeInTheDocument()
    expect(screen.getByText('Choose Files')).toBeInTheDocument()
  })

  it('validates file type and size', async () => {
    render(<TrackUpload onUploadComplete={onUploadComplete} onUploadError={onUploadError} maxFileSize={0.00001} />)

    const input = screen.getByRole('button', { name: 'Choose Files' })
    // trigger hidden input via click
    fireEvent.click(input)

    const file = new File(['small'], 'song.mp3', { type: 'audio/mpeg' })
    const bigFile = new File([new Array(1024).join('a')], 'big.wav', { type: 'audio/wav' })
    Object.defineProperty(global, 'FileReader', {
      value: class {
        onload: any
        readAsDataURL() { this.onload?.() }
        result = 'data:audio/mpeg;base64,AAA'
      }
    })

    const realQuery = document.querySelector.bind(document)
    const fileInput = realQuery('input[type="file"]') as HTMLInputElement
    Object.defineProperty(fileInput, 'files', { value: [bigFile, file] })
    fireEvent.change(fileInput)

    await waitFor(() => {
      expect(onUploadError).toHaveBeenCalled()
    })
  })

  it('uploads file and calls onUploadComplete', async () => {
    render(<TrackUpload onUploadComplete={onUploadComplete} onUploadError={onUploadError} />)

    Object.defineProperty(global, 'FileReader', {
      value: class {
        onload: any
        readAsDataURL() { this.onload?.() }
        result = 'data:audio/mpeg;base64,AAA'
      }
    })

    const file = new File(['sound'], 'song.mp3', { type: 'audio/mpeg' })
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    Object.defineProperty(fileInput, 'files', { value: [file] })
    fireEvent.change(fileInput)

    await waitFor(() => {
      expect(onUploadComplete).toHaveBeenCalled()
    })
  })
})


