import type { Metadata } from "next";
import LegalPage, { type LegalSection } from "@/components/settings/LegalPage";

export const metadata: Metadata = { title: "使用條款 - BookMind" };

const SECTIONS: LegalSection[] = [
  {
    heading: "服務說明",
    paragraphs: [
      "BookMind 是一款協助你記錄紙本書閱讀筆記的個人工具。我們會盡力提供穩定、簡潔的使用體驗，但無法保證服務永不中斷或完全沒有錯誤。",
    ],
  },
  {
    heading: "使用者的責任",
    paragraphs: [
      "請妥善保管你的登入帳號與裝置，並對你新增的內容負責。書摘內容請僅作為個人閱讀筆記使用，勿用於違法或侵害他人權益的用途。",
    ],
  },
  {
    heading: "內容所有權",
    paragraphs: [
      "你寫下的筆記與整理屬於你本人；書摘中引用的原文，著作權仍屬於原作者。我們不會主動使用、販售或分享你的內容。",
    ],
  },
  {
    heading: "免責聲明",
    paragraphs: [
      "書籍資訊來自 Google Books，可能有誤或不完整。在法律允許的範圍內，對於因使用本服務所導致的直接或間接損失，我們不承擔責任。",
    ],
  },
  {
    heading: "條款變更",
    paragraphs: [
      "若條款有重大變更，我們會在 App 內通知你。繼續使用即表示你同意更新後的條款。",
    ],
  },
];

export default function TermsPage() {
  return (
    <LegalPage title="使用條款" updatedAt="2026 年 10 月" sections={SECTIONS} />
  );
}
