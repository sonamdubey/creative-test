import type { UserStatus } from './user'

export type UserFormMode = 'add' | 'edit'

export interface UserFormValues {
  name: string
  email: string
  role: string
  status: UserStatus
  groups: string
  permissions: string
}
