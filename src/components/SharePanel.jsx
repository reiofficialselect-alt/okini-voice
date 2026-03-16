import { useState, useRef, useCallback } from 'react'
import { toPng } from 'html-to-image'
import { supabase } from '../lib/supabase'
import { OGShareCard, StoriesShareCard } from './ShareCard'

const BASE_URL = typeof window !== 'undefined' ? window.location.origin : 'https://okini-voice.vercel.app'
const isMobile = typeof navigator !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

export default function SharePanel({ review, reviewIndex = 0 }) {
  const [status, setStatus] = useState(null)
  const ogRef = useRef(null)
  const storiesRef = useRef(null)

  if (!review) return null

  async function getTrackingUrl() {
    try {
      const shortId = Math.random().toString(36).slice(2, 8)
      await supabase.from('short_urls').insert([{ id: shortId, review_id: review.id }])
      return BASE_URL + '/api/s?id=' + shortId
    } catch { return BASE_URL + '/review/' + review.id }
  }

  async function genImg(type) {
    const node = type === 'stories' ? storiesRef.current : ogRef.current
    if (!node) { console.error('Node not found:', type); return null }
    try {
      node.style.opacity = '1'
      node.style.position = 'fixed'
      node.style.left = '0'
      node.style.top = '0'
      node.style.zIndex = '-1'
      await new Promise(function(r){ setTimeout(r, 100) })
      await toPng(node, { quality: 0.95, pixelRatio: 1 })
      const dataUrl = await toPng(node, { quality: 0.95, pixelRatio: 1 })
      node.style.opacity = '0'
      node.style.position = 'fixed'
      node.style.left = '-9999px'
      const res = await fetch(dataUrl)
      return await res.blob()
    } catch (e) {
      console.error('Image gen error:', e)
      node.style.opacity = '0'
      node.style.left = '-9999px'
      return null
    }
  }

  function dlBlob(blob, name) {
    const u = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = u; a.download = name
    document.body.appendChild(a); a.click()
    document.body.removeChild(a)
    setTimeout(function(){ URL.revokeObjectURL(u) }, 1000)
  }

  async function shareX() {
    var trackUrl = await getTrackingUrl()
    var cap = 'OKINI Tokyo\u306e\u30ea\u30a2\u30eb\u306a\u58f0\ud83c\udf38 #OKINI\u6771\u4eac #\u9ad8\u53ce\u5165\u30d0\u30a4\u30c8\n' + trackUrl
    if (isMobile) {
      setStatus('preparing')
      var blob = await genImg('og')
      if (blob) {
        var file = new File([blob], 'okini.png', { type: 'image/png' })
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
          try { await navigator.share({ text: cap, files: [file] }); setStatus(null); return } catch {}
        }
        dlBlob(blob, 'okini-voice.png')
      }
      setStatus(null)
    }
    window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(cap), '_blank')
  }

  async function shareLINE() {
    var trackUrl = await getTrackingUrl()
    var shareUrl = BASE_URL + '/review/' + review.id
    if (isMobile) {
      setStatus('preparing')
      var blob = await genImg('og')
      if (blob) {
        var file = new File([blob], 'okini.png', { type: 'image/png' })
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
          try { await navigator.share({ text: 'OKINI Tokyo\u306e\u30ea\u30a2\u30eb\u306a\u58f0\ud83c\udf38\n' + trackUrl, files: [file] }); setStatus(null); return } catch {}
        }
      }
      setStatus(null)
    }
    window.open('https://social-plugins.line.me/lineit/share?url=' + encodeURIComponent(shareUrl), '_blank')
  }

  async function shareInsta() {
    setStatus('preparing')
    var blob = await genImg('stories')
    if (!blob) { setStatus('error'); setTimeout(function(){ setStatus(null) }, 2000); return }
    dlBlob(blob, 'okini-voice-story.png')
    setStatus('ig')
    setTimeout(function () { setStatus(null) }, 5000)
  }

  async function shareOther() {
    var trackUrl = await getTrackingUrl()
    var cap = 'OKINI Tokyo\u306e\u30ea\u30a2\u30eb\u306a\u58f0\ud83c\udf38 #OKINI\u6771\u4eac\n' + trackUrl
    if (isMobile) {
      setStatus('preparing')
      var blob = await genImg('og')
      if (blob && navigator.share && navigator.canShare) {
        var file = new File([blob], 'okini.png', { type: 'image/png' })
        if (navigator.canShare({ files: [file] })) {
          try { await navigator.share({ text: cap, files: [file] }); setStatus(null); return } catch {}
        }
      }
      if (navigator.share) {
        try { await navigator.share({ text: cap }); setStatus(null); return } catch {}
      }
      setStatus(null)
    } else {
      try {
        await navigator.clipboard.writeText(cap)
        setStatus('copied')
        setTimeout(function(){ setStatus(null) }, 2000)
      } catch {
        window.prompt('\u30b3\u30d4\u30fc\u3057\u3066\u304f\u3060\u3055\u3044:', cap)
      }
    }
  }

  return (
    <div style={{ marginTop: 16 }}>
      <p style={{ fontSize: '0.78rem', color: 'var(--td)', textAlign: 'center', marginBottom: 14 }}>{'\u30b7\u30a7\u30a2\u3057\u3066\u30dd\u30a4\u30f3\u30c8GET'}</p>

      {status === 'preparing' && (
        <div style={{ textAlign: 'center', padding: '12px 0', marginBottom: 10 }}>
          <div style={{ display: 'inline-block', width: 20, height: 20, border: '2px solid var(--pink)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
          <div style={{ fontSize: '0.72rem', color: 'var(--td)', marginTop: 6 }}>{'\u30ab\u30fc\u30c9\u3092\u751f\u6210\u4e2d...'}</div>
          <style>{'@keyframes spin { to { transform: rotate(360deg) } }'}</style>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 12 }}>
        <SnsBtn onClick={shareX} color="#000" label="X" icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>} disabled={status === 'preparing'} />
        <SnsBtn onClick={shareInsta} color="linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)" label="Insta" icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>} disabled={status === 'preparing'} />
        <SnsBtn onClick={shareLINE} color="#06C755" label="LINE" icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/></svg>} disabled={status === 'preparing'} />
        <SnsBtn onClick={shareOther} color="rgba(255,255,255,0.1)" label={status === 'copied' ? '\u2713' : '\u305d\u306e\u4ed6'} icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{color:'var(--td)'}}><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/></svg>} disabled={status === 'preparing'} />
      </div>

      {status === 'ig' && (
        <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--green, #6BCF9F)', marginBottom: 8, padding: '10px 12px', background: 'rgba(107,207,159,0.08)', border: '1px solid rgba(107,207,159,0.15)', borderRadius: 10 }}>
          {'\u2713 \u753b\u50cf\u4fdd\u5b58\u6e08\u307f\uff01Instagram\u3092\u958b\u3044\u3066\u30b9\u30c8\u30fc\u30ea\u30fc\u306b\u8cbc\u308a\u4ed8\u3051\u3066\u304f\u3060\u3055\u3044'}
        </div>
      )}
      {status === 'error' && (
        <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--red, #E87070)', marginBottom: 8 }}>{'\u30a8\u30e9\u30fc\u304c\u767a\u751f\u3057\u307e\u3057\u305f'}</div>
      )}

      <div style={{ opacity: 0, position: 'fixed', left: -9999, top: 0, pointerEvents: 'none', zIndex: -1 }}>
        <OGShareCard ref={ogRef} review={review} reviewIndex={reviewIndex} />
        <StoriesShareCard ref={storiesRef} review={review} reviewIndex={reviewIndex} />
      </div>
    </div>
  )
}

function SnsBtn({ onClick, color, label, icon, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '14px 4px', borderRadius: 14, border: '1px solid var(--bdr)', background: 'rgba(255,255,255,0.03)', cursor: disabled ? 'wait' : 'pointer', fontFamily: 'var(--f)', opacity: disabled ? 0.5 : 1, transition: 'all 0.2s' }}>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
      <span style={{ fontSize: '0.65rem', color: 'var(--td)' }}>{label}</span>
    </button>
  )
}