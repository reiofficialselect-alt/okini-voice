export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { code, redirect_uri } = req.body
  const CLIENT_ID = process.env.VITE_LINE_CHANNEL_ID
  const CLIENT_SECRET = process.env.VITE_LINE_CHANNEL_SECRET

  try {
    const tokenRes = await fetch('https://api.line.me/oauth2/v2.1/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }),
    })
    const tokenData = await tokenRes.json()
    if (!tokenData.access_token) return res.status(400).json({ error: 'Token exchange failed', detail: tokenData })

    const profileRes = await fetch('https://api.line.me/v2/profile', {
      headers: { Authorization: 'Bearer ' + tokenData.access_token },
    })
    const profile = await profileRes.json()

    return res.status(200).json({ profile, access_token: tokenData.access_token })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}