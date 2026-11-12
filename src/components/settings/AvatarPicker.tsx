import Image from "next/image";
import { Check } from "lucide-react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { AVATAR_KEYS, AVATARS } from "@/lib/avatars";

interface AvatarPickerProps {
  registration: UseFormRegisterReturn<"avatarKey">;
}

export default function AvatarPicker({ registration }: AvatarPickerProps) {
  return (
    <fieldset className="mx-auto w-fit md:mx-0">
      <legend className="text-sm font-medium">選擇頭像</legend>
      <div className="mt-3 grid grid-cols-3 gap-x-6 gap-y-5 md:gap-x-8 md:gap-y-6">
        {AVATAR_KEYS.map((key) => (
          <label
            key={key}
            className="relative size-20 cursor-pointer rounded-full ring-2 ring-transparent ring-offset-2 ring-offset-background transition-shadow has-checked:ring-primary has-focus-visible:ring-ring/50 md:size-24"
          >
            <input
              type="radio"
              value={key}
              className="peer sr-only"
              {...registration}
            />
            <Image
              src={AVATARS[key].src}
              alt={AVATARS[key].label}
              sizes="(min-width: 768px) 96px, 80px"
              className="size-full rounded-full bg-muted object-cover"
            />
            <span
              aria-hidden
              className="absolute -right-0.5 -bottom-0.5 hidden size-6 items-center justify-center rounded-full bg-primary text-primary-foreground ring-2 ring-background peer-checked:flex"
            >
              <Check className="size-3.5" strokeWidth={3} />
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
