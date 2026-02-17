'use client'

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

export default function LoginPage(){
    const supabase  = createClient();
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true)

      await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${location.origin}/auth/callback`
  }
})
        setLoading(false)
    }

    
  return (
    <div className="flex h-screen items-center justify-center">
      <button
        onClick={handleLogin}
        disabled={loading}
        className="rounded bg-black px-6 py-3 text-white hover:bg-gray-800"
      >
        {loading ? 'Redirecting...' : 'Sign in with Google'}
      </button>
    </div>
  )
}