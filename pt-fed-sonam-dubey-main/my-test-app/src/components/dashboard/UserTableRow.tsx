import { memo, useCallback } from 'react'
import type { User } from '../../types/user'
import {
  formatLastLogin,
  isInactiveUser,
  isRecentlyCreated,
} from '../../utils/userUtils'
import { UserAccordionPanel } from './UserAccordionPanel'
import { UserStatusBadge } from './UserStatusBadge'

interface UserTableRowProps {
  user: User
  isExpanded: boolean
  onToggleUser: (userId: string) => void
  onEditUser: (userId: string) => void
  onDeleteUser: (userId: string) => void
}

function UserTableRowComponent({
  user,
  isExpanded,
  onToggleUser,
  onEditUser,
  onDeleteUser,
}: UserTableRowProps) {
  const isInactive = isInactiveUser(user)
  const isNew = isRecentlyCreated(user.createdAt)
  const detailsPanelId = `user-details-${user.id}`
  const onToggle = useCallback(() => onToggleUser(user.id), [onToggleUser, user.id])
  const onEdit = useCallback(() => onEditUser(user.id), [onEditUser, user.id])
  const onDelete = useCallback(
    () => onDeleteUser(user.id),
    [onDeleteUser, user.id],
  )

  return (
    <>
      <tr
        className={`dashboard-row${isInactive ? ' row-inactive' : ''}${
          isNew ? ' row-new' : ''
        }${isExpanded ? ' row-expanded' : ''}`}
      >
        <td data-label="Name">
          <button
            type="button"
            className="row-expand-toggle"
            onClick={onToggle}
            aria-expanded={isExpanded}
            aria-controls={detailsPanelId}
          >
            <span className={`chevron ${isExpanded ? 'chevron-open' : ''}`} aria-hidden>
              ▶
            </span>
            <span>{user.name}</span>
          </button>
        </td>
        <td data-label="Email">{user.email}</td>
        <td data-label="Role">{user.role}</td>
        <td data-label="Status">
          <UserStatusBadge status={user.status} />
        </td>
        <td data-label="Last Login">{formatLastLogin(user.lastLogin)}</td>
        <td data-label="Activity Level">{user.activityLevel}</td>
        <td data-label="Groups/Permissions">
          <div className="groups">{user.groups.join(', ')}</div>
          <div className="permissions">{user.permissions.join(', ')}</div>
          <div className="row-actions">
            <button type="button" className="edit-user-btn" onClick={onEdit}>
              Edit
            </button>
            <button type="button" className="delete-user-btn" onClick={onDelete}>
              Delete
            </button>
          </div>
        </td>
      </tr>
      <tr className="detail-row">
        <td colSpan={7} className="detail-cell">
          <div id={detailsPanelId}>
            <UserAccordionPanel user={user} isExpanded={isExpanded} />
          </div>
        </td>
      </tr>
    </>
  )
}

export const UserTableRow = memo(UserTableRowComponent)
