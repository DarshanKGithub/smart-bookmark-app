'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Bookmark {
  id: string
  title: string
  url: string
  user_id: string
  created_at: string
}

interface Props {
  initialBookmarks: Bookmark[]
  userId: string
}

export default function BookmarkList({ initialBookmarks, userId }: Props) {
  const supabase = createClient()
  const [bookmarks, setBookmarks] = useState(initialBookmarks)

  useEffect(() => {
    const channel = supabase
      .channel(`bookmarks-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookmarks',
          filter: `user_id=eq.${userId}`, // 🔥 Optimized filter
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setBookmarks((prev) => {
              // prevent duplicates
              if (prev.find((b) => b.id === payload.new.id)) return prev
              return [payload.new as Bookmark, ...prev]
            })
          }

          if (payload.eventType === 'DELETE') {
            setBookmarks((prev) =>
              prev.filter((b) => b.id !== payload.old.id)
            )
          }

          if (payload.eventType === 'UPDATE') {
            setBookmarks((prev) =>
              prev.map((b) =>
                b.id === payload.new.id ? (payload.new as Bookmark) : b
              )
            )
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId])

  useEffect(() => {
  const handler = (event: any) => {
    const newBookmark = event.detail
    setBookmarks((prev) => [newBookmark, ...prev])
  }

  window.addEventListener('bookmark-added', handler)

  return () => {
    window.removeEventListener('bookmark-added', handler)
  }
}, [])


 const handleDelete = async (id: string) => {
  // 🔥 Optimistic remove
  setBookmarks((prev) => prev.filter((b) => b.id !== id))

  const { error } = await supabase
    .from('bookmarks')
    .delete()
    .eq('id', id)

  if (error) {
    alert(error.message)
  }
}


  if (bookmarks.length === 0) {
    return <p className="text-gray-500">No bookmarks yet.</p>
  }

  return (
    <ul className="space-y-4">
  {bookmarks.map((bookmark) => (
    <li
      key={bookmark.id}
      className="group bg-white p-4 rounded-xl shadow-md border border-slate-100 transition hover:shadow-lg hover:-translate-y-1"
    >
      <div className="flex justify-between items-start">
        <div>
          <a
            href={bookmark.url}
            target="_blank"
            className="font-semibold text-lg text-black hover:underline"
          >
            {bookmark.title}
          </a>
          <p className="text-sm text-slate-500 truncate max-w-sm">
            {bookmark.url}
          </p>
        </div>

        <button
          onClick={() => handleDelete(bookmark.id)}
          className="opacity-0 group-hover:opacity-100 text-red-500 text-sm transition"
        >
          Delete
        </button>
      </div>
    </li>
  ))}
  {bookmarks.length === 0 && (
  <div className="text-center py-10 text-slate-400">
    No bookmarks yet. Add your first one 🚀
  </div>
)}

</ul>

  )
  
}
