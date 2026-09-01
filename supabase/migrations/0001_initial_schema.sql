-- ============================================================
-- BookMind Baseline Schema
-- ------------------------------------------------------------
-- 這份檔案描述資料庫「目前」的完整結構，用於重建環境。
-- 現有的 Supabase 專案已經是這個狀態，請勿重複執行。
-- 之後的每一次結構變更，另開 00NN_ 開頭的新檔案。
-- ============================================================


-- ============================================================
-- books：使用者的書單
-- ============================================================
create table public.books (
  id              uuid        primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  user_id         uuid        not null,
  google_books_id text,
  title           text        not null,
  authors         text,
  cover_url       text,
  status          text        not null default 'want_to_read',
  updated_at      timestamptz not null default now(),
  isbn13          text,

  -- 閱讀狀態只允許三種值，對應設計稿的篩選 chips
  constraint books_status_check
    check (status in ('want_to_read', 'reading', 'completed'))
);

-- 藏書頁的查詢形狀：先篩使用者，再依加入時間新到舊排序
create index books_user_created_idx
  on public.books (user_id, created_at desc);

alter table public.books enable row level security;

create policy "使用者只能讀自己的書" on public.books
  for select using (auth.uid() = user_id);

create policy "使用者只能新增自己的書" on public.books
  for insert with check (auth.uid() = user_id);

create policy "使用者只能更新自己的書" on public.books
  for update using (auth.uid() = user_id);

create policy "使用者只能刪除自己的書" on public.books
  for delete using (auth.uid() = user_id);


-- ============================================================
-- notes：閱讀筆記，分為摘錄與心得兩種型別
-- ============================================================
create table public.notes (
  id         uuid        primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id    uuid        not null,
  book_id    uuid        not null
               references public.books (id) on delete cascade,
  excerpt    text,
  content    text,
  updated_at timestamptz not null default now(),
  type       text        not null default 'thought',

  -- 型別只允許摘錄與心得兩種
  constraint notes_type_check
    check (type in ('excerpt', 'thought')),

  -- 資料形狀：摘錄必有原文（感想選填）；心得必有內容且不可有原文
  -- btrim 去除頭尾空白，避免只打空白鍵就通過檢查
  constraint notes_shape_check
    check (
      (type = 'excerpt' and excerpt is not null and length(btrim(excerpt)) > 0)
      or
      (type = 'thought' and excerpt is null and content is not null and length(btrim(content)) > 0)
    )
);

-- 筆記頁的查詢形狀
create index notes_user_created_idx
  on public.notes (user_id, created_at desc);

-- 書籍詳情頁「這本書的筆記」查詢
create index notes_book_id_idx
  on public.notes (book_id);

alter table public.notes enable row level security;

create policy "使用者只能讀自己的筆記" on public.notes
  for select using (auth.uid() = user_id);

create policy "使用者只能新增自己的筆記" on public.notes
  for insert with check (auth.uid() = user_id);

create policy "使用者只能更新自己的筆記" on public.notes
  for update using (auth.uid() = user_id);

create policy "使用者只能刪除自己的筆記" on public.notes
  for delete using (auth.uid() = user_id);


-- ============================================================
-- profiles：個人設定（暱稱與頭像）
-- ------------------------------------------------------------
-- 主鍵直接用 user_id，保證一個使用者只會有一筆設定。
-- 外鍵指向 auth.users，帳號被刪除時設定一併清除。
-- ============================================================
create table public.profiles (
  user_id      uuid        primary key
                 references auth.users (id) on delete cascade,
  display_name text        not null default '閱讀旅人',
  avatar_key   text        not null default 'avatar-1',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),

  -- 頭像是固定插圖組，存 key 而非 URL
  constraint profiles_avatar_key_check
    check (avatar_key in ('avatar-1', 'avatar-2', 'avatar-3'))
);

alter table public.profiles enable row level security;

create policy "使用者只能讀自己的個人資料" on public.profiles
  for select using (auth.uid() = user_id);

create policy "使用者只能新增自己的個人資料" on public.profiles
  for insert with check (auth.uid() = user_id);

create policy "使用者只能更新自己的個人資料" on public.profiles
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "使用者只能刪除自己的個人資料" on public.profiles
  for delete using (auth.uid() = user_id);
