-- ============================================================
-- 筆記的新增／更新規則：「筆記是你的」之外，「掛的那本書」也要是你的
-- ------------------------------------------------------------
-- 原本只檢查 user_id，沒檢查 book_id。
-- 有心人可以送一筆 user_id 是自己、book_id 是別人的書的筆記，資料庫會照收：
-- 外鍵只確認「這本書存在」，不管書是誰的。
-- ============================================================

drop policy "使用者只能新增自己的筆記" on public.notes;
drop policy "使用者只能更新自己的筆記" on public.notes;

-- notes.book_id 指的是「正要寫入的這一列」的 book_id
-- books.user_id = auth.uid() 寫明出來，不依賴 books 表自己的 RLS
create policy "使用者只能在自己的書下新增筆記" on public.notes
  for insert with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.books
      where books.id = notes.book_id
        and books.user_id = auth.uid()
    )
  );

-- using：只能挑自己的筆記來改
-- with check：改完的結果也要符合規則（不能把筆記搬到別人的書下）
create policy "使用者只能在自己的書下更新筆記" on public.notes
  for update
  using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.books
      where books.id = notes.book_id
        and books.user_id = auth.uid()
    )
  );
