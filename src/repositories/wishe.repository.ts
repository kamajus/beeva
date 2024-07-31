import { BaseRepository } from './base.repository'

import { IWishe } from '@/@types'
import { supabase } from '@/config/supabase'

export class WisheRepository extends BaseRepository<IWishe> {
  constructor() {
    super('wishes')
  }

  async findByUserId(userId: number | string): Promise<IWishe[] | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .order('created_at', { ascending: false })
      .eq('user_id', userId)
      .returns<IWishe[]>()

    if (error) throw error
    return data ?? null
  }
}
