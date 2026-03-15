import { useState } from 'react'
import { SHARE_TEMPLATE } from '../data/templates'
import { catColor } from '../lib/helpers'
import { supabase } from '../lib/supabase'

const BASE_URL = typeof window !== 'undefined' ? window.location.origin : 'https://okini-voice.vercel.app'

export default function SharePanel({ review }) {
  const [copied, setCopied] = useState(false)
  const [sharing, setSharing] = useState(false)

  if (!review) return null

  const reviewUrl = `${BASE_URL}/review/${review.id}`

  async function getTrackingUrl() {
    try {
      const shortId = Math.random().toString(36).slice(2, 8)
      await supabase.from('short_urls').insert([{ id: shortId, review_id: review.id }])
      return `${BASE_URL}/api/s?id=${shortId}`
    } catch {
      return reviewUrl
    }
  }

  async function handleXShare() {
    setSharing(true)
    const trackUrl = await getTrackingUrl()
    const shareText = SHARE_TEMPLATE(review)
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(trackUrl)}`
    window.open(twitterUrl, '_blank')
    setSharing(false)
  }

  function handleDownloadCard(format) {
    const ogUrl = `${BASE_URL}/api/og?id=${review.id}&format=${format}`
    window.open(ogUrl, '_blank')
  }

  async function handleCopy() {
    const trackUrl = await getTrackingUrl()
    const shareText = SHARE_TEMPLATE(review)
    try {
      await navigator.clipboard.writeText(shareText + '\n' + trackUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  return (
    <div style={{ marginTop: 16 }}>
      <p style={{ fontSize: '0.78rem', color: 'var(--td)', textAlign: 'center', marginBottom: 12 }}>シェアしてポイントGET </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <button onClick={handleXShare} disabled={sharing} style={shareBtn('#1DA1F2')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          {sharing ? 'シェア準備中...' : 'Xでシェアする'}
        </button>
        <button onClick={() => handleDownloadCard('og')} style={shareBtn('#E8B4B8')}>
           OGPカード画像を見る
        </button>
        <button onClick={() => handleDownloadCard('story')} style={shareBtn('#E4405F')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
          Instagram Stories用画像
        </button>
        <button onClick={handleCopy} style={shareBtn('rgba(255,255,255,0.1)')}>
          {copied ? ' コピーしました！' : 'テキスト+リンクをコピー'}
        </button>
      </div>
      <div style={{ marginTop: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--bdr)', borderRadius: 12, padding: 14, borderLeft: '3px solid ' + catColor(review.category) }}>
        <div style={{ fontSize: '0.68rem', color: 'var(--tm)', marginBottom: 4 }}>シェアプレビュー</div>
        <p style={{ fontSize: '0.78rem', color: 'var(--td)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{SHARE_TEMPLATE(review)}</p>
      </div>
    </div>
  )
}

const shareBtn = (bg) => ({
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
  background: bg, color: '#fff', fontSize: '0.85rem', fontWeight: 600,
  padding: '12px 20px', borderRadius: 12, border: 'none', cursor: 'pointer',
  fontFamily: 'var(--f)', transition: 'all 0.2s', width: '100%',
})