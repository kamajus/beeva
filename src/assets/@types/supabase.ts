export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      notifications: {
        Row: {
          created_at: string
          description: string
          id: string
          title: string
          type: Database['public']['Enums']['notification_type']
          user_id: string | null
          was_readed: boolean
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          title: string
          type: Database['public']['Enums']['notification_type']
          user_id?: string | null
          was_readed?: boolean
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          title?: string
          type?: Database['public']['Enums']['notification_type']
          user_id?: string | null
          was_readed?: boolean
        }
        Relationships: [
          {
            foreignKeyName: 'notifications_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'public_notifications_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      residence_notifications: {
        Row: {
          created_at: string
          id: string
          notification_id: string
          residence_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          notification_id: string
          residence_id: string
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: string
          notification_id?: string
          residence_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'residence_notifications_notification_id_fkey'
            columns: ['notification_id']
            isOneToOne: false
            referencedRelation: 'notifications'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'residence_notifications_residence_id_fkey'
            columns: ['residence_id']
            isOneToOne: false
            referencedRelation: 'residences'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'residence_notifications_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      residences: {
        Row: {
          approval_status: boolean
          cover: string | null
          created_at: string
          description: string
          id: string
          kind: Database['public']['Enums']['residence_kind']
          location: string
          owner_id: string
          photos: string[] | null
          price: number
          state: Database['public']['Enums']['residence_state']
          updated_at: string | null
        }
        Insert: {
          approval_status?: boolean
          cover?: string | null
          created_at?: string
          description: string
          id?: string
          kind: Database['public']['Enums']['residence_kind']
          location: string
          owner_id: string
          photos?: string[] | null
          price: number
          state: Database['public']['Enums']['residence_state']
          updated_at?: string | null
        }
        Update: {
          approval_status?: boolean
          cover?: string | null
          created_at?: string
          description?: string
          id?: string
          kind?: Database['public']['Enums']['residence_kind']
          location?: string
          owner_id?: string
          photos?: string[] | null
          price?: number
          state?: Database['public']['Enums']['residence_state']
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'residences_owner_id_fkey'
            columns: ['owner_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      saved_residences: {
        Row: {
          created_at: string
          id: string
          residence_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id: string
          residence_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          residence_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'favorites_residence_id_fkey'
            columns: ['residence_id']
            isOneToOne: false
            referencedRelation: 'residences'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'favorites_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          first_name: string
          id: string
          last_name: string
          phone: number | null
          photo_url: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          first_name: string
          id: string
          last_name: string
          phone?: number | null
          photo_url?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          first_name?: string
          id?: string
          last_name?: string
          phone?: number | null
          photo_url?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_residences_by_location: {
        Args: {
          search_location: string
        }
        Returns: {
          residence: unknown
        }[]
      }
    }
    Enums: {
      notification_type: 'congratulations' | 'residence-posted'
      residence_kind: 'apartment' | 'villa' | 'land' | 'others'
      residence_state: 'sell' | 'rent'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, 'public'>]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
        PublicSchema['Views'])
    ? (PublicSchema['Tables'] &
        PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never
