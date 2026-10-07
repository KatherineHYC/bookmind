"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";
import {
  BookOpen,
  Camera,
  Loader2,
  Search,
  X,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AddBookButton from "./AddBookButton";
import BookCover from "./BookCover";
import IsbnScanner, { type CameraErrorReason } from "./IsbnScanner";
import { searchByISBN } from "@/lib/google-books";
import { cn } from "@/lib/utils";
import type { Book } from "@/types/book";

type ScanState =
  | { status: "starting" }
  | { status: "scanning" }
  | { status: "looking-up"; isbn: string }
  | { status: "found"; isbn: string; book: Book }
  | { status: "not-found"; isbn: string }
  | { status: "lookup-error"; isbn: string }
  | { status: "camera-error"; reason: CameraErrorReason };

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

const CAMERA_ERROR_COPY: Record<
  CameraErrorReason,
  { title: string; description: string }
> = {
  denied: {
    title: "需要相機權限才能掃描條碼",
    description: "請在瀏覽器設定中，開啟相機權限以使用掃描功能。",
  },
  unavailable: {
    title: "找不到可用的相機",
    description: "這台裝置或瀏覽器沒有可用的相機，請改用手動輸入。",
  },
  failed: {
    title: "相機無法啟動",
    description: "相機可能正被其他 App 使用，關閉後再試一次。",
  },
};

// 蓋在 /books/new 上的全螢幕掃描畫面
export default function IsbnScanOverlay({
  addedIds,
  onClose,
  onManualEntry,
}: IsbnScanOverlayProps) {
  const [state, setState] = useState<ScanState>({ status: "starting" });

  const [scannerKey, setScannerKey] = useState(0);

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

  function handleRetryCamera() {
    setState({ status: "starting" });
    setScannerKey((key) => key + 1);
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
        key={scannerKey}
        paused={state.status !== "scanning"}
        onDetected={lookUp}
        onReady={() =>
          setState((prev) =>
            prev.status === "starting" ? { status: "scanning" } : prev,
          )
        }
        onError={(reason) => setState({ status: "camera-error", reason })}
      />

      <button
        type="button"
        onClick={onClose}
        aria-label="關閉掃描"
        autoFocus
        className="absolute z-10 top-[calc(env(safe-area-inset-top)+0.75rem)] right-4 flex size-11 items-center justify-center rounded-full bg-black/50 text-white"
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

      {state.status === "camera-error" && (
        <CameraErrorCard
          reason={state.reason}
          onRetry={handleRetryCamera}
          onManualEntry={onManualEntry}
        />
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

interface StatusIconProps {
  icon: LucideIcon;
  badge: LucideIcon;
  // primary：一般提示（綠）；destructive：被擋住了（紅）
  tone: "primary" | "destructive";
}

// 圓形底的大圖示，右下角疊一顆小徽章（設計稿 G、I 共用的樣式）
function StatusIcon({ icon: Icon, badge: Badge, tone }: StatusIconProps) {
  return (
    <div
      className="relative flex size-16 items-center justify-center rounded-full bg-muted"
      aria-hidden
    >
      <Icon
        className={cn(
          "size-7",
          tone === "primary" ? "text-primary" : "text-muted-foreground",
        )}
      />
      <span
        className={cn(
          "absolute -right-1 -bottom-1 flex size-6 items-center justify-center rounded-full ring-2 ring-card",
          tone === "primary"
            ? "bg-primary text-primary-foreground"
            : "bg-destructive text-destructive-foreground",
        )}
      >
        <Badge className="size-3.5" strokeWidth={2.5} />
      </span>
    </div>
  );
}

interface CameraErrorCardProps {
  reason: CameraErrorReason;
  onRetry: () => void;
  onManualEntry: () => void;
}

// 相機開不起來時，畫面中央的說明卡（設計稿 G）
function CameraErrorCard({
  reason,
  onRetry,
  onManualEntry,
}: CameraErrorCardProps) {
  const { title, description } = CAMERA_ERROR_COPY[reason];

  return (
    <div className="absolute inset-0 flex items-center justify-center px-6">
      <div className="flex w-full max-w-sm flex-col items-center rounded-3xl bg-card px-6 py-8 text-center text-card-foreground shadow-2xl">
        <StatusIcon icon={Camera} badge={X} tone="destructive" />

        <h2 role="alert" className="mt-5 text-lg/7 font-medium text-balance">
          {title}
        </h2>
        <p className="mt-2 text-sm/relaxed text-balance text-muted-foreground">
          {description}
        </p>

        <div className="mt-6 flex w-full flex-col gap-3">
          {reason === "failed" && (
            <Button onClick={onRetry} className={SHEET_BUTTON_CLASS}>
              再試一次
            </Button>
          )}
          <Button
            variant={reason === "failed" ? "outline" : "default"}
            onClick={onManualEntry}
            className={
              reason === "failed"
                ? SHEET_OUTLINE_BUTTON_CLASS
                : SHEET_BUTTON_CLASS
            }
          >
            改用手動輸入 ISBN
          </Button>
        </div>
      </div>
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
          <StatusIcon icon={BookOpen} badge={Search} tone="primary" />
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
