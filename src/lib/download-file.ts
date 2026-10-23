// 把一段文字包成檔案並觸發下載；只能在瀏覽器裡呼叫（用到 document）
export function downloadTextFile(
  fileName: string,
  content: string,
  mimeType = "text/plain",
) {
  // 再用一個看不見的 <a download> 點它一下，瀏覽器就會當成下載處理。
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.append(link);
  link.click();
  link.remove();

  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
