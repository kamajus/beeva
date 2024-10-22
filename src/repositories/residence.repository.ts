import { BaseRepository } from './base.repository'

import { IResidence } from '@/@types'
import { supabase } from '@/config/supabase'

export class ResidenceRepository extends BaseRepository<IResidence> {
  constructor() {
    super('residences')
  }

  async findByOwnerId(userId: number | string): Promise<IResidence[] | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .order('created_at', { ascending: false })
      .eq('owner_id', userId)
      .returns<IResidence[]>()

    if (error) throw error
    return data ?? null
  }

  async findRecent(): Promise<IResidence[] | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .order('created_at', { ascending: true })
      .limit(10)
      .returns<IResidence[]>()

    if (error) throw error
    return data ?? null
  }
}
