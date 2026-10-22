// 把瀏覽器的 user-agent 字串整理成看得懂的「瀏覽器 版本・作業系統」

const BROWSERS: Array<{ name: string; pattern: RegExp }> = [
  { name: "Edge", pattern: /Edg(?:A|iOS)?\/(\d+)/ },
  { name: "Firefox", pattern: /(?:Firefox|FxiOS)\/(\d+)/ },
  { name: "Chrome", pattern: /(?:Chrome|CriOS)\/(\d+)/ },
  { name: "Safari", pattern: /Version\/(\d+).*Safari/ },
];

const SYSTEMS: Array<{ name: string; pattern: RegExp }> = [
  { name: "iOS", pattern: /iPhone/ },
  { name: "iPadOS", pattern: /iPad/ },
  { name: "Android", pattern: /Android/ },
  { name: "macOS／iPadOS", pattern: /Macintosh/ },
  { name: "Windows", pattern: /Windows/ },
];

export function describeDevice(userAgent: string | null): string {
  if (!userAgent) return "未知";

  const browser = BROWSERS.find(({ pattern }) => pattern.test(userAgent));
  const version = browser && userAgent.match(browser.pattern)?.[1];
  const system = SYSTEMS.find(({ pattern }) => pattern.test(userAgent));

  const browserLabel = browser ? `${browser.name} ${version}` : "未知瀏覽器";
  const systemLabel = system ? system.name : "未知系統";

  return `${browserLabel}・${systemLabel}`;
}
