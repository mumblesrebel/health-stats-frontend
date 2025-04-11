import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import LoadingSpinner from '../LoadingSpinner'

describe('LoadingSpinner', () => {
  it('renders with default props', () => {
    render(<LoadingSpinner />)
    const spinner = screen.getByRole('progressbar')
    expect(spinner).toBeInTheDocument()
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders with custom size', () => {
    render(<LoadingSpinner size="lg" />)
    const spinner = screen.getByRole('progressbar')
    expect(spinner).toBeInTheDocument()
    // MUI CircularProgress with lg size should be 48px
    expect(spinner).toHaveAttribute('style', expect.stringContaining('width: 48px'))
  })

  it('renders with custom color', () => {
    render(<LoadingSpinner color="error" />)
    const spinner = screen.getByRole('progressbar')
    expect(spinner).toBeInTheDocument()
    // MUI CircularProgress with error color
    expect(spinner).toHaveClass('MuiCircularProgress-colorError')
  })

  it('renders with custom className', () => {
    render(<LoadingSpinner className="my-custom-class" />)
    const container = screen.getByRole('progressbar').parentElement?.parentElement
    expect(container).toHaveClass('my-custom-class')
  })

  it('renders with custom message', () => {
    const message = 'Custom loading message'
    render(<LoadingSpinner message={message} />)
    expect(screen.getByText(message)).toBeInTheDocument()
  })
})
