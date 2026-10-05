// 去掉手動輸入時可能帶進來的連字號與空白（例如 978-986-175-526-7）
export function normalizeIsbn(input: string): string {
  return input.replace(/[\s-]/g, "");
}

export function isIsbn13(code: string): boolean {
  return /^97[89]\d{10}$/.test(code);
}

// 使用者在搜尋框打的字「看起來像不像 ISBN」（13 碼，或舊制 10 碼、最後一碼可能是 X）
export function looksLikeIsbn(input: string): boolean {
  const code = normalizeIsbn(input);
  return isIsbn13(code) || /^\d{9}[\dXx]$/.test(code);
}
