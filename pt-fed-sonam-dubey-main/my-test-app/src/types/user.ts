export type UserStatus = 'Active' | 'Inactive' | 'Pending'
export type ActivityLevel = 'High' | 'Medium' | 'Low'

export interface UserSecuritySettings {
  twoFactorEnabled: boolean
  passwordAgeDays: number
  lastPasswordUpdate: string
  securitySettings: string[]
}

export interface UserDetailPanelData {
  recentActivityLogs: string[]
  updatesMade: string[]
  loginAttempts: string[]
}

export interface User {
  id: string
  name: string
  email: string
  role: string
  status: UserStatus
  lastLogin: string
  activityLevel: ActivityLevel
  groups: string[]
  permissions: string[]
  createdAt: string
  details: UserDetailPanelData
  security: UserSecuritySettings
}
