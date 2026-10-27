// Google 登入流程結束後，callback 帶回 /settings 的結果代號
// callback 寫入、設定頁讀取，兩邊共用同一份清單
export const AUTH_RESULTS = [
  "signed-in", // 登入成功（綁定或切換帳號都算）
  "identity-exists", // 這個 Google 帳號已經綁在別的使用者身上
  "cancelled", // 使用者在 Google 畫面按了取消
  "failed", // 其他所有失敗
] as const;

export type AuthResult = (typeof AUTH_RESULTS)[number];

export const AUTH_RESULT_PARAM = "auth";

function isAuthResult(value: string): value is AuthResult {
  return (AUTH_RESULTS as readonly string[]).includes(value);
}

// 網址參數可以被任意修改，只認清單裡的值，其他一律當作沒有
export function parseAuthResult(
  value: string | string[] | undefined,
): AuthResult | null {
  if (typeof value !== "string") return null;
  return isAuthResult(value) ? value : null;
}
