export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      favorites: {
        Row: {
          created_at: string;
          id: string;
          residence_id: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          residence_id?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          residence_id?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'favorites_residence_id_fkey';
            columns: ['residence_id'];
            isOneToOne: false;
            referencedRelation: 'residences';
            referencedColumns: ['id'];
          },
        ];
      };
      notifications: {
        Row: {
          created_at: string;
          description: string;
          id: string;
          type: Database['public']['Enums']['notification_type'];
          user_id: string;
          was_readed: boolean;
        };
        Insert: {
          created_at?: string;
          description: string;
          id?: string;
          type: Database['public']['Enums']['notification_type'];
          user_id?: string;
          was_readed?: boolean;
        };
        Update: {
          created_at?: string;
          description?: string;
          id?: string;
          type?: Database['public']['Enums']['notification_type'];
          user_id?: string;
          was_readed?: boolean;
        };
        Relationships: [];
      };
      residences: {
        Row: {
          approval_status: boolean;
          cover: string | null;
          created_at: string;
          description: string | null;
          id: string;
          kind: Database['public']['Enums']['residence_kind'];
          location: string;
          owner_id: string;
          photos: string[] | null;
          price: number;
          state: Database['public']['Enums']['residence_state'];
        };
        Insert: {
          approval_status?: boolean;
          cover?: string | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          kind: Database['public']['Enums']['residence_kind'];
          location: string;
          owner_id?: string;
          photos?: string[] | null;
          price: number;
          state: Database['public']['Enums']['residence_state'];
        };
        Update: {
          approval_status?: boolean;
          cover?: string | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          kind?: Database['public']['Enums']['residence_kind'];
          location?: string;
          owner_id?: string;
          photos?: string[] | null;
          price?: number;
          state?: Database['public']['Enums']['residence_state'];
        };
        Relationships: [];
      };
      users: {
        Row: {
          created_at: string;
          email: string;
          first_name: string;
          id: string;
          last_name: string;
          phone: number | null;
          photo_url: string | null;
        };
        Insert: {
          created_at?: string;
          email: string;
          first_name: string;
          id?: string;
          last_name: string;
          phone?: number | null;
          photo_url?: string | null;
        };
        Update: {
          created_at?: string;
          email?: string;
          first_name?: string;
          id?: string;
          last_name?: string;
          phone?: number | null;
          photo_url?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      deleteUser: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
      get_residences_by_location: {
        Args: {
          place: string;
        };
        Returns: {
          approval_status: boolean;
          cover: string | null;
          created_at: string;
          description: string | null;
          id: string;
          kind: Database['public']['Enums']['residence_kind'];
          location: string;
          owner_id: string;
          photos: string[] | null;
          price: number;
          state: Database['public']['Enums']['residence_state'];
        }[];
      };
      verify_user_password: {
        Args: {
          password: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      notification_type: 'congratulations';
      residence_kind: 'apartment' | 'villa' | 'land' | 'others';
      residence_state: 'sell' | 'rent';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database['public']['Tables'] & Database['public']['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database['public']['Tables'] &
        Database['public']['Views'])
    ? (Database['public']['Tables'] &
        Database['public']['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends keyof Database['public']['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database['public']['Tables']
    ? Database['public']['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends keyof Database['public']['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database['public']['Tables']
    ? Database['public']['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends keyof Database['public']['Enums'] | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof Database['public']['Enums']
    ? Database['public']['Enums'][PublicEnumNameOrOptions]
    : never;
