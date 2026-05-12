import { memo, useCallback, useState } from 'react'
import type { User } from '../../types/user'
import { UserTableRow } from './UserTableRow'

interface UserTableProps {
  users: User[]
  onEditUser: (userId: string) => void
  onDeleteUser: (userId: string) => void
}

function UserTableComponent({ users, onEditUser, onDeleteUser }: UserTableProps) {
  const [expandedUserIds, setExpandedUserIds] = useState<Set<string>>(new Set())

  const toggleRowExpansion = useCallback((userId: string): void => {
    setExpandedUserIds((previous) => {
      const next = new Set(previous)
      if (next.has(userId)) {
        next.delete(userId)
      } else {
        next.add(userId)
      }
      return next
    })
  }, [])

  return (
    <div className="table-wrapper">
      <table className="dashboard-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Last Login</th>
            <th>Activity Level</th>
            <th>Groups/Permissions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <UserTableRow
              key={user.id}
              user={user}
              isExpanded={expandedUserIds.has(user.id)}
              onToggleUser={toggleRowExpansion}
              onEditUser={onEditUser}
              onDeleteUser={onDeleteUser}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export const UserTable = memo(UserTableComponent)
