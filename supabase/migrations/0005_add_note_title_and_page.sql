-- ============================================================
-- notes 新增「標題」與「頁碼」兩欄（新增筆記頁要用）
-- ------------------------------------------------------------
-- 兩欄都允許空值：都是選填欄位，而且舊筆記本來就沒有這兩項資料
-- ============================================================
alter table public.notes
  add column title text,
  add column page  integer;


-- 標題：沒填就存 null，不允許空字串或全是空白，最多 50 字
-- （和 notes_shape_check 同樣用 btrim，只打空白鍵不算有填）
alter table public.notes
  add constraint notes_title_check
    check (
      title is null
      or (length(btrim(title)) > 0 and char_length(title) <= 50)
    );

-- 頁碼：一定是正整數
alter table public.notes
  add constraint notes_page_positive_check
    check (page is null or page > 0);

-- 頁碼只屬於摘錄：心得是自己的想法，不對應書中某一頁
alter table public.notes
  add constraint notes_page_excerpt_only_check
    check (page is null or type = 'excerpt');
