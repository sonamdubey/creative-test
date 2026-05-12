import { describe, expect, it } from 'vitest'
import { MOCK_USERS } from '../../constants/users'
import type { User } from '../../types/user'
import usersReducer, {
  deleteUser,
  saveUser,
  setRoleFilter,
  setSearchTerm,
  setUsers,
} from './usersSlice'

describe('usersSlice reducer', () => {
  it('sets users and clears loading state', () => {
    const nextState = usersReducer(undefined, setUsers(MOCK_USERS))
    expect(nextState.users).toHaveLength(MOCK_USERS.length)
    expect(nextState.isLoading).toBe(false)
  })

  it('updates search and role filters immutably', () => {
    const loadedState = usersReducer(undefined, setUsers(MOCK_USERS))
    const withSearch = usersReducer(loadedState, setSearchTerm('aarav'))
    const withRole = usersReducer(withSearch, setRoleFilter('Admin'))

    expect(withSearch.searchTerm).toBe('aarav')
    expect(withRole.roleFilter).toBe('Admin')
    expect(loadedState).not.toBe(withSearch)
    expect(withSearch).not.toBe(withRole)
  })

  it('handles saveUser fulfilled for add and edit', () => {
    const loadedState = usersReducer(undefined, setUsers(MOCK_USERS))

    const newUser: User = {
      ...MOCK_USERS[0],
      id: 'usr-new',
      name: 'New User',
      email: 'new.user@enterprise.io',
    }

    const addedState = usersReducer(
      loadedState,
      saveUser.fulfilled(
        newUser,
        'req-add',
        {
          mode: 'add',
          values: {
            name: 'New User',
            email: 'new.user@enterprise.io',
            role: 'Admin',
            status: 'Active',
            groups: 'Platform',
            permissions: 'users:read',
          },
        },
      ),
    )

    expect(addedState.users[0]?.id).toBe('usr-new')

    const editedUser: User = {
      ...newUser,
      role: 'Manager',
    }

    const editedState = usersReducer(
      addedState,
      saveUser.fulfilled(
        editedUser,
        'req-edit',
        {
          mode: 'edit',
          userId: 'usr-new',
          values: {
            name: 'New User',
            email: 'new.user@enterprise.io',
            role: 'Manager',
            status: 'Active',
            groups: 'Platform',
            permissions: 'users:read',
          },
        },
      ),
    )

    const updated = editedState.users.find((user) => user.id === 'usr-new')
    expect(updated?.role).toBe('Manager')
  })

  it('handles deleteUser fulfilled', () => {
    const loadedState = usersReducer(undefined, setUsers(MOCK_USERS))
    const targetId = MOCK_USERS[0].id

    const nextState = usersReducer(
      loadedState,
      deleteUser.fulfilled(targetId, 'req-delete', { userId: targetId }),
    )

    expect(nextState.users.some((user) => user.id === targetId)).toBe(false)
  })
})
