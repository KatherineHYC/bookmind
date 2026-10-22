"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Container from "@/components/layouts/Container";
import NoteFormHeader from "@/components/notes/NoteFormHeader";
import AvatarPicker from "./AvatarPicker";
import { updateProfile } from "@/app/actions/profile";
import {
  DISPLAY_NAME_MAX,
  profileSchema,
  type ProfileFormValues,
  type ProfileInput,
} from "@/lib/profile-schema";
import { AVATARS } from "@/lib/avatars";
import { cn } from "@/lib/utils";

const SETTINGS_PATH = "/settings";

export default function ProfileForm({
  defaultValues,
}: {
  defaultValues: ProfileFormValues;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ProfileFormValues, unknown, ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues,
    mode: "onChange",
  });

  const [avatarKey, displayName] = useWatch({
    control,
    name: ["avatarKey", "displayName"],
  });

  function onValid(values: ProfileInput) {
    setServerError(null);

    startTransition(async () => {
      const result = await updateProfile(values);

      if ("error" in result) {
        setServerError(result.error);
        return;
      }

      toast.success("已更新個人資料");
      router.replace(SETTINGS_PATH);
    });
  }

  return (
    <form
      onSubmit={handleSubmit(onValid)}
      noValidate
      className="flex min-h-dvh flex-col"
    >
      <NoteFormHeader
        title="編輯個人資料"
        onBack={() => router.replace(SETTINGS_PATH)}
      />

      <fieldset disabled={isPending} className="min-w-0 flex-1">
        <Container className="pb-8 md:max-w-lg lg:max-w-lg">
          {/* 大頭像預覽：跟著下方的選擇即時切換 */}
          <Image
            src={AVATARS[avatarKey].src}
            alt=""
            sizes="176px"
            loading="eager"
            className="mx-auto mt-4 size-44 rounded-full bg-muted object-cover"
          />

          <div className="mt-8">
            <AvatarPicker registration={register("avatarKey")} />
          </div>

          <div className="mt-8">
            <label
              htmlFor="profile-display-name"
              className="text-sm font-medium"
            >
              暱稱
            </label>
            <div
              className={cn(
                "mt-3 flex items-center gap-3 rounded-xl border bg-card px-4 transition-colors focus-within:border-ring",
                errors.displayName ? "border-destructive" : "border-input",
              )}
            >
              <input
                id="profile-display-name"
                maxLength={DISPLAY_NAME_MAX}
                autoComplete="nickname"
                enterKeyHint="done"
                aria-invalid={errors.displayName ? true : undefined}
                aria-describedby={
                  errors.displayName ? "profile-display-name-error" : undefined
                }
                className="h-12 min-w-0 flex-1 bg-transparent text-base outline-none"
                {...register("displayName")}
              />
              <span
                aria-hidden
                className={cn(
                  "shrink-0 text-sm tabular-nums",
                  errors.displayName
                    ? "text-destructive"
                    : "text-muted-foreground",
                )}
              >
                {displayName.length}/{DISPLAY_NAME_MAX}
              </span>
            </div>
            {errors.displayName && (
              <p
                id="profile-display-name-error"
                role="alert"
                className="mt-2 text-sm text-destructive"
              >
                {errors.displayName.message}
              </p>
            )}
          </div>
        </Container>
      </fieldset>

      <div className="sticky bottom-0 bg-linear-to-t from-background from-70% to-transparent pt-6 pb-[calc(env(safe-area-inset-bottom)+1rem)]">
        <Container className="md:max-w-lg lg:max-w-lg">
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
            disabled={!isValid || isPending}
            className="h-12 w-full text-base"
          >
            {isPending ? (
              <>
                <Loader2 className="size-5 animate-spin" aria-hidden />
                儲存中⋯
              </>
            ) : (
              "儲存"
            )}
          </Button>
        </Container>
      </div>
    </form>
  );
}
