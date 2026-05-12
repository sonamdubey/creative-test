import {
  createAsyncThunk,
  createSlice,
  nanoid,
  type PayloadAction,
} from '@reduxjs/toolkit'
import type { User } from '../../types/user'
import type { RootState } from '../store'
import type { UserFormMode, UserFormValues } from '../../types/userForm'

export interface UsersState {
  users: User[]
  searchTerm: string
  roleFilter: string
  isLoading: boolean
  isSubmitting: boolean
  submitError: string | null
}

const initialState: UsersState = {
  users: [],
  searchTerm: '',
  roleFilter: 'All',
  isLoading: true,
  isSubmitting: false,
  submitError: null,
}

interface SaveUserPayload {
  mode: UserFormMode
  values: UserFormValues
  userId?: string
}

interface DeleteUserPayload {
  userId: string
}

const normalizeCsvField = (value: string): string[] =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0)

export const saveUser = createAsyncThunk<
  User,
  SaveUserPayload,
  { state: RootState; rejectValue: string }
>('users/saveUser', async (payload, thunkApi) => {
  const state = thunkApi.getState()
  const users = state.users.users
  const { mode, values, userId } = payload

  await new Promise((resolve) => setTimeout(resolve, 700))

  const duplicateUser = users.find(
    (user) =>
      user.email.toLowerCase() === values.email.toLowerCase() && user.id !== userId,
  )

  if (duplicateUser) {
    return thunkApi.rejectWithValue('Email already exists. Please use another one.')
  }

  const groups = normalizeCsvField(values.groups)
  const permissions = normalizeCsvField(values.permissions)

  if (mode === 'edit') {
    const existingUser = users.find((user) => user.id === userId)
    if (!existingUser) {
      return thunkApi.rejectWithValue('User not found for update.')
    }

    return {
      ...existingUser,
      name: values.name.trim(),
      email: values.email.trim().toLowerCase(),
      role: values.role.trim(),
      status: values.status,
      groups,
      permissions,
    }
  }

  const now = new Date().toISOString()
  return {
    id: nanoid(),
    name: values.name.trim(),
    email: values.email.trim().toLowerCase(),
    role: values.role.trim(),
    status: values.status,
    lastLogin: now,
    activityLevel: 'Medium',
    groups,
    permissions,
    createdAt: now,
    details: {
      recentActivityLogs: ['User account created'],
      updatesMade: ['Initial user profile setup'],
      loginAttempts: ['No attempts yet'],
    },
    security: {
      twoFactorEnabled: false,
      passwordAgeDays: 0,
      lastPasswordUpdate: now,
      securitySettings: ['Default security policy'],
    },
  }
})

export const deleteUser = createAsyncThunk<
  string,
  DeleteUserPayload,
  { state: RootState; rejectValue: string }
>('users/deleteUser', async ({ userId }, thunkApi) => {
  const state = thunkApi.getState()
  const existingUser = state.users.users.find((user) => user.id === userId)

  await new Promise((resolve) => setTimeout(resolve, 400))

  if (!existingUser) {
    return thunkApi.rejectWithValue('User not found for deletion.')
  }

  return userId
})

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload
      state.isLoading = false
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload
    },
    setRoleFilter: (state, action: PayloadAction<string>) => {
      state.roleFilter = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveUser.pending, (state) => {
        state.isSubmitting = true
        state.submitError = null
      })
      .addCase(saveUser.fulfilled, (state, action) => {
        const nextUser = action.payload
        const index = state.users.findIndex((user) => user.id === nextUser.id)

        if (index >= 0) {
          state.users[index] = nextUser
        } else {
          state.users.unshift(nextUser)
        }

        state.isSubmitting = false
      })
      .addCase(saveUser.rejected, (state, action) => {
        state.isSubmitting = false
        state.submitError = action.payload ?? 'Unable to save user.'
      })
      .addCase(deleteUser.pending, (state) => {
        state.isSubmitting = true
        state.submitError = null
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user.id !== action.payload)
        state.isSubmitting = false
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isSubmitting = false
        state.submitError = action.payload ?? 'Unable to delete user.'
      })
  },
})

export const { setUsers, setSearchTerm, setRoleFilter } = usersSlice.actions
export default usersSlice.reducer
