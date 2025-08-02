'use client'

import { useState, useEffect } from 'react'

interface Track {
  id: string
  name: string
  artistName: string
  playCount: number
  imageUrl?: string
}

export function TopTracks() {
  const [tracks, setTracks] = useState<Track[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: API実装後に実際のデータを取得
    setTimeout(() => {
      setTracks([])
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return <div className="bg-white rounded-lg shadow p-6">読み込み中...</div>
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium mb-4">トップトラック</h3>
      {tracks.length === 0 ? (
        <p className="text-gray-500">データがありません</p>
      ) : (
        <ul className="space-y-3">
          {tracks.map((track, index) => (
            <li key={track.id} className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-900">
                {index + 1}.
              </span>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {track.name}
                </p>
                <p className="text-sm text-gray-500">
                  {track.artistName} - {track.playCount}回再生
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}