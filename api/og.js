import { ImageResponse } from '@vercel/og'

export const config = { runtime: 'edge' }

const SB = 'https://ezhukcbjrhxzamcjvial.supabase.co'
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6aHVrY2Jqcmh4emFtY2p2aWFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1ODU3NTcsImV4cCI6MjA4OTE2MTc1N30.Ziw9MXtVhcVw22EUzXx0pASjGG1_pN0_qLQZlPQJi6U'

const TITLES = {
  '\u7d66\u4e0e': '\u266b \u7a3c\u3052\u308b\u74b0\u5883',
  '\u5ba2\u8cea': '\u2661 \u7d33\u58eb\u69d8\u591a\u6570',
  '\u4eba\u9593': '\u2726 \u5c45\u5fc3\u5730\u629c\u7fa4',
  '\u6c42\u4eba': '\u2727 \u5618\u306a\u3057\u5ba3\u8a00',
  '\u901a\u52e4': '\u2606 \u30a2\u30af\u30bb\u30b9\u25ce',
  '\u5f85\u6a5f': '\u2726 \u5feb\u9069\u7a7a\u9593'
}

function getTitle(c) {
  if (!c) return '\u2726 Real Voice'
  for (var k in TITLES) { if (c.indexOf(k) !== -1) return TITLES[k] }
  return '\u2726 Real Voice'
}

function extractHL(b) {
  if (!b) return ''
  var s = b.split(/[\u3002\uff01!]/g).filter(function(x){ return x.trim().length > 4 })
  if (!s.length) return b.slice(0, 60)
  var sh = s.filter(function(x){ return x.trim().length <= 30 })
  return (sh.length ? sh[0] : s[0]).trim()
}

export default async function handler(req) {
  var id = new URL(req.url).searchParams.get('id')

  var rv = null
  if (id) {
    try {
      var r = await fetch(SB + '/rest/v1/reviews?id=eq.' + id + '&select=*', {
        headers: { apikey: KEY, Authorization: 'Bearer ' + KEY }
      })
      var d = await r.json()
      if (d && d.length) rv = d[0]
    } catch(e) {}
  }

  var quote = rv ? extractHL(rv.body) : 'OKINI Tokyo\u306e\u30ea\u30a2\u30eb\u306a\u58f0'
  var cat = (rv && rv.category) ? rv.category : ''
  var title = getTitle(cat)
  var detail = rv && rv.body ? rv.body.slice(0, 80) + (rv.body.length > 80 ? '...' : '') : ''
  var date = ''
  if (rv && rv.date) date = rv.date
  else if (rv && rv.created_at) date = rv.created_at.slice(0,7).replace('-','.')

  var allText = 'OKINI Tokyo\u6771\u4eac\u90fd\u5927\u7530\u533a\u84b2\u7530\u53e3\u30b3\u30df37\u4ef6' + quote + detail + cat + title + 'A\u3055\u3093okini-voice.vercel.app\u266b\u2661\u2726\u2727\u2606'

  var fontData = null
  try {
    var css = await (await fetch('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@800&text=' + encodeURIComponent(allText))).text()
    var furl = css.match(/src: url\((.+?)\)/)
    if (furl && furl[1]) fontData = await (await fetch(furl[1])).arrayBuffer()
  } catch(e) {}

  return new ImageResponse(
    (
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', background: '#0f0d18', fontFamily: '"Noto Sans JP",sans-serif', color: '#fff', padding: 48, position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
          <span style={{ fontSize: 42, fontWeight: 800, letterSpacing: 3 }}>OKINI Tokyo</span>
          <span style={{ fontSize: 18, fontWeight: 800, color: '#fff', background: 'linear-gradient(135deg,#E8457C,#9B6DD7)', padding: '4px 16px', borderRadius: 20 }}>{title}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <span style={{ fontSize: 20, color: 'rgba(255,255,255,0.35)' }}>{'\u6771\u4eac\u90fd\u5927\u7530\u533a \u84b2\u7530'}</span>
          <span style={{ fontSize: 18, color: 'rgba(255,255,255,0.2)' }}>{'\u2022 37\u4ef6'}</span>
          {cat ? <span style={{ fontSize: 18, color: '#9B6DD7', fontWeight: 800, background: 'rgba(155,109,215,0.12)', padding: '2px 14px', borderRadius: 12 }}>{cat}</span> : null}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', background: 'linear-gradient(90deg,rgba(201,168,76,0.22),rgba(201,168,76,0.08))', border: '2px solid rgba(201,168,76,0.28)', borderRadius: 8, padding: '24px 28px', marginBottom: 16 }}>
          <span style={{ fontSize: 30, fontWeight: 800, lineHeight: 1.55, color: '#E8D48B' }}>{'"' + quote + '"'}</span>
        </div>
        <div style={{ display: 'flex', fontSize: 20, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>{detail}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto' }}>
          <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.15)' }}>okini-voice.vercel.app</span>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span style={{ fontSize: 24, fontWeight: 800, color: 'rgba(255,255,255,0.6)' }}>{'A\u3055\u3093'}</span>
            <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.2)' }}>{date}</span>
          </div>
        </div>
        <div style={{ display: 'flex', position: 'absolute', bottom: 0, left: 0, width: '100%', height: 3, background: 'linear-gradient(90deg,rgba(201,168,76,0.5),rgba(232,69,124,0.4),transparent)' }}></div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: fontData ? [{ name: 'Noto Sans JP', data: fontData, weight: 800, style: 'normal' }] : []
    }
  )
}