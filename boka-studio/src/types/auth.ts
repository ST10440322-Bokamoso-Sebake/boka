export type UserRole = 'customer' | 'admin'

export type UserProfile = {
  id: string
  email: string
  name: string
  role: UserRole
  verified: boolean
  createdAt: string
  phone?: string
}
