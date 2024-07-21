import { BaseRepository } from './base.repository'

import { ISavedResidences } from '@/assets/@types'
import { supabase } from '@/config/supabase'

export class SavedResidenceRepository extends BaseRepository<ISavedResidences> {
  constructor() {
    super('saved_residences')
  }

  async findByResidenceIdAndUserId(
    residenceId: number | string,
    userId: number | string,
  ): Promise<ISavedResidences | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('user_id', userId)
      .eq('residence_id', residenceId)
      .maybeSingle<ISavedResidences>()

    if (error) throw error
    return data ?? null
  }

  async findByUserId(
    userId: number | string,
  ): Promise<ISavedResidences[] | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('user_id', userId)
      .returns<ISavedResidences[]>()

    if (error) throw error
    return data ?? null
  }

  async deleteByResidenceId(residenceId: number | string): Promise<void> {
    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq('residence_id', residenceId)
    if (error) throw error
  }
}
