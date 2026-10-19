// 列表頁共用的網址參數小工具（藏書頁、筆記頁都會用到）

export type RawSearchParams = Record<string, string | string[] | undefined>;

export function pickOne(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value)?.trim() ?? "";
}

export function isOption<T extends string>(
  options: readonly { value: T }[],
  value: string,
): value is T {
  return options.some((option) => option.value === value);
}
