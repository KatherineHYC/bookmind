import { z } from "zod";
import type { Note, NoteType } from "@/types/note";

const NOTE_TYPES = [
  "excerpt",
  "thought",
] as const satisfies readonly NoteType[];

const TITLE_MAX = 50;
const PAGE_MAX = 9999;
const PAGE_ERROR = `頁碼請輸入 1–${PAGE_MAX} 的數字`;

// ── 欄位積木 ─────────────────────────────────────────────

const optionalText = z
  .string()
  .trim()
  .nullable()
  .transform((value) => (value ? value : null));

const titleField = z
  .string()
  .trim()
  .max(TITLE_MAX, `標題最多 ${TITLE_MAX} 字`)
  .nullable()
  .transform((value) => (value ? value : null));

const pageField = z
  .number({ error: PAGE_ERROR })
  .int(PAGE_ERROR)
  .min(1, PAGE_ERROR)
  .max(PAGE_MAX, PAGE_ERROR)
  .nullable();

// ── 第一層：送進資料庫前的最後形狀（Server Action 驗這個）─────────

export const noteInputSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("excerpt"),
    title: titleField,
    page: pageField,
    excerpt: z.string().trim().min(1, "請輸入摘錄內容"),
    content: optionalText,
  }),
  z.object({
    type: z.literal("thought"),
    title: titleField,
    content: z.string().trim().min(1, "請輸入心得內容"),
  }),
]);

// ── 第二層：表單（React Hook Form 用這個）─────────────────────

const noteFormFields = z.object({
  type: z.enum(NOTE_TYPES),
  page: z.string(),
  title: z.string(),
  excerpt: z.string(),
  content: z.string(),
});

function toPage(raw: string): number | null {
  const trimmed = raw.trim();
  return trimmed === "" ? null : Number(trimmed);
}

// 依類型挑出要送的欄位；心得模式下藏起來的摘錄與頁碼在這裡被丟掉
function toNoteInput({
  type,
  page,
  title,
  excerpt,
  content,
}: z.infer<typeof noteFormFields>): z.input<typeof noteInputSchema> {
  return type === "excerpt"
    ? { type, title, page: toPage(page), excerpt, content }
    : { type, title, content };
}

export const noteFormSchema = noteFormFields
  .transform(toNoteInput)
  .pipe(noteInputSchema);

// 表單裡的值：五個欄位都是字串，切換類型時不會消失
export type NoteFormValues = z.input<typeof noteFormSchema>;

// 驗證後要送出的值：依類型分成兩種形狀
export type NoteInput = z.output<typeof noteInputSchema>;

// 新增筆記時的空白表單
export const EMPTY_NOTE_FORM: NoteFormValues = {
  type: "excerpt",
  page: "",
  title: "",
  excerpt: "",
  content: "",
};

export function noteToFormValues(note: Note): NoteFormValues {
  return {
    type: note.type,
    page: note.page === null ? "" : String(note.page),
    title: note.title ?? "",
    excerpt: note.excerpt ?? "",
    content: note.content ?? "",
  };
}
