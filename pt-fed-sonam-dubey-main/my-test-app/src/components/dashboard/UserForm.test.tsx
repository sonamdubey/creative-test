import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { UserForm } from './UserForm'

describe('UserForm', () => {
  it('shows validation messages on invalid submission', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()

    render(
      <UserForm
        mode="add"
        isSubmitting={false}
        submitError={null}
        onSubmit={onSubmit}
        onCancel={vi.fn()}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Add User' }))

    expect(await screen.findByText('Name must be at least 2 characters')).toBeInTheDocument()
    expect(screen.getByText('Please enter a valid email')).toBeInTheDocument()
    expect(screen.getByText('Role is required')).toBeInTheDocument()
    expect(screen.getByText('Please add at least one group')).toBeInTheDocument()
    expect(screen.getByText('Please add at least one permission')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('submits valid form values', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()

    render(
      <UserForm
        mode="add"
        isSubmitting={false}
        submitError={null}
        onSubmit={onSubmit}
        onCancel={vi.fn()}
      />,
    )

    await user.type(screen.getByLabelText('Name'), 'John Doe')
    await user.type(screen.getByLabelText('Email'), 'john@company.com')
    await user.type(screen.getByLabelText('Role'), 'Admin')
    await user.selectOptions(screen.getByLabelText('Status'), 'Active')
    await user.type(screen.getByLabelText('Assigned groups'), 'Platform, Security')
    await user.type(screen.getByLabelText('Permissions'), 'users:read, users:write')
    await user.click(screen.getByRole('button', { name: 'Add User' }))

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1))
    expect(onSubmit.mock.calls[0]?.[0]).toEqual({
      name: 'John Doe',
      email: 'john@company.com',
      role: 'Admin',
      status: 'Active',
      groups: 'Platform, Security',
      permissions: 'users:read, users:write',
    })
  })

  it('shows submit error and loading state', () => {
    render(
      <UserForm
        mode="edit"
        isSubmitting={true}
        submitError="Unable to save user."
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    )

    expect(screen.getByRole('button', { name: 'Saving...' })).toBeDisabled()
    expect(screen.getByText('Unable to save user.')).toBeInTheDocument()
  })
})
