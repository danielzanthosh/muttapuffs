export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id: string
          username: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          username?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
        }
        Relationships: []
      }
      bakeries: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          address: string | null
          city: string
          district: string | null
          latitude: number | null
          longitude: number | null
          phone: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          address?: string | null
          city: string
          district?: string | null
          latitude?: number | null
          longitude?: number | null
          phone?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          address?: string | null
          city?: string
          district?: string | null
          latitude?: number | null
          longitude?: number | null
          phone?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          id: string
          bakery_id: string
          user_id: string
          title: string | null
          review_text: string
          egg_rating: number
          taste_rating: number
          freshness_rating: number
          price_rating: number
          scam_level: number
          overall_rating: number
          price_paid: number | null
          visited_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          bakery_id: string
          user_id: string
          title?: string | null
          review_text: string
          egg_rating: number
          taste_rating: number
          freshness_rating: number
          price_rating: number
          scam_level: number
          price_paid?: number | null
          visited_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          bakery_id?: string
          user_id?: string
          title?: string | null
          review_text?: string
          egg_rating?: number
          taste_rating?: number
          freshness_rating?: number
          price_rating?: number
          scam_level?: number
          price_paid?: number | null
          visited_at?: string | null
          created_at?: string
        }
        Relationships: []
      }
      review_photos: {
        Row: {
          id: string
          review_id: string
          user_id: string
          cloudinary_url: string
          cloudinary_public_id: string | null
          width: number | null
          height: number | null
          file_size: number | null
          created_at: string
        }
        Insert: {
          id?: string
          review_id: string
          user_id: string
          cloudinary_url: string
          cloudinary_public_id?: string | null
          width?: number | null
          height?: number | null
          file_size?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          review_id?: string
          user_id?: string
          cloudinary_url?: string
          cloudinary_public_id?: string | null
          width?: number | null
          height?: number | null
          file_size?: number | null
          created_at?: string
        }
        Relationships: []
      }
      bakery_badges: {
        Row: {
          id: string
          bakery_id: string
          badge_type: string
          label: string
          created_at: string
        }
        Insert: {
          id?: string
          bakery_id: string
          badge_type: string
          label: string
          created_at?: string
        }
        Update: {
          id?: string
          bakery_id?: string
          badge_type?: string
          label?: string
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
    CompositeTypes: {}
  }
}
