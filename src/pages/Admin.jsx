import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { fetchAllReviews, updateReviewStatus, seedReviews } from '../lib/dataService'
import { catColor } from '../lib/helpers'
import Layout from '../components/Layout'

export default function Admin() {
  const { isAdmin } = useAuth()
  const nav = useNavigate()
  const [reviews, setReviews] = useState([])
  const [filter, setFilter] = useState('pending')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAdmin) { nav('/login'); return }
    load()
  }, [isAdmin])

  const load = async () => {
    setLoading(true)
    const data = await fetchAllReviews()
    setReviews(data)
    setLoading(false)
  }

  const handleStatus = async (id, status) => {
    await updateReviewStatus(id, status)
    setReviews(rs => rs.map(r => r.id === id ? { ...r, status, approved_at: status === 'approved' ? new Date().toISOString() : null } : r))
  }

  const handleSeed = async () => {
    if (!confirm('37件のシードデータを投入しますか？')) return
    try {
      const count = await seedReviews()
      alert(`${count}件投入しました`)
      load()
    } catch (e) { alert('エラー: ' + e.message) }
  }

  const filtered = reviews.filter(r => filter === 'all' || r.status === filter)
  const counts = {
    pending: reviews.filter(r => r.status === 'pending').length,
    approved: reviews.filter(r => r.status === 'approved').length,
    rejected: reviews.filter(r => r.status === 'rejected').length,
    all: reviews.length,
  }

  if (!isAdmin) return null

  return (
    <Layout>
      <div style={{ maxWidth: 800, margin: '40px auto', padding: '0 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h1 style={{ fontFamily: 'var(--fd)', fontSize: '1.5rem', fontStyle: 'italic' }}>Admin Panel</h1>
          <button onClick={handleSeed} style={{ ...chipBtn, background: 'rgba(107,207,160,0.12)', borderColor: 'rgba(107,207,160,0.3)', color: 'var(--green)' }}>
            シードデータ投入
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 20 }}>
          {[
            ['pending', '未承認', counts.pending, 'var(--gold)'],
            ['approved', '承認済み', counts.approved, 'var(--green)'],
            ['rejected', '却下', counts.rejected, 'var(--red)'],
            ['all', '全件', counts.all, 'var(--pink)'],
          ].map(([k, l, c, color]) => (
            <button key={k} onClick={() => setFilter(k)} style={{
              background: filter === k ? `${color}15` : 'var(--card)',
              border: `1px solid ${filter === k ? `${color}55` : 'var(--bdr)'}`,
              borderRadius: 12, padding: '14px 8px', textAlign: 'center', cursor: 'pointer',
            }}>
              <div style={{ fontFamily: 'var(--fd)', fontSize: '1.5rem', fontWeight: 700, color, lineHeight: 1 }}>{c}</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--td)', marginTop: 4 }}>{l}</div>
            </button>
          ))}
        </div>

        {/* Review list */}
        {loading ? (
          <p style={{ textAlign: 'center', color: 'var(--td)', padding: 40 }}>読み込み中...</p>
        ) : filtered.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--td)', padding: 40 }}>該当する口コミはありません</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map(r => (
              <div key={r.id} style={{ background: 'var(--card)', border: '1px solid var(--bdr)', borderRadius: 16, padding: 18, borderLeft: `3px solid ${catColor(r.category)}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.62rem', fontWeight: 700, padding: '3px 10px', borderRadius: 50, ...(r.type === 'good' ? { background: 'rgba(107,143,232,0.15)', color: 'var(--blue)' } : { background: 'rgba(232,112,112,0.15)', color: 'var(--red)' }) }}>
                    {r.type === 'good' ? '良い点' : '改善要望'}
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: catColor(r.category) }}>{r.category}</span>
                  <span style={{
                    fontSize: '0.62rem', padding: '2px 8px', borderRadius: 50, marginLeft: 'auto',
                    background: r.status === 'pending' ? 'rgba(232,213,168,0.15)' : r.status === 'approved' ? 'rgba(107,207,160,0.15)' : 'rgba(232,112,112,0.15)',
                    color: r.status === 'pending' ? 'var(--gold)' : r.status === 'approved' ? 'var(--green)' : 'var(--red)',
                  }}>{r.status}</span>
                  <span style={{ fontSize: '0.62rem', color: 'var(--tm)' }}>{r.date || r.created_at?.slice(0, 10)}</span>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--td)', lineHeight: 1.8, marginBottom: 10 }}>{r.body}</p>
                {r.tags?.length > 0 && (
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 10 }}>
                    {r.tags.map(t => <span key={t} style={{ fontSize: '0.62rem', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--bdr)', borderRadius: 50, padding: '2px 8px', color: 'var(--tm)' }}>{t}</span>)}
                  </div>
                )}
                {r.status === 'pending' && (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => handleStatus(r.id, 'approved')} style={{ ...actionBtn, background: 'rgba(107,207,160,0.15)', color: 'var(--green)', borderColor: 'rgba(107,207,160,0.3)' }}>承認する</button>
                    <button onClick={() => handleStatus(r.id, 'rejected')} style={{ ...actionBtn, background: 'rgba(232,112,112,0.1)', color: 'var(--red)', borderColor: 'rgba(232,112,112,0.2)' }}>却下</button>
                  </div>
                )}
                {r.status !== 'pending' && (
                  <button onClick={() => handleStatus(r.id, 'pending')} style={{ ...actionBtn, color: 'var(--td)' }}>pendingに戻す</button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}

const chipBtn = { padding: '8px 16px', borderRadius: 50, border: '1px solid var(--bdr)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 500, fontFamily: 'var(--f)', background: 'var(--card)' }
const actionBtn = { padding: '6px 16px', borderRadius: 50, border: '1px solid var(--bdr)', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 500, fontFamily: 'var(--f)', background: 'var(--card)' }
