import { BaseRepository } from './base.repository'

import { ISavedResidences } from '@/@types'
import { supabase } from '@/config/supabase'

export class SavedResidenceRepository extends BaseRepository<ISavedResidences> {
  constructor() {
    super('saved_residences')
  }

  async findByUserId(
    userId: number | string,
  ): Promise<ISavedResidences[] | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .order('created_at', { ascending: false })
      .eq('user_id', userId)
      .returns<ISavedResidences[]>()

    if (error) throw error
    return data ?? null
  }
}
