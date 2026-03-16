import { ImageResponse } from '@vercel/og'

export const config = { runtime: 'edge' }

export default function handler(req) {
  var url = new URL(req.url)
  var id = url.searchParams.get('id') || ''
  var mode = url.searchParams.get('mode') || ''

  if (mode === 'html') {
    var ogImg = url.origin + '/api/og?id=' + id
    var pageUrl = url.origin + '/review/' + id
    return new Response(
      '<!DOCTYPE html><html><head><meta charset="utf-8"><title>OKINI Tokyo</title><meta property="og:title" content="OKINI Tokyo | Real Voice"/><meta property="og:description" content="OKINI Tokyo\u306e\u30ea\u30a2\u30eb\u306a\u53e3\u30b3\u30df"/><meta property="og:image" content="' + ogImg + '"/><meta property="og:image:width" content="1200"/><meta property="og:image:height" content="630"/><meta name="twitter:card" content="summary_large_image"/><meta name="twitter:image" content="' + ogImg + '"/><script>window.location.replace("' + pageUrl + '")</script></head><body></body></html>',
      { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    )
  }

  return new ImageResponse(
    {
      type: 'div',
      props: {
        style: { display: 'flex', width: '100%', height: '100%', background: '#0f0d18', color: '#fff', alignItems: 'center', justifyContent: 'center', fontSize: 60 },
        children: 'OKINI Tokyo TEST'
      }
    },
    { width: 1200, height: 630 }
  )
}