export interface Record {
  id?: number | string
  [key: string]: unknown
}

export abstract class IRepository<T extends Record> {
  protected abstract tableName: string
  protected abstract cached?: T[]

  abstract findAll(): Promise<T[]>
  abstract find(matchs: Record): Promise<T[]>
  abstract findById(id: number | string): Promise<T | null>
  abstract create(
    record: Omit<
      T,
      'id' | 'created_at' | 'updated_at' | 'user_id' | 'owner_id'
    >,
  ): Promise<T>

  abstract update(id: number | string, updates: Partial<T>): Promise<T[]>
  abstract delete(matchs: Record): Promise<void>
  abstract deleteById(id: number | string): Promise<void>
}
