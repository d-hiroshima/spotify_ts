'use client'

import { useState, useEffect } from 'react'

interface Pattern {
  hour: number
  count: number
}

export function ListeningPatterns() {
  const [patterns, setPatterns] = useState<Pattern[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: API実装後に実際のデータを取得
    setTimeout(() => {
      setPatterns([])
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return <div className="bg-white rounded-lg shadow p-6">読み込み中...</div>
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium mb-4">視聴パターン</h3>
      {patterns.length === 0 ? (
        <p className="text-gray-500">データがありません</p>
      ) : (
        <div className="space-y-2">
          <p className="text-sm text-gray-600">時間帯別再生回数</p>
          {/* TODO: チャートコンポーネントを実装 */}
        </div>
      )}
    </div>
  )
}