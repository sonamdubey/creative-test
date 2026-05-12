import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import type { User } from '../../types/user'

export const selectUsersState = (state: RootState) => state.users
export const selectAllUsers = createSelector(
  [selectUsersState],
  (usersState): User[] => usersState.users,
)
export const selectUsersLoading = (state: RootState) =>
  selectUsersState(state).isLoading
export const selectUsersSubmitting = (state: RootState) =>
  selectUsersState(state).isSubmitting
export const selectUsersSubmitError = (state: RootState) =>
  selectUsersState(state).submitError
export const selectSearchTerm = (state: RootState) =>
  selectUsersState(state).searchTerm
export const selectRoleFilter = (state: RootState) =>
  selectUsersState(state).roleFilter

export const selectRoleOptions = createSelector([selectAllUsers], (users): string[] => {
  const roles = new Set(users.map((user) => user.role))
  return ['All', ...Array.from(roles)]
})

export const selectFilteredUsers = createSelector(
  [selectAllUsers, selectSearchTerm, selectRoleFilter],
  (users, searchTerm, selectedRole): User[] => {
    const query = searchTerm.trim().toLowerCase()

    return users.filter((user) => {
      const roleMatch = selectedRole === 'All' || user.role === selectedRole
      const globalMatch =
        query.length === 0 ||
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)

      return roleMatch && globalMatch
    })
  },
)
