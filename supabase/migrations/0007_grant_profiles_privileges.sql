-- ============================================================
-- profiles：補上 authenticated 角色的資料表權限
-- ------------------------------------------------------------
-- GRANT 決定「能不能碰這張表」，RLS 決定「能碰哪幾列」，兩道都要過。
-- 匿名登入的使用者也是 authenticated 角色，所以只需要給它。
-- 列的範圍仍由 0001 的 RLS policy 限制在 auth.uid() = user_id。
-- ============================================================
grant select, insert, update, delete on public.profiles to authenticated;
