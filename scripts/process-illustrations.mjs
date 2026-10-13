// 插圖處理腳本：把 GPT 產的原圖（PNG）整批轉成網站要用的 WebP
// 用法：npm run illustrations
//
// 輸入：design/illustrations-src/*.png（原圖，不進 Git）
// 輸出：src/assets/illustrations/*.webp（處理後的成品，會進 Git）
//       design/illustrations-preview.html（驗收用的預覽頁，不進 Git）
//
// ⚠ 輸出資料夾由腳本全權管理：每次執行都會先清掉裡面的 .webp 再重產，
//   不要手動把其他檔案放進 src/assets/illustrations/。

import { mkdir, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC_DIR = "design/illustrations-src";
const OUT_DIR = "src/assets/illustrations";
const PREVIEW_FILE = "design/illustrations-preview.html";

// ── 1. 規格設定 ────────────────────────────────────────────
// 檔名的第一段（hero-landing → hero）決定套用哪一組規格
// width：輸出寬度（約為最大顯示寬的 2 倍）；budgetKB：單張大小上限
const PRESETS = {
  hero: { width: 840, budgetKB: 150 },
  header: { width: 720, budgetKB: 80 },
  spot: { width: 480, budgetKB: 50 },
  deco: { width: 300, budgetKB: 30 },
  avatar: { width: 480, budgetKB: 40 },
};

// 應該要有的原圖清單，少了哪張會提醒
const EXPECTED = [
  "hero-landing",
  "header-home",
  "header-library",
  "header-notes",
  "header-settings",
  "spot-search-start",
  "spot-not-found",
  "spot-search-error",
  "spot-open-book",
  "spot-days",
  "spot-feedback",
  "spot-about",
  "deco-quote",
  "deco-leaf-corner",
  "deco-leaf-shadow",
  "deco-brush-sheet",
  "avatar-girl",
  "avatar-boy",
  "avatar-sprout",
  "avatar-cat",
  "avatar-pug",
  "avatar-alien",
];

// 白底的影子圖：用深淺換算透明度，其他插圖都是 GPT 已經去背的透明 PNG
const SHADOW_IMAGES = new Set(["deco-leaf-shadow"]);
// 影子統一用這個顏色（鼠尾草灰綠），深淺只交給透明度表現
const SHADOW_COLOR = [150, 165, 145];
const SHADOW_WIDTH = 200;

// 一張圖裡畫了好幾個元素，要依上下的空白切開
const SPLIT_SHEETS = { "deco-brush-sheet": "deco-brush" };

const ALPHA_SOLID = 250; // GPT 的「實心」只有 253 左右，250 以上補成 255
const ALPHA_VISIBLE = 8; // alpha 超過這個值才算「有畫東西」，用來找裁切範圍
const QUALITY_START = 82; // WebP 品質從 82 開始試，超過預算就往下降
const QUALITY_MIN = 62; // 最低降到這裡，還超過就回報，交給人判斷
const QUALITY_STEP = 4;
// 80 和 sharp 預設的 100 肉眼分不出來，檔案卻小很多
const ALPHA_QUALITY = 80;

// ── 2. 像素處理（全部在 RGBA 原始像素陣列上操作）──────────────

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

// 但 WebP 會把它當成半透明多存一份資訊，所以統一補滿。
function snapAlpha(data) {
  for (let i = 3; i < data.length; i += 4) {
    if (data[i] >= ALPHA_SOLID) data[i] = 255;
  }
}

// 所以把顏色統一成 SHADOW_COLOR，越深的地方越不透明、白色的地方全透明。
// 不能用「從白色反推原色」的算法：淡影子的 alpha 很小，反推時會放大雜訊，
// 檔案會暴增好幾倍。
function shadowToAlpha(data) {
  let maxDarkness = 0;
  for (let i = 0; i < data.length; i += 4) {
    const darkness = 255 - Math.min(data[i], data[i + 1], data[i + 2]);
    if (darkness > maxDarkness) maxDarkness = darkness;
  }

  const floor = 6; // 比這更淡的視為白底雜訊，直接全透明
  for (let i = 0; i < data.length; i += 4) {
    const darkness = 255 - Math.min(data[i], data[i + 1], data[i + 2]);
    const alpha = clamp((darkness - floor) / (maxDarkness - floor), 0, 1);
    data[i] = SHADOW_COLOR[0];
    data[i + 1] = SHADOW_COLOR[1];
    data[i + 2] = SHADOW_COLOR[2];
    data[i + 3] = Math.round(alpha * 255);
  }
}

// 找出「有畫東西」的範圍（bounding box），只看 top～bottom 這幾列
function findBounds(data, width, top, bottom) {
  let minX = width;
  let minY = bottom;
  let maxX = -1;
  let maxY = -1;
  for (let y = top; y < bottom; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * 4 + 3] > ALPHA_VISIBLE) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < 0) return null;
  return {
    left: minX,
    top: minY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
  };
}

// 依「整列都是透明」的空白帶，把一張圖切成上下好幾段
function findRowBands(data, width, height) {
  const minGap = Math.round(height * 0.02); // 空白要夠寬才算分隔
  const bands = [];
  let start = -1;
  let gap = 0;

  for (let y = 0; y < height; y++) {
    let hasInk = false;
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * 4 + 3] > ALPHA_VISIBLE) {
        hasInk = true;
        break;
      }
    }
    if (hasInk) {
      if (start < 0) start = y;
      gap = 0;
    } else if (start >= 0 && ++gap >= minGap) {
      bands.push([start, y - gap + 1]);
      start = -1;
      gap = 0;
    }
  }
  if (start >= 0) bands.push([start, height]);

  // 太細的雜點不算一段
  return bands.filter(([top, bottom]) => bottom - top > height * 0.01);
}

// ── 3. 輸出 ────────────────────────────────────────────────

// 這樣每張圖都拿到「在預算內最好看」的品質，而不是全部統一用低品質。
async function encodeWithinBudget(pipeline, budgetKB) {
  let quality = QUALITY_START;
  while (true) {
    const buffer = await pipeline
      .clone()
      .webp({
        quality,
        alphaQuality: ALPHA_QUALITY,
        effort: 6,
        smartSubsample: true,
      })
      .toBuffer();
    const fits = buffer.length / 1024 <= budgetKB;
    if (fits || quality - QUALITY_STEP < QUALITY_MIN)
      return { buffer, quality };
    quality -= QUALITY_STEP;
  }
}

async function writeOutput(name, pipeline, preset) {
  const { buffer, quality } = await encodeWithinBudget(
    pipeline,
    preset.budgetKB,
  );
  const outPath = path.join(OUT_DIR, `${name}.webp`);
  await writeFile(outPath, buffer);
  const meta = await sharp(buffer).metadata();
  const kb = buffer.length / 1024;
  return {
    name,
    size: `${meta.width}×${meta.height}`,
    kb: Number(kb.toFixed(1)),
    budgetKB: preset.budgetKB,
    quality,
    ok: kb <= preset.budgetKB,
  };
}

// 插圖：補 alpha（或影子轉透明）→（切開）→ 貼齊內容裁邊 → 縮圖 → WebP
async function processIllustration(name, file, preset) {
  const { data, info } = await sharp(file)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height } = info;

  if (SHADOW_IMAGES.has(name)) shadowToAlpha(data);
  else snapAlpha(data);

  const splitPrefix = SPLIT_SHEETS[name];
  const parts = splitPrefix
    ? findRowBands(data, width, height).map(([top, bottom], index) => ({
        name: `${splitPrefix}-${index + 1}`,
        top,
        bottom,
      }))
    : [{ name, top: 0, bottom: height }];

  const results = [];
  for (const part of parts) {
    const bounds = findBounds(data, width, part.top, part.bottom);
    if (!bounds) {
      console.warn(`⚠ ${part.name}：找不到任何內容，略過`);
      continue;
    }

    // 不同插圖之間的大小和對齊才一致。需要間距時交給 CSS 的 padding／margin。
    const outWidth = SHADOW_IMAGES.has(name) ? SHADOW_WIDTH : preset.width;
    const pipeline = sharp(data, { raw: { width, height, channels: 4 } })
      .extract(bounds)
      .resize({ width: outWidth, withoutEnlargement: true });
    results.push(await writeOutput(part.name, pipeline, preset));
  }
  return results;
}

// 頭像：保留背景、不裁邊（六張要框在完全相同的位置），只縮成固定正方形
async function processAvatar(name, file, preset) {
  const pipeline = sharp(file)
    .resize(preset.width, preset.width, { fit: "cover" })
    .removeAlpha();
  return [await writeOutput(name, pipeline, preset)];
}

// ── 4. 預覽頁：把成品放在米色頁面底和卡片底上，一次看完 ───────────

function buildPreview(results) {
  const cards = results
    .map(
      (r) => `
    <figure class="${r.ok ? "" : "over"}">
      <div class="pair">
        <div class="bg page"><img src="../${OUT_DIR}/${r.name}.webp" alt=""></div>
        <div class="bg card"><img src="../${OUT_DIR}/${r.name}.webp" alt=""></div>
      </div>
      <figcaption><b>${r.name}</b><br>${r.size}・${r.kb} KB／${r.budgetKB} KB・q${r.quality}</figcaption>
    </figure>`,
    )
    .join("");

  return `<!doctype html>
<html lang="zh-Hant"><head><meta charset="utf-8"><title>插圖預覽</title>
<style>
  body { margin: 24px; font: 14px/1.5 system-ui, sans-serif; background: #fff; color: #352e22; }
  main { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; }
  figure { margin: 0; border: 1px solid #ddd5c4; border-radius: 12px; padding: 12px; }
  figure.over { border: 2px solid #c24c3c; }
  .pair { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .bg { aspect-ratio: 1; display: grid; place-items: center; border-radius: 8px; padding: 8px; }
  .page { background: #f2ede6; }
  .card { background: #fefcf8; }
  img { max-width: 100%; max-height: 100%; }
</style></head>
<body><h1>插圖預覽（紅框＝超過大小預算）</h1><main>${cards}</main></body></html>`;
}

// ── 5. 主流程 ──────────────────────────────────────────────

async function main() {
  const files = (await readdir(SRC_DIR)).filter((f) =>
    f.toLowerCase().endsWith(".png"),
  );
  const names = files.map((f) => path.basename(f, path.extname(f)));

  const missing = EXPECTED.filter((n) => !names.includes(n));
  if (missing.length > 0) console.warn(`⚠ 缺少原圖：${missing.join(", ")}`);

  await mkdir(OUT_DIR, { recursive: true });
  for (const old of await readdir(OUT_DIR)) {
    if (old.endsWith(".webp")) await rm(path.join(OUT_DIR, old));
  }

  const results = [];
  for (const file of files) {
    const name = path.basename(file, path.extname(file));
    const preset = PRESETS[name.split("-")[0]];
    if (!preset) {
      console.warn(
        `⚠ ${file}：檔名開頭不是 ${Object.keys(PRESETS).join("／")}，略過`,
      );
      continue;
    }
    const filePath = path.join(SRC_DIR, file);
    const handler = name.startsWith("avatar-")
      ? processAvatar
      : processIllustration;
    results.push(...(await handler(name, filePath, preset)));
  }

  results.sort((a, b) => a.name.localeCompare(b.name));
  console.table(results);
  await writeFile(PREVIEW_FILE, buildPreview(results));
  console.log(`預覽頁：${PREVIEW_FILE}`);

  const over = results.filter((r) => !r.ok);
  if (over.length > 0) {
    console.error(
      `✗ ${over.length} 張超過大小預算：${over.map((r) => r.name).join(", ")}`,
    );
    process.exitCode = 1;
  } else {
    console.log(`✓ ${results.length} 張全部在預算內`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
