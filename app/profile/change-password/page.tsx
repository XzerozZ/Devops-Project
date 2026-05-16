'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function ChangePasswordPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)

  if (status === 'loading') return <div className="text-center mt-10">Loading...</div>
  if (status === 'unauthenticated') {
    router.push('/auth/login')
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match')
      return
    }

    setIsUpdating(true)

    try {
      const userId = (session?.user as any).id
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      if (res.ok) {
        setSuccess('Password changed successfully')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
        setTimeout(() => router.push('/profile'), 2000)
      } else {
        const data = await res.json()
        setError(data.message || 'Failed to change password')
      }
    } catch (err) {
      setError('Something went wrong')
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Change Password</h1>
      
      <div className="bg-white shadow rounded-lg p-6 space-y-6 border">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Current Password</label>
            <input
              type="password"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">New Password</label>
            <input
              type="password"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
            <input
              type="password"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-green-600">{success} Redirecting...</p>}

          <div className="flex flex-col space-y-3">
            <button
              type="submit"
              disabled={isUpdating}
              className="w-full bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 disabled:bg-gray-400"
            >
              {isUpdating ? 'Changing...' : 'Update Password'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="w-full bg-white text-gray-700 px-4 py-2 rounded-md border hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
