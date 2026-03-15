export const STORY_QUESTIONS = {
  '客質/客層': [
    { key: 'before', label: '入る前の気持ち', placeholder: '客層についてどんなイメージ（不安）がありましたか？\n例: 酔っ払い多そう、怖い人来そう…' },
    { key: 'experience', label: '実際の体験', placeholder: '実際に働いてみて、お客さんはどんな感じでしたか？\n例: 紳士的な方が多い、ロングのお客様が多い…' },
    { key: 'insight', label: '気づき・おすすめ', placeholder: '他のお店と比べて違うなと思ったポイントは？\n（未経験なら「想像と違った点」でもOK）' },
  ],
  '給与/報酬/待遇': [
    { key: 'before', label: '入る前の気持ち', placeholder: 'お給料についてどんな不安がありましたか？\n例: 本当に稼げるの？求人に嘘がないか心配…' },
    { key: 'experience', label: '実際の体験', placeholder: '実際の稼ぎは期待と比べてどうでしたか？\n（具体額はぼかしてもOK）' },
    { key: 'insight', label: '気づき・おすすめ', placeholder: '報酬面で「これがいい」と感じたポイントは？\n例: 日払い、バック率、ロング率…' },
  ],
  '人間関係': [
    { key: 'before', label: '入る前の気持ち', placeholder: 'スタッフとの関係で気になっていたことは？\n例: 距離感は？口うるさくない？' },
    { key: 'experience', label: '実際の体験', placeholder: '実際のスタッフ・ドライバー・女の子同士の雰囲気は？\n具体的な場面があると◎' },
    { key: 'insight', label: '気づき・おすすめ', placeholder: '長く続けられそうと思った理由は？' },
  ],
  '通勤環境': [
    { key: 'before', label: '入る前の気持ち', placeholder: '通勤（アクセス）で心配だったことは？' },
    { key: 'experience', label: '実際の体験', placeholder: '実際の送迎・立地・アクセスはどうでしたか？' },
    { key: 'insight', label: '気づき・おすすめ', placeholder: '出稼ぎ/通いとして便利だと感じたポイントは？' },
  ],
  '求人ページ信用度': [
    { key: 'before', label: '入る前の気持ち', placeholder: '求人ページを見た時、正直どう思いましたか？' },
    { key: 'experience', label: '実際の体験', placeholder: '実際に入ってみて、求人の内容と合ってましたか？' },
    { key: 'insight', label: '気づき・おすすめ', placeholder: '「ここは本当だった」と思ったポイントは？' },
  ],
  '待機環境': [
    { key: 'before', label: '入る前の気持ち', placeholder: '待機って何するの？と思ってましたか？' },
    { key: 'experience', label: '実際の体験', placeholder: '待機室の実際の雰囲気・設備はどうでしたか？' },
    { key: 'insight', label: '気づき・おすすめ', placeholder: '待機中の過ごし方で気に入っているポイントは？' },
  ],
}

export const BOOST_HINTS = [
  { min: 0, msg: 'まずは入る前の気持ちから書いてみましょう 🌱' },
  { min: 30, msg: 'いい感じ！実際の体験を足すと説得力UP ✨' },
  { min: 80, msg: '素晴らしい！最後に気づきやおすすめポイントを 💡' },
  { min: 130, msg: '完璧な口コミです🌸 シェアしたら反応もらえるかも！' },
]

export const SHARE_TEMPLATE = (review) => {
  const stars = '★'.repeat(review.rating || 5) + '☆'.repeat(5 - (review.rating || 5))
  const bodySnippet = (review.body || '').slice(0, 40) + ((review.body || '').length > 40 ? '…' : '')
  return `OKINI蒲田で働いてます🌸

${bodySnippet}

${stars}（${review.category}）

#OKINI蒲田 #高収入バイト #蒲田`
}
