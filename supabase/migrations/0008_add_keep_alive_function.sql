-- 給每日排程呼叫的「心跳」函式：只執行 select 1，不讀也不改任何資料
-- 目的：讓資料庫每天都有一次活動，避免 Supabase 免費版閒置 7 天後自動暫停
create or replace function public.keep_alive()
returns void
language sql
as $$
  select 1;
$$;

-- 排程是從伺服器以「未登入（anon）」身分呼叫，所以要開放 anon 執行這個函式
-- 函式本身什麼資料都碰不到，開放給任何人呼叫也沒有風險
grant execute on function public.keep_alive() to anon;
