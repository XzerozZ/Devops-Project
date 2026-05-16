'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

export default function BlogListPage() {
  const [blogs, setBlogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const { data: session } = useSession()

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true)
      try {
        const url = search ? `/api/blogs?search=${encodeURIComponent(search)}` : '/api/blogs'
        const res = await fetch(url)
        const data = await res.json()
        
        if (Array.isArray(data)) {
          setBlogs(data)
        } else {
          setError(data.message || 'Failed to fetch blogs')
        }
      } catch (error) {
        console.error('Failed to fetch blogs', error)
        setError('Something went wrong while fetching blogs')
      } finally {
        setLoading(false)
      }
    }

    const timer = setTimeout(() => {
      fetchBlogs()
    }, 300)

    return () => clearTimeout(timer)
  }, [search])

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">All Blogs</h1>
        <div className="space-x-4">
          {session ? (
            <>
              <Link href="/blogs/create" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500">
                Create Blog
              </Link>
              <Link href="/profile" className="text-gray-600 hover:text-gray-900">
                Profile
              </Link>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-indigo-600 hover:underline">
                Login
              </Link>
              <Link href="/auth/register" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500">
                Register
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="mb-8">
        <input
          type="text"
          placeholder="Search blogs by title..."
          className="w-full border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="space-y-6">
        {loading && <p className="text-center text-gray-500 py-10">Searching...</p>}
        {!loading && error && (
          <p className="text-center text-red-600 border border-red-200 bg-red-50 p-4 rounded-md">
            {error}
          </p>
        )}

        {!loading && !error && blogs.length === 0 && (
          <p className="text-center text-gray-500">No blogs found.</p>
        )}

        {!loading && !error && blogs.length > 0 && blogs.map((blog: any) => (
          <div key={blog.id} className="border p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-2xl font-semibold mb-2">{blog.title}</h2>
            <p className="text-gray-600 mb-4">{blog.content.substring(0, 150)}...</p>
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>By {blog.author?.name || 'Anonymous'}</span>
              <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
