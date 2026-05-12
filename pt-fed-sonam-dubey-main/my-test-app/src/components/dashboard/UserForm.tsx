import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { FormField } from '../forms/FormField'
import type { User } from '../../types/user'
import type { UserFormMode, UserFormValues } from '../../types/userForm'

const USER_STATUS_OPTIONS = ['Active', 'Inactive', 'Pending'] as const

const userFormSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  email: z.string().trim().email('Please enter a valid email'),
  role: z.string().trim().min(2, 'Role is required'),
  status: z.enum(USER_STATUS_OPTIONS),
  groups: z.string().trim().min(1, 'Please add at least one group'),
  permissions: z.string().trim().min(1, 'Please add at least one permission'),
})

interface UserFormProps {
  mode: UserFormMode
  user?: User
  isSubmitting: boolean
  submitError: string | null
  onSubmit: (values: UserFormValues) => void
  onCancel: () => void
}

const buildInitialValues = (user?: User): UserFormValues => ({
  name: user?.name ?? '',
  email: user?.email ?? '',
  role: user?.role ?? '',
  status: user?.status ?? 'Active',
  groups: user?.groups.join(', ') ?? '',
  permissions: user?.permissions.join(', ') ?? '',
})

export function UserForm({
  mode,
  user,
  isSubmitting,
  submitError,
  onSubmit,
  onCancel,
}: UserFormProps) {
  const initialValues = buildInitialValues(user)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: initialValues,
  })

  useEffect(() => {
    reset(buildInitialValues(user))
  }, [mode, reset, user])

  return (
    <form className="user-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <FormField htmlFor="name" label="Name" error={errors.name?.message}>
        <input id="name" type="text" autoComplete="name" {...register('name')} />
      </FormField>

      <FormField htmlFor="email" label="Email" error={errors.email?.message}>
        <input
          id="email"
          type="email"
          autoComplete="email"
          {...register('email')}
        />
      </FormField>

      <FormField htmlFor="role" label="Role" error={errors.role?.message}>
        <input id="role" type="text" {...register('role')} />
      </FormField>

      <FormField htmlFor="status" label="Status" error={errors.status?.message}>
        <select id="status" {...register('status')}>
          {USER_STATUS_OPTIONS.map((statusOption) => (
            <option key={statusOption} value={statusOption}>
              {statusOption}
            </option>
          ))}
        </select>
      </FormField>

      <FormField
        htmlFor="groups"
        label="Assigned groups"
        error={errors.groups?.message}
      >
        <textarea
          id="groups"
          rows={2}
          placeholder="Platform, Security"
          {...register('groups')}
        />
      </FormField>

      <FormField
        htmlFor="permissions"
        label="Permissions"
        error={errors.permissions?.message}
      >
        <textarea
          id="permissions"
          rows={2}
          placeholder="users:read, users:write"
          {...register('permissions')}
        />
      </FormField>

      {submitError ? (
        <p className="form-submit-error" role="alert">
          {submitError}
        </p>
      ) : null}

      <div className="form-actions">
        <button
          type="button"
          className="button-secondary"
          onClick={() => reset(buildInitialValues(user))}
          disabled={isSubmitting}
        >
          Reset
        </button>
        <button type="button" className="button-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="button-primary" disabled={isSubmitting}>
          {isSubmitting
            ? 'Saving...'
            : mode === 'add'
              ? 'Add User'
              : 'Save Changes'}
        </button>
      </div>
    </form>
  )
}
