// Google Books API 原始格式
export interface GoogleBookVolume {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    publisher?: string;
    publishedDate?: string;
    pageCount?: number;
    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
    };
    industryIdentifiers?: Array<{
      type: "ISBN_10" | "ISBN_13" | string;
      identifier: string;
    }>;
    language?: string;
    categories?: string[];
  };
}

// BookMind 內部書籍格式
export interface Book {
  googleBooksId: string;
  title: string;
  authors: string[];
  description: string;
  publisher: string;
  publishedDate: string;
  pageCount: number | null;
  coverUrl: string | null;
  isbn13: string | null;
  isbn10: string | null;
  language: string;
  categories: string[];
}

// 書籍閱讀狀態
export type ReadingStatus = "want_to_read" | "reading" | "completed";

// Supabase 書單紀錄（Book + 使用者狀態）
export interface UserBook {
  id: string;
  userId: string;
  book: Book;
  status: ReadingStatus;
  createdAt: string;
  updatedAt: string;
}
