import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { MOCK_USERS } from '../../constants/users'
import { UserTable } from './UserTable'

describe('UserTable', () => {
  it('toggles expand and collapse for a user row', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <UserTable
        users={MOCK_USERS.slice(0, 1)}
        onEditUser={vi.fn()}
        onDeleteUser={vi.fn()}
      />,
    )

    const toggle = screen.getByRole('button', { name: /aarav sharma/i })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(container.querySelector('.accordion-panel.expanded')).toBeNull()

    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    expect(container.querySelector('.accordion-panel.expanded')).toBeInTheDocument()

    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(container.querySelector('.accordion-panel.expanded')).toBeNull()
  })
})
