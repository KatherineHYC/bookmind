// 列表預覽用：連續換行（含只有空白的空行）合併成一個，避免空行吃掉 line-clamp 的行數
export function collapseBlankLines(text: string): string {
  return text.replace(/(\r?\n[ \t]*){2,}/g, "\n").trim();
}
