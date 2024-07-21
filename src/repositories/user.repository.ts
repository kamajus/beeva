import { BaseRepository } from './base.repository'

import { IUser } from '@/assets/@types'
import { supabase } from '@/config/supabase'

export class UserRepository extends BaseRepository<IUser> {
  constructor() {
    super('users')
  }

  async create(
    record: Omit<IUser, 'created_at' | 'updated_at'>,
  ): Promise<IUser> {
    const { data, error } = await supabase
      .from(this.tableName)
      .insert([record])
      .select('*')
      .single<IUser>()

    if (error) throw error
    return data
  }
}
