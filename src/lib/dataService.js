import { supabase, isSupabaseConfigured } from './supabase'
import seedData from '../data/reviews-seed.json'

const LS_KEY = 'okini_reviews'

function getLocal() {
  const stored = localStorage.getItem(LS_KEY)
  if (stored) return JSON.parse(stored)
  const init = seedData.map(r => ({ ...r, status: 'approved', rating: 5 }))
  localStorage.setItem(LS_KEY, JSON.stringify(init))
  return init
}
function saveLocal(data) { localStorage.setItem(LS_KEY, JSON.stringify(data)) }

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

export async function submitReview(review) {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase
      .from('reviews')
      .insert([{
        category: review.category,
        type: review.type,
        rating: review.rating,
        tags: review.tags,
        body: review.body,
        date: review.date,
        status: 'pending',
      }])
      .select()
    if (error) { console.error(error); throw error }
    return data[0]
  }
  const newReview = { ...review, id: 'r' + Date.now(), status: 'pending', created_at: new Date().toISOString() }
  const all = getLocal()
  all.unshift(newReview)
  saveLocal(all)
  return newReview
}

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

export async function seedReviews() {
  const reviews = seedData.map(r => ({
    category: r.category,
    type: r.type,
    rating: 5,
    tags: [],
    body: r.body,
    date: r.date,
    status: 'approved',
  }))
  if (isSupabaseConfigured()) {
    const { error } = await supabase.from('reviews').insert(reviews)
    if (error) { console.error(error); throw error }
    return reviews.length
  }
  saveLocal(reviews)
  return reviews.length
}