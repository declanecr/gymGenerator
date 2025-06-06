import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Dashboard from './Dashboard'
import { AuthContext } from '../context/AuthContext'

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthContext.Provider value={{ token: 'abc', login: () => {}, logout: () => {}, isAuthenticated: true }}>
    <MemoryRouter>{children}</MemoryRouter>
  </AuthContext.Provider>
)

test('renders dashboard heading', () => {
  render(<Dashboard />, { wrapper })
  expect(screen.getByText(/Welcome to the Dashboard/)).toBeInTheDocument()
})