import { render, screen } from '@testing-library/react'
import { expect, it, describe, vi } from 'vitest'
import Header from './Header'
import { MantineProvider } from '@mantine/core'
import { useAuthenticator } from '@aws-amplify/ui-react'

// Mock TanStack Router
vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to }: any) => <a href={to}>{children}</a>,
  useNavigate: () => vi.fn(),
}))

const renderHeader = () => {
  return render(
    <MantineProvider>
      <Header />
    </MantineProvider>
  )
}

describe('Header Component', () => {
  it('renders the branding logo', () => {
    renderHeader()
    const logo = screen.getByAltText(/Anthony Larson/i)
    expect(logo).toBeDefined()
    expect(logo.getAttribute('src')).toContain('favicon.png')
  })

  it('renders navigation links', () => {
    renderHeader()
    expect(screen.getByText(/Home/i)).toBeDefined()
    expect(screen.getByText(/Experience/i)).toBeDefined()
    expect(screen.getByText(/Projects/i)).toBeDefined()
  })

  it('shows Login button when unauthenticated', () => {
    renderHeader()
    expect(screen.getByText(/Login/i)).toBeDefined()
  })

  it('shows Sign Out button and Admin link when authenticated', () => {
    vi.mocked(useAuthenticator).mockReturnValue({
      authStatus: 'authenticated',
      signOut: vi.fn(),
    } as any)

    renderHeader()
    expect(screen.getByText(/Sign Out/i)).toBeDefined()
    expect(screen.getByText(/Admin/i)).toBeDefined()
  })
})
