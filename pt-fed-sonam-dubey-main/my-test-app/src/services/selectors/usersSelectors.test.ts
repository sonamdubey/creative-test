import { describe, expect, it } from 'vitest'
import { MOCK_USERS } from '../../constants/users'
import type { RootState } from '../store'
import {
  selectFilteredUsers,
  selectRoleOptions,
} from './usersSelectors'

const createState = (searchTerm = '', roleFilter = 'All'): RootState =>
  ({
    counter: { value: 0 },
    users: {
      users: MOCK_USERS,
      searchTerm,
      roleFilter,
      isLoading: false,
      isSubmitting: false,
      submitError: null,
    },
  }) as RootState

describe('usersSelectors', () => {
  it('filters users by global search term (name/email)', () => {
    const searchByName = selectFilteredUsers(createState('aarav'))
    const searchByEmail = selectFilteredUsers(createState('mia.khan@enterprise.io'))

    expect(searchByName).toHaveLength(1)
    expect(searchByName[0]?.name).toBe('Aarav Sharma')
    expect(searchByEmail).toHaveLength(1)
    expect(searchByEmail[0]?.name).toBe('Mia Khan')
  })

  it('filters users by role', () => {
    const filtered = selectFilteredUsers(createState('', 'Manager'))
    expect(filtered).toHaveLength(1)
    expect(filtered[0]?.role).toBe('Manager')
  })

  it('returns memoized role options with All default', () => {
    const options = selectRoleOptions(createState())
    expect(options).toContain('All')
    expect(options).toContain('Admin')
    expect(options).toContain('Manager')
  })
})
