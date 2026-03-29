export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __version__?: '12'
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          phone: string | null
          role: 'buyer' | 'agent' | 'admin'
          created_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          role?: 'buyer' | 'agent' | 'admin'
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          role?: 'buyer' | 'agent' | 'admin'
          created_at?: string
        }
      }
      agents: {
        Row: {
          id: string
          user_id: string
          bio: string | null
          coverage_areas: string[] | null
          ktp_url: string | null
          license_url: string | null
          is_verified: boolean
          verified_at: string | null
          slug: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          bio?: string | null
          coverage_areas?: string[] | null
          ktp_url?: string | null
          license_url?: string | null
          is_verified?: boolean
          verified_at?: string | null
          slug: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          bio?: string | null
          coverage_areas?: string[] | null
          ktp_url?: string | null
          license_url?: string | null
          is_verified?: boolean
          verified_at?: string | null
          slug?: string
          created_at?: string
        }
      }
      properties: {
        Row: {
          id: string
          agent_id: string
          title: string
          description: string | null
          type: 'rumah' | 'apartemen' | 'ruko' | 'tanah' | 'villa' | 'gudang' | 'kantor'
          status: 'jual' | 'sewa'
          price: number
          land_area: number | null
          building_area: number | null
          bedrooms: number | null
          bathrooms: number | null
          city: string
          district: string | null
          address: string | null
          latitude: number | null
          longitude: number | null
          amenities: string[] | null
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          agent_id: string
          title: string
          description?: string | null
          type: 'rumah' | 'apartemen' | 'ruko' | 'tanah' | 'villa' | 'gudang' | 'kantor'
          status: 'jual' | 'sewa'
          price: number
          land_area?: number | null
          building_area?: number | null
          bedrooms?: number | null
          bathrooms?: number | null
          city: string
          district?: string | null
          address?: string | null
          latitude?: number | null
          longitude?: number | null
          amenities?: string[] | null
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          agent_id?: string
          title?: string
          description?: string | null
          type?: 'rumah' | 'apartemen' | 'ruko' | 'tanah' | 'villa' | 'gudang' | 'kantor'
          status?: 'jual' | 'sewa'
          price?: number
          land_area?: number | null
          building_area?: number | null
          bedrooms?: number | null
          bathrooms?: number | null
          city?: string
          district?: string | null
          address?: string | null
          latitude?: number | null
          longitude?: number | null
          amenities?: string[] | null
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      property_images: {
        Row: {
          id: string
          property_id: string
          url: string
          is_primary: boolean
          sort_order: number
        }
        Insert: {
          id?: string
          property_id: string
          url: string
          is_primary?: boolean
          sort_order?: number
        }
        Update: {
          id?: string
          property_id?: string
          url?: string
          is_primary?: boolean
          sort_order?: number
        }
      }
      leads: {
        Row: {
          id: string
          property_id: string
          agent_id: string
          buyer_name: string
          buyer_phone: string | null
          buyer_email: string | null
          message: string | null
          channel: 'form' | 'whatsapp' | 'email'
          status: 'new' | 'contacted' | 'survey' | 'negotiation' | 'closed' | 'cancelled'
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          property_id: string
          agent_id: string
          buyer_name: string
          buyer_phone?: string | null
          buyer_email?: string | null
          message?: string | null
          channel?: 'form' | 'whatsapp' | 'email'
          status?: 'new' | 'contacted' | 'survey' | 'negotiation' | 'closed' | 'cancelled'
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          agent_id?: string
          buyer_name?: string
          buyer_phone?: string | null
          buyer_email?: string | null
          message?: string | null
          channel?: 'form' | 'whatsapp' | 'email'
          status?: 'new' | 'contacted' | 'survey' | 'negotiation' | 'closed' | 'cancelled'
          notes?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Convenience types
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Agent = Database['public']['Tables']['agents']['Row']
export type Property = Database['public']['Tables']['properties']['Row']
export type PropertyImage = Database['public']['Tables']['property_images']['Row']
export type Lead = Database['public']['Tables']['leads']['Row']

export type PropertyWithImages = Property & {
  property_images: PropertyImage[]
  agents: Agent & {
    profiles: Profile
  }
}
