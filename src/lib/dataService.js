import { supabase, isSupabaseConfigured } from './supabase'
import seedData from '../data/reviews-seed.json'

// ローカルストレージキー
const LS_KEY = 'okini_reviews'

function getLocal() {
  const stored = localStorage.getItem(LS_KEY)
  if (stored) return JSON.parse(stored)
  // シードデータを初期化（全件approved扱い）
  const init = seedData.map(r => ({ ...r, status: 'approved', rating: 5 }))
  localStorage.setItem(LS_KEY, JSON.stringify(init))
  return init
}
function saveLocal(data) { localStorage.setItem(LS_KEY, JSON.stringify(data)) }

// --- 公開口コミ取得 ---
export async function fetchApprovedReviews() {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
    if (error) { console.error(error); return getLocal().filter(r => r.status === 'approved') }
    return data
  }
  return getLocal().filter(r => r.status === 'approved')
}

// --- 全口コミ取得（管理用） ---
export async function fetchAllReviews() {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) { console.error(error); return getLocal() }
    return data
  }
  return getLocal()
}

// --- 口コミ投稿 ---
export async function submitReview(review) {
  const newReview = {
    ...review,
    id: 'r' + Date.now(),
    status: 'pending',
    created_at: new Date().toISOString(),
  }
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase.from('reviews').insert([newReview]).select()
    if (error) { console.error(error); throw error }
    return data[0]
  }
  const all = getLocal()
  all.unshift(newReview)
  saveLocal(all)
  return newReview
}

// --- ステータス更新（管理） ---
export async function updateReviewStatus(id, status) {
  if (isSupabaseConfigured()) {
    const { error } = await supabase
      .from('reviews')
      .update({ status, approved_at: status === 'approved' ? new Date().toISOString() : null })
      .eq('id', id)
    if (error) { console.error(error); throw error }
    return
  }
  const all = getLocal()
  const idx = all.findIndex(r => r.id === id)
  if (idx !== -1) {
    all[idx].status = status
    if (status === 'approved') all[idx].approved_at = new Date().toISOString()
    saveLocal(all)
  }
}

// --- シードデータ投入 ---
export async function seedReviews() {
  const reviews = seedData.map(r => ({ ...r, status: 'approved', rating: 5 }))
  if (isSupabaseConfigured()) {
    const { error } = await supabase.from('reviews').insert(reviews)
    if (error) { console.error(error); throw error }
    return reviews.length
  }
  saveLocal(reviews)
  return reviews.length
}
