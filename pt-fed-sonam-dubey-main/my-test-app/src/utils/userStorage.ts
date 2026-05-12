import type { User } from '../types/user'

const USERS_STORAGE_KEY = 'dashboard-users-v1'

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'string')

const isValidUser = (value: unknown): value is User => {
  if (!value || typeof value !== 'object') {
    return false
  }

  const candidate = value as Partial<User>
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.name === 'string' &&
    typeof candidate.email === 'string' &&
    typeof candidate.role === 'string' &&
    typeof candidate.status === 'string' &&
    typeof candidate.lastLogin === 'string' &&
    typeof candidate.activityLevel === 'string' &&
    typeof candidate.createdAt === 'string' &&
    isStringArray(candidate.groups) &&
    isStringArray(candidate.permissions) &&
    !!candidate.details &&
    isStringArray(candidate.details.recentActivityLogs) &&
    isStringArray(candidate.details.updatesMade) &&
    isStringArray(candidate.details.loginAttempts) &&
    !!candidate.security &&
    typeof candidate.security.twoFactorEnabled === 'boolean' &&
    typeof candidate.security.passwordAgeDays === 'number' &&
    typeof candidate.security.lastPasswordUpdate === 'string' &&
    isStringArray(candidate.security.securitySettings)
  )
}

export const loadUsersFromStorage = (): User[] | null => {
  try {
    const serialized = localStorage.getItem(USERS_STORAGE_KEY)
    if (!serialized) {
      return null
    }

    const parsed: unknown = JSON.parse(serialized)
    if (!Array.isArray(parsed)) {
      return null
    }

    const users = parsed.filter(isValidUser)
    return users.length === parsed.length ? users : null
  } catch {
    return null
  }
}

export const saveUsersToStorage = (users: User[]): void => {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
  } catch {
    // Ignore write errors (private mode/quota), app still works in-memory.
  }
}
