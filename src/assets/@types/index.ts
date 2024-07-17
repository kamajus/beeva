import { Database } from '@/assets/@types/supabase'

export type IResidenceEnum = 'apartment' | 'land' | 'others' | 'villa' | 'all'
export type IResidence = Database['public']['Tables']['residences']['Row']
export type IFavorite = Database['public']['Tables']['favorites']['Row']
export type IUser = Database['public']['Tables']['users']['Row']
export type INotification = Database['public']['Tables']['notifications']['Row']

export interface ICachedResidence {
  residence: IResidence
  user?: IUser
}
