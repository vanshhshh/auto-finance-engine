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
      aml_alerts: {
        Row: {
          alert_type: string
          created_at: string | null
          description: string
          id: string
          metadata: Json | null
          resolved_at: string | null
          resolved_by: string | null
          severity: string
          status: string
          transaction_id: string | null
          user_id: string
        }
        Insert: {
          alert_type: string
          created_at?: string | null
          description: string
          id?: string
          metadata?: Json | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity: string
          status?: string
          transaction_id?: string | null
          user_id: string
        }
        Update: {
          alert_type?: string
          created_at?: string | null
          description?: string
          id?: string
          metadata?: Json | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          status?: string
          transaction_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "aml_alerts_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      api_keys: {
        Row: {
          active: boolean | null
          api_key: string
          created_at: string | null
          expires_at: string | null
          id: string
          key_name: string
          last_used: string | null
          permissions: Json
          user_id: string
        }
        Insert: {
          active?: boolean | null
          api_key: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          key_name: string
          last_used?: string | null
          permissions?: Json
          user_id: string
        }
        Update: {
          active?: boolean | null
          api_key?: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          key_name?: string
          last_used?: string | null
          permissions?: Json
          user_id?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          id: string
          ip_address: unknown | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      bulk_payment_items: {
        Row: {
          amount: number
          bulk_payment_id: string
          description: string | null
          error_message: string | null
          id: string
          processed_at: string | null
          recipient_address: string
          status: string
          transaction_id: string | null
        }
        Insert: {
          amount: number
          bulk_payment_id: string
          description?: string | null
          error_message?: string | null
          id?: string
          processed_at?: string | null
          recipient_address: string
          status?: string
          transaction_id?: string | null
        }
        Update: {
          amount?: number
          bulk_payment_id?: string
          description?: string | null
          error_message?: string | null
          id?: string
          processed_at?: string | null
          recipient_address?: string
          status?: string
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bulk_payment_items_bulk_payment_id_fkey"
            columns: ["bulk_payment_id"]
            isOneToOne: false
            referencedRelation: "bulk_payments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bulk_payment_items_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      bulk_payments: {
        Row: {
          created_at: string | null
          failed_count: number | null
          id: string
          processed_at: string | null
          processed_count: number | null
          status: string
          title: string
          total_amount: number
          total_recipients: number
          user_id: string
        }
        Insert: {
          created_at?: string | null
          failed_count?: number | null
          id?: string
          processed_at?: string | null
          processed_count?: number | null
          status?: string
          title: string
          total_amount: number
          total_recipients: number
          user_id: string
        }
        Update: {
          created_at?: string | null
          failed_count?: number | null
          id?: string
          processed_at?: string | null
          processed_count?: number | null
          status?: string
          title?: string
          total_amount?: number
          total_recipients?: number
          user_id?: string
        }
        Relationships: []
      }
      compliance_events: {
        Row: {
          created_at: string | null
          description: string
          event_type: string
          id: string
          metadata: Json | null
          resolved: boolean | null
          severity: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description: string
          event_type: string
          id?: string
          metadata?: Json | null
          resolved?: boolean | null
          severity: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string
          event_type?: string
          id?: string
          metadata?: Json | null
          resolved?: boolean | null
          severity?: string
          user_id?: string
        }
        Relationships: []
      }
      compliance_reports: {
        Row: {
          created_at: string | null
          data: Json
          generated_by: string | null
          id: string
          period_end: string
          period_start: string
          report_type: string
          status: string
          submitted_at: string | null
        }
        Insert: {
          created_at?: string | null
          data: Json
          generated_by?: string | null
          id?: string
          period_end: string
          period_start: string
          report_type: string
          status?: string
          submitted_at?: string | null
        }
        Update: {
          created_at?: string | null
          data?: Json
          generated_by?: string | null
          id?: string
          period_end?: string
          period_start?: string
          report_type?: string
          status?: string
          submitted_at?: string | null
        }
        Relationships: []
      }
      fraud_rules: {
        Row: {
          action: string
          active: boolean | null
          conditions: Json
          created_at: string | null
          id: string
          rule_name: string
          rule_type: string
          severity: string
          updated_at: string | null
        }
        Insert: {
          action: string
          active?: boolean | null
          conditions: Json
          created_at?: string | null
          id?: string
          rule_name: string
          rule_type: string
          severity: string
          updated_at?: string | null
        }
        Update: {
          action?: string
          active?: boolean | null
          conditions?: Json
          created_at?: string | null
          id?: string
          rule_name?: string
          rule_type?: string
          severity?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      fx_rates: {
        Row: {
          id: string
          pair: string
          rate: number
          timestamp: string
        }
        Insert: {
          id?: string
          pair: string
          rate: number
          timestamp?: string
        }
        Update: {
          id?: string
          pair?: string
          rate?: number
          timestamp?: string
        }
        Relationships: []
      }
      kyc_documents: {
        Row: {
          admin_notes: string | null
          document_type: string
          file_name: string
          file_path: string
          id: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
          upload_date: string | null
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          document_type: string
          file_name: string
          file_path: string
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          upload_date?: string | null
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          document_type?: string
          file_name?: string
          file_path?: string
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          upload_date?: string | null
          user_id?: string
        }
        Relationships: []
      }
      merchant_profiles: {
        Row: {
          address: string | null
          business_name: string
          business_type: string | null
          created_at: string | null
          email: string | null
          id: string
          phone: string | null
          status: string
          updated_at: string | null
          user_id: string
          website: string | null
        }
        Insert: {
          address?: string | null
          business_name: string
          business_type?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          phone?: string | null
          status?: string
          updated_at?: string | null
          user_id: string
          website?: string | null
        }
        Update: {
          address?: string | null
          business_name?: string
          business_type?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          phone?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
      mfa_verifications: {
        Row: {
          code: string
          created_at: string | null
          email: string | null
          expires_at: string
          id: string
          method: string
          phone_number: string | null
          user_id: string
          verified: boolean | null
        }
        Insert: {
          code: string
          created_at?: string | null
          email?: string | null
          expires_at: string
          id?: string
          method: string
          phone_number?: string | null
          user_id: string
          verified?: boolean | null
        }
        Update: {
          code?: string
          created_at?: string | null
          email?: string | null
          expires_at?: string
          id?: string
          method?: string
          phone_number?: string | null
          user_id?: string
          verified?: boolean | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          read: boolean | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          read?: boolean | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          read?: boolean | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      organizations: {
        Row: {
          compliance_score: number | null
          country_code: string
          created_at: string | null
          id: string
          kyc_status: string | null
          name: string
          type: string
          updated_at: string | null
        }
        Insert: {
          compliance_score?: number | null
          country_code: string
          created_at?: string | null
          id?: string
          kyc_status?: string | null
          name: string
          type: string
          updated_at?: string | null
        }
        Update: {
          compliance_score?: number | null
          country_code?: string
          created_at?: string | null
          id?: string
          kyc_status?: string | null
          name?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      payment_links: {
        Row: {
          amount: number
          created_at: string | null
          description: string | null
          expires_at: string | null
          id: string
          merchant_id: string
          status: string
          used_at: string | null
          used_by: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          description?: string | null
          expires_at?: string | null
          id?: string
          merchant_id: string
          status?: string
          used_at?: string | null
          used_by?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string | null
          expires_at?: string | null
          id?: string
          merchant_id?: string
          status?: string
          used_at?: string | null
          used_by?: string | null
        }
        Relationships: []
      }
      payment_requests: {
        Row: {
          amount: number
          created_at: string | null
          currency: string
          description: string | null
          expires_at: string | null
          id: string
          merchant_id: string
          paid_at: string | null
          paid_by: string | null
          status: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string
          description?: string | null
          expires_at?: string | null
          id?: string
          merchant_id: string
          paid_at?: string | null
          paid_by?: string | null
          status?: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string
          description?: string | null
          expires_at?: string | null
          id?: string
          merchant_id?: string
          paid_at?: string | null
          paid_by?: string | null
          status?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          approved_tokens: string[] | null
          country_of_residence: string | null
          created_at: string
          id: string
          kyc_documents_uploaded: boolean | null
          kyc_status: string | null
          nationality: string | null
          organization_id: string | null
          role: string
          updated_at: string
          user_id: string
          wallet_address: string | null
          wallet_approved: boolean | null
        }
        Insert: {
          approved_tokens?: string[] | null
          country_of_residence?: string | null
          created_at?: string
          id?: string
          kyc_documents_uploaded?: boolean | null
          kyc_status?: string | null
          nationality?: string | null
          organization_id?: string | null
          role?: string
          updated_at?: string
          user_id: string
          wallet_address?: string | null
          wallet_approved?: boolean | null
        }
        Update: {
          approved_tokens?: string[] | null
          country_of_residence?: string | null
          created_at?: string
          id?: string
          kyc_documents_uploaded?: boolean | null
          kyc_status?: string | null
          nationality?: string | null
          organization_id?: string | null
          role?: string
          updated_at?: string
          user_id?: string
          wallet_address?: string | null
          wallet_approved?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      programmable_rules: {
        Row: {
          amount: number
          condition_type: string
          condition_value: number
          created_at: string
          execution_count: number
          id: string
          last_executed: string | null
          name: string
          status: string
          target_address: string
          token_symbol: string
          user_id: string
        }
        Insert: {
          amount: number
          condition_type: string
          condition_value: number
          created_at?: string
          execution_count?: number
          id?: string
          last_executed?: string | null
          name: string
          status?: string
          target_address: string
          token_symbol: string
          user_id: string
        }
        Update: {
          amount?: number
          condition_type?: string
          condition_value?: number
          created_at?: string
          execution_count?: number
          id?: string
          last_executed?: string | null
          name?: string
          status?: string
          target_address?: string
          token_symbol?: string
          user_id?: string
        }
        Relationships: []
      }
      risk_scores: {
        Row: {
          calculated_at: string | null
          factors: Json | null
          id: string
          score: number
          updated_by: string | null
          user_id: string
        }
        Insert: {
          calculated_at?: string | null
          factors?: Json | null
          id?: string
          score?: number
          updated_by?: string | null
          user_id: string
        }
        Update: {
          calculated_at?: string | null
          factors?: Json | null
          id?: string
          score?: number
          updated_by?: string | null
          user_id?: string
        }
        Relationships: []
      }
      rule_executions: {
        Row: {
          executed_at: string
          id: string
          oracle_data: Json | null
          reason: string | null
          rule_id: string
          success: boolean
          transaction_id: string | null
        }
        Insert: {
          executed_at?: string
          id?: string
          oracle_data?: Json | null
          reason?: string | null
          rule_id: string
          success: boolean
          transaction_id?: string | null
        }
        Update: {
          executed_at?: string
          id?: string
          oracle_data?: Json | null
          reason?: string | null
          rule_id?: string
          success?: boolean
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rule_executions_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "programmable_rules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rule_executions_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          assigned_to: string | null
          created_at: string | null
          description: string
          id: string
          priority: string
          resolved_at: string | null
          status: string
          subject: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string | null
          description: string
          id?: string
          priority?: string
          resolved_at?: string | null
          status?: string
          subject: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string | null
          description?: string
          id?: string
          priority?: string
          resolved_at?: string | null
          status?: string
          subject?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      system_controls: {
        Row: {
          id: string
          key: string
          updated_at: string
          value: boolean
        }
        Insert: {
          id?: string
          key: string
          updated_at?: string
          value?: boolean
        }
        Update: {
          id?: string
          key?: string
          updated_at?: string
          value?: boolean
        }
        Relationships: []
      }
      ticket_messages: {
        Row: {
          created_at: string | null
          id: string
          is_internal: boolean | null
          message: string
          ticket_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_internal?: boolean | null
          message: string
          ticket_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_internal?: boolean | null
          message?: string
          ticket_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_messages_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      token_balances: {
        Row: {
          balance: number
          created_at: string
          id: string
          token_symbol: string
          updated_at: string
          user_id: string
        }
        Insert: {
          balance?: number
          created_at?: string
          id?: string
          token_symbol: string
          updated_at?: string
          user_id: string
        }
        Update: {
          balance?: number
          created_at?: string
          id?: string
          token_symbol?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      transaction_fees: {
        Row: {
          active: boolean | null
          created_at: string | null
          currency: string
          fee_type: string
          fee_value: number
          id: string
          max_fee: number | null
          min_fee: number | null
          transaction_type: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          currency: string
          fee_type: string
          fee_value: number
          id?: string
          max_fee?: number | null
          min_fee?: number | null
          transaction_type: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          currency?: string
          fee_type?: string
          fee_value?: number
          id?: string
          max_fee?: number | null
          min_fee?: number | null
          transaction_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          from_address: string | null
          id: string
          rule_id: string | null
          status: string
          to_address: string
          token_symbol: string
          transaction_type: string
          tx_hash: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          from_address?: string | null
          id?: string
          rule_id?: string | null
          status?: string
          to_address: string
          token_symbol: string
          transaction_type: string
          tx_hash?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          from_address?: string | null
          id?: string
          rule_id?: string | null
          status?: string
          to_address?: string
          token_symbol?: string
          transaction_type?: string
          tx_hash?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_devices: {
        Row: {
          created_at: string | null
          device_id: string
          device_name: string | null
          device_type: string | null
          fingerprint: string | null
          id: string
          last_seen: string | null
          trusted: boolean | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          device_id: string
          device_name?: string | null
          device_type?: string | null
          fingerprint?: string | null
          id?: string
          last_seen?: string | null
          trusted?: boolean | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          device_id?: string
          device_name?: string | null
          device_type?: string | null
          fingerprint?: string | null
          id?: string
          last_seen?: string | null
          trusted?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string | null
          email_notifications: boolean | null
          id: string
          language: string | null
          notifications_enabled: boolean | null
          push_notifications: boolean | null
          sms_notifications: boolean | null
          theme: string | null
          two_factor_enabled: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email_notifications?: boolean | null
          id?: string
          language?: string | null
          notifications_enabled?: boolean | null
          push_notifications?: boolean | null
          sms_notifications?: boolean | null
          theme?: string | null
          two_factor_enabled?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email_notifications?: boolean | null
          id?: string
          language?: string | null
          notifications_enabled?: boolean | null
          push_notifications?: boolean | null
          sms_notifications?: boolean | null
          theme?: string | null
          two_factor_enabled?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          active: boolean | null
          created_at: string | null
          device_id: string | null
          expires_at: string
          id: string
          ip_address: unknown | null
          session_token: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          device_id?: string | null
          expires_at: string
          id?: string
          ip_address?: unknown | null
          session_token: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          device_id?: string | null
          expires_at?: string
          id?: string
          ip_address?: unknown | null
          session_token?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_sessions_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "user_devices"
            referencedColumns: ["id"]
          },
        ]
      }
      webhook_deliveries: {
        Row: {
          delivered_at: string | null
          event_type: string
          id: string
          payload: Json
          response_body: string | null
          response_status: number | null
          success: boolean | null
          webhook_id: string
        }
        Insert: {
          delivered_at?: string | null
          event_type: string
          id?: string
          payload: Json
          response_body?: string | null
          response_status?: number | null
          success?: boolean | null
          webhook_id: string
        }
        Update: {
          delivered_at?: string | null
          event_type?: string
          id?: string
          payload?: Json
          response_body?: string | null
          response_status?: number | null
          success?: boolean | null
          webhook_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "webhook_deliveries_webhook_id_fkey"
            columns: ["webhook_id"]
            isOneToOne: false
            referencedRelation: "webhooks"
            referencedColumns: ["id"]
          },
        ]
      }
      webhooks: {
        Row: {
          active: boolean | null
          created_at: string | null
          events: string[]
          id: string
          last_triggered: string | null
          secret: string
          url: string
          user_id: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          events: string[]
          id?: string
          last_triggered?: string | null
          secret: string
          url: string
          user_id: string
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          events?: string[]
          id?: string
          last_triggered?: string | null
          secret?: string
          url?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
