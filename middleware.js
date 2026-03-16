export const config = { matcher: ['/review/:id*'] }

const SB = 'https://ezhukcbjrhxzamcjvial.supabase.co'
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6aHVrY2Jqcmh4emFtY2p2aWFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1ODU3NTcsImV4cCI6MjA4OTE2MTc1N30.Ziw9MXtVhcVw22EUzXx0pASjGG1_pN0_qLQZlPQJi6U'

export default async function middleware(req) {
  var ua = (req.headers.get('user-agent') || '').toLowerCase()
  var isBot = /bot|crawler|spider|facebookexternalhit|twitterbot|linkedinbot|line|slack|discord|telegram|whatsapp|preview/i.test(ua)

  if (!isBot) return

  var url = new URL(req.url)
  var parts = url.pathname.split('/')
  var id = parts[2] || ''
  if (!id) return

  var title = 'OKINI Tokyo | Real Voice'
  var desc = 'OKINI Tokyo\u306e\u30ea\u30a2\u30eb\u306a\u53e3\u30b3\u30df'
  try {
    var r = await fetch(SB + '/rest/v1/reviews?id=eq.' + id + '&select=body,category', {
      headers: { apikey: KEY, Authorization: 'Bearer ' + KEY }
    })
    var d = await r.json()
    if (d && d.length) {
      var body = d[0].body || ''
      desc = body.slice(0, 100) + (body.length > 100 ? '...' : '')
      title = 'OKINI Tokyo | ' + (d[0].category || 'Real Voice')
    }
  } catch(e) {}

  var ogImg = url.origin + '/api/og?id=' + id
  var pageUrl = url.origin + '/review/' + id

  var html = '<!DOCTYPE html><html><head>' +
    '<meta charset="utf-8"/>' +
    '<title>' + esc(title) + '</title>' +
    '<meta property="og:title" content="' + esc(title) + '"/>' +
    '<meta property="og:description" content="' + esc(desc) + '"/>' +
    '<meta property="og:image" content="' + ogImg + '"/>' +
    '<meta property="og:image:width" content="1200"/>' +
    '<meta property="og:image:height" content="630"/>' +
    '<meta property="og:url" content="' + pageUrl + '"/>' +
    '<meta property="og:type" content="article"/>' +
    '<meta name="twitter:card" content="summary_large_image"/>' +
    '<meta name="twitter:title" content="' + esc(title) + '"/>' +
    '<meta name="twitter:description" content="' + esc(desc) + '"/>' +
    '<meta name="twitter:image" content="' + ogImg + '"/>' +
    '</head><body></body></html>'

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=3600' }
  })
}

function esc(s) {
  return (s || '').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
}