import type { User } from '../types/user'

const DAY_IN_MS = 24 * 60 * 60 * 1000

export const formatLastLogin = (isoDate: string): string => {
  return new Date(isoDate).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export const isRecentlyCreated = (createdAt: string): boolean => {
  return Date.now() - new Date(createdAt).getTime() <= 7 * DAY_IN_MS
}

export const isInactiveUser = (user: User): boolean => {
  if (user.status === 'Inactive') {
    return true
  }

  return Date.now() - new Date(user.lastLogin).getTime() > 30 * DAY_IN_MS
}
