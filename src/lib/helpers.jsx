// カテゴリ→色マッピング
export const catColor = (cat) => {
  if (cat?.includes('客質')) return '#6B8FE8'
  if (cat?.includes('給与')) return '#E8D5A8'
  if (cat?.includes('人間')) return '#E8B4B8'
  if (cat?.includes('通勤')) return '#9B7FBF'
  if (cat?.includes('求人')) return '#5BC4BE'
  if (cat?.includes('待機')) return '#6BCFA0'
  return '#E8B4B8'
}

// ハイライトワード
const HL_WORDS = ['女の子ファースト', '紳士', '稼げます', '稼げる', '働きやすい', '高待遇', '安心', '正直', '優しい', '丁寧']

export function highlightText(text) {
  const parts = []
  let rest = text
  while (rest.length > 0) {
    let idx = rest.length, word = ''
    for (const w of HL_WORDS) {
      const i = rest.indexOf(w)
      if (i !== -1 && i < idx) { idx = i; word = w }
    }
    if (!word) { parts.push(rest); break }
    if (idx > 0) parts.push(rest.slice(0, idx))
    parts.push(<span key={parts.length} style={{ color: '#E8D5A8', fontWeight: 500, textShadow: '0 0 12px rgba(232,213,168,0.3)' }}>{word}</span>)
    rest = rest.slice(idx + word.length)
  }
  return parts
}

// カテゴリ一覧
export const CATEGORIES = ['客質/客層', '給与/報酬/待遇', '人間関係', '通勤環境', '求人ページ信用度', '待機環境']

// タグ選択肢
export const TAG_OPTIONS = ['未経験', '経験者', '出稼ぎ', '学生', '通い', '短時間OK', '稼げる', '客質良い', 'スタッフ◎', '送迎あり', '個室待機', '寮あり']
