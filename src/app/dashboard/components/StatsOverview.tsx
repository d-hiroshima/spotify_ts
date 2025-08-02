'use client'

import { useState, useEffect } from 'react'

interface Stats {
  totalTracks: number
  totalDuration: number
  uniqueArtists: number
  uniqueAlbums: number
}

export function StatsOverview() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: API実装後に実際のデータを取得
    setTimeout(() => {
      setStats({
        totalTracks: 0,
        totalDuration: 0,
        uniqueArtists: 0,
        uniqueAlbums: 0,
      })
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return <div className="bg-white rounded-lg shadow p-6">読み込み中...</div>
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium mb-4">統計概要</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold">{stats?.totalTracks || 0}</p>
          <p className="text-sm text-gray-600">再生曲数</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold">
            {Math.floor((stats?.totalDuration || 0) / 60)}分
          </p>
          <p className="text-sm text-gray-600">総再生時間</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold">{stats?.uniqueArtists || 0}</p>
          <p className="text-sm text-gray-600">アーティスト数</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold">{stats?.uniqueAlbums || 0}</p>
          <p className="text-sm text-gray-600">アルバム数</p>
        </div>
      </div>
    </div>
  )
}