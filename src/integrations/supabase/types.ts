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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      admin_audit_log: {
        Row: {
          action: string
          actor_id: string | null
          actor_name: string
          created_at: string
          id: string
          reason: string | null
          target_id: string
          target_label: string
          target_type: string
        }
        Insert: {
          action: string
          actor_id?: string | null
          actor_name: string
          created_at?: string
          id?: string
          reason?: string | null
          target_id: string
          target_label: string
          target_type: string
        }
        Update: {
          action?: string
          actor_id?: string | null
          actor_name?: string
          created_at?: string
          id?: string
          reason?: string | null
          target_id?: string
          target_label?: string
          target_type?: string
        }
        Relationships: []
      }
      admins: {
        Row: {
          created_at: string
          id: string
        }
        Insert: {
          created_at?: string
          id: string
        }
        Update: {
          created_at?: string
          id?: string
        }
        Relationships: []
      }
      feedback: {
        Row: {
          comment: string | null
          created_at: string
          guest_email: string | null
          id: string
          is_guest: boolean | null
          rating: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string
          guest_email?: string | null
          id?: string
          is_guest?: boolean | null
          rating: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string
          guest_email?: string | null
          id?: string
          is_guest?: boolean | null
          rating?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      guardian_student_subjects: {
        Row: {
          created_at: string
          guardian_id: string
          id: string
          subject_id: string
        }
        Insert: {
          created_at?: string
          guardian_id: string
          id?: string
          subject_id: string
        }
        Update: {
          created_at?: string
          guardian_id?: string
          id?: string
          subject_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "guardian_student_subjects_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      liked_teachers: {
        Row: {
          created_at: string
          id: string
          teacher_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          teacher_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          teacher_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "liked_teachers_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teacher_upvote_stats"
            referencedColumns: ["teacher_id"]
          },
          {
            foreignKeyName: "liked_teachers_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers_list"
            referencedColumns: ["id"]
          },
        ]
      }
      page_content: {
        Row: {
          board_slug: string | null
          created_at: string
          display_order: number | null
          full_content: string
          heading: string
          id: string
          is_active: boolean | null
          page_type: string
          short_content: string | null
          subject_slug: string | null
          updated_at: string
        }
        Insert: {
          board_slug?: string | null
          created_at?: string
          display_order?: number | null
          full_content: string
          heading?: string
          id?: string
          is_active?: boolean | null
          page_type: string
          short_content?: string | null
          subject_slug?: string | null
          updated_at?: string
        }
        Update: {
          board_slug?: string | null
          created_at?: string
          display_order?: number | null
          full_content?: string
          heading?: string
          id?: string
          is_active?: boolean | null
          page_type?: string
          short_content?: string | null
          subject_slug?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      paper_reads: {
        Row: {
          id: string
          paper_id: string
          read_at: string
          user_id: string
        }
        Insert: {
          id?: string
          paper_id: string
          read_at?: string
          user_id: string
        }
        Update: {
          id?: string
          paper_id?: string
          read_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "paper_reads_paper_id_fkey"
            columns: ["paper_id"]
            isOneToOne: false
            referencedRelation: "papers"
            referencedColumns: ["id"]
          },
        ]
      }
      papers: {
        Row: {
          board: string
          class: string
          created_at: string
          created_by: string | null
          exam_type: string
          file_url: string | null
          id: string
          is_published: boolean
          school: string
          subject: string
          title: string
          updated_at: string
          year: number
        }
        Insert: {
          board: string
          class: string
          created_at?: string
          created_by?: string | null
          exam_type?: string
          file_url?: string | null
          id?: string
          is_published?: boolean
          school: string
          subject: string
          title: string
          updated_at?: string
          year: number
        }
        Update: {
          board?: string
          class?: string
          created_at?: string
          created_by?: string | null
          exam_type?: string
          file_url?: string | null
          id?: string
          is_published?: boolean
          school?: string
          subject?: string
          title?: string
          updated_at?: string
          year?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          age: number | null
          avatar_url: string | null
          created_at: string
          date_of_birth: string | null
          email: string | null
          full_name: string | null
          grade: string | null
          guardian_email: string | null
          id: string
          phone: string | null
          relationship_to_student: string | null
          role: string | null
          school_board: string | null
          school_college: string | null
          student_age: number | null
          student_date_of_birth: string | null
          student_grade: string | null
          student_name: string | null
          student_school_board: string | null
          terms_agreement: boolean | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          age?: number | null
          avatar_url?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          full_name?: string | null
          grade?: string | null
          guardian_email?: string | null
          id: string
          phone?: string | null
          relationship_to_student?: string | null
          role?: string | null
          school_board?: string | null
          school_college?: string | null
          student_age?: number | null
          student_date_of_birth?: string | null
          student_grade?: string | null
          student_name?: string | null
          student_school_board?: string | null
          terms_agreement?: boolean | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          age?: number | null
          avatar_url?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          full_name?: string | null
          grade?: string | null
          guardian_email?: string | null
          id?: string
          phone?: string | null
          relationship_to_student?: string | null
          role?: string | null
          school_board?: string | null
          school_college?: string | null
          student_age?: number | null
          student_date_of_birth?: string | null
          student_grade?: string | null
          student_name?: string | null
          student_school_board?: string | null
          terms_agreement?: boolean | null
          updated_at?: string
        }
        Relationships: []
      }
      rate_limit_log: {
        Row: {
          attempt_count: number
          created_at: string
          function_name: string
          id: string
          identifier: string
          window_start: string
        }
        Insert: {
          attempt_count?: number
          created_at?: string
          function_name: string
          id?: string
          identifier: string
          window_start?: string
        }
        Update: {
          attempt_count?: number
          created_at?: string
          function_name?: string
          id?: string
          identifier?: string
          window_start?: string
        }
        Relationships: []
      }
      Shikshaqmine: {
        Row: {
          Area: string | null
          "Class Size (Group/ Solo)": string | null
          "Classes Taught": string | null
          "Classes Taught for Backend": string | null
          Description: string | null
          "Email ID": string | null
          EXPANDED: string | null
          Featured: boolean | null
          "Featured Subject": string | null
          "Hero Image": string | null
          id: number
          is_paused: boolean
          Link: string | null
          "LOCATION V2": string | null
          "Max Fees": number | null
          "Min Fees": number | null
          "Mode of Teaching": string | null
          MOU: boolean
          "Phone Number": string | null
          "Place of Teaching": string | null
          "Qualifications etc": string | null
          "Review 1": string | null
          "Review 2": string | null
          "Review 3": string | null
          "School Boards Catered": string | null
          "Sir/Ma'am?": string | null
          Slug: string | null
          "STUDENT'S HOME IN THESE AREAS": string | null
          Subjects: string | null
          Title: string | null
          "TUTOR'S HOME IN THESE AREAS": string | null
          Video: string | null
          "Video Link": string | null
          "Years they started teaching": string | null
        }
        Insert: {
          Area?: string | null
          "Class Size (Group/ Solo)"?: string | null
          "Classes Taught"?: string | null
          "Classes Taught for Backend"?: string | null
          Description?: string | null
          "Email ID"?: string | null
          EXPANDED?: string | null
          Featured?: boolean | null
          "Featured Subject"?: string | null
          "Hero Image"?: string | null
          id?: number
          is_paused?: boolean
          Link?: string | null
          "LOCATION V2"?: string | null
          "Max Fees"?: number | null
          "Min Fees"?: number | null
          "Mode of Teaching"?: string | null
          MOU?: boolean
          "Phone Number"?: string | null
          "Place of Teaching"?: string | null
          "Qualifications etc"?: string | null
          "Review 1"?: string | null
          "Review 2"?: string | null
          "Review 3"?: string | null
          "School Boards Catered"?: string | null
          "Sir/Ma'am?"?: string | null
          Slug?: string | null
          "STUDENT'S HOME IN THESE AREAS"?: string | null
          Subjects?: string | null
          Title?: string | null
          "TUTOR'S HOME IN THESE AREAS"?: string | null
          Video?: string | null
          "Video Link"?: string | null
          "Years they started teaching"?: string | null
        }
        Update: {
          Area?: string | null
          "Class Size (Group/ Solo)"?: string | null
          "Classes Taught"?: string | null
          "Classes Taught for Backend"?: string | null
          Description?: string | null
          "Email ID"?: string | null
          EXPANDED?: string | null
          Featured?: boolean | null
          "Featured Subject"?: string | null
          "Hero Image"?: string | null
          id?: number
          is_paused?: boolean
          Link?: string | null
          "LOCATION V2"?: string | null
          "Max Fees"?: number | null
          "Min Fees"?: number | null
          "Mode of Teaching"?: string | null
          MOU?: boolean
          "Phone Number"?: string | null
          "Place of Teaching"?: string | null
          "Qualifications etc"?: string | null
          "Review 1"?: string | null
          "Review 2"?: string | null
          "Review 3"?: string | null
          "School Boards Catered"?: string | null
          "Sir/Ma'am?"?: string | null
          Slug?: string | null
          "STUDENT'S HOME IN THESE AREAS"?: string | null
          Subjects?: string | null
          Title?: string | null
          "TUTOR'S HOME IN THESE AREAS"?: string | null
          Video?: string | null
          "Video Link"?: string | null
          "Years they started teaching"?: string | null
        }
        Relationships: []
      }
      student_subjects: {
        Row: {
          created_at: string
          id: string
          student_id: string
          subject_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          student_id: string
          subject_id: string
        }
        Update: {
          created_at?: string
          id?: string
          student_id?: string
          subject_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_subjects_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      student_teachers: {
        Row: {
          created_at: string
          id: string
          student_id: string
          teacher_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          student_id: string
          teacher_id: string
        }
        Update: {
          created_at?: string
          id?: string
          student_id?: string
          teacher_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_teachers_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_teachers_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teacher_upvote_stats"
            referencedColumns: ["teacher_id"]
          },
          {
            foreignKeyName: "student_teachers_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers_list"
            referencedColumns: ["id"]
          },
        ]
      }
      subjects: {
        Row: {
          created_at: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      teacher_applications: {
        Row: {
          class_size: string | null
          classes_taught_for_backend: string
          created_at: string
          description: string | null
          email: string
          featured_subject: string | null
          hero_image_url: string | null
          id: string
          location_v2: string | null
          max_fees: number | null
          min_fees: number | null
          mode_of_teaching: string | null
          mou_consent: boolean
          mou_consent_timestamp: string | null
          name: string
          phone_number: string
          qualifications_etc: string | null
          reference_name: string | null
          reference_number: string | null
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          school_boards_catered: string | null
          sir_maam: string
          status: string
          students_home_areas: string | null
          subjects: string
          texted_status: string
          tutors_home_areas: string | null
          updated_at: string
          whatsapp_link: string | null
          years_started_teaching: string | null
        }
        Insert: {
          class_size?: string | null
          classes_taught_for_backend: string
          created_at?: string
          description?: string | null
          email: string
          featured_subject?: string | null
          hero_image_url?: string | null
          id?: string
          location_v2?: string | null
          max_fees?: number | null
          min_fees?: number | null
          mode_of_teaching?: string | null
          mou_consent?: boolean
          mou_consent_timestamp?: string | null
          name: string
          phone_number: string
          qualifications_etc?: string | null
          reference_name?: string | null
          reference_number?: string | null
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          school_boards_catered?: string | null
          sir_maam: string
          status?: string
          students_home_areas?: string | null
          subjects: string
          texted_status?: string
          tutors_home_areas?: string | null
          updated_at?: string
          whatsapp_link?: string | null
          years_started_teaching?: string | null
        }
        Update: {
          class_size?: string | null
          classes_taught_for_backend?: string
          created_at?: string
          description?: string | null
          email?: string
          featured_subject?: string | null
          hero_image_url?: string | null
          id?: string
          location_v2?: string | null
          max_fees?: number | null
          min_fees?: number | null
          mode_of_teaching?: string | null
          mou_consent?: boolean
          mou_consent_timestamp?: string | null
          name?: string
          phone_number?: string
          qualifications_etc?: string | null
          reference_name?: string | null
          reference_number?: string | null
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          school_boards_catered?: string | null
          sir_maam?: string
          status?: string
          students_home_areas?: string | null
          subjects?: string
          texted_status?: string
          tutors_home_areas?: string | null
          updated_at?: string
          whatsapp_link?: string | null
          years_started_teaching?: string | null
        }
        Relationships: []
      }
      teacher_comments: {
        Row: {
          approved: boolean
          approved_at: string | null
          approved_by: string | null
          comment: string
          created_at: string
          id: string
          is_anonymous: boolean
          rating: number | null
          teacher_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          approved?: boolean
          approved_at?: string | null
          approved_by?: string | null
          comment: string
          created_at?: string
          id?: string
          is_anonymous?: boolean
          rating?: number | null
          teacher_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          approved?: boolean
          approved_at?: string | null
          approved_by?: string | null
          comment?: string
          created_at?: string
          id?: string
          is_anonymous?: boolean
          rating?: number | null
          teacher_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      teacher_recommendations: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string
          id: string
          notes: string | null
          recommender_contact: string
          recommender_name: string
          status: string | null
          teacher_contact: string
          teacher_name: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          recommender_contact: string
          recommender_name: string
          status?: string | null
          teacher_contact: string
          teacher_name: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          recommender_contact?: string
          recommender_name?: string
          status?: string | null
          teacher_contact?: string
          teacher_name?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      teacher_upvotes: {
        Row: {
          created_at: string
          id: string
          teacher_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          teacher_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          teacher_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "teacher_upvotes_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teacher_upvote_stats"
            referencedColumns: ["teacher_id"]
          },
          {
            foreignKeyName: "teacher_upvotes_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers_list"
            referencedColumns: ["id"]
          },
        ]
      }
      teachers_list: {
        Row: {
          bio: string | null
          classes: string | null
          created_at: string | null
          honorific: string | null
          id: string
          image_url: string | null
          is_featured: boolean | null
          is_verified: boolean | null
          location: string | null
          name: string
          "Sir/Ma'am?": string | null
          slug: string
          subject_id: string | null
          subjects: string | null
          whatsapp_number: string | null
        }
        Insert: {
          bio?: string | null
          classes?: string | null
          created_at?: string | null
          honorific?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          is_verified?: boolean | null
          location?: string | null
          name: string
          "Sir/Ma'am?"?: string | null
          slug: string
          subject_id?: string | null
          subjects?: string | null
          whatsapp_number?: string | null
        }
        Update: {
          bio?: string | null
          classes?: string | null
          created_at?: string | null
          honorific?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          is_verified?: boolean | null
          location?: string | null
          name?: string
          "Sir/Ma'am?"?: string | null
          slug?: string
          subject_id?: string | null
          subjects?: string | null
          whatsapp_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "teachers_list_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      paper_read_stats: {
        Row: {
          class: string | null
          paper_id: string | null
          read_count: number | null
          school: string | null
          subject: string | null
          title: string | null
        }
        Relationships: []
      }
      teacher_comments_public: {
        Row: {
          approved: boolean | null
          comment: string | null
          created_at: string | null
          id: string | null
          is_anonymous: boolean | null
          rating: number | null
          teacher_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Relationships: []
      }
      teacher_rating_stats: {
        Row: {
          average_rating: number | null
          rating_count: number | null
          teacher_id: string | null
          teacher_slug: string | null
        }
        Relationships: []
      }
      public_profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          grade: string | null
          id: string | null
          role: string | null
          school_college: string | null
        }
        Relationships: []
      }
      teacher_upvote_stats: {
        Row: {
          teacher_id: string | null
          teacher_name: string | null
          teacher_slug: string | null
          upvote_count: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      approve_teacher_application: {
        Args: { admin_id: string; application_id: string }
        Returns: number
      }
      assign_teacher_role_by_email: {
        Args: { user_email: string }
        Returns: boolean
      }
      check_existing_users_for_teacher_role: {
        Args: never
        Returns: {
          assigned_role: boolean
          teacher_email: string
          user_email: string
          user_id: string
        }[]
      }
      check_rate_limit: {
        Args: {
          p_function_name: string
          p_identifier: string
          p_max_attempts?: number
          p_window_minutes?: number
        }
        Returns: boolean
      }
      check_user_exists: { Args: { user_email: string }; Returns: boolean }
      check_user_has_password: {
        Args: { user_email: string }
        Returns: boolean
      }
      cleanup_rate_limit_log: { Args: never; Returns: undefined }
      combine_areas: {
        Args: { student_areas: string; tutor_areas: string }
        Returns: string
      }
      extract_phone_from_link: { Args: { link_text: string }; Returns: string }
      generate_unique_slug: { Args: { name_text: string }; Returns: string }
      get_public_profile_data: {
        Args: never
        Returns: {
          avatar_url: string
          full_name: string
          grade: string
          id: string
          role: string
          school_college: string
        }[]
      }
      get_teacher_email: { Args: never; Returns: string }
      get_teacher_upvote_count: {
        Args: { teacher_uuid: string }
        Returns: number
      }
      is_admin: { Args: never; Returns: boolean }
      is_teacher: { Args: never; Returns: boolean }
      normalize_phone_to_10_digits: {
        Args: { phone_text: string }
        Returns: string
      }
      sync_teachers_list_from_shikshaqmine: {
        Args: never
        Returns: {
          inserted_count: number
          total_processed: number
          updated_count: number
        }[]
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
