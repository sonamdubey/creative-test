import { memo } from 'react'

interface UserFiltersProps {
  searchTerm: string
  roleFilter: string
  roleOptions: string[]
  onSearchChange: (value: string) => void
  onRoleChange: (value: string) => void
}

function UserFiltersComponent({
  searchTerm,
  roleFilter,
  roleOptions,
  onSearchChange,
  onRoleChange,
}: UserFiltersProps) {
  return (
    <section className="filters" aria-label="User filters">
      <label className="field">
        <span>Search</span>
        <input
          type="search"
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </label>

      <label className="field">
        <span>Role</span>
        <select
          value={roleFilter}
          onChange={(event) => onRoleChange(event.target.value)}
        >
          {roleOptions.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </label>
    </section>
  )
}

export const UserFilters = memo(UserFiltersComponent)
