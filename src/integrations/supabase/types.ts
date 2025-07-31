export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      account_esip_connections: {
        Row: {
          account_id: string
          created_at: string | null
          esip_id: string
          id: string
          permissions: Json
          status: string
        }
        Insert: {
          account_id: string
          created_at?: string | null
          esip_id: string
          id?: string
          permissions?: Json
          status?: string
        }
        Update: {
          account_id?: string
          created_at?: string | null
          esip_id?: string
          id?: string
          permissions?: Json
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "account_esip_connections_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "cbdc_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "account_esip_connections_esip_id_fkey"
            columns: ["esip_id"]
            isOneToOne: false
            referencedRelation: "ecosystem_service_providers"
            referencedColumns: ["id"]
          },
        ]
      }
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
      api_request_logs: {
        Row: {
          created_at: string | null
          endpoint: string
          esip_id: string | null
          id: string
          idempotency_key: string | null
          ip_address: unknown | null
          jws_signature: string | null
          method: string
          pip_id: string | null
          request_body: Json | null
          request_headers: Json | null
          response_body: Json | null
          response_status: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          endpoint: string
          esip_id?: string | null
          id?: string
          idempotency_key?: string | null
          ip_address?: unknown | null
          jws_signature?: string | null
          method: string
          pip_id?: string | null
          request_body?: Json | null
          request_headers?: Json | null
          response_body?: Json | null
          response_status?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          endpoint?: string
          esip_id?: string | null
          id?: string
          idempotency_key?: string | null
          ip_address?: unknown | null
          jws_signature?: string | null
          method?: string
          pip_id?: string | null
          request_body?: Json | null
          request_headers?: Json | null
          response_body?: Json | null
          response_status?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "api_request_logs_esip_id_fkey"
            columns: ["esip_id"]
            isOneToOne: false
            referencedRelation: "ecosystem_service_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "api_request_logs_pip_id_fkey"
            columns: ["pip_id"]
            isOneToOne: false
            referencedRelation: "payment_interface_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      atomic_swaps: {
        Row: {
          counterparty_pip: string
          created_at: string | null
          hash_lock: string
          id: string
          initiator_account_id: string
          receive_amount: number
          receive_token: string
          send_amount: number
          send_token: string
          status: string
          time_lock: string
        }
        Insert: {
          counterparty_pip: string
          created_at?: string | null
          hash_lock: string
          id?: string
          initiator_account_id: string
          receive_amount: number
          receive_token: string
          send_amount: number
          send_token: string
          status?: string
          time_lock: string
        }
        Update: {
          counterparty_pip?: string
          created_at?: string | null
          hash_lock?: string
          id?: string
          initiator_account_id?: string
          receive_amount?: number
          receive_token?: string
          send_amount?: number
          send_token?: string
          status?: string
          time_lock?: string
        }
        Relationships: [
          {
            foreignKeyName: "atomic_swaps_initiator_account_id_fkey"
            columns: ["initiator_account_id"]
            isOneToOne: false
            referencedRelation: "cbdc_accounts"
            referencedColumns: ["id"]
          },
        ]
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
      cbdc_accounts: {
        Row: {
          account_type: string
          alias_email: string | null
          alias_phone: string | null
          country_code: string
          created_at: string | null
          id: string
          parent_account_id: string | null
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          account_type: string
          alias_email?: string | null
          alias_phone?: string | null
          country_code: string
          created_at?: string | null
          id?: string
          parent_account_id?: string | null
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          account_type?: string
          alias_email?: string | null
          alias_phone?: string | null
          country_code?: string
          created_at?: string | null
          id?: string
          parent_account_id?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cbdc_accounts_parent_account_id_fkey"
            columns: ["parent_account_id"]
            isOneToOne: false
            referencedRelation: "cbdc_accounts"
            referencedColumns: ["id"]
          },
        ]
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
      conditional_triggers: {
        Row: {
          account_id: string
          action_config: Json
          action_type: string
          conditions: Json
          created_at: string | null
          id: string
          last_executed: string | null
          status: string
          trigger_type: string
        }
        Insert: {
          account_id: string
          action_config: Json
          action_type: string
          conditions: Json
          created_at?: string | null
          id?: string
          last_executed?: string | null
          status?: string
          trigger_type: string
        }
        Update: {
          account_id?: string
          action_config?: Json
          action_type?: string
          conditions?: Json
          created_at?: string | null
          id?: string
          last_executed?: string | null
          status?: string
          trigger_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "conditional_triggers_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "cbdc_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      country_banking_methods: {
        Row: {
          configuration: Json
          country_code: string
          created_at: string | null
          id: string
          is_active: boolean | null
          method_name: string
          method_type: string
          provider_name: string
        }
        Insert: {
          configuration?: Json
          country_code: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          method_name: string
          method_type: string
          provider_name: string
        }
        Update: {
          configuration?: Json
          country_code?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          method_name?: string
          method_type?: string
          provider_name?: string
        }
        Relationships: []
      }
      developer_sandboxes: {
        Row: {
          api_key: string
          created_at: string | null
          developer_id: string
          environment_config: Json
          id: string
          is_active: boolean | null
          sandbox_name: string
        }
        Insert: {
          api_key: string
          created_at?: string | null
          developer_id: string
          environment_config?: Json
          id?: string
          is_active?: boolean | null
          sandbox_name: string
        }
        Update: {
          api_key?: string
          created_at?: string | null
          developer_id?: string
          environment_config?: Json
          id?: string
          is_active?: boolean | null
          sandbox_name?: string
        }
        Relationships: []
      }
      ecosystem_service_providers: {
        Row: {
          api_key: string
          created_at: string | null
          id: string
          name: string
          permissions: Json
          provider_type: string
          status: string
        }
        Insert: {
          api_key: string
          created_at?: string | null
          id?: string
          name: string
          permissions?: Json
          provider_type: string
          status?: string
        }
        Update: {
          api_key?: string
          created_at?: string | null
          id?: string
          name?: string
          permissions?: Json
          provider_type?: string
          status?: string
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
      fund_operations: {
        Row: {
          account_id: string
          amount: number
          bank_account_id: string | null
          bank_method: string
          completed_at: string | null
          country_code: string
          created_at: string | null
          id: string
          operation_type: string
          reference_id: string | null
          status: string
          token_symbol: string
        }
        Insert: {
          account_id: string
          amount: number
          bank_account_id?: string | null
          bank_method: string
          completed_at?: string | null
          country_code: string
          created_at?: string | null
          id?: string
          operation_type: string
          reference_id?: string | null
          status?: string
          token_symbol: string
        }
        Update: {
          account_id?: string
          amount?: number
          bank_account_id?: string | null
          bank_method?: string
          completed_at?: string | null
          country_code?: string
          created_at?: string | null
          id?: string
          operation_type?: string
          reference_id?: string | null
          status?: string
          token_symbol?: string
        }
        Relationships: [
          {
            foreignKeyName: "fund_operations_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "cbdc_accounts"
            referencedColumns: ["id"]
          },
        ]
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
      offline_operations: {
        Row: {
          account_id: string
          amount: number
          completed_at: string | null
          created_at: string | null
          device_id: string
          device_type: string
          id: string
          operation_type: string
          status: string
          token_symbol: string
        }
        Insert: {
          account_id: string
          amount: number
          completed_at?: string | null
          created_at?: string | null
          device_id: string
          device_type: string
          id?: string
          operation_type: string
          status?: string
          token_symbol: string
        }
        Update: {
          account_id?: string
          amount?: number
          completed_at?: string | null
          created_at?: string | null
          device_id?: string
          device_type?: string
          id?: string
          operation_type?: string
          status?: string
          token_symbol?: string
        }
        Relationships: [
          {
            foreignKeyName: "offline_operations_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "cbdc_accounts"
            referencedColumns: ["id"]
          },
        ]
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
      payment_interface_providers: {
        Row: {
          api_key: string
          country_code: string
          created_at: string | null
          id: string
          name: string
          public_key: string
          status: string
        }
        Insert: {
          api_key: string
          country_code: string
          created_at?: string | null
          id?: string
          name: string
          public_key: string
          status?: string
        }
        Update: {
          api_key?: string
          country_code?: string
          created_at?: string | null
          id?: string
          name?: string
          public_key?: string
          status?: string
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
      payment_requests_advanced: {
        Row: {
          amount: number
          authentication_method: string | null
          completed_at: string | null
          created_at: string | null
          description: string | null
          expires_at: string | null
          id: string
          is_authenticated: boolean | null
          payer_pip: string
          requester_account_id: string
          status: string
          token_symbol: string
        }
        Insert: {
          amount: number
          authentication_method?: string | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          expires_at?: string | null
          id?: string
          is_authenticated?: boolean | null
          payer_pip: string
          requester_account_id: string
          status?: string
          token_symbol: string
        }
        Update: {
          amount?: number
          authentication_method?: string | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          expires_at?: string | null
          id?: string
          is_authenticated?: boolean | null
          payer_pip?: string
          requester_account_id?: string
          status?: string
          token_symbol?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_requests_advanced_requester_account_id_fkey"
            columns: ["requester_account_id"]
            isOneToOne: false
            referencedRelation: "cbdc_accounts"
            referencedColumns: ["id"]
          },
        ]
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
      programmable_locks: {
        Row: {
          account_id: string
          amount: number
          arbiter_pip: string | null
          conditions: Json | null
          created_at: string | null
          expires_at: string | null
          hash_condition: string | null
          id: string
          lock_type: string
          recipient_pip: string
          status: string
          time_lock: string | null
          token_symbol: string
        }
        Insert: {
          account_id: string
          amount: number
          arbiter_pip?: string | null
          conditions?: Json | null
          created_at?: string | null
          expires_at?: string | null
          hash_condition?: string | null
          id?: string
          lock_type: string
          recipient_pip: string
          status?: string
          time_lock?: string | null
          token_symbol: string
        }
        Update: {
          account_id?: string
          amount?: number
          arbiter_pip?: string | null
          conditions?: Json | null
          created_at?: string | null
          expires_at?: string | null
          hash_condition?: string | null
          id?: string
          lock_type?: string
          recipient_pip?: string
          status?: string
          time_lock?: string | null
          token_symbol?: string
        }
        Relationships: [
          {
            foreignKeyName: "programmable_locks_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "cbdc_accounts"
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
      split_payment_recipients: {
        Row: {
          amount: number
          id: string
          recipient_pip: string
          split_payment_id: string
          status: string
          transaction_id: string | null
        }
        Insert: {
          amount: number
          id?: string
          recipient_pip: string
          split_payment_id: string
          status?: string
          transaction_id?: string | null
        }
        Update: {
          amount?: number
          id?: string
          recipient_pip?: string
          split_payment_id?: string
          status?: string
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "split_payment_recipients_split_payment_id_fkey"
            columns: ["split_payment_id"]
            isOneToOne: false
            referencedRelation: "split_payments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "split_payment_recipients_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      split_payments: {
        Row: {
          conditions: Json | null
          created_at: string | null
          id: string
          initiator_account_id: string
          status: string
          token_symbol: string
          total_amount: number
        }
        Insert: {
          conditions?: Json | null
          created_at?: string | null
          id?: string
          initiator_account_id: string
          status?: string
          token_symbol: string
          total_amount: number
        }
        Update: {
          conditions?: Json | null
          created_at?: string | null
          id?: string
          initiator_account_id?: string
          status?: string
          token_symbol?: string
          total_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "split_payments_initiator_account_id_fkey"
            columns: ["initiator_account_id"]
            isOneToOne: false
            referencedRelation: "cbdc_accounts"
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
      system_status: {
        Row: {
          created_at: string | null
          id: string
          last_check: string | null
          last_error: string | null
          metrics: Json | null
          service_name: string
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_check?: string | null
          last_error?: string | null
          metrics?: Json | null
          service_name: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          last_check?: string | null
          last_error?: string | null
          metrics?: Json | null
          service_name?: string
          status?: string
          updated_at?: string | null
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
      trade_finance_escrows: {
        Row: {
          arbiter_pip: string | null
          buyer_account_id: string
          created_at: string | null
          documents_required: string[] | null
          escrow_amount: number
          id: string
          released_at: string | null
          seller_account_id: string
          status: string
          token_symbol: string
          trade_terms: Json
        }
        Insert: {
          arbiter_pip?: string | null
          buyer_account_id: string
          created_at?: string | null
          documents_required?: string[] | null
          escrow_amount: number
          id?: string
          released_at?: string | null
          seller_account_id: string
          status?: string
          token_symbol: string
          trade_terms: Json
        }
        Update: {
          arbiter_pip?: string | null
          buyer_account_id?: string
          created_at?: string | null
          documents_required?: string[] | null
          escrow_amount?: number
          id?: string
          released_at?: string | null
          seller_account_id?: string
          status?: string
          token_symbol?: string
          trade_terms?: Json
        }
        Relationships: [
          {
            foreignKeyName: "trade_finance_escrows_buyer_account_id_fkey"
            columns: ["buyer_account_id"]
            isOneToOne: false
            referencedRelation: "cbdc_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trade_finance_escrows_seller_account_id_fkey"
            columns: ["seller_account_id"]
            isOneToOne: false
            referencedRelation: "cbdc_accounts"
            referencedColumns: ["id"]
          },
        ]
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
