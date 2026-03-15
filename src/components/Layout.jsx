import { useAuth } from '../lib/auth'
import { useNavigate } from 'react-router-dom'

const LINE_URL = 'https://lin.ee/quzUszF'

export default function Layout({ children, showCastNav = false }) {
  const { isAuth, isAdmin, logout } = useAuth()
  const nav = useNavigate()

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* Ambient Orbs */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', borderRadius: '50%', filter: 'blur(130px)', animation: 'oFloat 25s ease-in-out infinite', width: 500, height: 500, background: 'var(--pink)', top: '-12%', left: '-8%', opacity: 0.3 }} />
        <div style={{ position: 'absolute', borderRadius: '50%', filter: 'blur(130px)', animation: 'oFloat 25s ease-in-out infinite', animationDelay: '-8s', width: 400, height: 400, background: 'var(--purple)', bottom: '-10%', right: '-5%', opacity: 0.25 }} />
        <div style={{ position: 'absolute', borderRadius: '50%', filter: 'blur(130px)', animation: 'oFloat 25s ease-in-out infinite', animationDelay: '-16s', width: 250, height: 250, background: 'var(--blue)', top: '50%', left: '55%', opacity: 0.15 }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: '12px 20px', background: 'rgba(11,10,18,0.88)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--bdr)' }}>
          <div style={{ maxWidth: 920, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <a href="/" onClick={e => { e.preventDefault(); nav('/') }} style={{ fontFamily: 'var(--fd)', fontSize: '1.15rem', color: 'var(--pink)', cursor: 'pointer' }}>
              OKINI Tokyo<span style={{ fontFamily: 'var(--f)', fontSize: '0.65rem', color: 'var(--td)', marginLeft: 8 }}>Real Voice</span>
            </a>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              {isAuth && (
                <>
                  {!isAdmin && <button onClick={() => nav('/submit')} style={navBtnStyle}>投稿する</button>}
                  {isAdmin && <button onClick={() => nav('/admin')} style={navBtnStyle}>管理画面</button>}
                  <button onClick={() => { logout(); nav('/') }} style={{ ...navBtnStyle, background: 'transparent', border: '1px solid var(--bdr)', color: 'var(--td)' }}>ログアウト</button>
                </>
              )}
              {!isAuth && (
                <button onClick={() => nav('/login')} style={{ ...navBtnStyle, background: 'transparent', border: '1px solid rgba(232,180,184,0.3)', color: 'var(--pink)' }}>キャスト専用</button>
              )}
              <a href={LINE_URL} target="_blank" rel="noopener noreferrer" style={{ background: 'linear-gradient(135deg,var(--pink-hot),var(--purple))', color: '#fff', fontSize: '0.72rem', fontWeight: 700, padding: '8px 20px', borderRadius: 50 }}>LINEで応募</a>
            </div>
          </div>
        </header>

        <main style={{ paddingTop: 60, paddingBottom: 80 }}>{children}</main>

        {/* Footer */}
        <footer style={{ background: 'rgba(0,0,0,0.3)', color: 'var(--tm)', textAlign: 'center', padding: '24px 20px', fontSize: '0.68rem' }}>
          OKINI Tokyo in 蒲田｜蒲田デリバリーヘルス
        </footer>

        {/* Fixed Bottom */}
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 99, background: 'rgba(11,10,18,0.92)', backdropFilter: 'blur(14px)', padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, borderTop: '1px solid var(--bdr)' }}>
          <span style={{ color: 'var(--td)', fontSize: '0.75rem' }}>応募・質問</span>
          <a href={LINE_URL} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#06C755', color: '#fff', fontSize: '0.78rem', fontWeight: 700, padding: '10px 22px', borderRadius: 50 }}>LINE</a>
        </div>
      </div>
    </div>
  )
}

const navBtnStyle = {
  background: 'rgba(232,180,184,0.12)',
  border: '1px solid rgba(232,180,184,0.3)',
  color: 'var(--pink)',
  fontSize: '0.72rem',
  fontWeight: 500,
  padding: '6px 14px',
  borderRadius: 50,
  cursor: 'pointer',
  fontFamily: 'var(--f)',
}
