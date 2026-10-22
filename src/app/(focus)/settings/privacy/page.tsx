import type { Metadata } from "next";
import LegalPage, { type LegalSection } from "@/components/settings/LegalPage";
import { SUPPORT_EMAIL } from "@/lib/app-info";

export const metadata: Metadata = { title: "隱私政策 - BookMind" };

const SECTIONS: LegalSection[] = [
  {
    heading: "我們收集哪些資料",
    paragraphs: [
      "BookMind 只收集提供服務所需的最少資料：你新增的書籍、摘錄與筆記，以及暱稱與頭像設定。若你使用 Google 帳號登入，我們只會取得電子郵件，用來辨識你的帳號。",
    ],
  },
  {
    heading: "資料如何儲存",
    paragraphs: [
      "你的書籍與筆記儲存在 Supabase 雲端資料庫，傳輸過程皆經過加密，並設有存取權限控管，只有你本人能讀取自己的資料。",
    ],
  },
  {
    heading: "訪客模式與登入",
    paragraphs: [
      "你可以先以訪客身分使用，不需要註冊。訪客身分記錄在這台裝置的瀏覽器中，若清除瀏覽器資料或更換裝置，將無法再取回原本的書籍與筆記。",
      "使用 Google 帳號登入後，資料會綁定到你的帳號，換裝置也能繼續使用。",
    ],
  },
  {
    heading: "第三方服務",
    paragraphs: [
      "搜尋或掃描書籍時，你輸入的關鍵字或 ISBN 會送到 Google Books 查詢書籍資訊。除此之外，我們不會把你的資料提供給任何第三方。",
    ],
  },
  {
    heading: "如何刪除你的資料",
    paragraphs: [
      "你可以隨時在 App 內刪除任何書籍或筆記，也可以在「我的」頁面使用「清除本機資料」一次刪除全部內容。",
    ],
  },
  {
    heading: "聯絡我們",
    paragraphs: [`對隱私政策有任何疑問，歡迎來信 ${SUPPORT_EMAIL}。`],
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage title="隱私政策" updatedAt="2026 年 10 月" sections={SECTIONS} />
  );
}
