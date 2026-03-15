import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { handleLineCallback } from '../lib/lineAuth'
import Layout from '../components/Layout'

export default function AuthCallback() {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState('認証中...')
  const { loginWithLine } = useAuth()
  const nav = useNavigate()

  useEffect(() => {
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const savedState = sessionStorage.getItem('line_state')

    if (!code) { setStatus('認証コードがありません'); return }
    if (state !== savedState) { setStatus('不正なリクエストです'); return }

    handleLineCallback(code)
      .then(data => {
        loginWithLine(data)
        nav('/submit')
      })
      .catch(err => setStatus('認証に失敗しました: ' + err.message))
  }, [])

  return (
    <Layout>
      <div style={{ textAlign: 'center', padding: 80 }}>
        <div style={{ fontSize: '2rem', marginBottom: 16 }}></div>
        <p style={{ color: 'var(--td)', fontSize: '0.92rem' }}>{status}</p>
      </div>
    </Layout>
  )
}