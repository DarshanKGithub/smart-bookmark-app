import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import BookmarkForm from '@/components/BookmarkForm'
import BookmarkList from '@/components/BookmarkList'

export default async function Home() {
  const supabase = createClient()

  const {
    data: { user },
  } = await (await supabase).auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: bookmarks } = await (await supabase)
    .from('bookmarks')
    .select('*')
    .order('created_at', { ascending: false })

return (
  <div className="flex items-center justify-center min-h-screen px-4">
    <div className="glass-card w-full max-w-2xl p-8">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            My Bookmarks
          </h1>
          <p className="text-slate-500 text-sm">
            Logged in as {user.email}
          </p>
        </div>

        <form action="/auth/signout" method="post">
          <button className="text-sm bg-slate-200 px-4 py-2 rounded-xl hover:bg-slate-300 transition">
            Logout
          </button>
        </form>
      </div>

      {/* Add Form */}
      <BookmarkForm userId={user.id} />

      {/* Divider */}
      <div className="my-8 border-t border-slate-200" />

      {/* Bookmark List */}
      <BookmarkList
        initialBookmarks={bookmarks || []}
        userId={user.id}
      />
    </div>
  </div>
)


}
