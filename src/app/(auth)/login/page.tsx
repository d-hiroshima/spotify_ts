'use client'

import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'

export default function LoginPage() {
  const searchParams = useSearchParams()
  const from = searchParams.get('from') || '/dashboard'

  const handleLogin = () => {
    signIn('spotify', { callbackUrl: from })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Spotify Music Stats
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            あなたの音楽統計を見てみましょう
          </p>
        </div>
        <div>
          <button
            onClick={handleLogin}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Spotifyでログイン
          </button>
        </div>
      </div>
    </div>
  )
}