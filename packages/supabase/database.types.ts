export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      child_memberships: {
        Row: {
          child_id: string;
          id: string;
          organization_id: string | null;
          permissions: Json | null;
          role: Database['public']['Enums']['ChildMembershipRole'];
          user_id: string;
        };
        Insert: {
          child_id: string;
          id?: string;
          organization_id?: string | null;
          permissions?: Json | null;
          role: Database['public']['Enums']['ChildMembershipRole'];
          user_id: string;
        };
        Update: {
          child_id?: string;
          id?: string;
          organization_id?: string | null;
          permissions?: Json | null;
          role?: Database['public']['Enums']['ChildMembershipRole'];
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'child_memberships_child_id_fkey';
            columns: ['child_id'];
            isOneToOne: false;
            referencedRelation: 'children';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'child_memberships_organization_id_fkey';
            columns: ['organization_id'];
            isOneToOne: false;
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'child_memberships_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      child_organizations: {
        Row: {
          child_id: string;
          id: string;
          organization_id: string;
        };
        Insert: {
          child_id: string;
          id?: string;
          organization_id: string;
        };
        Update: {
          child_id?: string;
          id?: string;
          organization_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'child_organizations_child_id_fkey';
            columns: ['child_id'];
            isOneToOne: false;
            referencedRelation: 'children';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'child_organizations_organization_id_fkey';
            columns: ['organization_id'];
            isOneToOne: false;
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          },
        ];
      };
      children: {
        Row: {
          avatar_url: string | null;
          birthdate: string;
          created_by: string;
          id: string;
          name: string;
          sex: Database['public']['Enums']['Sex'] | null;
        };
        Insert: {
          avatar_url?: string | null;
          birthdate: string;
          created_by: string;
          id?: string;
          name: string;
          sex?: Database['public']['Enums']['Sex'] | null;
        };
        Update: {
          avatar_url?: string | null;
          birthdate?: string;
          created_by?: string;
          id?: string;
          name?: string;
          sex?: Database['public']['Enums']['Sex'] | null;
        };
        Relationships: [
          {
            foreignKeyName: 'children_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      events: {
        Row: {
          child_id: string;
          created_at: string;
          created_by: string;
          id: string;
          organization_id: string | null;
          payload: Json;
          type: Database['public']['Enums']['EventType'];
          visibility: Database['public']['Enums']['EventVisibility'];
        };
        Insert: {
          child_id: string;
          created_at?: string;
          created_by: string;
          id?: string;
          organization_id?: string | null;
          payload: Json;
          type: Database['public']['Enums']['EventType'];
          visibility: Database['public']['Enums']['EventVisibility'];
        };
        Update: {
          child_id?: string;
          created_at?: string;
          created_by?: string;
          id?: string;
          organization_id?: string | null;
          payload?: Json;
          type?: Database['public']['Enums']['EventType'];
          visibility?: Database['public']['Enums']['EventVisibility'];
        };
        Relationships: [
          {
            foreignKeyName: 'events_child_id_fkey';
            columns: ['child_id'];
            isOneToOne: false;
            referencedRelation: 'children';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'events_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'events_organization_id_fkey';
            columns: ['organization_id'];
            isOneToOne: false;
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          },
        ];
      };
      organization_members: {
        Row: {
          id: string;
          organization_id: string;
          role: Database['public']['Enums']['OrganizationMemberRole'];
          user_id: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          role: Database['public']['Enums']['OrganizationMemberRole'];
          user_id: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          role?: Database['public']['Enums']['OrganizationMemberRole'];
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'organization_members_organization_id_fkey';
            columns: ['organization_id'];
            isOneToOne: false;
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'organization_members_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      organizations: {
        Row: {
          id: string;
          name: string;
          type: Database['public']['Enums']['OrganizationType'];
        };
        Insert: {
          id?: string;
          name: string;
          type: Database['public']['Enums']['OrganizationType'];
        };
        Update: {
          id?: string;
          name?: string;
          type?: Database['public']['Enums']['OrganizationType'];
        };
        Relationships: [];
      };
      users: {
        Row: {
          email: string;
          id: string;
        };
        Insert: {
          email: string;
          id: string;
        };
        Update: {
          email?: string;
          id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      create_child_for_current_user: {
        Args: {
          p_avatar_url?: string;
          p_birthdate: string;
          p_name: string;
          p_sex?: Database['public']['Enums']['Sex'];
        };
        Returns: {
          avatar_url: string | null;
          birthdate: string;
          created_by: string;
          id: string;
          name: string;
          sex: Database['public']['Enums']['Sex'] | null;
        };
        SetofOptions: {
          from: '*';
          to: 'children';
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
    };
    Enums: {
      ChildMembershipRole: 'parent' | 'caregiver' | 'admin';
      EventType:
        | 'activity'
        | 'diaper'
        | 'growth'
        | 'meal'
        | 'meds'
        | 'message'
        | 'nap'
        | 'note';
      EventVisibility: 'all' | 'parents_only' | 'org_only';
      OrganizationMemberRole: 'owner' | 'staff';
      OrganizationType: 'daycare';
      Sex: 'male' | 'female';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  'public'
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      ChildMembershipRole: ['parent', 'caregiver', 'admin'],
      EventType: [
        'activity',
        'diaper',
        'growth',
        'meal',
        'meds',
        'message',
        'nap',
        'note',
      ],
      EventVisibility: ['all', 'parents_only', 'org_only'],
      OrganizationMemberRole: ['owner', 'staff'],
      OrganizationType: ['daycare'],
      Sex: ['male', 'female'],
    },
  },
} as const;
