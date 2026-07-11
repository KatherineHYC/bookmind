import { createClient } from "@/lib/supabase/server";
import { rowToBookListItem } from "@/lib/book-mapper";
import type { BookRow } from "@/types/book";
import BookCard from "@/components/features/BookCard";
import AddBookSearch from "@/components/features/AddBookSearch";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("books")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("讀取書單失敗：", error);
  }

  const books = ((data as BookRow[]) ?? []).map(rowToBookListItem);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">📚 我的書單</h1>

      <AddBookSearch />

      <div className="mt-6 space-y-3">
        {books.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">
            還沒有任何書籍，搜尋或掃描新增第一本吧！
          </p>
        ) : (
          books.map((book) => <BookCard key={book.id} book={book} />)
        )}
      </div>
    </div>
  );
}
