# Supabase セットアップガイド

## 1. プロジェクト作成
1. https://supabase.com にアクセス → Sign Up / Sign In
2. 「New Project」→ 名前: `okini-voice` → Region: `Northeast Asia (Tokyo)` → パスワード設定
3. 作成完了まで2分ほど待つ

## 2. APIキー取得
1. 左メニュー「Settings」→「API」
2. **Project URL** と **anon public key** をコピー
3. プロジェクトルートに `.env` ファイルを作成:

```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxxxx...
VITE_ADMIN_PASSCODE=admin1234
VITE_CAST_PASSCODE=cast5678
```

## 3. テーブル作成
Supabaseダッシュボード → SQL Editor → 以下を実行:

```sql
-- ユーザープロフィール
CREATE TABLE users_profile (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  display_initial text NOT NULL,
  age int,
  tenure text,
  category text,
  total_points int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- 口コミ
CREATE TABLE reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users_profile(id),
  category text NOT NULL,
  type text NOT NULL CHECK (type IN ('good', 'wish')),
  rating int CHECK (rating BETWEEN 1 AND 5),
  tags text[] DEFAULT '{}',
  body text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  share_url text,
  share_clicks int DEFAULT 0,
  share_engagements jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  approved_at timestamptz
);

-- ポイント（Phase 3用、先にテーブルだけ作成）
CREATE TABLE points (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users_profile(id),
  amount int NOT NULL,
  reason text NOT NULL,
  review_id uuid REFERENCES reviews(id),
  created_at timestamptz DEFAULT now()
);

-- RLS有効化
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE users_profile ENABLE ROW LEVEL SECURITY;

-- 公開ページ: approvedの口コミは誰でも読める
CREATE POLICY "Public read approved reviews"
  ON reviews FOR SELECT
  USING (status = 'approved');

-- 投稿: 認証済みユーザーは投稿可能（anon keyでもINSERT可能にする）
CREATE POLICY "Anyone can insert reviews"
  ON reviews FOR INSERT
  WITH CHECK (true);

-- 管理: 全件読み取り（管理画面用 - service_role keyで操作）
CREATE POLICY "Admin read all reviews"
  ON reviews FOR SELECT
  USING (true);

-- 管理: ステータス更新
CREATE POLICY "Admin update reviews"
  ON reviews FOR UPDATE
  USING (true);

-- プロフィール
CREATE POLICY "Public read profiles"
  ON users_profile FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert profiles"
  ON users_profile FOR INSERT
  WITH CHECK (true);

-- シードデータ投入用インデックス
CREATE INDEX idx_reviews_status ON reviews(status);
CREATE INDEX idx_reviews_category ON reviews(category);
CREATE INDEX idx_reviews_created ON reviews(created_at DESC);
```

## 4. シードデータ投入
管理画面からログイン後、「シードデータ投入」ボタンで37件の既存口コミを一括投入できます。
または SQL Editor から `seed.sql` を実行してください。
