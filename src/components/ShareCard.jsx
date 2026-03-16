import { forwardRef } from 'react'

const C = {
  accent: '#E8457C',
  violet: '#9B6DD7',
  gold: '#C9A84C',
  goldLight: '#E8D48B',
  bg1: '#0C0B14',
  bg2: '#140E20',
  text90: 'rgba(255,255,255,0.90)',
  text70: 'rgba(255,255,255,0.70)',
  text50: 'rgba(255,255,255,0.50)',
  text35: 'rgba(255,255,255,0.35)',
  text20: 'rgba(255,255,255,0.20)',
  text10: 'rgba(255,255,255,0.10)',
  glassBorder: 'rgba(255,255,255,0.07)',
}

const RADAR_DATA = {
  labels: ['\u4eba\u9593\u95a2\u4fc2', '\u5f85\u6a5f\u74b0\u5883', '\u7d66\u4e0e/\u5831\u916c', '\u5ba2\u8cea/\u5ba2\u5c64', '\u4fe1\u7528\u5ea6', '\u901a\u52e4'],
  scores: [96, 95, 92, 90, 90, 86],
}

const TITLE_MAP = {
  '\u7d66\u4e0e': '\u266b \u7a3c\u3052\u308b\u74b0\u5883',
  '\u5ba2\u8cea': '\u2661 \u7d33\u58eb\u69d8\u591a\u6570',
  '\u4eba\u9593': '\u2726 \u5c45\u5fc3\u5730\u629c\u7fa4',
  '\u6c42\u4eba': '\u2727 \u5618\u306a\u3057\u5ba3\u8a00',
  '\u901a\u52e4': '\u2606 \u30a2\u30af\u30bb\u30b9\u25ce',
  '\u5f85\u6a5f': '\u2726 \u5feb\u9069\u7a7a\u9593',
}

function getTitle(category) {
  if (!category) return '\u2726 Real Voice'
  for (const [key, title] of Object.entries(TITLE_MAP)) {
    if (category.includes(key)) return title
  }
  return '\u2726 Real Voice'
}

function extractHighlight(body) {
  if (!body) return ''
  const sentences = body.split(/[\u3002\uff01!]/g).filter(s => s.trim().length > 4)
  if (sentences.length === 0) return body.slice(0, 60)
  const short = sentences.filter(s => s.trim().length <= 30)
  const pick = short.length > 0 ? short[0] : sentences[0]
  return pick.trim()
}

function getPersonLabel(review, index) {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  return letters[index % 26] + '\u3055\u3093'
}

function RadarSVG({ size }) {
  const cx = size / 2, cy = size / 2, r = size / 2 - 24, n = 6
  const { labels, scores } = RADAR_DATA
  const pt = (i, v) => {
    const a = (Math.PI * 2 * i) / n - Math.PI / 2
    return [cx + (v / 100) * r * Math.cos(a), cy + (v / 100) * r * Math.sin(a)]
  }
  return (
    <svg width={size} height={size} viewBox={'0 0 ' + size + ' ' + size} xmlns="http://www.w3.org/2000/svg">
      {[25, 50, 75, 100].map(lv => {
        const pts = Array.from({ length: n }, (_, i) => pt(i, lv).join(',')).join(' ')
        return <polygon key={lv} points={pts} fill="none" stroke={C.text10} strokeWidth="0.5" />
      })}
      {Array.from({ length: n }, (_, i) => {
        const p = pt(i, 100)
        return <line key={i} x1={cx} y1={cy} x2={p[0]} y2={p[1]} stroke={C.text10} strokeWidth="0.4" />
      })}
      <polygon points={scores.map((v, i) => pt(i, v).join(',')).join(' ')} fill={C.accent} fillOpacity="0.18" stroke={C.accent} strokeWidth="2" />
      {scores.map((v, i) => { const p = pt(i, v); return <circle key={i} cx={p[0]} cy={p[1]} r="3.5" fill={C.accent} /> })}
      {labels.map((l, i) => { const p = pt(i, 118); return <text key={i} x={p[0]} y={p[1]} fill={C.text35} fontSize={size > 200 ? '11' : '8'} textAnchor="middle" dominantBaseline="central" fontFamily="'Noto Sans JP',sans-serif">{l}</text> })}
    </svg>
  )
}
const OGShareCard = forwardRef(function OGShareCard({ review, reviewIndex }, ref) {
  const highlight = extractHighlight(review.body)
  const person = getPersonLabel(review, reviewIndex || 0)
  const title = getTitle(review.category)
  const date = review.date || (review.created_at ? review.created_at.slice(0, 7).replace('-', '.') : '')
  return (
    <div ref={ref} style={{ width: 1200, height: 630, background: 'linear-gradient(150deg, #0C0B14, #140E20 50%, #0C0B14)', fontFamily: "'Noto Sans JP','Hiragino Sans',sans-serif", color: '#fff', position: 'relative', overflow: 'hidden' }}>
      <div style={{ display: 'flex', height: '100%', padding: '48px 52px' }}>
        <div style={{ width: '57%', display: 'flex', flexDirection: 'column', paddingRight: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
            <span style={{ fontSize: 44, fontWeight: 800, color: C.text90, letterSpacing: 4 }}>OKINI Tokyo</span>
            <span style={{ fontSize: 18, fontWeight: 700, color: '#fff', background: 'linear-gradient(135deg, #E8457C, #9B6DD7)', padding: '4px 16px', borderRadius: 20, whiteSpace: 'nowrap' }}>{title}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
            <span style={{ fontSize: 20, color: C.text35 }}>{'\u6771\u4eac\u90fd\u5927\u7530\u533a \u84b2\u7530'}</span>
            <span style={{ fontSize: 18, color: C.text20 }}>{'\u2022 37\u4ef6'}</span>
            <span style={{ fontSize: 18, color: '#9B6DD7', fontWeight: 600, background: 'rgba(155,109,215,0.12)', border: '1px solid rgba(155,109,215,0.2)', padding: '2px 14px', borderRadius: 12 }}>{review.category || ''}</span>
          </div>
          <div style={{ background: 'linear-gradient(90deg, rgba(201,168,76,0.22), rgba(201,168,76,0.08))', border: '1px solid rgba(201,168,76,0.28)', borderRadius: 8, padding: '24px 28px', display: 'flex', alignItems: 'center' }}>
            <div style={{ fontSize: 32, fontWeight: 800, lineHeight: 1.55, color: '#E8D48B', letterSpacing: -0.5 }}>"{highlight}"</div>
          </div>
          <div style={{ fontSize: 22, color: C.text50, lineHeight: 1.65, marginTop: 20, flex: 1, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{review.body}</div>
          <div style={{ marginTop: 'auto', paddingTop: 8 }}><span style={{ fontSize: 16, color: C.text20, letterSpacing: 0.5 }}>okini-voice.vercel.app</span></div>
        </div>
        <div style={{ width: '43%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><RadarSVG size={320} /></div>
          <div style={{ textAlign: 'right', alignSelf: 'flex-end' }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: C.text70 }}>{person}</div>
            <div style={{ fontSize: 16, color: C.text20 }}>{date}</div>
          </div>
        </div>
      </div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, #C9A84C80, #E8457C60, transparent)' }} />
    </div>
  )
})

const StoriesShareCard = forwardRef(function StoriesShareCard({ review, reviewIndex }, ref) {
  const highlight = extractHighlight(review.body)
  const person = getPersonLabel(review, reviewIndex || 0)
  const title = getTitle(review.category)
  const date = review.date || (review.created_at ? review.created_at.slice(0, 7).replace('-', '.') : '')
  return (
    <div ref={ref} style={{ width: 1080, height: 1920, background: 'linear-gradient(180deg, #0C0B14 0%, #1A1228 40%, #0C0B14 100%)', fontFamily: "'Noto Sans JP','Hiragino Sans',sans-serif", color: '#fff', position: 'relative', overflow: 'hidden' }}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '100px 72px' }}>
        <div style={{ textAlign: 'center', marginBottom: 16 }}><div style={{ fontSize: 72, fontWeight: 800, color: C.text90, letterSpacing: 8 }}>OKINI Tokyo</div></div>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <span style={{ fontSize: 32, color: C.text35 }}>{'\u6771\u4eac\u90fd\u5927\u7530\u533a \u84b2\u7530'}</span>
          <span style={{ fontSize: 28, color: C.text20, marginLeft: 24 }}>{'\u53e3\u30b3\u30df 37\u4ef6'}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 60 }}>
          <span style={{ fontSize: 28, fontWeight: 700, color: '#fff', background: 'linear-gradient(135deg, #E8457C, #9B6DD7)', padding: '8px 24px', borderRadius: 24 }}>{title}</span>
          <span style={{ fontSize: 28, color: '#9B6DD7', fontWeight: 600, background: 'rgba(155,109,215,0.12)', border: '2px solid rgba(155,109,215,0.2)', padding: '8px 24px', borderRadius: 20 }}>{review.category || ''}</span>
        </div>
        <div style={{ background: 'linear-gradient(180deg, rgba(201,168,76,0.2), rgba(201,168,76,0.06))', border: '2px solid rgba(201,168,76,0.28)', borderRadius: 16, padding: '48px', marginBottom: 36 }}>
          <div style={{ fontSize: 56, fontWeight: 800, lineHeight: 1.55, color: '#E8D48B', textAlign: 'center', letterSpacing: -1 }}>"{highlight}"</div>
        </div>
        <div style={{ fontSize: 36, color: C.text35, lineHeight: 1.65, textAlign: 'center', padding: '0 16px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{review.body}</div>
        <div style={{ display: 'flex', justifyContent: 'center', margin: 'auto 0', padding: '40px 0' }}><RadarSVG size={480} /></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div style={{ fontSize: 22, color: C.text10, letterSpacing: 1 }}>okini-voice.vercel.app</div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 40, fontWeight: 700, color: C.text70 }}>{person}</div>
            <div style={{ fontSize: 24, color: C.text20 }}>{date}</div>
          </div>
        </div>
      </div>
      <div style={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', background: 'linear-gradient(180deg, transparent, #C9A84C60, #E8457C50, transparent)' }} />
    </div>
  )
})

export { OGShareCard, StoriesShareCard, extractHighlight, getTitle, getPersonLabel }