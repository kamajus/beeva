import { EventArg } from '@react-navigation/native'

import { Database } from '@/assets/@types/supabase'

export type IResidenceEnum = 'apartment' | 'land' | 'others' | 'villa' | 'all'
export type IResidence = Database['public']['Tables']['residences']['Row']
export type ISavedResidences =
  Database['public']['Tables']['saved_residences']['Row']
export type IUser = Database['public']['Tables']['users']['Row']
export type INotification = Database['public']['Tables']['notifications']['Row']
export type IResidenceNotification =
  Database['public']['Tables']['residence_notifications']['Row']

export interface ICachedResidence {
  residence: IResidence
  user?: IUser
}

export type beforeRemoveEventType = EventArg<
  'beforeRemove',
  true,
  {
    action: Readonly<{
      type: string
      payload?: object | undefined
      source?: string | undefined
      target?: string | undefined
    }>
  }
>
