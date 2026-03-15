import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { submitReview } from '../lib/dataService'
import { CATEGORIES, TAG_OPTIONS, catColor } from '../lib/helpers'
import { STORY_QUESTIONS, BOOST_HINTS } from '../data/templates'
import SharePanel from '../components/SharePanel'
import Layout from '../components/Layout'

const STEP_LABELS = ['カテゴリ', 'タイプ', 'ストーリー', 'タグ', '確認']

export default function Submit() {
  const { isAuth } = useAuth()
  const nav = useNavigate()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({ category: '', type: 'good', rating: 5, tags: [], story: { before: '', experience: '', insight: '' }, extra: '' })
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)

  if (!isAuth) { nav('/login'); return null }

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const setStory = (k, v) => setForm(f => ({ ...f, story: { ...f.story, [k]: v } }))
  const toggleTag = t => set('tags', form.tags.includes(t) ? form.tags.filter(x => x !== t) : [...form.tags, t])

  const buildBody = () => {
    const parts = [form.story.before, form.story.experience, form.story.insight].filter(Boolean)
    if (form.extra) parts.push(form.extra)
    return parts.join('\n\n')
  }

  const bodyLength = buildBody().length
  const currentHint = [...BOOST_HINTS].reverse().find(h => bodyLength >= h.min)
  const canNext = () => { if (step === 0) return !!form.category; if (step === 2) return bodyLength > 20; return true }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      const review = await submitReview({ category: form.category, type: form.type, rating: form.rating, tags: form.tags, body: buildBody(), date: new Date().toISOString().slice(0, 7).replace('-', '.') })
      setResult(review)
    } catch (err) { alert('投稿に失敗しました: ' + err.message) }
    setSubmitting(false)
  }

  if (result) return (
    <Layout>
      <div style={{ maxWidth: 560, margin: '40px auto', padding: '0 20px' }}>
        <div style={{ ...glass, padding: 40, textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>🌸</div>
          <h2 style={{ fontFamily: 'var(--fd)', fontSize: '1.4rem', fontStyle: 'italic', marginBottom: 6 }}>投稿ありがとう！</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--td)', marginBottom: 28 }}>スタッフ確認後に公開されます</p>
          <SharePanel review={{ ...result, body: buildBody() }} />
          <button onClick={() => nav('/')} style={{ ...btnSec, marginTop: 20, width: '100%' }}>口コミ一覧に戻る</button>
        </div>
      </div>
    </Layout>
  )

  return (
    <Layout>
      <div style={{ maxWidth: 600, margin: '40px auto', padding: '0 20px' }}>
        <h1 style={{ fontFamily: 'var(--fd)', fontSize: '1.5rem', fontStyle: 'italic', textAlign: 'center', marginBottom: 4 }}>Write a Review</h1>
        <p style={{ fontSize: '0.82rem', color: 'var(--td)', textAlign: 'center', marginBottom: 24 }}>あなたの声を聞かせてください</p>

        {/* Progress */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 28 }}>
          {STEP_LABELS.map((l, i) => (
            <div key={i} style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ height: 3, borderRadius: 2, background: i <= step ? 'var(--pink)' : 'rgba(255,255,255,0.06)', transition: 'all 0.3s', marginBottom: 4 }} />
              <span style={{ fontSize: '0.62rem', color: i <= step ? 'var(--pink)' : 'var(--tm)' }}>{l}</span>
            </div>
          ))}
        </div>

        <div style={glass}>
          {step === 0 && <div><StepTitle n={1} t="どのカテゴリ？" /><div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>{CATEGORIES.map(c => <button key={c} onClick={() => set('category', c)} style={{ ...chip, background: form.category === c ? catColor(c) + '22' : 'rgba(255,255,255,0.04)', borderColor: form.category === c ? catColor(c) : 'var(--bdr)', color: form.category === c ? catColor(c) : 'var(--td)' }}>{c}</button>)}</div></div>}

          {step === 1 && <div><StepTitle n={2} t="良い点？改善要望？" /><div style={{ display: 'flex', gap: 8, margin: '16px 0' }}>{[['good', '良い点 ✨', 'var(--blue)'], ['wish', '改善要望 💭', 'var(--red)']].map(([v, l, c]) => <button key={v} onClick={() => set('type', v)} style={{ ...chip, flex: 1, justifyContent: 'center', padding: 14, background: form.type === v ? c.replace('var(', '').replace(')', '') === '--blue' ? 'rgba(107,143,232,0.12)' : 'rgba(232,112,112,0.12)' : 'rgba(255,255,255,0.04)', borderColor: form.type === v ? (v === 'good' ? 'rgba(107,143,232,0.4)' : 'rgba(232,112,112,0.4)') : 'var(--bdr)', color: form.type === v ? (v === 'good' ? 'var(--blue)' : 'var(--red)') : 'var(--td)' }}>{l}</button>)}</div><div style={{ marginTop: 20 }}><span style={{ fontSize: '0.82rem', color: 'var(--td)' }}>評価</span><div style={{ display: 'flex', gap: 8, marginTop: 8 }}>{[1,2,3,4,5].map(n => <button key={n} onClick={() => set('rating', n)} style={{ width: 44, height: 44, borderRadius: '50%', border: 'none', cursor: 'pointer', fontSize: '1.2rem', background: n <= form.rating ? 'var(--pink)' : 'rgba(255,255,255,0.06)', color: n <= form.rating ? 'var(--bg)' : 'var(--tm)', fontWeight: 700, transition: 'all 0.2s' }}>★</button>)}</div></div></div>}

          {step === 2 && <div><StepTitle n={3} t="あなたのストーリー" /><p style={{ fontSize: '0.75rem', color: 'var(--tm)', margin: '4px 0 16px' }}>3つの質問に答えるだけ。SNSで反応がもらえる構成になります。</p>{(STORY_QUESTIONS[form.category] || STORY_QUESTIONS['客質/客層']).map((q, i) => <div key={q.key} style={{ marginBottom: 16 }}><label style={{ fontSize: '0.78rem', fontWeight: 500, color: ['var(--gold)', 'var(--pink)', 'var(--green)'][i], display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}><span style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', color: 'var(--td)' }}>{i + 1}</span>{q.label}</label><textarea value={form.story[q.key]} onChange={e => setStory(q.key, e.target.value)} placeholder={q.placeholder} rows={3} style={ta} /></div>)}<div style={{ marginTop: 8 }}><label style={{ fontSize: '0.78rem', color: 'var(--td)', marginBottom: 6, display: 'block' }}>追加コメント（任意）</label><textarea value={form.extra} onChange={e => set('extra', e.target.value)} placeholder="他に伝えたいことがあれば" rows={2} style={ta} /></div>{currentHint && <div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(232,213,168,0.08)', border: '1px solid rgba(232,213,168,0.15)', borderRadius: 10, fontSize: '0.75rem', color: 'var(--gold)' }}>{currentHint.msg}</div>}<div style={{ fontSize: '0.68rem', color: 'var(--tm)', textAlign: 'right', marginTop: 6 }}>{bodyLength}文字</div></div>}

          {step === 3 && <div><StepTitle n={4} t="タグを選択（任意）" /><p style={{ fontSize: '0.75rem', color: 'var(--tm)', marginBottom: 12 }}>あてはまるものをタップ。シェア時のハッシュタグにもなります。</p><div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{TAG_OPTIONS.map(t => <button key={t} onClick={() => toggleTag(t)} style={{ ...chip, fontSize: '0.75rem', background: form.tags.includes(t) ? 'rgba(232,180,184,0.15)' : 'rgba(255,255,255,0.04)', borderColor: form.tags.includes(t) ? 'rgba(232,180,184,0.3)' : 'var(--bdr)', color: form.tags.includes(t) ? 'var(--pink)' : 'var(--td)' }}>{form.tags.includes(t) ? '✓ ' : ''}{t}</button>)}</div></div>}

          {step === 4 && <div><StepTitle n={5} t="投稿プレビュー" /><div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--bdr)', borderRadius: 16, padding: 18, marginTop: 12, borderLeft: '3px solid ' + catColor(form.category) }}><div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10, flexWrap: 'wrap' }}><span style={{ fontSize: '0.62rem', fontWeight: 700, padding: '3px 10px', borderRadius: 50, background: form.type === 'good' ? 'rgba(107,143,232,0.15)' : 'rgba(232,112,112,0.15)', color: form.type === 'good' ? 'var(--blue)' : 'var(--red)' }}>{form.type === 'good' ? '良い点' : '改善要望'}</span><span style={{ fontSize: '0.78rem', fontWeight: 700, color: catColor(form.category) }}>{form.category}</span><span style={{ marginLeft: 'auto', color: 'var(--gold)', fontSize: '0.82rem' }}>{'★'.repeat(form.rating)}{'☆'.repeat(5 - form.rating)}</span></div><p style={{ fontSize: '0.85rem', color: 'var(--td)', lineHeight: 1.9, whiteSpace: 'pre-wrap' }}>{buildBody()}</p>{form.tags.length > 0 && <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 10 }}>{form.tags.map(t => <span key={t} style={{ fontSize: '0.65rem', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--bdr)', borderRadius: 50, padding: '2px 8px', color: 'var(--tm)' }}>{t}</span>)}</div>}</div><p style={{ fontSize: '0.72rem', color: 'var(--tm)', textAlign: 'center', marginTop: 12 }}>スタッフ承認後に公開されます</p></div>}

          {/* Nav */}
          <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
            {step > 0 && <button onClick={() => setStep(s => s - 1)} style={btnSec}>戻る</button>}
            <div style={{ flex: 1 }} />
            {step < 4 ? <button onClick={() => setStep(s => s + 1)} disabled={!canNext()} style={{ ...btnPri, opacity: canNext() ? 1 : 0.4 }}>次へ →</button> : <button onClick={handleSubmit} disabled={submitting} style={{ ...btnPri, opacity: submitting ? 0.5 : 1 }}>{submitting ? '送信中...' : '投稿する 🌸'}</button>}
          </div>
        </div>
      </div>
    </Layout>
  )
}

function StepTitle({ n, t }) {
  return <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}><span style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,var(--pink-hot),var(--purple))', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>{n}</span><span style={{ fontSize: '1rem', fontWeight: 700 }}>{t}</span></div>
}

const glass = { background: 'var(--card)', border: '1px solid var(--bdr)', borderRadius: 20, padding: 28, backdropFilter: 'blur(8px)' }
const chip = { display: 'inline-flex', alignItems: 'center', padding: '8px 16px', borderRadius: 50, border: '1px solid var(--bdr)', fontSize: '0.78rem', cursor: 'pointer', fontFamily: 'var(--f)', transition: 'all 0.2s' }
const ta = { width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--bdr)', borderRadius: 12, color: 'var(--t)', fontSize: '0.85rem', fontFamily: 'var(--f)', outline: 'none', resize: 'vertical', lineHeight: 1.8 }
const btnPri = { padding: '14px 28px', background: 'linear-gradient(135deg,var(--pink-hot),var(--purple))', color: '#fff', fontWeight: 700, fontSize: '0.88rem', border: 'none', borderRadius: 50, cursor: 'pointer', fontFamily: 'var(--f)' }
const btnSec = { padding: '14px 28px', background: 'transparent', border: '1px solid var(--bdr)', color: 'var(--td)', fontSize: '0.88rem', borderRadius: 50, cursor: 'pointer', fontFamily: 'var(--f)' }
