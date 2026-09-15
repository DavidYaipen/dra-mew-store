export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: number;
          name: string;
          cat: 'Peluches' | 'Figuras' | 'Cartas' | 'Ropa' | 'Accesorios';
          price: number;
          old_price: number | null;
          rating: number;
          image: string;
          tint: string;
          badge: string | null;
          is_featured: boolean;
          created_at: string;
        };
        Insert: {
          id: number;
          name: string;
          cat: 'Peluches' | 'Figuras' | 'Cartas' | 'Ropa' | 'Accesorios';
          price: number;
          old_price?: number | null;
          rating: number;
          image: string;
          tint: string;
          badge?: string | null;
          is_featured?: boolean;
          created_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          cat?: 'Peluches' | 'Figuras' | 'Cartas' | 'Ropa' | 'Accesorios';
          price?: number;
          old_price?: number | null;
          rating?: number;
          image?: string;
          tint?: string;
          badge?: string | null;
          is_featured?: boolean;
          created_at?: string;
        };
      };
      product_variants: {
        Row: {
          id: string;
          product_id: number;
          name: string;
          sku: string | null;
          price_override: number | null;
          stock: number;
          image: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: number;
          name: string;
          sku?: string | null;
          price_override?: number | null;
          stock?: number;
          image?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: number;
          name?: string;
          sku?: string | null;
          price_override?: number | null;
          stock?: number;
          image?: string | null;
          created_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          order_number: number;
          customer_id: string | null;
          status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
          subtotal: number;
          discount: number;
          shipping_cost: number;
          total: number;
          coupon_id: string | null;
          shipping_method: string | null;
          shipping_address: Json | null;
          payment_method: string | null;
          payment_status: string;
          notes: string | null;
          whatsapp_sent: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number?: number;
          customer_id?: string | null;
          status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
          subtotal: number;
          discount?: number;
          shipping_cost?: number;
          total: number;
          coupon_id?: string | null;
          shipping_method?: string | null;
          shipping_address?: Json | null;
          payment_method?: string | null;
          payment_status?: string;
          notes?: string | null;
          whatsapp_sent?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_number?: number;
          customer_id?: string | null;
          status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
          subtotal?: number;
          discount?: number;
          shipping_cost?: number;
          total?: number;
          coupon_id?: string | null;
          shipping_method?: string | null;
          shipping_address?: Json | null;
          payment_method?: string | null;
          payment_status?: string;
          notes?: string | null;
          whatsapp_sent?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: number;
          variant_id: string | null;
          name: string;
          price: number;
          quantity: number;
          image: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id: number;
          variant_id?: string | null;
          name: string;
          price: number;
          quantity: number;
          image?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: number;
          variant_id?: string | null;
          name?: string;
          price?: number;
          quantity?: number;
          image?: string | null;
          created_at?: string;
        };
      };
      customers: {
        Row: {
          id: string;
          email: string | null;
          name: string;
          phone: string | null;
          address: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          email?: string | null;
          name: string;
          phone?: string | null;
          address?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          name?: string;
          phone?: string | null;
          address?: Json | null;
          created_at?: string;
        };
      };
      coupons: {
        Row: {
          id: string;
          code: string;
          discount_type: 'percentage' | 'fixed';
          discount_value: number;
          min_order: number;
          max_uses: number | null;
          used_count: number;
          valid_from: string;
          valid_until: string | null;
          active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          discount_type: 'percentage' | 'fixed';
          discount_value: number;
          min_order?: number;
          max_uses?: number | null;
          used_count?: number;
          valid_from?: string;
          valid_until?: string | null;
          active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          discount_type?: 'percentage' | 'fixed';
          discount_value?: number;
          min_order?: number;
          max_uses?: number | null;
          used_count?: number;
          valid_from?: string;
          valid_until?: string | null;
          active?: boolean;
          created_at?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          product_id: number;
          customer_name: string;
          rating: number;
          comment: string | null;
          approved: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: number;
          customer_name: string;
          rating: number;
          comment?: string | null;
          approved?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: number;
          customer_name?: string;
          rating?: number;
          comment?: string | null;
          approved?: boolean;
          created_at?: string;
        };
      };
      subscribers: {
        Row: {
          id: string;
          email: string;
          active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          active?: boolean;
          created_at?: string;
        };
      };
      inventory_movements: {
        Row: {
          id: string;
          product_id: number;
          variant_id: string | null;
          quantity: number;
          reason: string;
          reference: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: number;
          variant_id?: string | null;
          quantity: number;
          reason: string;
          reference?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: number;
          variant_id?: string | null;
          quantity?: number;
          reason?: string;
          reference?: string | null;
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      product_category: 'Peluches' | 'Figuras' | 'Cartas' | 'Ropa' | 'Accesorios';
      order_status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
    };
  };
}
