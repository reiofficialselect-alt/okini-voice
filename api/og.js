export const config = { runtime: 'edge' }

export default async function handler(req) {
  const url = new URL(req.url)
  const id = url.searchParams.get('id')
  const format = url.searchParams.get('format') || 'og'

  const supabaseUrl = 'https://ezhukcbjrhxzamcjvial.supabase.co'
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6aHVrY2Jqcmh4emFtY2p2aWFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1ODU3NTcsImV4cCI6MjA4OTE2MTc1N30.Ziw9MXtVhcVw22EUzXx0pASjGG1_pN0_qLQZlPQJi6U'

  let review = null
  if (id) {
    const res = await fetch(`${supabaseUrl}/rest/v1/reviews?id=eq.${id}&select=*`, {
      headers: { apikey: supabaseKey, Authorization: 'Bearer ' + supabaseKey }
    })
    const data = await res.json()
    if (data && data.length > 0) review = data[0]
  }

  const w = format === 'story' ? 1080 : 1200
  const h = format === 'story' ? 1920 : 630

  const catColors = {
    '客質/客層': '#6B8FE8', '給与/報酬/待遇': '#E8D5A8', '人間関係': '#E8B4B8',
    '通勤環境': '#9B7FBF', '求人ページ信用度': '#5BC4BE', '待機環境': '#6BCFA0'
  }
  const catColor = review ? (catColors[review.category] || '#E8B4B8') : '#E8B4B8'
  const stars = review ? ''.repeat(review.rating || 5) + ''.repeat(5 - (review.rating || 5)) : ''
  const body = review ? (review.body || '').slice(0, 80) + ((review.body || '').length > 80 ? '' : '') : 'OKINI蒲田のリアルな口コミ'
  const category = review ? review.category : ''

  const isStory = format === 'story'

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#0B0A12"/>
        <stop offset="100%" stop-color="#1A1428"/>
      </linearGradient>
      <filter id="glow"><feGaussianBlur stdDeviation="40" result="blur"/><feComposite in="SourceGraphic" in2="blur" operator="over"/></filter>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#bg)"/>
    <circle cx="${isStory ? 200 : 100}" cy="${isStory ? 300 : 80}" r="${isStory ? 250 : 180}" fill="#E8B4B8" opacity="0.08" filter="url(#glow)"/>
    <circle cx="${isStory ? 800 : 1000}" cy="${isStory ? 1400 : 500}" r="${isStory ? 200 : 150}" fill="#9B7FBF" opacity="0.06" filter="url(#glow)"/>
    <rect x="${isStory ? 60 : 40}" y="${isStory ? 60 : 40}" width="4" height="${isStory ? 1800 : 550}" rx="2" fill="${catColor}" opacity="0.6"/>
    <text x="${isStory ? 90 : 70}" y="${isStory ? 120 : 90}" font-family="serif" font-size="${isStory ? 42 : 28}" font-style="italic" fill="#E8B4B8" opacity="0.9"> OKINI Tokyo in 蒲田</text>
    <text x="${isStory ? 90 : 70}" y="${isStory ? 175 : 125}" font-family="sans-serif" font-size="${isStory ? 30 : 18}" fill="rgba(232,228,240,0.4)">Real Voice</text>
    <line x1="${isStory ? 90 : 70}" y1="${isStory ? 220 : 155}" x2="${isStory ? 990 : 1130}" y2="${isStory ? 220 : 155}" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
    <text x="${isStory ? 90 : 70}" y="${isStory ? 350 : 250}" font-family="serif" font-size="${isStory ? 48 : 32}" font-style="italic" fill="#E8E4F0" opacity="0.95">"</text>
    ${wrapText(body, isStory ? 90 : 70, isStory ? 420 : 280, isStory ? 38 : 24, isStory ? 56 : 36, w - (isStory ? 150 : 140))}
    <line x1="${isStory ? 90 : 70}" y1="${isStory ? 1200 : 420}" x2="${isStory ? 990 : 1130}" y2="${isStory ? 1200 : 420}" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
    <text x="${isStory ? 90 : 70}" y="${isStory ? 1280 : 470}" font-family="sans-serif" font-size="${isStory ? 36 : 22}" fill="${catColor}">${stars}  ${category}</text>
    <text x="${isStory ? 90 : 70}" y="${isStory ? 1380 : 520}" font-family="sans-serif" font-size="${isStory ? 28 : 16}" fill="rgba(232,228,240,0.4)">#OKINI蒲田 #高収入バイト</text>
  </svg>`

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}

function wrapText(text, x, startY, fontSize, lineHeight, maxWidth) {
  const charsPerLine = Math.floor(maxWidth / fontSize)
  const lines = []
  let remaining = text
  while (remaining.length > 0 && lines.length < 4) {
    lines.push(remaining.slice(0, charsPerLine))
    remaining = remaining.slice(charsPerLine)
  }
  return lines.map((line, i) =>
    `<text x="${x}" y="${startY + i * lineHeight}" font-family="sans-serif" font-size="${fontSize}" fill="rgba(232,228,240,0.7)">${escapeXml(line)}</text>`
  ).join('\n')
}

function escapeXml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}