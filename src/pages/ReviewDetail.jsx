import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchApprovedReviews } from '../lib/dataService'
import { catColor, highlightText } from '../lib/helpers'
import SharePanel from '../components/SharePanel'
import Layout from '../components/Layout'

export default function ReviewDetail() {
  const { id } = useParams()
  const nav = useNavigate()
  const [review, setReview] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchApprovedReviews().then(reviews => {
      const found = reviews.find(r => r.id === id)
      setReview(found || null)
      setLoading(false)
    })
  }, [id])

  if (loading) return <Layout><div style={{ textAlign: 'center', padding: 80, color: 'var(--td)' }}>読み込み中...</div></Layout>
  if (!review) return <Layout><div style={{ textAlign: 'center', padding: 80, color: 'var(--td)' }}>口コミが見つかりません</div></Layout>

  const stars = '★'.repeat(review.rating || 5) + '☆'.repeat(5 - (review.rating || 5))

  return (
    <Layout>
      <div style={{ maxWidth: 640, margin: '40px auto', padding: '0 20px' }}>

        {/* Card */}
        <div style={{
          background: 'var(--card)', border: '1px solid var(--bdr)', borderRadius: 24,
          padding: 28, backdropFilter: 'blur(8px)', position: 'relative', overflow: 'hidden',
          borderLeft: `4px solid ${catColor(review.category)}`,
        }}>
          {/* Top accent */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${catColor(review.category)}, transparent)` }} />

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
            <span style={{
              fontSize: '0.65rem', fontWeight: 700, padding: '4px 12px', borderRadius: 50,
              background: review.type === 'good' ? 'rgba(107,143,232,0.15)' : 'rgba(232,112,112,0.15)',
              color: review.type === 'good' ? 'var(--blue)' : 'var(--red)',
            }}>{review.type === 'good' ? '良い点' : '改善要望'}</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: catColor(review.category) }}>{review.category}</span>
            <span style={{ marginLeft: 'auto', color: 'var(--gold)', fontSize: '0.9rem', letterSpacing: 2 }}>{stars}</span>
          </div>

          {/* Quote mark */}
          <span style={{ fontFamily: 'var(--fd)', fontSize: '4rem', color: 'rgba(232,180,184,0.12)', lineHeight: 1, display: 'block', marginBottom: -20 }}>"</span>

          {/* Body */}
          <p style={{ fontSize: '0.95rem', color: 'var(--td)', lineHeight: 2, whiteSpace: 'pre-wrap' }}>
            {highlightText(review.body)}
          </p>

          {/* Tags */}
          {review.tags?.length > 0 && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 16 }}>
              {review.tags.map(t => (
                <span key={t} style={{ fontSize: '0.68rem', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--bdr)', borderRadius: 50, padding: '3px 10px', color: 'var(--tm)' }}>#{t}</span>
              ))}
            </div>
          )}

          {/* Meta */}
          <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--bdr)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--tm)' }}>{review.date || review.created_at?.slice(0, 7).replace('-', '.')}</span>
            <span style={{ fontSize: '0.72rem', color: 'var(--tm)' }}>OKINI Tokyo in 蒲田</span>
          </div>
        </div>

        {/* Share */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--bdr)', borderRadius: 20, padding: 24, marginTop: 16, backdropFilter: 'blur(8px)' }}>
          <SharePanel review={review} />
        </div>

        {/* Back */}
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <button onClick={() => nav('/')} style={{ fontSize: '0.85rem', color: 'var(--pink)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--f)', borderBottom: '1px solid rgba(232,180,184,0.3)', paddingBottom: 2 }}>
            ← 口コミ一覧に戻る
          </button>
        </div>
      </div>
    </Layout>
  )
}
