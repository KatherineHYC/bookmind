-- ============================================================
-- 1. 防止重複加入同一本書
-- 2. updated_at 改由資料庫自動維護
-- ============================================================


-- ============================================================
-- 同一個使用者不能重複加入同一本書
-- ------------------------------------------------------------
-- 兩欄一組的唯一約束：user_id 可以重複、google_books_id 可以重複，
-- 但「同一組合」只能出現一次。不同使用者收藏同一本書不受影響。
-- ============================================================
alter table public.books
  add constraint books_user_google_id_key
  unique (user_id, google_books_id);


-- ============================================================
-- updated_at 自動更新
-- ------------------------------------------------------------
-- 欄位的 default now() 只在 INSERT 時生效，UPDATE 不會自動改。
-- 用一個 trigger 在每次更新前改寫這一欄，應用層就不必手動維護。
-- ============================================================

-- 共用函式：把即將寫入的那一列的 updated_at 換成現在時間
-- new 代表「即將寫入資料庫的那一列」，改完回傳它，資料庫才會存改過的版本
create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- before update：在資料真正寫入之前執行，才來得及改寫欄位
-- for each row：每更新一列就跑一次
create trigger books_set_updated_at
  before update on public.books
  for each row execute function public.set_updated_at();

create trigger notes_set_updated_at
  before update on public.notes
  for each row execute function public.set_updated_at();

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();
