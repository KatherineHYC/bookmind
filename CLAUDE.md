# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 指令

- 改完先跑 `npm run typecheck` 和 `npm run lint` 再 commit。專案目前沒有測試。
- `npm run build` 必須維持 `next build --webpack`：next-pwa 是 webpack plugin，Turbopack 不會產生 service worker。開發模式下 PWA 是關閉的。

## 專案規則

- UI 文字一律繁體中文。
- 預設 Server Component，需要互動才加 `'use client'`。
- TypeScript strict，不用 `any`。Supabase 型別手動維護，用 `.overrideTypes<T, { merge: false }>()`。
- 不直接改 `src/components/ui/`（shadcn 產生的檔案），外觀用 `globals.css` 的 token 控制。shadcn 底層是 Base UI（`@base-ui/react`），不是 Radix。
- `cn` 從 `@/lib/utils` 引入。
- Zod 是 v4，用 v4 API（例如 `z.url()`）。
- API key 只放 API Route；Supabase 查詢都要有 RLS。
- Mobile First；主要測試裝置是 iPhone 12、iPad Pro 11"、MacBook Air（Chrome + Safari）。
- code 裡只寫工作註解（讓人看懂這段在做什麼），不寫學習筆記註解。

## 架構

- `src/proxy.ts` 是 Next 16 的 middleware（沒有 `middleware.ts`）：刷新 Supabase session，沒有使用者時自動 `signInAnonymously()`。
- 讀取：`src/lib/queries/`（集中的查詢層，每個檔案開頭 `import "server-only"`）。寫入：`src/app/actions/` Server Actions（zod 驗證 + `revalidatePath`/`redirect`）。
- 篩選、搜尋、排序狀態放在 URL searchParams（`src/lib/search-params.ts`、`book-filters.ts`、`note-filters.ts`）。
- 元件資料夾：`layouts/` 結構外殼、`features/` 跨領域共用元件、`books/` `notes/` `home/` 等為領域元件。
- Route groups：`(main)` 有底部導覽列的頁面，`(focus)` 專注型頁面（新增書、書籍詳情、編輯筆記）。
- `CRON_SECRET` 未設定時 `/api/keep-alive` 會拒絕所有請求（Vercel cron 每日呼叫，避免 Supabase 免費版閒置暫停）。

## 資料庫 Migration

- 在 `supabase/migrations/` 新增編號遞增的 `.sql`（接續目前最大編號），包含 RLS policy 與 GRANT。
- 沒有 Supabase CLI，由我手動貼到 SQL Editor 執行。Claude 只寫檔，不要嘗試套用。

## Git 流程

- 小改動直接在 main commit：樣式微調、文字修改、單一元件的小修正，且不動資料庫、不改資料流程。
- 系統性改動走 Issue + PR：新功能、跨多個檔案的行為改變、資料庫 migration、驗證或權限相關。
  流程：Issue → 分支 `<issue號>-<type>/<kebab-case>` → 小 commit → PR 最後一行 `Closes #N` → merge 後刪分支。
- 直接推 main 會立刻部署到正式環境，push 前必須先在本機確認畫面。
- 不確定屬於哪一種時，先問我。
- commit 用英文 Conventional Commits（含 scope，例如 `fix(books): ...`），一句話。
- Issue 與 PR 內文用繁體中文；Issue 用 `- [ ]` 列驗收條件，PR 用完成式描述做了什麼。
