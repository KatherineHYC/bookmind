-- 拿掉舊封面網址裡的 Google 卷邊參數（edge=curl）
-- 新加入的書已經在 API Route 裡處理掉了，這裡只清理之前存進來的舊資料
update public.books
set cover_url = replace(cover_url, '&edge=curl', '')
where cover_url like '%edge=curl%';
