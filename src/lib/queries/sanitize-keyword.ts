export function sanitizeKeyword(keyword: string): string {
  return keyword.replace(/[,%_()]/g, " ").trim();
}
