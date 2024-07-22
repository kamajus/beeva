import { IRepository, Record } from './repository.abstract'

import { supabase } from '@/config/supabase'

export class BaseRepository<T extends Record> extends IRepository<T> {
  protected tableName: string
  protected cached?: T[]

  constructor(tableName: string) {
    super()
    this.tableName = tableName
  }

  async findAll(): Promise<T[]> {
    const { data, error } = await supabase.from(this.tableName).select('*')

    if (error) throw error
    return data ?? []
  }

  async find(matchs: Record): Promise<T[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .match(matchs)
      .returns<[]>()

    if (error) throw error
    return data ?? []
  }

  async findById(id: number | string): Promise<T | null> {
    if (this.cached && this.cached.find((c) => c.id === id)) {
      return this.cached[id]
    }

    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single<T>()

    if (error) throw error
    return data ?? null
  }

  async create(
    record: Omit<
      T,
      'id' | 'created_at' | 'updated_at' | 'user_id' | 'owner_id'
    >,
  ): Promise<T> {
    const { data, error } = await supabase
      .from(this.tableName)
      .insert([record])
      .select('*')
      .single<T>()

    if (error) throw error
    return data
  }

  async update(id: number | string, updates: Partial<T>): Promise<T[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .update(updates)
      .eq('id', id)
      .select('*')

    if (error) throw error
    return data ?? []
  }

  async delete(matchs: Record): Promise<void> {
    const { error } = await supabase.from(this.tableName).delete().match(matchs)
    if (error) throw error
  }

  async deleteById(id: number | string): Promise<void> {
    const { error } = await supabase.from(this.tableName).delete().eq('id', id)
    if (error) throw error
  }
}
