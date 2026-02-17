'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Props {
  userId: string
}

export default function BookmarkForm({ userId }: Props) {
  const supabase = createClient()

  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const tempId = crypto.randomUUID()

    // 🔥 Optimistic insert
    const optimisticBookmark = {
      id: tempId,
      title,
      url,
      user_id: userId,
      created_at: new Date().toISOString(),
    }

    // Emit custom event to update list instantly
    window.dispatchEvent(
      new CustomEvent('bookmark-added', { detail: optimisticBookmark })
    )

    const { error } = await supabase.from('bookmarks').insert([
      {
        title,
        url,
        user_id: userId,
      },
    ])

    if (error) {
      alert(error.message)
    }

    setTitle('')
    setUrl('')
    setLoading(false)
  }

  return (
 <form onSubmit={handleSubmit} className="space-y-4">
  <input
    type="text"
    placeholder="Bookmark title"
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    required
    className="input-modern"
  />

  <input
    type="url"
    placeholder="https://example.com"
    value={url}
    onChange={(e) => setUrl(e.target.value)}
    required
    className="input-modern"
  />

  <button
    type="submit"
    disabled={loading}
    className="primary-btn w-full disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {loading ? 'Adding...' : 'Add Bookmark'}
  </button>
</form>

  )
}
