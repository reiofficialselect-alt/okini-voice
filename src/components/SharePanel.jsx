import { useState } from 'react'

const BASE_URL = typeof window !== 'undefined' ? window.location.origin : 'https://okini-voice.vercel.app'

export default function SharePanel({ review }) {
  const [status, setStatus] = useState(null)

  if (!review) return null

  var shareUrl = BASE_URL + '/api/og?id=' + review.id + '&mode=html'

  async function handleShare() {
    setStatus('preparing')
    try {
      var text = 'OKINI Tokyo\u306e\u30ea\u30a2\u30eb\u306a\u58f0\ud83c\udf38\n' + shareUrl

      if (navigator.share) {
        await navigator.share({ text: text })
        setStatus('shared')
        setTimeout(function(){ setStatus(null) }, 2000)
        return
      }

      await navigator.clipboard.writeText(text)
      setStatus('copied')
      setTimeout(function(){ setStatus(null) }, 2000)
    } catch (err) {
      if (err.name === 'AbortError') { setStatus(null); return }
      try {
        await navigator.clipboard.writeText(shareUrl)
        setStatus('copied')
        setTimeout(function(){ setStatus(null) }, 2000)
      } catch { setStatus(null) }
    }
  }

  return (
    <div style={{ marginTop: 16 }}>
      <p style={{ fontSize: '0.78rem', color: 'var(--td)', textAlign: 'center', marginBottom: 12 }}>{'\u30b7\u30a7\u30a2\u3057\u3066\u30dd\u30a4\u30f3\u30c8GET'}</p>

      <button onClick={handleShare} disabled={status === 'preparing'} style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        background: 'linear-gradient(135deg, var(--pink-hot, #E8457C), var(--purple, #9B6DD7))',
        color: '#fff', fontSize: '1rem', fontWeight: 700,
        padding: '16px 24px', borderRadius: 50, border: 'none',
        cursor: status === 'preparing' ? 'wait' : 'pointer',
        fontFamily: 'var(--f)', width: '100%',
        opacity: status === 'preparing' ? 0.7 : 1,
        transition: 'all 0.2s'
      }}>
        {status === 'preparing' ? '\u6e96\u5099\u4e2d...' : status === 'shared' ? '\u2713 \u30b7\u30a7\u30a2\u3057\u307e\u3057\u305f\uff01' : status === 'copied' ? '\u2713 \u30b3\u30d4\u30fc\u3057\u307e\u3057\u305f\uff01' : '\u30b7\u30a7\u30a2\u3059\u308b \u2197'}
      </button>

      <div style={{ marginTop: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--bdr)', borderRadius: 12, overflow: 'hidden' }}>
        <img src={BASE_URL + '/api/og?id=' + review.id} alt="share card" style={{ width: '100%', display: 'block', borderRadius: '12px 12px 0 0' }} />
        <div style={{ padding: '10px 14px', fontSize: '0.72rem', color: 'var(--tm)' }}>{'\u2191 URL\u3092\u8cbc\u308b\u3068\u3053\u306e\u30ab\u30fc\u30c9\u304c\u81ea\u52d5\u8868\u793a\u3055\u308c\u307e\u3059'}</div>
      </div>
    </div>
  )
}