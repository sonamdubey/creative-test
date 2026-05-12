import type { UserStatus } from '../../types/user'

interface UserStatusBadgeProps {
  status: UserStatus
}

const STATUS_CLASS_MAP: Record<UserStatus, string> = {
  Active: 'status-badge status-active',
  Inactive: 'status-badge status-inactive',
  Pending: 'status-badge status-pending',
}

export function UserStatusBadge({ status }: UserStatusBadgeProps) {
  return <span className={STATUS_CLASS_MAP[status]}>{status}</span>
}
