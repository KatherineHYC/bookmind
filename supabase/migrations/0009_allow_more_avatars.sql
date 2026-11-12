-- ============================================================
-- profiles：頭像從 3 個擴充到 6 個
-- ------------------------------------------------------------
-- CHECK 約束不能直接修改，只能「先刪掉舊的、再建一條新的」。
-- 舊資料都是 avatar-1～3，也符合新規則，所以建立時不會報錯。
-- ============================================================
alter table public.profiles
  drop constraint profiles_avatar_key_check;

alter table public.profiles
  add constraint profiles_avatar_key_check
    check (avatar_key in (
      'avatar-1', 'avatar-2', 'avatar-3',
      'avatar-4', 'avatar-5', 'avatar-6'
    ));
