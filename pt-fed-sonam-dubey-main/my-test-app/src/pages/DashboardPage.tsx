import { useCallback, useEffect, useMemo, useState } from 'react'
import { UserFilters } from '../components/dashboard/UserFilters'
import { UserForm } from '../components/dashboard/UserForm'
import { UserFormModal } from '../components/dashboard/UserFormModal'
import { UserTable } from '../components/dashboard/UserTable'
import { useAppDispatch, useAppSelector } from '../hooks/redux'
import {
  selectAllUsers,
  selectFilteredUsers,
  selectRoleFilter,
  selectRoleOptions,
  selectSearchTerm,
  selectUsersSubmitError,
  selectUsersSubmitting,
  selectUsersLoading,
} from '../services/selectors/usersSelectors'
import {
  deleteUser,
  saveUser,
  setRoleFilter,
  setSearchTerm,
  setUsers,
} from '../services/slices/usersSlice'
import { MOCK_USERS } from '../constants/users'
import '../styles/dashboard.css'
import type { User } from '../types/user'
import type { UserFormMode, UserFormValues } from '../types/userForm'
import { loadUsersFromStorage, saveUsersToStorage } from '../utils/userStorage'

export function DashboardPage() {
  const dispatch = useAppDispatch()
  const allUsers = useAppSelector(selectAllUsers)
  const users = useAppSelector(selectFilteredUsers)
  const roleOptions = useAppSelector(selectRoleOptions)
  const roleFilter = useAppSelector(selectRoleFilter)
  const searchTerm = useAppSelector(selectSearchTerm)
  const isLoading = useAppSelector(selectUsersLoading)
  const isSubmitting = useAppSelector(selectUsersSubmitting)
  const submitError = useAppSelector(selectUsersSubmitError)
  const [searchInput, setSearchInput] = useState<string>(searchTerm)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [formMode, setFormMode] = useState<UserFormMode>('add')
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

  useEffect(() => {
    const timeout = setTimeout(() => {
      const persistedUsers = loadUsersFromStorage()
      dispatch(setUsers(persistedUsers ?? MOCK_USERS))
    }, 650)

    return () => {
      clearTimeout(timeout)
    }
  }, [dispatch])

  useEffect(() => {
    if (!isLoading) {
      saveUsersToStorage(allUsers)
    }
  }, [allUsers, isLoading])

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      dispatch(setSearchTerm(searchInput))
    }, 300)

    return () => {
      clearTimeout(debounceTimeout)
    }
  }, [dispatch, searchInput])

  const selectedUser: User | undefined = useMemo(
    () =>
      formMode === 'edit'
        ? allUsers.find((user) => user.id === selectedUserId)
        : undefined,
    [allUsers, formMode, selectedUserId],
  )

  const openAddUserModal = useCallback((): void => {
    setFormMode('add')
    setSelectedUserId(null)
    setIsModalOpen(true)
  }, [])

  const closeModal = useCallback((): void => {
    if (isSubmitting) {
      return
    }
    setIsModalOpen(false)
  }, [isSubmitting])

  const openEditUserModal = useCallback((userId: string): void => {
    setFormMode('edit')
    setSelectedUserId(userId)
    setIsModalOpen(true)
  }, [])

  const onSubmitForm = useCallback(async (values: UserFormValues): Promise<void> => {
    const action = await dispatch(
      saveUser({
        mode: formMode,
        values,
        userId: formMode === 'edit' ? selectedUserId ?? undefined : undefined,
      }),
    )

    if (saveUser.fulfilled.match(action)) {
      setIsModalOpen(false)
    }
  }, [dispatch, formMode, selectedUserId])

  const onDeleteUser = useCallback(async (userId: string): Promise<void> => {
    const matchedUser = allUsers.find((user) => user.id === userId)
    const userName = matchedUser?.name ?? 'this user'
    const shouldDelete = window.confirm(`Delete ${userName}?`)
    if (!shouldDelete) {
      return
    }

    await dispatch(deleteUser({ userId }))
  }, [allUsers, dispatch])

  const onRoleChange = useCallback(
    (value: string) => {
      dispatch(setRoleFilter(value))
    },
    [dispatch],
  )

  const clearFilters = useCallback(() => {
    setSearchInput('')
    dispatch(setRoleFilter('All'))
  }, [dispatch])

  const activeUsersCount = useMemo(
    () => allUsers.filter((user) => user.status === 'Active').length,
    [allUsers],
  )
  const inactiveUsersCount = useMemo(
    () => allUsers.filter((user) => user.status === 'Inactive').length,
    [allUsers],
  )
  const pendingUsersCount = useMemo(
    () => allUsers.filter((user) => user.status === 'Pending').length,
    [allUsers],
  )

  return (
    <main className="dashboard-page">
      <header className="dashboard-topbar">
        <div className="brand">
          <span className="brand-dot" aria-hidden></span>
          <h3>Enterprise Admin</h3>
        </div>
      </header>
      <section className="dashboard-shell">
        <header className="dashboard-header">
          <div>
            <h2>User Dashboard</h2>
          </div>
          <button type="button" className="button-primary" onClick={openAddUserModal}>
            Add User
          </button>
        </header>

        <section className="dashboard-kpis" aria-label="Dashboard metrics">
          <article className="kpi-card">
            <p>Total Users</p>
            <strong>{allUsers.length}</strong>
          </article>
          <article className="kpi-card kpi-card--active">
            <p>Active Users</p>
            <strong>{activeUsersCount}</strong>
          </article>
          <article className="kpi-card kpi-card--inactive">
            <p>Inactive Users</p>
            <strong>{inactiveUsersCount}</strong>
          </article>
          <article className="kpi-card kpi-card--pending">
            <p>Pending Users</p>
            <strong>{pendingUsersCount}</strong>
          </article>
        </section>

        <section className="dashboard-content">
          <UserFilters
            searchTerm={searchInput}
            roleFilter={roleFilter}
            roleOptions={roleOptions}
            onSearchChange={setSearchInput}
            onRoleChange={onRoleChange}
          />

          {isLoading ? (
            <section className="state-block" role="status" aria-live="polite">
              <p className="state-title">Loading users...</p>
              <p className="state-subtitle">
                Preparing your admin workspace and latest account records.
              </p>
            </section>
          ) : users.length === 0 ? (
            <section className="state-block state-empty">
              <p className="state-title">No matching users</p>
              <p className="state-subtitle">
                Refine your filters, clear search, or add a new user to get started.
              </p>
              <button
                type="button"
                className="button-secondary"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            </section>
          ) : (
            <UserTable
              users={users}
              onEditUser={openEditUserModal}
              onDeleteUser={onDeleteUser}
            />
          )}
        </section>
      </section>

      <UserFormModal
        isOpen={isModalOpen}
        title={formMode === 'add' ? 'Add User' : 'Edit User'}
        onClose={closeModal}
      >
        <UserForm
          mode={formMode}
          user={selectedUser}
          isSubmitting={isSubmitting}
          submitError={submitError}
          onSubmit={onSubmitForm}
          onCancel={closeModal}
        />
      </UserFormModal>
    </main>
  )
}
