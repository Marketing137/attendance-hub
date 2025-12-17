export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      areas: {
        Row: {
          color: string | null
          created_at: string | null
          icono: string | null
          id: string
          jefe_id: string | null
          nombre: string
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          icono?: string | null
          id?: string
          jefe_id?: string | null
          nombre: string
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          icono?: string | null
          id?: string
          jefe_id?: string | null
          nombre?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      attendance: {
        Row: {
          created_at: string | null
          descuento_aplicado: number | null
          employee_id: string
          estado: Database["public"]["Enums"]["attendance_status"] | null
          fecha: string
          hora_entrada: string | null
          hora_entrada_almuerzo: string | null
          hora_entrada_programada: string | null
          hora_salida: string | null
          hora_salida_almuerzo: string | null
          hora_salida_programada: string | null
          horas_extra: number | null
          id: string
          minutos_compensados: number | null
          minutos_tarde: number | null
          observaciones: string | null
          procesado_nomina: boolean | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          descuento_aplicado?: number | null
          employee_id: string
          estado?: Database["public"]["Enums"]["attendance_status"] | null
          fecha: string
          hora_entrada?: string | null
          hora_entrada_almuerzo?: string | null
          hora_entrada_programada?: string | null
          hora_salida?: string | null
          hora_salida_almuerzo?: string | null
          hora_salida_programada?: string | null
          horas_extra?: number | null
          id?: string
          minutos_compensados?: number | null
          minutos_tarde?: number | null
          observaciones?: string | null
          procesado_nomina?: boolean | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          descuento_aplicado?: number | null
          employee_id?: string
          estado?: Database["public"]["Enums"]["attendance_status"] | null
          fecha?: string
          hora_entrada?: string | null
          hora_entrada_almuerzo?: string | null
          hora_entrada_programada?: string | null
          hora_salida?: string | null
          hora_salida_almuerzo?: string | null
          hora_salida_programada?: string | null
          horas_extra?: number | null
          id?: string
          minutos_compensados?: number | null
          minutos_tarde?: number | null
          observaciones?: string | null
          procesado_nomina?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attendance_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance_uploads: {
        Row: {
          archivo_nombre: string
          archivo_url: string | null
          created_at: string | null
          faltas_detectadas: number | null
          fecha_periodo_fin: string
          fecha_periodo_inicio: string
          id: string
          procesado: boolean | null
          subido_por: string | null
          tardanzas_detectadas: number | null
          total_registros: number | null
        }
        Insert: {
          archivo_nombre: string
          archivo_url?: string | null
          created_at?: string | null
          faltas_detectadas?: number | null
          fecha_periodo_fin: string
          fecha_periodo_inicio: string
          id?: string
          procesado?: boolean | null
          subido_por?: string | null
          tardanzas_detectadas?: number | null
          total_registros?: number | null
        }
        Update: {
          archivo_nombre?: string
          archivo_url?: string | null
          created_at?: string | null
          faltas_detectadas?: number | null
          fecha_periodo_fin?: string
          fecha_periodo_inicio?: string
          id?: string
          procesado?: boolean | null
          subido_por?: string | null
          tardanzas_detectadas?: number | null
          total_registros?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "attendance_uploads_subido_por_fkey"
            columns: ["subido_por"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      contracts: {
        Row: {
          archivo_pdf: string | null
          created_at: string | null
          employee_id: string
          estado: Database["public"]["Enums"]["contract_status"] | null
          fecha_fin: string | null
          fecha_inicio: string
          id: string
          observaciones: string | null
          salario: number
          tipo: Database["public"]["Enums"]["contract_type"]
          updated_at: string | null
        }
        Insert: {
          archivo_pdf?: string | null
          created_at?: string | null
          employee_id: string
          estado?: Database["public"]["Enums"]["contract_status"] | null
          fecha_fin?: string | null
          fecha_inicio: string
          id?: string
          observaciones?: string | null
          salario: number
          tipo: Database["public"]["Enums"]["contract_type"]
          updated_at?: string | null
        }
        Update: {
          archivo_pdf?: string | null
          created_at?: string | null
          employee_id?: string
          estado?: Database["public"]["Enums"]["contract_status"] | null
          fecha_fin?: string | null
          fecha_inicio?: string
          id?: string
          observaciones?: string | null
          salario?: number
          tipo?: Database["public"]["Enums"]["contract_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contracts_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          apellidos: string
          area_id: string | null
          banco: string | null
          created_at: string | null
          cuenta_bancaria: string | null
          direccion: string | null
          dni: string
          email: string | null
          email_personal: string | null
          estado: string | null
          fecha_ingreso: string
          fecha_nacimiento: string | null
          foto_url: string | null
          id: string
          nombres: string
          puesto: string
          salario_base: number
          telefono: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          apellidos: string
          area_id?: string | null
          banco?: string | null
          created_at?: string | null
          cuenta_bancaria?: string | null
          direccion?: string | null
          dni: string
          email?: string | null
          email_personal?: string | null
          estado?: string | null
          fecha_ingreso: string
          fecha_nacimiento?: string | null
          foto_url?: string | null
          id?: string
          nombres: string
          puesto: string
          salario_base?: number
          telefono?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          apellidos?: string
          area_id?: string | null
          banco?: string | null
          created_at?: string | null
          cuenta_bancaria?: string | null
          direccion?: string | null
          dni?: string
          email?: string | null
          email_personal?: string | null
          estado?: string | null
          fecha_ingreso?: string
          fecha_nacimiento?: string | null
          foto_url?: string | null
          id?: string
          nombres?: string
          puesto?: string
          salario_base?: number
          telefono?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employees_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "areas"
            referencedColumns: ["id"]
          },
        ]
      }
      justifications: {
        Row: {
          aprobador_jefe_id: string | null
          aprobador_rrhh_id: string | null
          archivo_adjunto: string | null
          attendance_id: string
          comentario_jefe: string | null
          comentario_rrhh: string | null
          created_at: string | null
          employee_id: string
          estado: Database["public"]["Enums"]["justification_status"] | null
          fecha_aprobacion_jefe: string | null
          fecha_aprobacion_rrhh: string | null
          id: string
          motivo: string
          updated_at: string | null
        }
        Insert: {
          aprobador_jefe_id?: string | null
          aprobador_rrhh_id?: string | null
          archivo_adjunto?: string | null
          attendance_id: string
          comentario_jefe?: string | null
          comentario_rrhh?: string | null
          created_at?: string | null
          employee_id: string
          estado?: Database["public"]["Enums"]["justification_status"] | null
          fecha_aprobacion_jefe?: string | null
          fecha_aprobacion_rrhh?: string | null
          id?: string
          motivo: string
          updated_at?: string | null
        }
        Update: {
          aprobador_jefe_id?: string | null
          aprobador_rrhh_id?: string | null
          archivo_adjunto?: string | null
          attendance_id?: string
          comentario_jefe?: string | null
          comentario_rrhh?: string | null
          created_at?: string | null
          employee_id?: string
          estado?: Database["public"]["Enums"]["justification_status"] | null
          fecha_aprobacion_jefe?: string | null
          fecha_aprobacion_rrhh?: string | null
          id?: string
          motivo?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "justifications_aprobador_jefe_id_fkey"
            columns: ["aprobador_jefe_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "justifications_aprobador_rrhh_id_fkey"
            columns: ["aprobador_rrhh_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "justifications_attendance_id_fkey"
            columns: ["attendance_id"]
            isOneToOne: false
            referencedRelation: "attendance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "justifications_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          asunto: string
          contenido: string
          created_at: string | null
          destinatario_id: string | null
          id: string
          leido: boolean | null
          referencia_id: string | null
          remitente_id: string | null
          tipo: string | null
        }
        Insert: {
          asunto: string
          contenido: string
          created_at?: string | null
          destinatario_id?: string | null
          id?: string
          leido?: boolean | null
          referencia_id?: string | null
          remitente_id?: string | null
          tipo?: string | null
        }
        Update: {
          asunto?: string
          contenido?: string
          created_at?: string | null
          destinatario_id?: string | null
          id?: string
          leido?: boolean | null
          referencia_id?: string | null
          remitente_id?: string | null
          tipo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_destinatario_id_fkey"
            columns: ["destinatario_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_remitente_id_fkey"
            columns: ["remitente_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          apellidos: string | null
          avatar_url: string | null
          created_at: string | null
          email: string | null
          id: string
          nombres: string | null
          updated_at: string | null
        }
        Insert: {
          apellidos?: string | null
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          id: string
          nombres?: string | null
          updated_at?: string | null
        }
        Update: {
          apellidos?: string | null
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          nombres?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      sanctions: {
        Row: {
          aprobador_rrhh_id: string | null
          articulo_reglamento: string | null
          created_at: string | null
          descripcion: string
          descuento_monto: number | null
          documento_url: string | null
          employee_id: string
          estado: string | null
          fecha: string
          fecha_fin_suspension: string | null
          fecha_inicio_suspension: string | null
          id: string
          nivel_infraccion: Database["public"]["Enums"]["infraction_level"]
          solicitante_id: string | null
          tipo: Database["public"]["Enums"]["sanction_type"]
          updated_at: string | null
        }
        Insert: {
          aprobador_rrhh_id?: string | null
          articulo_reglamento?: string | null
          created_at?: string | null
          descripcion: string
          descuento_monto?: number | null
          documento_url?: string | null
          employee_id: string
          estado?: string | null
          fecha: string
          fecha_fin_suspension?: string | null
          fecha_inicio_suspension?: string | null
          id?: string
          nivel_infraccion: Database["public"]["Enums"]["infraction_level"]
          solicitante_id?: string | null
          tipo: Database["public"]["Enums"]["sanction_type"]
          updated_at?: string | null
        }
        Update: {
          aprobador_rrhh_id?: string | null
          articulo_reglamento?: string | null
          created_at?: string | null
          descripcion?: string
          descuento_monto?: number | null
          documento_url?: string | null
          employee_id?: string
          estado?: string | null
          fecha?: string
          fecha_fin_suspension?: string | null
          fecha_inicio_suspension?: string | null
          id?: string
          nivel_infraccion?: Database["public"]["Enums"]["infraction_level"]
          solicitante_id?: string | null
          tipo?: Database["public"]["Enums"]["sanction_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sanctions_aprobador_rrhh_id_fkey"
            columns: ["aprobador_rrhh_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sanctions_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sanctions_solicitante_id_fkey"
            columns: ["solicitante_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          area_id: string | null
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          area_id?: string | null
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          area_id?: string | null
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "areas"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_tardy_discount: {
        Args: { minutos_tarde: number }
        Returns: number
      }
      get_current_employee_id: { Args: never; Returns: string }
      get_user_area: { Args: { _user_id: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin_rrhh" | "jefe_area" | "empleado"
      attendance_status:
        | "puntual"
        | "tarde"
        | "falta"
        | "justificado"
        | "compensado"
      contract_status: "vigente" | "vencido" | "renovado" | "finalizado"
      contract_type:
        | "indefinido"
        | "plazo_fijo"
        | "practicas"
        | "temporal"
        | "por_obra"
      infraction_level: "leve" | "grave" | "muy_grave"
      justification_status:
        | "pendiente_jefe"
        | "aprobada_jefe"
        | "rechazada_jefe"
        | "pendiente_rrhh"
        | "aprobada"
        | "rechazada"
      sanction_type:
        | "amonestacion_verbal"
        | "amonestacion_escrita"
        | "suspension"
        | "descuento"
        | "despido"
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
    Enums: {
      app_role: ["admin_rrhh", "jefe_area", "empleado"],
      attendance_status: [
        "puntual",
        "tarde",
        "falta",
        "justificado",
        "compensado",
      ],
      contract_status: ["vigente", "vencido", "renovado", "finalizado"],
      contract_type: [
        "indefinido",
        "plazo_fijo",
        "practicas",
        "temporal",
        "por_obra",
      ],
      infraction_level: ["leve", "grave", "muy_grave"],
      justification_status: [
        "pendiente_jefe",
        "aprobada_jefe",
        "rechazada_jefe",
        "pendiente_rrhh",
        "aprobada",
        "rechazada",
      ],
      sanction_type: [
        "amonestacion_verbal",
        "amonestacion_escrita",
        "suspension",
        "descuento",
        "despido",
      ],
    },
  },
} as const
