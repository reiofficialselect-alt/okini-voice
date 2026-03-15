import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import Layout from '../components/Layout'

export default function Login() {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const nav = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    const role = login(code)
    if (role === 'admin') nav('/admin')
    else if (role === 'cast') nav('/submit')
    else setError('パスコードが正しくありません')
  }

  return (
    <Layout>
      <div style={{ maxWidth: 400, margin: '80px auto', padding: '0 20px' }}>
        <div style={{ background: 'var(--card)', border: '1px solid var(--bdr)', borderRadius: 20, padding: 32, backdropFilter: 'blur(8px)' }}>
          <h1 style={{ fontFamily: 'var(--fd)', fontSize: '1.5rem', fontStyle: 'italic', textAlign: 'center', marginBottom: 8 }}>Cast Login</h1>
          <p style={{ fontSize: '0.82rem', color: 'var(--td)', textAlign: 'center', marginBottom: 24 }}>在籍キャスト専用</p>
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              value={code}
              onChange={e => { setCode(e.target.value); setError('') }}
              placeholder="パスコードを入力"
              style={inputStyle}
              autoFocus
            />
            {error && <p style={{ color: 'var(--red)', fontSize: '0.78rem', marginTop: 8 }}>{error}</p>}
            <button type="submit" style={btnStyle}>ログイン</button>
          </form>
          <p style={{ fontSize: '0.72rem', color: 'var(--tm)', textAlign: 'center', marginTop: 16 }}>パスコードはスタッフからお知らせします</p>
        </div>
      </div>
    </Layout>
  )
}

const inputStyle = {
  width: '100%', padding: '14px 16px', background: 'rgba(255,255,255,0.05)',
  border: '1px solid var(--bdr)', borderRadius: 12, color: 'var(--t)',
  fontSize: '0.92rem', fontFamily: 'var(--f)', outline: 'none',
}
const btnStyle = {
  width: '100%', padding: '14px', marginTop: 16,
  background: 'linear-gradient(135deg, var(--pink-hot), var(--purple))',
  color: '#fff', fontWeight: 700, fontSize: '0.88rem',
  border: 'none', borderRadius: 50, cursor: 'pointer',
  fontFamily: 'var(--f)',
}
