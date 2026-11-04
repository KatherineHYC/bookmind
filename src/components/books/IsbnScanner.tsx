"use client";

import { useEffect, useEffectEvent, useRef } from "react";
import { BarcodeDetector } from "barcode-detector/ponyfill";
import { isIsbn13 } from "@/lib/isbn";

// 每隔多久辨識一次畫面（毫秒）。太頻繁會讓手機發燙，太慢會覺得反應遲鈍
const DETECT_INTERVAL_MS = 150;

export type CameraErrorReason = "denied" | "unavailable" | "failed";

// getUserMedia 失敗時丟出的是 DOMException，用 name 判斷原因
function toCameraErrorReason(error: unknown): CameraErrorReason {
  if (!navigator.mediaDevices?.getUserMedia) return "unavailable";

  const name = error instanceof DOMException ? error.name : "";
  if (name === "NotAllowedError" || name === "SecurityError") return "denied";
  if (name === "NotFoundError" || name === "OverconstrainedError") {
    return "unavailable";
  }

  return "failed";
}

interface IsbnScannerProps {
  // 暫停辨識（相機畫面照常顯示，只是掃到東西不回報）
  paused: boolean;
  onDetected: (isbn13: string) => void;
  onReady: () => void;
  onError: (reason: CameraErrorReason) => void;
}

// 只負責「相機 + 條碼辨識」，畫面上的取景框、提示文字、結果卡都由外層決定
export default function IsbnScanner({
  paused,
  onDetected,
  onReady,
  onError,
}: IsbnScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleDecoded = useEffectEvent((text: string) => {
    if (paused || !isIsbn13(text)) return;
    onDetected(text);
  });
  const handleStarted = useEffectEvent(() => onReady());
  const handleFailed = useEffectEvent((reason: CameraErrorReason) =>
    onError(reason),
  );

  useEffect(() => {
    let cancelled = false;
    let stream: MediaStream | null = null;
    let timerId: ReturnType<typeof setTimeout> | undefined;

    // 只辨識 EAN-13（書背 ISBN 條碼的格式），格式越少辨識越快
    const detector = new BarcodeDetector({ formats: ["ean_13"] });

    // 一輪辨識完才排下一輪，不會因為某次辨識比較慢而疊在一起
    async function detectLoop() {
      const video = videoRef.current;
      if (cancelled || !video) return;

      // readyState >= 2 代表影片已經有畫面可以讀
      if (video.readyState >= 2) {
        try {
          const barcodes = await detector.detect(video);
          if (cancelled) return;
          for (const barcode of barcodes) handleDecoded(barcode.rawValue);
        } catch (error) {
          // 單一畫面辨識失敗不影響下一輪，記錄後繼續
          console.warn("條碼辨識失敗：", error);
        }
      }

      timerId = setTimeout(detectLoop, DETECT_INTERVAL_MS);
    }

    async function start() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            // 後鏡頭
            facingMode: "environment",
            // 條碼線條很細，解析度太低會糊在一起；ideal 代表「盡量給，給不到也沒關係」
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
        });

        // 相機打開前元件就被關掉了（例如使用者馬上按 ✕）：立刻把鏡頭關掉
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        const video = videoRef.current;
        if (!video) return;

        video.srcObject = stream;
        await video.play();
        if (cancelled) return;

        handleStarted();
        detectLoop();
      } catch (error) {
        if (cancelled) return;
        console.error("相機啟動失敗：", error);
        handleFailed(toCameraErrorReason(error));
      }
    }

    start();

    return () => {
      cancelled = true;
      clearTimeout(timerId);
      // 關掉每一條影像軌道，手機上方的「相機使用中」綠點才會消失
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* playsInline：iOS 不加會強制全螢幕播放；muted：沒有靜音 iOS 不允許自動播放 */}
      <video
        ref={videoRef}
        playsInline
        muted
        className="absolute inset-0 size-full object-cover"
      />
    </div>
  );
}
