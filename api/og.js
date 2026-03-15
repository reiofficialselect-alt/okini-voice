export const config = { runtime: 'edge' }

export default async function handler(req) {
  const url = new URL(req.url)
  const id = url.searchParams.get('id')
  const format = url.searchParams.get('format') || 'og'

  const supabaseUrl = 'https://ezhukcbjrhxzamcjvial.supabase.co'
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6aHVrY2Jqcmh4emFtY2p2aWFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1ODU3NTcsImV4cCI6MjA4OTE2MTc1N30.Ziw9MXtVhcVw22EUzXx0pASjGG1_pN0_qLQZlPQJi6U'

  let review = null
  if (id) {
    const res = await fetch(supabaseUrl + '/rest/v1/reviews?id=eq.' + id + '&select=*', {
      headers: { apikey: supabaseKey, Authorization: 'Bearer ' + supabaseKey }
    })
    const data = await res.json()
    if (data && data.length > 0) review = data[0]
  }

  const w = format === 'story' ? 1080 : 1200
  const h = format === 'story' ? 1920 : 630
  const isStory = format === 'story'

  const catColors = { '客質/客層': '#6B8FE8', '給与/報酬/待遇': '#E8D5A8', '人間関係': '#E8B4B8', '通勤環境': '#9B7FBF', '求人ページ信用度': '#5BC4BE', '待機環境': '#6BCFA0' }
  const cc = review ? (catColors[review.category] || '#E8B4B8') : '#E8B4B8'
  const stars = review ? '\u2605'.repeat(review.rating || 5) : '\u2605\u2605\u2605\u2605\u2605'
  const body = review ? (review.body || '').slice(0, isStory ? 100 : 60) + ((review.body || '').length > (isStory ? 100 : 60) ? '\u2026' : '') : 'OKINI\u84b2\u7530\u306e\u30ea\u30a2\u30eb\u306a\u53e3\u30b3\u30df'
  const category = review ? review.category : ''
  const fs = isStory ? 44 : 36
  const lh = isStory ? 66 : 52
  const cpl = Math.floor((w - (isStory ? 180 : 160)) / (fs * 0.55))

  const lines = []
  let rem = body
  while (rem.length > 0 && lines.length < (isStory ? 5 : 3)) {
    lines.push(rem.slice(0, cpl))
    rem = rem.slice(cpl)
  }
  const bodyY = isStory ? 600 : 220
  const textSvg = lines.map(function(line, i) {
    return '<text x="' + (isStory ? 100 : 80) + '" y="' + (bodyY + i * lh) + '" font-family="sans-serif" font-size="' + fs + '" fill="rgba(232,228,240,0.85)">' + escapeXml(line) + '</text>'
  }).join('\n')

  const starsY = bodyY + lines.length * lh + (isStory ? 60 : 40)
  const catY = starsY + (isStory ? 50 : 36)
  const tagY = isStory ? h - 200 : h - 40

  const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '">' +
    '<defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0B0A12"/><stop offset="100%" stop-color="#1A1428"/></linearGradient>' +
    '<filter id="glow"><feGaussianBlur stdDeviation="60"/></filter></defs>' +
    '<rect width="' + w + '" height="' + h + '" fill="url(#bg)"/>' +
    '<circle cx="' + (isStory ? 200 : 150) + '" cy="' + (isStory ? 300 : 100) + '" r="' + (isStory ? 300 : 220) + '" fill="#E8B4B8" opacity="0.07" filter="url(#glow)"/>' +
    '<circle cx="' + (isStory ? 850 : 1050) + '" cy="' + (isStory ? 1500 : 500) + '" r="' + (isStory ? 250 : 180) + '" fill="#9B7FBF" opacity="0.05" filter="url(#glow)"/>' +
    '<rect x="' + (isStory ? 80 : 60) + '" y="' + (isStory ? 80 : 40) + '" width="6" height="' + (isStory ? 1760 : 550) + '" rx="3" fill="' + cc + '" opacity="0.7"/>' +
    '<text x="' + (isStory ? 110 : 90) + '" y="' + (isStory ? 180 : 100) + '" font-family="serif" font-size="' + (isStory ? 52 : 38) + '" font-style="italic" fill="#E8B4B8">\u2726 OKINI Tokyo in \u84b2\u7530</text>' +
    '<text x="' + (isStory ? 110 : 90) + '" y="' + (isStory ? 240 : 140) + '" font-family="sans-serif" font-size="' + (isStory ? 32 : 22) + '" fill="rgba(232,228,240,0.35)">Real Voice</text>' +
    '<text x="' + (isStory ? 100 : 80) + '" y="' + (bodyY - (isStory ? 40 : 20)) + '" font-family="serif" font-size="' + (isStory ? 80 : 60) + '" fill="rgba(232,180,184,0.15)">\u201C</text>' +
    textSvg +
    '<text x="' + (isStory ? 100 : 80) + '" y="' + starsY + '" font-family="sans-serif" font-size="' + (isStory ? 40 : 30) + '" fill="' + cc + '">' + stars + '</text>' +
    '<text x="' + (isStory ? 100 : 80) + '" y="' + catY + '" font-family="sans-serif" font-size="' + (isStory ? 34 : 24) + '" fill="' + cc + '" opacity="0.8">' + escapeXml(category) + '</text>' +
    '<text x="' + (isStory ? 100 : 80) + '" y="' + tagY + '" font-family="sans-serif" font-size="' + (isStory ? 28 : 18) + '" fill="rgba(232,228,240,0.3)">#OKINI\u84b2\u7530 #\u9ad8\u53ce\u5165\u30d0\u30a4\u30c8</text>' +
    '</svg>'

  return new Response(svg, {
    headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=3600' }
  })
}

function escapeXml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}