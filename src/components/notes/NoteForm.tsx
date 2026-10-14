"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Container from "@/components/layouts/Container";
import AutoGrowTextarea from "@/components/features/AutoGrowTextarea";
import ConfirmDialog from "@/components/features/ConfirmDialog";
import SegmentedControl from "@/components/features/SegmentedControl";
import NoteFormHeader from "./NoteFormHeader";
import { createNote } from "@/app/actions/notes";
import {
  EMPTY_NOTE_FORM,
  noteFormSchema,
  type NoteFormValues,
  type NoteInput,
} from "@/lib/note-schema";
import { cn } from "@/lib/utils";
import type { NoteType } from "@/types/note";

const TYPE_OPTIONS = [
  { value: "excerpt", label: "摘錄" },
  { value: "thought", label: "心得" },
] as const satisfies readonly { value: NoteType; label: string }[];

const BARE_FIELD =
  "w-full bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground/70 disabled:opacity-60";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-2 text-sm text-destructive">
      {message}
    </p>
  );
}

interface NoteFormProps {
  bookId: string;
}

export default function NoteForm({ bookId }: NoteFormProps) {
  const router = useRouter();
  const backHref = `/books/${bookId}`;

  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isDiscardOpen, setIsDiscardOpen] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<NoteFormValues, unknown, NoteInput>({
    resolver: zodResolver(noteFormSchema),
    defaultValues: EMPTY_NOTE_FORM,
  });

  const [type, page, title, excerpt, content] = useWatch({
    control,
    name: ["type", "page", "title", "excerpt", "content"],
  });

  const hasText = [page, title, excerpt, content].some(
    (value) => value.trim() !== "",
  );
  const shouldConfirmLeave = isDirty && hasText;

  useEffect(() => {
    if (!shouldConfirmLeave) return;

    function handleBeforeUnload(event: BeforeUnloadEvent) {
      event.preventDefault();
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [shouldConfirmLeave]);

  function leave() {
    router.replace(backHref);
  }

  function handleBack() {
    if (shouldConfirmLeave) setIsDiscardOpen(true);
    else leave();
  }

  function onValid(values: NoteInput) {
    setServerError(null);

    startTransition(async () => {
      const result = await createNote(bookId, values);
      if (result?.error) setServerError(result.error);
    });
  }

  const isExcerpt = type === "excerpt";

  return (
    <>
      <form
        onSubmit={handleSubmit(onValid)}
        noValidate
        className="flex min-h-dvh flex-col"
      >
        <NoteFormHeader title="新增筆記" onBack={handleBack} />

        <fieldset disabled={isPending} className="min-w-0 flex-1">
          <Container className="pb-8 md:max-w-2xl lg:max-w-2xl">
            <Controller
              control={control}
              name="type"
              render={({ field }) => (
                <SegmentedControl
                  options={TYPE_OPTIONS}
                  value={field.value}
                  onChange={field.onChange}
                  legend="筆記類型"
                  hideLegend
                  disabled={isPending}
                  className="mt-2"
                />
              )}
            />

            {/* 頁碼：唯一有標籤的欄位，只屬於摘錄 */}
            {isExcerpt && (
              <div className="mt-6">
                <div
                  className={cn(
                    "flex items-center gap-4 border-b py-2",
                    errors.page ? "border-destructive" : "border-border",
                  )}
                >
                  <label
                    htmlFor="note-page"
                    className="shrink-0 text-sm text-muted-foreground"
                  >
                    頁碼
                  </label>
                  <input
                    id="note-page"
                    inputMode="numeric"
                    enterKeyHint="next"
                    autoComplete="off"
                    placeholder="選填"
                    aria-invalid={errors.page ? true : undefined}
                    aria-describedby={
                      errors.page ? "note-page-error" : undefined
                    }
                    className={BARE_FIELD}
                    {...register("page")}
                  />
                </div>
                <FieldError
                  id="note-page-error"
                  message={errors.page?.message}
                />
              </div>
            )}

            {/* 標題 */}
            <div className={isExcerpt ? "mt-4" : "mt-6"}>
              <input
                aria-label="標題（選填）"
                placeholder="標題（選填）"
                enterKeyHint="next"
                autoComplete="off"
                aria-invalid={errors.title ? true : undefined}
                aria-describedby={errors.title ? "note-title-error" : undefined}
                className={cn(
                  BARE_FIELD,
                  "border-b py-3 text-2xl font-semibold",
                  errors.title ? "border-destructive" : "border-border",
                )}
                {...register("title")}
              />
              <FieldError
                id="note-title-error"
                message={errors.title?.message}
              />
            </div>

            {isExcerpt ? (
              <>
                {/* 摘錄 必填 */}
                <div className="mt-4">
                  <AutoGrowTextarea
                    aria-label="書中摘錄"
                    placeholder="輸入書中摘錄⋯"
                    aria-invalid={errors.excerpt ? true : undefined}
                    aria-describedby={
                      errors.excerpt ? "note-excerpt-error" : undefined
                    }
                    className={cn(
                      BARE_FIELD,
                      "min-h-40 border-b py-3 leading-8",
                      errors.excerpt ? "border-destructive" : "border-border",
                    )}
                    {...register("excerpt")}
                  />
                  <FieldError
                    id="note-excerpt-error"
                    message={errors.excerpt?.message}
                  />
                </div>

                {/* 感想 選填 */}
                <AutoGrowTextarea
                  aria-label="一點感想（選填）"
                  placeholder="一點感想（選填）"
                  className={cn(BARE_FIELD, "mt-4 min-h-32 py-3 leading-8")}
                  {...register("content")}
                />
              </>
            ) : (
              <div className="mt-4">
                {/* 心得：必填；平常沒有分隔線，出錯時才出現紅線 */}
                <AutoGrowTextarea
                  aria-label="心得內容"
                  placeholder="寫下你的想法⋯"
                  aria-invalid={errors.content ? true : undefined}
                  aria-describedby={
                    errors.content ? "note-content-error" : undefined
                  }
                  className={cn(
                    BARE_FIELD,
                    "min-h-60 border-b py-3 leading-8",
                    errors.content
                      ? "border-destructive"
                      : "border-transparent",
                  )}
                  {...register("content")}
                />
                <FieldError
                  id="note-content-error"
                  message={errors.content?.message}
                />
              </div>
            )}
          </Container>
        </fieldset>

        {/* 儲存按鈕 */}
        <div className="sticky bottom-0 bg-linear-to-t from-background from-70% to-transparent pt-6 pb-[calc(env(safe-area-inset-bottom)+1rem)]">
          <Container className="md:max-w-2xl lg:max-w-2xl">
            {serverError && (
              <p
                role="alert"
                className="mb-3 text-center text-sm text-destructive"
              >
                {serverError}
              </p>
            )}
            <Button
              type="submit"
              disabled={isPending}
              className="h-12 w-full text-base"
            >
              {isPending ? (
                <>
                  <Loader2 className="size-5 animate-spin" aria-hidden />
                  儲存中⋯
                </>
              ) : (
                "儲存筆記"
              )}
            </Button>
          </Container>
        </div>
      </form>

      <ConfirmDialog
        open={isDiscardOpen}
        onOpenChange={setIsDiscardOpen}
        title="放棄這則筆記？"
        description="已輸入的內容不會被儲存。"
        confirmLabel="放棄"
        cancelLabel="繼續編輯"
        destructive
        onConfirm={leave}
      />
    </>
  );
}
