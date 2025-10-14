import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import NFTCreator from '../NFTCreator'

const track = {
  id: '1',
  title: 'Song',
  artist: 'Artist',
  artistAddress: '0x0',
  ipfsHash: 'QmHash',
  genre: 'Electronic',
  playCount: 0,
  createdAt: Date.now()
}

describe('NFTCreator', () => {
  it('renders and goes through steps', async () => {
    render(<NFTCreator track={track as any} />)
    expect(screen.getByText('Create NFT')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Next: Metadata'))
    expect(screen.getByText('NFT Metadata')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Next: Preview'))
    expect(screen.getByText('Preview NFT')).toBeInTheDocument()
  })
})


