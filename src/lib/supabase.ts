import { createClient } from "@supabase/supabase-js";

// 從環境變數讀取設定
// NEXT_PUBLIC_ 開頭代表這個變數可以暴露給瀏覽器
// Supabase 的 anon key 設計上就是公開的，搭配 RLS 才是安全機制
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// 建立單一 Supabase 客戶端實例
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
