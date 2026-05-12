import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './slices/counterSlice'
import usersReducer from './slices/usersSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    users: usersReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
