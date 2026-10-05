// 不指定時區的話，台灣凌晨 0～8 點寫的筆記會被顯示成「前一天」。
// 所以把時區寫死成台灣，不管程式在哪台機器跑，結果都一樣。
const dateFormatter = new Intl.DateTimeFormat("zh-TW", {
  timeZone: "Asia/Taipei",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

// ISO 時間字串 → "2024/05/24"
export function formatDate(isoString: string): string {
  return dateFormatter.format(new Date(isoString));
}
