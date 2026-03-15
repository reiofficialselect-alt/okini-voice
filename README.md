# OKINI Voice - 口コミWebアプリ

## クイックスタート

```bash
npm install
npm run dev
```

→ http://localhost:5173 で起動

## Supabase未設定でも動作します
ローカルストレージにデータを保存するフォールバックが入っているため、
Supabase未設定の状態でも全機能を試せます。

## Supabase接続する場合
1. SUPABASE_SETUP.md の手順に従ってプロジェクト作成
2. .env.example を .env にコピーしてキーを設定
3. SQLを実行してテーブル作成

## ページ一覧
- `/` - 公開口コミページ
- `/login` - キャスト/管理者ログイン
- `/submit` - 口コミ投稿フォーム（要ログイン）
- `/admin` - 管理画面（管理者パスコードでログイン）

## デフォルトパスコード
- キャスト: `cast5678`
- 管理者: `admin1234`
（.envで変更可能）
