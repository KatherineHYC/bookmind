"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";
import { Loader2, SearchX, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddBookButton from "./AddBookButton";
import BookCover from "./BookCover";
import IsbnScanner from "./IsbnScanner";
import { searchByISBN } from "@/lib/google-books";
import type { Book } from "@/types/book";

type ScanState =
  | { status: "starting" }
  | { status: "scanning" }
  | { status: "looking-up"; isbn: string }
  | { status: "found"; isbn: string; book: Book }
  | { status: "not-found"; isbn: string }
  | { status: "lookup-error"; isbn: string }
  | { status: "camera-error" };

interface IsbnScanOverlayProps {
  addedIds: ReadonlySet<string>;
  // 右上角 ✕：關閉相機，回到搜尋畫面
  onClose: () => void;
  // 「手動輸入 ISBN」「改用關鍵字搜尋」：關閉相機，並把游標放進搜尋框
  onManualEntry: () => void;
}

const SHEET_BUTTON_CLASS = "h-12 w-full text-base";
const SHEET_OUTLINE_BUTTON_CLASS =
  "h-12 w-full border-primary/50 bg-card text-base text-primary";

// 蓋在 /books/new 上的全螢幕掃描畫面
export default function IsbnScanOverlay({
  addedIds,
  onClose,
  onManualEntry,
}: IsbnScanOverlayProps) {
  const [state, setState] = useState<ScanState>({ status: "starting" });

  // 跟 AddBookSearch 的 latestRequestRef 同一招：丟掉過期的查詢結果
  const latestLookupRef = useRef(0);

  const handleEscape = useEffectEvent(() => onClose());

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") handleEscape();
    }
    document.addEventListener("keydown", handleKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  async function lookUp(isbn: string) {
    const lookupId = ++latestLookupRef.current;
    setState({ status: "looking-up", isbn });

    try {
      const book = await searchByISBN(isbn);
      if (lookupId !== latestLookupRef.current) return;
      setState(
        book ? { status: "found", isbn, book } : { status: "not-found", isbn },
      );
    } catch {
      if (lookupId !== latestLookupRef.current) return;
      setState({ status: "lookup-error", isbn });
    }
  }

  function handleRescan() {
    latestLookupRef.current++;
    setState({ status: "scanning" });
  }

  const isAiming = state.status === "starting" || state.status === "scanning";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="掃描書籍條碼"
      className="fixed inset-0 z-50 overflow-hidden bg-black text-white"
    >
      <IsbnScanner
        paused={state.status !== "scanning"}
        onDetected={lookUp}
        onReady={() =>
          setState((prev) =>
            prev.status === "starting" ? { status: "scanning" } : prev,
          )
        }
        onError={() => setState({ status: "camera-error" })}
      />

      <button
        type="button"
        onClick={onClose}
        aria-label="關閉掃描"
        autoFocus
        className="absolute top-[calc(env(safe-area-inset-top)+0.75rem)] right-4 flex size-11 items-center justify-center rounded-full bg-black/50 text-white"
      >
        <X className="size-6" aria-hidden />
      </button>

      {isAiming && (
        <>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-6 bg-black/25 px-10">
            <div
              className="aspect-3/2 w-full max-w-xs rounded-2xl border-2 border-white/90"
              aria-hidden
            />
            <p className="text-base" role="status">
              {state.status === "starting"
                ? "相機啟動中…"
                : "將書背條碼對準框內"}
            </p>
          </div>

          <div className="absolute inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+2rem)] flex justify-center">
            <button
              type="button"
              onClick={onManualEntry}
              className="h-11 rounded-full border border-white/80 bg-black/30 px-6 text-sm text-white"
            >
              手動輸入 ISBN
            </button>
          </div>
        </>
      )}

      {/* 先放最基本的提示，正式版（圖示卡片、依原因分開說明）在 D6 */}
      {state.status === "camera-error" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-8 text-center">
          <p className="text-lg font-medium" role="alert">
            無法使用相機
          </p>
          <p className="text-sm/relaxed text-white/80">
            請確認已允許相機權限，或改用手動輸入。
          </p>
          <Button onClick={onManualEntry} className="mt-2 h-12 px-6 text-base">
            改用手動輸入 ISBN
          </Button>
        </div>
      )}

      <ScanResultSheet
        state={state}
        addedIds={addedIds}
        onRescan={handleRescan}
        onRetry={lookUp}
        onManualEntry={onManualEntry}
      />
    </div>
  );
}

interface ScanResultSheetProps {
  state: ScanState;
  addedIds: ReadonlySet<string>;
  onRescan: () => void;
  onRetry: (isbn: string) => void;
  onManualEntry: () => void;
}

// 從畫面底部升起的結果卡：查詢中 / 找到書 / 找不到 / 查詢失敗
function ScanResultSheet({
  state,
  addedIds,
  onRescan,
  onRetry,
  onManualEntry,
}: ScanResultSheetProps) {
  // 還在對準條碼、或相機開不起來的時候，沒有結果卡
  if (
    state.status === "starting" ||
    state.status === "scanning" ||
    state.status === "camera-error"
  ) {
    return null;
  }

  return (
    <div
      aria-live="polite"
      className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-md rounded-t-3xl bg-card px-5 pt-6 pb-[calc(env(safe-area-inset-bottom)+1.25rem)] text-card-foreground shadow-2xl"
    >
      <SheetContent
        state={state}
        addedIds={addedIds}
        onRescan={onRescan}
        onRetry={onRetry}
        onManualEntry={onManualEntry}
      />
    </div>
  );
}

type SheetState = Exclude<
  ScanState,
  { status: "starting" | "scanning" | "camera-error" }
>;

function SheetContent({
  state,
  addedIds,
  onRescan,
  onRetry,
  onManualEntry,
}: Omit<ScanResultSheetProps, "state"> & { state: SheetState }) {
  switch (state.status) {
    case "looking-up":
      return (
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <Loader2
            className="size-6 animate-spin text-muted-foreground"
            aria-hidden
          />
          <p className="text-base font-medium">查詢書籍資料中…</p>
          <p className="text-sm text-muted-foreground">ISBN {state.isbn}</p>
        </div>
      );

    case "found": {
      const { book } = state;
      const year = book.publishedDate.slice(0, 4);
      const meta = [book.publisher, year].filter(Boolean).join(" · ");
      const isAdded = addedIds.has(book.googleBooksId);

      return (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="w-20 shrink-0">
              <BookCover
                coverUrl={book.coverUrl}
                title={book.title}
                size="sm"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="line-clamp-2 text-lg/7 font-medium wrap-break-word">
                {book.title}
              </h2>
              <p className="mt-1 truncate text-sm text-muted-foreground">
                {book.authors.join("、") || "作者不詳"}
              </p>
              {meta && (
                <p className="mt-0.5 truncate text-sm text-muted-foreground">
                  {meta}
                </p>
              )}
              <p className="mt-0.5 text-sm text-muted-foreground">
                ISBN {state.isbn}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <AddBookButton book={book} isAdded={isAdded} variant="full" />
            <Button
              variant="outline"
              onClick={onRescan}
              className={SHEET_OUTLINE_BUTTON_CLASS}
            >
              {isAdded ? "繼續掃描下一本" : "重新掃描"}
            </Button>
          </div>
        </div>
      );
    }

    case "not-found":
      return (
        <div className="flex flex-col items-center text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-muted">
            <SearchX className="size-7 text-primary" aria-hidden />
          </div>
          <h2 className="mt-4 text-lg font-medium">找不到這本書的資料</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            ISBN {state.isbn}
          </p>
          <div className="mt-5 flex w-full flex-col gap-3">
            <Button onClick={onRescan} className={SHEET_BUTTON_CLASS}>
              重新掃描
            </Button>
            <Button
              variant="outline"
              onClick={onManualEntry}
              className={SHEET_OUTLINE_BUTTON_CLASS}
            >
              改用關鍵字搜尋
            </Button>
          </div>
        </div>
      );

    case "lookup-error":
      return (
        <div className="flex flex-col items-center text-center">
          <h2 className="text-lg font-medium">暫時無法查詢</h2>
          <p className="mt-1 text-sm/relaxed text-muted-foreground">
            請確認網路連線後再試一次。
          </p>
          <div className="mt-5 flex w-full flex-col gap-3">
            <Button
              onClick={() => onRetry(state.isbn)}
              className={SHEET_BUTTON_CLASS}
            >
              再試一次
            </Button>
            <Button
              variant="outline"
              onClick={onRescan}
              className={SHEET_OUTLINE_BUTTON_CLASS}
            >
              重新掃描
            </Button>
          </div>
        </div>
      );
  }
}
