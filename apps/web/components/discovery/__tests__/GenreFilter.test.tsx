import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import GenreFilter from '../GenreFilter'

const defaultProps = {
  selectedGenres: [],
  onGenreChange: jest.fn(),
  availableGenres: ['Electronic', 'Rock', 'Pop', 'Hip-Hop', 'Jazz'],
  maxSelections: 3,
  showCounts: true
}

describe('GenreFilter', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders without crashing', () => {
    render(<GenreFilter {...defaultProps} />)
    expect(screen.getByTestId('genre-filter')).toBeInTheDocument()
  })

  it('displays available genres', () => {
    render(<GenreFilter {...defaultProps} />)
    
    expect(screen.getByText('Genres')).toBeInTheDocument()
    expect(screen.getByText('No genres selected')).toBeInTheDocument()
  })

  it('shows selected genres count', () => {
    render(<GenreFilter {...defaultProps} selectedGenres={['Electronic', 'Rock']} />)
    
    expect(screen.getByText('2/3')).toBeInTheDocument()
  })

  it('expands and collapses genre list', () => {
    render(<GenreFilter {...defaultProps} />)
    
    const expandButton = screen.getByTestId('toggle-expand')
    fireEvent.click(expandButton)
    
    expect(screen.getByTestId('genre-search')).toBeInTheDocument()
    expect(screen.getByText('Electronic')).toBeInTheDocument()
    expect(screen.getByText('Rock')).toBeInTheDocument()
  })

  it('handles genre selection', () => {
    render(<GenreFilter {...defaultProps} />)
    
    const expandButton = screen.getByTestId('toggle-expand')
    fireEvent.click(expandButton)
    
    const electronicButton = screen.getByTestId('genre-electronic')
    fireEvent.click(electronicButton)
    
    expect(defaultProps.onGenreChange).toHaveBeenCalledWith(['Electronic'])
  })

  it('handles genre deselection', () => {
    render(<GenreFilter {...defaultProps} selectedGenres={['Electronic', 'Rock']} />)
    
    const expandButton = screen.getByTestId('toggle-expand')
    fireEvent.click(expandButton)
    
    const electronicButton = screen.getByTestId('genre-electronic')
    fireEvent.click(electronicButton)
    
    expect(defaultProps.onGenreChange).toHaveBeenCalledWith(['Rock'])
  })

  it('respects max selections limit', () => {
    render(<GenreFilter {...defaultProps} selectedGenres={['Electronic', 'Rock', 'Pop']} />)
    
    const expandButton = screen.getByTestId('toggle-expand')
    fireEvent.click(expandButton)
    
    const hipHopButton = screen.getByTestId('genre-hip-hop')
    expect(hipHopButton).toBeDisabled()
  })

  it('shows max selection warning', () => {
    render(<GenreFilter {...defaultProps} selectedGenres={['Electronic', 'Rock', 'Pop']} />)
    
    const expandButton = screen.getByTestId('toggle-expand')
    fireEvent.click(expandButton)
    
    expect(screen.getByText('Maximum 3 genres selected')).toBeInTheDocument()
  })

  it('clears all selected genres', () => {
    render(<GenreFilter {...defaultProps} selectedGenres={['Electronic', 'Rock']} />)
    
    const clearButton = screen.getByTestId('clear-all-genres')
    fireEvent.click(clearButton)
    
    expect(defaultProps.onGenreChange).toHaveBeenCalledWith([])
  })

  it('filters genres by search query', () => {
    render(<GenreFilter {...defaultProps} />)
    
    const expandButton = screen.getByTestId('toggle-expand')
    fireEvent.click(expandButton)
    
    const searchInput = screen.getByTestId('genre-search')
    fireEvent.change(searchInput, { target: { value: 'Elec' } })
    
    expect(screen.getByText('Electronic')).toBeInTheDocument()
    expect(screen.queryByText('Rock')).not.toBeInTheDocument()
  })

  it('shows genre counts when enabled', () => {
    render(<GenreFilter {...defaultProps} />)
    
    const expandButton = screen.getByTestId('toggle-expand')
    fireEvent.click(expandButton)
    
    expect(screen.getByText(/tracks/)).toBeInTheDocument()
  })

  it('hides genre counts when disabled', () => {
    render(<GenreFilter {...defaultProps} showCounts={false} />)
    
    const expandButton = screen.getByTestId('toggle-expand')
    fireEvent.click(expandButton)
    
    expect(screen.queryByText(/tracks/)).not.toBeInTheDocument()
  })

  it('shows selected genres in collapsed view', () => {
    render(<GenreFilter {...defaultProps} selectedGenres={['Electronic', 'Rock', 'Pop', 'Jazz']} />)
    
    expect(screen.getByText('Electronic')).toBeInTheDocument()
    expect(screen.getByText('Rock')).toBeInTheDocument()
    expect(screen.getByText('Pop')).toBeInTheDocument()
    expect(screen.getByText('+1 more')).toBeInTheDocument()
  })

  it('handles empty search query', () => {
    render(<GenreFilter {...defaultProps} />)
    
    const expandButton = screen.getByTestId('toggle-expand')
    fireEvent.click(expandButton)
    
    const searchInput = screen.getByTestId('genre-search')
    fireEvent.change(searchInput, { target: { value: '' } })
    
    expect(screen.getByText('Electronic')).toBeInTheDocument()
    expect(screen.getByText('Rock')).toBeInTheDocument()
  })

  it('handles search query with no results', () => {
    render(<GenreFilter {...defaultProps} />)
    
    const expandButton = screen.getByTestId('toggle-expand')
    fireEvent.click(expandButton)
    
    const searchInput = screen.getByTestId('genre-search')
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } })
    
    expect(screen.queryByText('Electronic')).not.toBeInTheDocument()
    expect(screen.queryByText('Rock')).not.toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(
      <GenreFilter {...defaultProps} className="custom-class" />
    )
    
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('applies custom testId', () => {
    render(<GenreFilter {...defaultProps} testId="custom-test-id" />)
    
    expect(screen.getByTestId('custom-test-id')).toBeInTheDocument()
  })

  it('handles rapid genre selections', () => {
    render(<GenreFilter {...defaultProps} />)
    
    const expandButton = screen.getByTestId('toggle-expand')
    fireEvent.click(expandButton)
    
    const electronicButton = screen.getByTestId('genre-electronic')
    const rockButton = screen.getByTestId('genre-rock')
    
    fireEvent.click(electronicButton)
    fireEvent.click(rockButton)
    
    expect(defaultProps.onGenreChange).toHaveBeenCalledTimes(2)
  })

  it('handles rapid search queries', () => {
    render(<GenreFilter {...defaultProps} />)
    
    const expandButton = screen.getByTestId('toggle-expand')
    fireEvent.click(expandButton)
    
    const searchInput = screen.getByTestId('genre-search')
    
    fireEvent.change(searchInput, { target: { value: 'E' } })
    fireEvent.change(searchInput, { target: { value: 'El' } })
    fireEvent.change(searchInput, { target: { value: 'Ele' } })
    fireEvent.change(searchInput, { target: { value: 'Elec' } })
    
    expect(screen.getByText('Electronic')).toBeInTheDocument()
  })

  it('handles edge case props', () => {
    render(
      <GenreFilter 
        {...defaultProps}
        availableGenres={[]}
        maxSelections={0}
        showCounts={false}
        className=""
        testId=""
      />
    )
    
    expect(screen.getByTestId('genre-filter')).toBeInTheDocument()
  })

  it('handles missing onGenreChange gracefully', () => {
    render(
      <GenreFilter 
        {...defaultProps}
        onGenreChange={undefined as any}
      />
    )
    
    const expandButton = screen.getByTestId('toggle-expand')
    fireEvent.click(expandButton)
    
    const electronicButton = screen.getByTestId('genre-electronic')
    fireEvent.click(electronicButton)
    
    expect(screen.getByTestId('genre-filter')).toBeInTheDocument()
  })

  it('handles very long genre names', () => {
    const longGenres = ['Very Long Genre Name That Might Cause Layout Issues']
    
    render(<GenreFilter {...defaultProps} availableGenres={longGenres} />)
    
    const expandButton = screen.getByTestId('toggle-expand')
    fireEvent.click(expandButton)
    
    expect(screen.getByText('Very Long Genre Name That Might Cause Layout Issues')).toBeInTheDocument()
  })

  it('handles special characters in genre names', () => {
    const specialGenres = ['Rock & Roll', 'R&B', 'Hip-Hop/Rap']
    
    render(<GenreFilter {...defaultProps} availableGenres={specialGenres} />)
    
    const expandButton = screen.getByTestId('toggle-expand')
    fireEvent.click(expandButton)
    
    expect(screen.getByText('Rock & Roll')).toBeInTheDocument()
    expect(screen.getByText('R&B')).toBeInTheDocument()
    expect(screen.getByText('Hip-Hop/Rap')).toBeInTheDocument()
  })

  it('handles unicode characters in genre names', () => {
    const unicodeGenres = ['你好世界', '🌍 Music', '🎵 Electronic']
    
    render(<GenreFilter {...defaultProps} availableGenres={unicodeGenres} />)
    
    const expandButton = screen.getByTestId('toggle-expand')
    fireEvent.click(expandButton)
    
    expect(screen.getByText('你好世界')).toBeInTheDocument()
    expect(screen.getByText('🌍 Music')).toBeInTheDocument()
    expect(screen.getByText('🎵 Electronic')).toBeInTheDocument()
  })

  it('handles very large number of genres', () => {
    const manyGenres = Array.from({ length: 100 }, (_, i) => `Genre ${i + 1}`)
    
    render(<GenreFilter {...defaultProps} availableGenres={manyGenres} />)
    
    const expandButton = screen.getByTestId('toggle-expand')
    fireEvent.click(expandButton)
    
    expect(screen.getByText('Genre 1')).toBeInTheDocument()
    expect(screen.getByText('Genre 100')).toBeInTheDocument()
  })

  it('handles zero max selections', () => {
    render(<GenreFilter {...defaultProps} maxSelections={0} />)
    
    const expandButton = screen.getByTestId('toggle-expand')
    fireEvent.click(expandButton)
    
    const electronicButton = screen.getByTestId('genre-electronic')
    expect(electronicButton).toBeDisabled()
  })

  it('handles negative max selections', () => {
    render(<GenreFilter {...defaultProps} maxSelections={-1} />)
    
    const expandButton = screen.getByTestId('toggle-expand')
    fireEvent.click(expandButton)
    
    const electronicButton = screen.getByTestId('genre-electronic')
    expect(electronicButton).toBeDisabled()
  })

  it('handles undefined availableGenres', () => {
    render(<GenreFilter {...defaultProps} availableGenres={undefined as any} />)
    
    expect(screen.getByTestId('genre-filter')).toBeInTheDocument()
  })

  it('handles null availableGenres', () => {
    render(<GenreFilter {...defaultProps} availableGenres={null as any} />)
    
    expect(screen.getByTestId('genre-filter')).toBeInTheDocument()
  })

  it('handles empty availableGenres array', () => {
    render(<GenreFilter {...defaultProps} availableGenres={[]} />)
    
    const expandButton = screen.getByTestId('toggle-expand')
    fireEvent.click(expandButton)
    
    expect(screen.getByText('No genres selected')).toBeInTheDocument()
  })
})
