import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchApprovedReviews } from '../lib/dataService'
import { catColor, highlightText } from '../lib/helpers'
import Layout from '../components/Layout'

const RADAR = [
  { label: '給与/報酬', value: 92 }, { label: '通勤環境', value: 86 },
  { label: '待機環境', value: 95 }, { label: '求人信用度', value: 90 },
  { label: '客質/客層', value: 90 }, { label: '人間関係', value: 96 },
]
const HIGHLIGHTS = [
  { text: 'ここ以外の在籍で働くなんて考えられないです', meta: '給与/報酬 — 2023.10' },
  { text: 'ほぼ紳士様。ここでよかった！', meta: '客質/客層 — 2022.07' },
  { text: '女の子ファーストで動いてくれる。人間関係で悩んだことは一度もありません', meta: '人間関係 — 2025.09' },
  { text: '嘘つくお店多い中、全部正直！本当におすすめ！', meta: '給与/報酬 — 2022.07' },
  { text: '蒲田なのに凄い！紳士な方が多く働きやすい', meta: '給与/報酬 — 2023.09' },
  { text: 'スタッフさんに嫌な人がいないのはかなり重要', meta: '人間関係 — 2023.05' },
]
const TIMELINE = [{ y: '2020', c: 3 }, { y: '2021', c: 2 }, { y: '2022', c: 3 }, { y: '2023', c: 10 }, { y: '2024', c: 4 }, { y: '2025', c: 15 }]
const SCORES = [
  { label: '人間関係', val: 96, g: 'linear-gradient(90deg,#C48B90,#E8B4B8)' },
  { label: '待機環境', val: 95, g: 'linear-gradient(90deg,#9B7FBF,#B89FDF)' },
  { label: '給与/報酬', val: 92, g: 'linear-gradient(90deg,#C48B90,#E8B4B8)' },
  { label: '客質/客層', val: 90, g: 'linear-gradient(90deg,#6B8FE8,#8FAEE8)' },
  { label: '求人信用度', val: 90, g: 'linear-gradient(90deg,#9B7FBF,#B89FDF)' },
  { label: '通勤環境', val: 86, g: 'linear-gradient(90deg,#6B8FE8,#8FAEE8)' },
]
const IMPROVEMENTS = [
  { cat: '送迎の運転について', date: '2025.10', text: '「稀に運転が荒い」との声をいただきました。', reply: '安全運転を心がけるようドライバーへ指導を実施。引き続きフィードバック受付中です。' },
  { cat: '夏場の階段について', date: '2023.09', text: '「夏場の階段がきつい」との声。室内は冷房完備で快適とのこと。', reply: '建物の構造的な問題もありますが前向きに検討中。室内環境は引き続き快適に維持します。' },
]
const LINE_URL = 'https://lin.ee/quzUszF'

export default function PublicVoice() {
  const [reviews, setReviews] = useState([])
  const [catFilter, setCatFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [showAll, setShowAll] = useState(false)
  const nav = useNavigate()

  useEffect(() => { fetchApprovedReviews().then(setReviews) }, [])

  const catMatch = r => catFilter === 'all' || r.category?.includes(catFilter)
  const typeMatch = r => typeFilter === 'all' || r.type === typeFilter
  const filtered = reviews.filter(r => catMatch(r) && typeMatch(r))
  const visible = showAll ? filtered : filtered.slice(0, 8)
  const remaining = filtered.length - visible.length

  const goodCount = reviews.filter(r => r.type === 'good').length
  const wishCount = reviews.filter(r => r.type === 'wish').length

  const cats = [
    { key: 'all', label: 'すべて', count: reviews.length },
    { key: '客質', label: '客質/客層', count: reviews.filter(r => r.category?.includes('客質')).length },
    { key: '給与', label: '給与/報酬', count: reviews.filter(r => r.category?.includes('給与')).length },
    { key: '人間', label: '人間関係', count: reviews.filter(r => r.category?.includes('人間')).length },
    { key: '通勤', label: '通勤環境', count: reviews.filter(r => r.category?.includes('通勤')).length },
    { key: '求人', label: '求人信用度', count: reviews.filter(r => r.category?.includes('求人')).length },
    { key: '待機', label: '待機環境', count: reviews.filter(r => r.category?.includes('待機')).length },
  ]

  const maxTL = Math.max(...TIMELINE.map(t => t.c))

  return (
    <Layout>
      {/* Hero */}
      <section style={{ padding: '50px 20px 32px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--card)', border: '1px solid var(--bdr)', borderRadius: 50, padding: '5px 14px', fontSize: '0.68rem', color: 'var(--td)', marginBottom: 14, backdropFilter: 'blur(8px)' }}>
          <span style={{ width: 6, height: 6, background: 'var(--green)', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
          {reviews.length}件の実データ ・ 2020〜2025
        </div>
        <h1 style={{ fontFamily: 'var(--fd)', fontSize: '2.6rem', fontWeight: 400, fontStyle: 'italic', lineHeight: 1.15, marginBottom: 10, background: 'linear-gradient(135deg,var(--pink) 0%,var(--t) 50%,var(--purple) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Real Voice</h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--td)', maxWidth: 480, margin: '0 auto' }}>良いところも、改善してほしいところも、全部見せます。</p>
      </section>

      <div style={{ maxWidth: 920, margin: '0 auto', padding: '0 20px' }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, margin: '30px 0' }}>
          {[{ n: reviews.length, s: '', l: '総口コミ数' }, { n: 86, s: '%', l: '良い点の割合' }, { n: 92, s: '点', l: '総合スコア' }].map((st, i) => (
            <div key={i} style={{ background: 'var(--card)', border: '1px solid var(--bdr)', borderRadius: 'var(--r)', padding: '22px 12px', textAlign: 'center', backdropFilter: 'blur(8px)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ fontFamily: 'var(--fd)', fontSize: '2.4rem', fontWeight: 700, color: 'var(--pink)', lineHeight: 1, textShadow: '0 0 30px var(--pink-g)' }}>{st.n}{st.s}</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--tm)', marginTop: 4, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{st.l}</div>
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,var(--pink),var(--purple))' }} />
            </div>
          ))}
        </div>

        {/* Highlights */}
        <div style={{ margin: '40px 0' }}>
          <SectionLabel>ハイライト</SectionLabel>
          <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 12, scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}>
            {HIGHLIGHTS.map((h, i) => (
              <div key={i} style={{ minWidth: 300, maxWidth: 340, background: 'linear-gradient(135deg,rgba(232,180,184,0.08),rgba(155,127,191,0.06))', border: '1px solid rgba(232,180,184,0.1)', borderRadius: 20, padding: '28px 24px', scrollSnapAlign: 'start', flexShrink: 0, position: 'relative' }}>
                <span style={{ position: 'absolute', top: 12, left: 18, fontFamily: 'var(--fd)', fontSize: '4rem', color: 'rgba(232,180,184,0.15)', lineHeight: 1 }}>"</span>
                <div style={{ fontFamily: 'var(--fd)', fontSize: '1.15rem', fontStyle: 'italic', lineHeight: 1.6, marginBottom: 12 }}>{h.text}</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--td)' }}>{h.meta}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Radar + Scores */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, margin: '36px 0' }}>
          <GlassCard title="レーダーチャート"><div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0' }}><RadarChart data={RADAR} /></div></GlassCard>
          <GlassCard title="項目別スコア">
            {SCORES.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <span style={{ fontSize: '0.78rem', minWidth: 100, color: 'var(--td)' }}>{s.label}</span>
                <div style={{ flex: 1, height: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 50, overflow: 'hidden' }}>
                  <AnimBar val={s.val} bg={s.g} />
                </div>
                <span style={{ fontFamily: 'var(--fd)', fontSize: '0.82rem', fontWeight: 700, color: 'var(--pink)', minWidth: 28, textAlign: 'right' }}>{s.val}</span>
              </div>
            ))}
          </GlassCard>
        </div>

        {/* Categories */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, margin: '20px 0' }}>
          {cats.map(c => (
            <button key={c.key} onClick={() => { setCatFilter(c.key); setShowAll(false) }} style={{
              background: catFilter === c.key ? 'rgba(232,180,184,0.12)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${catFilter === c.key ? 'rgba(232,180,184,0.3)' : 'var(--bdr)'}`,
              borderRadius: 50, padding: '6px 14px', fontSize: '0.72rem',
              color: catFilter === c.key ? 'var(--pink)' : 'var(--td)',
              display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontFamily: 'var(--f)',
            }}>
              {c.label}
              <span style={{ background: catFilter === c.key ? 'var(--pink)' : 'rgba(232,180,184,0.4)', color: 'var(--bg)', fontSize: '0.6rem', fontWeight: 700, padding: '1px 7px', borderRadius: 50 }}>{c.count}</span>
            </button>
          ))}
        </div>

        {/* Timeline */}
        <GlassCard title="口コミ推移" style={{ margin: '36px 0' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 80 }}>
            {TIMELINE.map((t, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ width: '100%', borderRadius: '6px 6px 0 0', background: 'linear-gradient(180deg,var(--pink),var(--purple))', height: `${(t.c / maxTL) * 100}%`, minHeight: 4, position: 'relative' }}>
                  <span style={{ position: 'absolute', top: -20, left: '50%', transform: 'translateX(-50%)', fontSize: '0.65rem', color: 'var(--pink)', fontWeight: 700 }}>{t.c}</span>
                </div>
                <span style={{ fontSize: '0.62rem', color: 'var(--tm)' }}>{t.y}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Reviews */}
        <SectionLabel>口コミ一覧</SectionLabel>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
          {[['all', 'すべて'], ['good', `良い点 (${goodCount})`], ['wish', `改善要望 (${wishCount})`]].map(([k, l]) => (
            <button key={k} onClick={() => { setTypeFilter(k); setShowAll(false) }} style={{
              background: typeFilter === k ? 'rgba(232,180,184,0.12)' : 'var(--card)',
              border: `1px solid ${typeFilter === k ? 'rgba(232,180,184,0.3)' : 'var(--bdr)'}`,
              color: typeFilter === k ? 'var(--pink)' : 'var(--td)',
              fontSize: '0.72rem', padding: '6px 14px', borderRadius: 50, cursor: 'pointer', fontFamily: 'var(--f)',
            }}>{l}</button>
          ))}
        </div>

        <div>
          {visible.map((r, i) => (
            <div key={r.id} className="vc-anim" onClick={() => nav(`/review/${r.id}`)} style={{ background: 'var(--card)', border: '1px solid var(--bdr)', borderRadius: 20, padding: 22, marginBottom: 14, backdropFilter: 'blur(6px)', animationDelay: `${i * 0.05}s`, borderLeft: `3px solid ${catColor(r.category)}`, cursor: 'pointer', transition: 'all 0.3s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.62rem', fontWeight: 700, padding: '3px 10px', borderRadius: 50, ...(r.type === 'good' ? { background: 'rgba(107,143,232,0.15)', color: 'var(--blue)' } : { background: 'rgba(232,112,112,0.15)', color: 'var(--red)' }) }}>{r.type === 'good' ? '良い点' : '改善要望'}</span>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: catColor(r.category) }}>{r.category}</span>
                <span style={{ fontSize: '0.62rem', color: 'var(--tm)', marginLeft: 'auto' }}>{r.date || r.created_at?.slice(0, 7).replace('-', '.')}</span>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--td)', lineHeight: 1.8 }}>{highlightText(r.body)}</div>
            </div>
          ))}
        </div>
        {remaining > 0 && (
          <button onClick={() => setShowAll(true)} style={{ display: 'block', width: '100%', background: 'var(--card)', border: '1px solid var(--bdr)', color: 'var(--td)', padding: 14, borderRadius: 'var(--r)', fontSize: '0.82rem', fontFamily: 'var(--f)', cursor: 'pointer', margin: '16px 0' }}>
            もっと見る（残り{remaining}件）
          </button>
        )}

        {/* Improvements */}
        <SectionLabel>改善への取り組み</SectionLabel>
        {IMPROVEMENTS.map((imp, i) => (
          <div key={i} style={{ background: 'var(--card)', border: '1px solid rgba(232,112,112,0.15)', borderRadius: 'var(--r)', padding: '18px 20px', marginBottom: 12, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: 'var(--red)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--red)', fontWeight: 500 }}>{imp.cat}</span>
              <span style={{ fontSize: '0.62rem', color: 'var(--tm)' }}>{imp.date}</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--td)', lineHeight: 1.7, marginBottom: 10 }}>{imp.text}</p>
            <div style={{ background: 'rgba(107,207,160,0.06)', border: '1px solid rgba(107,207,160,0.12)', borderRadius: 10, padding: '12px 14px', fontSize: '0.78rem', color: 'var(--green)', lineHeight: 1.6 }}>
              <div style={{ fontSize: '0.65rem', color: 'rgba(107,207,160,0.6)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.1em' }}>お店の対応</div>
              {imp.reply}
            </div>
          </div>
        ))}

        {/* Bridge Section */}
        <div style={{ background: 'linear-gradient(135deg,rgba(232,180,184,0.1),rgba(155,127,191,0.08))', border: '1px solid rgba(232,180,184,0.15)', borderRadius: 24, padding: '40px 28px', textAlign: 'center', margin: '40px 0', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,var(--pink),var(--purple),var(--blue))' }} />
          <div style={{ fontSize: '0.68rem', color: 'rgba(232,228,240,0.4)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 12 }}>この口コミを書いた子たちと同じ環境で働けます</div>
          <div style={{ fontFamily: 'var(--fd)', fontSize: '1.4rem', fontStyle: 'italic', marginBottom: 8 }}>あなたも働いてみませんか？</div>
          <div style={{ fontSize: '0.82rem', color: 'var(--td)', marginBottom: 6 }}>質問だけでもOK。入店を強制しません。</div>
          <div style={{ fontFamily: 'var(--fd)', fontSize: '1.6rem', fontWeight: 700, color: 'var(--gold)', margin: '16px 0 4px', textShadow: '0 0 20px rgba(232,213,168,0.3)' }}>60分バック ¥10,000〜13,000</div>
          <div style={{ fontSize: '0.72rem', color: 'rgba(232,228,240,0.4)', marginBottom: 24 }}>日払い対応・寮完備・送迎あり</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
            {['LINE追加', '15分の面接', '体入', '入店'].map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(232,180,184,0.2)', borderRadius: 12, padding: '10px 16px', fontSize: '0.75rem', color: 'var(--pink)', fontWeight: 500 }}>
                  <span style={{ fontSize: '0.6rem', color: 'rgba(232,228,240,0.3)', display: 'block', marginBottom: 2 }}>STEP {i + 1}</span>{s}
                </div>
                {i < 3 && <span style={{ color: 'rgba(232,228,240,0.2)', fontSize: '0.8rem' }}>→</span>}
              </div>
            ))}
          </div>
          <a href={LINE_URL} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#06C755', color: '#fff', fontSize: '0.95rem', fontWeight: 700, padding: '16px 36px', borderRadius: 50, fontFamily: 'var(--f)', boxShadow: '0 4px 20px rgba(6,199,85,0.25)' }}>LINEで気軽に相談する</a>
        </div>

        <div style={{ textAlign: 'center', padding: '0 20px 20px' }}>
          <a href="../" style={{ fontSize: '0.8rem', color: 'var(--td)', borderBottom: '1px solid var(--bdr)', paddingBottom: 2 }}>← 求人ページトップに戻る</a>
        </div>
      </div>
    </Layout>
  )
}

// --- Sub components ---
function SectionLabel({ children }) {
  return (
    <div style={{ fontSize: '0.78rem', fontWeight: 700, margin: '36px 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ width: 3, height: 14, background: 'linear-gradient(180deg,var(--pink),var(--purple))', borderRadius: 2 }} />{children}
    </div>
  )
}

function GlassCard({ title, children, style = {} }) {
  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--bdr)', borderRadius: 20, padding: 24, backdropFilter: 'blur(8px)', ...style }}>
      {title && <div style={{ fontSize: '0.78rem', fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 3, height: 14, background: 'linear-gradient(180deg,var(--pink),var(--purple))', borderRadius: 2 }} />{title}
      </div>}
      {children}
    </div>
  )
}

function RadarChart({ data, size = 260 }) {
  const cx = size / 2, cy = size / 2, R = size * 0.36, n = data.length
  const pt = (i, r) => {
    const a = (Math.PI * 2 / n) * i - Math.PI / 2
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)]
  }
  const grid = [1, 2, 3, 4, 5].map(l => {
    const pts = Array.from({ length: n + 1 }, (_, i) => pt(i % n, R * l / 5).join(',')).join(' ')
    return <polygon key={l} points={pts} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
  })
  const axes = Array.from({ length: n }, (_, i) => {
    const [x, y] = pt(i, R)
    return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(255,255,255,0.04)" />
  })
  const dataPts = data.map((_, i) => pt(i, R * data[i].value / 100))
  const path = dataPts.map((p, i) => (i === 0 ? 'M' : 'L') + p.join(',')).join(' ') + 'Z'
  const labels = data.map((d, i) => {
    const [x, y] = pt(i, R + 28)
    return <g key={i}><text x={x} y={y - 7} textAnchor="middle" fill="rgba(232,228,240,0.5)" fontSize="10" fontFamily="'DM Sans',sans-serif">{d.label}</text><text x={x} y={y + 9} textAnchor="middle" fill="#E8B4B8" fontSize="14" fontWeight="700" fontFamily="'Playfair Display',serif">{d.value}</text></g>
  })
  const dots = dataPts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="4" fill="#E8B4B8" style={{ filter: 'drop-shadow(0 0 6px rgba(232,180,184,0.5))' }} />)
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ maxWidth: '100%' }}>
      {grid}{axes}
      <path d={path} fill="rgba(232,180,184,0.15)" stroke="rgba(232,180,184,0.6)" strokeWidth="2" />
      {dots}{labels}
    </svg>
  )
}

function AnimBar({ val, bg }) {
  const ref = useRef(null)
  const [w, setW] = useState(0)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setW(val) }, { threshold: 0.3 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [val])
  return <div ref={ref} style={{ height: '100%', borderRadius: 50, width: `${w}%`, background: bg, transition: 'width 1.5s cubic-bezier(0.25,0.46,0.45,0.94)' }} />
}
