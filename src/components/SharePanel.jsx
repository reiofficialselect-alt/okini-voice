import { useState } from 'react'
import { catColor } from '../lib/helpers'
import { supabase } from '../lib/supabase'

const BASE_URL = typeof window !== 'undefined' ? window.location.origin : 'https://okini-voice.vercel.app'

export default function SharePanel({ review }) {
  const [status, setStatus] = useState(null)

  if (!review) return null

  async function getTrackingUrl() {
    try {
      const shortId = Math.random().toString(36).slice(2, 8)
      await supabase.from('short_urls').insert([{ id: shortId, review_id: review.id }])
      return BASE_URL + '/api/s?id=' + shortId
    } catch {
      return BASE_URL + '/review/' + review.id
    }
  }

  async function handleShare() {
    setStatus('preparing')
    try {
      const trackUrl = await getTrackingUrl()
      const ogUrl = BASE_URL + '/api/og?id=' + review.id
      const caption = 'OKINI蒲田のリアルな声\uD83C\uDF38 #OKINI蒲田 #高収入バイト\n' + trackUrl

      if (navigator.share && navigator.canShare) {
        try {
          const res = await fetch(ogUrl)
          const blob = await res.blob()
          const file = new File([blob], 'okini-voice.png', { type: 'image/png' })
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({ text: caption, files: [file] })
            setStatus('shared')
            return
          }
        } catch {}
        try {
          await navigator.share({ text: caption })
          setStatus('shared')
          return
        } catch {}
      }

      const twitterUrl = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(caption)
      location.href = twitterUrl
      setStatus('shared')
    } catch {
      setStatus('error')
    }
  }

  async function handleCopy() {
    const trackUrl = await getTrackingUrl()
    const caption = 'OKINI蒲田のリアルな声\uD83C\uDF38 #OKINI蒲田 #高収入バイト\n' + trackUrl
    try {
      await navigator.clipboard.writeText(caption)
      setStatus('copied')
      setTimeout(function() { setStatus(null) }, 2000)
    } catch {}
  }

  function handleSaveImage() {
    const ogUrl = BASE_URL + '/api/og?id=' + review.id + '&format=story'
    window.open(ogUrl, '_blank')
  }

  return (
    <div style={{ marginTop: 16 }}>
      <p style={{ fontSize: '0.78rem', color: 'var(--td)', textAlign: 'center', marginBottom: 12 }}>シェアしてポイントGET</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <button onClick={handleShare} disabled={status === 'preparing'} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: 'linear-gradient(135deg, var(--pink-hot), var(--purple))', color: '#fff', fontSize: '1rem', fontWeight: 700, padding: '16px 24px', borderRadius: 50, border: 'none', cursor: 'pointer', fontFamily: 'var(--f)', width: '100%' }}>
          {status === 'preparing' ? '準備中...' : status === 'shared' ? ' シェアしました！' : 'シェアする '}
        </button>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={handleSaveImage} style={subBtn}>画像を保存</button>
          <button onClick={handleCopy} style={subBtn}>{status === 'copied' ? ' コピー済' : 'リンクをコピー'}</button>
        </div>
      </div>

      <div style={{ marginTop: 14, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--bdr)', borderRadius: 12, overflow: 'hidden' }}>
        <img src={BASE_URL + '/api/og?id=' + review.id} alt="シェアカード" style={{ width: '100%', display: 'block', borderRadius: '12px 12px 0 0' }} />
        <div style={{ padding: '10px 14px', fontSize: '0.75rem', color: 'var(--tm)' }}> シェア時にこのカードが表示されます</div>
      </div>
    </div>
  )
}

const subBtn = {
  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
  background: 'rgba(255,255,255,0.06)', color: 'var(--td)', fontSize: '0.78rem',
  padding: '10px 12px', borderRadius: 10, border: '1px solid var(--bdr)',
  cursor: 'pointer', fontFamily: 'var(--f)',
}