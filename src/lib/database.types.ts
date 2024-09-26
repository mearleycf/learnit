export interface Database {
  public: {
    Tables: {
      courses: {
        Row: {
          id: string
          title: string
          description: string
          slug: string
          language: string
          level: string
          tags: string[]
          price: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          slug: string
          language: string
          level: string
          tags: string[]
          price: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          slug?: string
          language?: string
          level?: string
          tags?: string[]
          price?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      chapters: {
        Row: {
          id: string
          course_id: string
          title: string
          description: string
          order_number: number
          estimated_time: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          course_id: string
          title: string
          description: string
          order_number: number
          estimated_time: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          title?: string
          description?: string
          order_number?: number
          estimated_time?: string
          created_at?: string
          updated_at?: string
        }
      }
      exercises: {
        Row: {
          id: string
          chapter_id: string
          title: string
          description: string
          type: string
          difficulty: string
          estimated_time_minutes: number
          initial_code: string
          solution: string
          hints: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          chapter_id: string
          title: string
          description: string
          type: string
          difficulty: string
          estimated_time_minutes: number
          initial_code?: string
          solution: string
          hints?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          chapter_id?: string
          title?: string
          description?: string
          type?: string
          difficulty?: string
          estimated_time_minutes?: number
          initial_code?: string
          solution?: string
          hints?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      feedback: {
        Row: {
          id: string
          user_id: string
          content_id: string
          content_type: string
          title: string
          description: string
          rating: number
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          content_id: string
          content_type: string
          title: string
          description: string
          rating?: number
          status: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          content_id?: string
          content_type?: string
          title?: string
          description?: string
          rating?: number
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      notes: {
        Row: {
          id: string
          user_id: string
          content_id: string
          content_type: string
          title: string
          note_text: string
          highlighted_text: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          content_id: string
          content_type: string
          title: string
          note_text: string
          highlighted_text?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          content_id?: string
          content_type?: string
          title?: string
          note_text?: string
          highlighted_text?: string
          created_at?: string
          updated_at?: string
        }
      }
      user_exercise_progress: {
        Row: {
          id: string
          user_id: string
          exercise_id: string
          score: number
          completed: boolean
          attempts: number
          last_attempt_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          exercise_id: string
          score: number
          completed: boolean
          attempts: number
          last_attempt_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          exercise_id?: string
          score?: number
          completed?: boolean
          attempts?: number
          last_attempt_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      user_progress: {
        Row: {
          id: string
          user_id: string
          course_id: string
          progress: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          course_id: string
          progress: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string
          progress?: number
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          name: string
          email: string
          role: string
          enrolled_courses: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          role: string
          enrolled_courses: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          role?: string
          enrolled_courses?: string[]
          created_at?: string
          updated_at?: string
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
