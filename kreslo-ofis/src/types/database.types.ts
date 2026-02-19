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
      settings: {
        Row: {
          id: number
          key: string
          value: string
          updated_at: string
        }
        Insert: {
          id?: number
          key: string
          value: string
          updated_at?: string
        }
        Update: {
          id?: number
          key?: string
          value?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name_az: string
          name_ru: string
          name_en: string
          slug: string
          parent_id: string | null
          sort_order: number | null
          is_active: boolean | null
          created_at: string
        }
        Insert: {
          id?: string
          name_az: string
          name_ru: string
          name_en: string
          slug: string
          parent_id?: string | null
          sort_order?: number | null
          is_active?: boolean | null
          created_at?: string
        }
        Update: {
          id?: string
          name_az?: string
          name_ru?: string
          name_en?: string
          slug?: string
          parent_id?: string | null
          sort_order?: number | null
          is_active?: boolean | null
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name_az: string
          name_ru: string
          name_en: string
          slug: string
          description_az: string | null
          description_ru: string | null
          description_en: string | null
          category_id: string | null
          price: number
          discount_price: number | null
          discount_ends_at: string | null
          image_url: string
          extra_images: string[] | null
          is_active: boolean | null
          in_stock: boolean | null
          sort_order: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name_az: string
          name_ru: string
          name_en: string
          slug: string
          description_az?: string | null
          description_ru?: string | null
          description_en?: string | null
          category_id?: string | null
          price: number
          discount_price?: number | null
          discount_ends_at?: string | null
          image_url: string
          extra_images?: string[] | null
          is_active?: boolean | null
          in_stock?: boolean | null
          sort_order?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name_az?: string
          name_ru?: string
          name_en?: string
          slug?: string
          description_az?: string | null
          description_ru?: string | null
          description_en?: string | null
          category_id?: string | null
          price?: number
          discount_price?: number | null
          discount_ends_at?: string | null
          image_url?: string
          extra_images?: string[] | null
          is_active?: boolean | null
          in_stock?: boolean | null
          sort_order?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      product_variants: {
        Row: {
          id: string
          product_id: string
          label_az: string
          label_ru: string
          label_en: string
          image_url: string | null
          price_delta: number | null
          in_stock: boolean | null
          sort_order: number | null
        }
        Insert: {
          id?: string
          product_id: string
          label_az: string
          label_ru: string
          label_en: string
          image_url?: string | null
          price_delta?: number | null
          in_stock?: boolean | null
          sort_order?: number | null
        }
        Update: {
          id?: string
          product_id?: string
          label_az?: string
          label_ru?: string
          label_en?: string
          image_url?: string | null
          price_delta?: number | null
          in_stock?: boolean | null
          sort_order?: number | null
        }
      }
      bundles: {
        Row: {
          id: string
          name_az: string
          name_ru: string
          name_en: string
          slug: string
          description_az: string | null
          description_ru: string | null
          description_en: string | null
          discount_percentage: number
          is_active: boolean | null
          created_at: string
        }
        Insert: {
          id?: string
          name_az: string
          name_ru: string
          name_en: string
          slug: string
          description_az?: string | null
          description_ru?: string | null
          description_en?: string | null
          discount_percentage?: number
          is_active?: boolean | null
          created_at?: string
        }
        Update: {
          id?: string
          name_az?: string
          name_ru?: string
          name_en?: string
          slug?: string
          description_az?: string | null
          description_ru?: string | null
          description_en?: string | null
          discount_percentage?: number
          is_active?: boolean | null
          created_at?: string
        }
      }
      bundle_items: {
        Row: {
          bundle_id: string
          product_id: string
        }
        Insert: {
          bundle_id: string
          product_id: string
        }
        Update: {
          bundle_id?: string
          product_id?: string
        }
      }
    }
    Views: {
      active_flash_sales: {
        Row: {
          id: string
          name_az: string
          name_ru: string
          name_en: string
          slug: string
          description_az: string | null
          description_ru: string | null
          description_en: string | null
          category_id: string | null
          price: number
          discount_price: number | null
          discount_ends_at: string | null
          image_url: string
          extra_images: string[] | null
          is_active: boolean | null
          in_stock: boolean | null
          sort_order: number | null
          created_at: string
          updated_at: string
        }
      }
      category_tree: {
        Row: {
          id: string
          name_az: string
          name_ru: string
          name_en: string
          slug: string
          sort_order: number | null
          parent_name_az: string | null
          parent_name_ru: string | null
          parent_name_en: string | null
        }
      }
    }
    Functions: {
      [_: string]: never
    }
    Enums: {
      [_: string]: never
    }
  }
}
