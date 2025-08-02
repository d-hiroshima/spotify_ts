'use client'

import { useState, useEffect } from 'react'

interface Artist {
  id: string
  name: string
  playCount: number
  imageUrl?: string
}

export function TopArtists() {
  const [artists, setArtists] = useState<Artist[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: API実装後に実際のデータを取得
    setTimeout(() => {
      setArtists([])
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return <div className="bg-white rounded-lg shadow p-6">読み込み中...</div>
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium mb-4">トップアーティスト</h3>
      {artists.length === 0 ? (
        <p className="text-gray-500">データがありません</p>
      ) : (
        <ul className="space-y-3">
          {artists.map((artist, index) => (
            <li key={artist.id} className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-900">
                {index + 1}.
              </span>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {artist.name}
                </p>
                <p className="text-sm text-gray-500">
                  {artist.playCount}回再生
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}