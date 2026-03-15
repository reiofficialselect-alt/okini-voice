const LINE_CHANNEL_ID = import.meta.env.VITE_LINE_CHANNEL_ID || ''
const REDIRECT_URI = `${window.location.origin}/auth/callback`

export function getLineLoginUrl() {
  const state = Math.random().toString(36).slice(2)
  sessionStorage.setItem('line_state', state)
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: LINE_CHANNEL_ID,
    redirect_uri: REDIRECT_URI,
    state,
    scope: 'profile openid',
  })
  return `https://access.line.me/oauth2/v2.1/authorize?${params}`
}

export async function handleLineCallback(code) {
  const res = await fetch('/api/line-auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, redirect_uri: REDIRECT_URI }),
  })
  if (!res.ok) throw new Error('LINE認証に失敗しました')
  return res.json()
}