/// <reference types="astro/client" />
import type { Session } from '@supabase/supabase-js'

declare namespace App {
  interface Locals {
    session: Session | null
  }
}

declare namespace Astro {
  interface AstroGlobal {
    locals: App.Locals
  }
}

interface ImportMetaEnv {
  readonly PUBLIC_SUPABASE_URL: string
  readonly PUBLIC_SUPABASE_ANON_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
