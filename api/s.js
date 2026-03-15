export const config = { runtime: 'edge' }

export default async function handler(req) {
  const url = new URL(req.url)
  const shortId = url.searchParams.get('id')

  if (!shortId) return Response.redirect('https://okini-voice.vercel.app/', 302)

  const supabaseUrl = 'https://ezhukcbjrhxzamcjvial.supabase.co'
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6aHVrY2Jqcmh4emFtY2p2aWFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1ODU3NTcsImV4cCI6MjA4OTE2MTc1N30.Ziw9MXtVhcVw22EUzXx0pASjGG1_pN0_qLQZlPQJi6U'
  const headers = { apikey: supabaseKey, Authorization: 'Bearer ' + supabaseKey, 'Content-Type': 'application/json' }

  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/short_urls?id=eq.${shortId}&select=review_id`, { headers })
    const data = await res.json()
    if (!data || data.length === 0) return Response.redirect('https://okini-voice.vercel.app/', 302)

    const reviewId = data[0].review_id
    const referrer = req.headers.get('referer') || ''
    const userAgent = req.headers.get('user-agent') || ''
    const ip = req.headers.get('x-forwarded-for') || ''
    const ipHash = await hashIP(ip)

    await fetch(`${supabaseUrl}/rest/v1/share_clicks`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ review_id: reviewId, referrer, user_agent: userAgent, ip_hash: ipHash })
    })

    return Response.redirect(`https://okini-voice.vercel.app/review/${reviewId}`, 302)
  } catch (e) {
    return Response.redirect('https://okini-voice.vercel.app/', 302)
  }
}

async function hashIP(ip) {
  const encoder = new TextEncoder()
  const data = encoder.encode(ip + 'okini-salt')
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 16)
}