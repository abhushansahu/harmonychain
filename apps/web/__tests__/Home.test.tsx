import { render, screen } from '@testing-library/react'
import Home from '../app/page'

// Mock the components
jest.mock('../components/layout/Navigation', () => {
  return function MockNavigation() {
    return <div data-testid="navigation">Navigation</div>
  }
})

jest.mock('../components/layout/Footer', () => {
  return function MockFooter() {
    return <div data-testid="footer">Footer</div>
  }
})

jest.mock('../components/layout/HeroSection', () => {
  return function MockHeroSection({ title }: { title: string }) {
    return <div data-testid="hero-section">{title}</div>
  }
})

jest.mock('../components/ui/StatsSection', () => {
  return function MockStatsSection() {
    return <div data-testid="stats-section">Stats</div>
  }
})

jest.mock('../components/ui/FeatureCard', () => {
  return function MockFeatureCard({ title }: { title: string }) {
    return <div data-testid="feature-card">{title}</div>
  }
})

jest.mock('../components/ui/CTA', () => {
  return function MockCTA() {
    return <div data-testid="cta">CTA</div>
  }
})

describe('Home Page', () => {
  it('renders the home page with all sections', () => {
    render(<Home />)
    
    expect(screen.getByTestId('navigation')).toBeInTheDocument()
    expect(screen.getByTestId('hero-section')).toBeInTheDocument()
    expect(screen.getByTestId('stats-section')).toBeInTheDocument()
    expect(screen.getByTestId('cta')).toBeInTheDocument()
    expect(screen.getByTestId('footer')).toBeInTheDocument()
  })

  it('displays the correct hero title', () => {
    render(<Home />)
    
    expect(screen.getByText('Decentralized Music for Everyone')).toBeInTheDocument()
  })

  it('renders feature cards', () => {
    render(<Home />)
    
    const featureCards = screen.getAllByTestId('feature-card')
    expect(featureCards).toHaveLength(3)
  })
})
