'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ProfilePage() {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name)
    }
  }, [session])

  if (status === 'loading') return <div className="text-center mt-10">Loading...</div>
  if (status === 'unauthenticated') {
    router.push('/auth/login')
    return null
  }

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setIsUpdating(true)

    try {
      const userId = (session?.user as any).id
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })

      if (res.ok) {
        setSuccess('Profile updated successfully')
        // Update local session
        await update({ name })
        router.refresh()
      } else {
        const data = await res.json()
        setError(data.message || 'Failed to update profile')
      }
    } catch (err) {
      setError('Something went wrong')
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">User Profile</h1>
      
      <div className="bg-white shadow rounded-lg p-6 space-y-6 border">
        <div>
          <label className="block text-sm font-medium text-gray-500">Email Address</label>
          <p className="mt-1 text-lg font-medium text-gray-900">{session?.user?.email}</p>
        </div>

        <form onSubmit={handleUpdateName} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Display Name</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}

          <button
            type="submit"
            disabled={isUpdating}
            className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500 disabled:bg-indigo-300"
          >
            {isUpdating ? 'Updating...' : 'Update Name'}
          </button>
        </form>

        <hr />

        <div className="space-y-3">
          <Link
            href="/profile/change-password"
            className="block w-full text-center bg-gray-100 text-gray-800 px-4 py-2 rounded-md border border-gray-200 hover:bg-gray-200"
          >
            Change Password
          </Link>
          
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full bg-red-50 text-red-600 px-4 py-2 rounded-md border border-red-200 hover:bg-red-100"
          >
            Log Out
          </button>
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <button onClick={() => router.push('/')} className="text-indigo-600 hover:underline">
          Back to Blogs
        </button>
      </div>
    </div>
  )
}
