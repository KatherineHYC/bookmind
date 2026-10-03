import type { BookListItem } from "@/types/book";

function mockCover(bg: string, label: string, height = 300): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 ${height}">
    <rect width="200" height="${height}" fill="${bg}"/>
    <text x="100" y="${height / 2}" fill="#ffffff" font-size="24" font-family="serif" text-anchor="middle">${label}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// 每一本都對應一個要檢查的情境（寫在註解裡）
export const MOCK_BOOKS: BookListItem[] = [
  {
    // 基本款：短書名、單一作者
    id: "mock-1",
    googleBooksId: "mock-g-1",
    title: "原子習慣",
    authors: ["詹姆斯．克利爾"],
    coverUrl: mockCover("#8a7f66", "原子習慣"),
    status: "reading",
    createdAt: "2026-09-28T10:00:00Z",
    isbn13: "9789861755267",
    noteCount: 3,
  },
  {
    // 書名剛好接近一行的寬度
    id: "mock-2",
    googleBooksId: "mock-g-2",
    title: "被討厭的勇氣",
    authors: ["岸見一郎", "古賀史健"],
    coverUrl: mockCover("#5f7d95", "勇氣"),
    status: "completed",
    createdAt: "2026-09-20T10:00:00Z",
    isbn13: "9789861371955",
    noteCount: 12,
  },
  {
    // 超長中文書名：檢查兩行截斷
    id: "mock-3",
    googleBooksId: "mock-g-3",
    title: "也許你該找人聊聊：一個諮商心理師與她的心理師，以及我們的生活",
    authors: ["蘿蕊．葛利布"],
    coverUrl: mockCover("#6f9bb3", "聊聊"),
    status: "want_to_read",
    createdAt: "2026-09-15T10:00:00Z",
    isbn13: "9789865596408",
    noteCount: 0,
  },
  {
    // 沒有封面 + 多位作者：檢查佔位圖與作者單行截斷
    id: "mock-4",
    googleBooksId: "mock-g-4",
    title: "沒有封面的書",
    authors: ["第一位作者", "第二位作者", "第三位作者", "第四位作者"],
    coverUrl: null,
    status: "reading",
    createdAt: "2026-09-10T10:00:00Z",
    isbn13: null,
    noteCount: 1,
  },
  {
    // 長英文書名：英文單字不會像中文一樣每個字都能斷行
    id: "mock-5",
    googleBooksId: "mock-g-5",
    title: "Thinking, Fast and Slow: Understanding Decision-Making",
    authors: ["Daniel Kahneman"],
    coverUrl: mockCover("#3d3d3d", "Thinking"),
    status: "completed",
    createdAt: "2026-09-05T10:00:00Z",
    isbn13: "9780374533557",
    noteCount: 7,
  },
  {
    // 沒有作者資料：應顯示「作者不詳」
    id: "mock-6",
    googleBooksId: "mock-g-6",
    title: "作者不詳的書",
    authors: [],
    coverUrl: mockCover("#a8744f", "佚名"),
    status: "want_to_read",
    createdAt: "2026-08-30T10:00:00Z",
    isbn13: null,
    noteCount: 0,
  },
  {
    // 封面不是 2:3（正方形）：檢查 object-cover 有沒有把框填滿
    id: "mock-7",
    googleBooksId: "mock-g-7",
    title: "正方形封面",
    authors: ["比例怪怪的出版社"],
    coverUrl: mockCover("#4f6b4a", "1:1", 200),
    status: "reading",
    createdAt: "2026-08-20T10:00:00Z",
    isbn13: null,
    noteCount: 2,
  },
  {
    // 極端組合：沒封面 + 超長書名 + 沒作者
    id: "mock-8",
    googleBooksId: "mock-g-8",
    title: "什麼都沒有而且書名還特別特別特別長的一本書用來測試佔位圖",
    authors: [],
    coverUrl: null,
    status: "completed",
    createdAt: "2026-08-10T10:00:00Z",
    isbn13: null,
    noteCount: 0,
  },
];
