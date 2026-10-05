"use client";

import { useEffect, useEffectEvent } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { isIsbn13 } from "@/lib/isbn";

const SCANNER_ELEMENT_ID = "isbn-scanner-region";

let previousShutdown: Promise<void> = Promise.resolve();

export type CameraErrorReason = "denied" | "unavailable" | "failed";

function toCameraErrorReason(error: unknown): CameraErrorReason {
  if (!navigator.mediaDevices?.getUserMedia) return "unavailable";

  const message = String(error);
  if (/NotAllowedError|SecurityError/.test(message)) return "denied";
  if (/NotFoundError|OverconstrainedError/.test(message)) return "unavailable";

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
    let scanner: Html5Qrcode | null = null;

    const started = previousShutdown.then(async () => {
      if (cancelled) return;

      scanner = new Html5Qrcode(SCANNER_ELEMENT_ID, {
        formatsToSupport: [Html5QrcodeSupportedFormats.EAN_13],
        verbose: false,
      });

      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, disableFlip: true },
        (decodedText) => handleDecoded(decodedText),
        () => {},
      );
    });

    started.then(
      () => {
        if (!cancelled) handleStarted();
      },
      (error: unknown) => {
        if (cancelled) return;
        console.error("相機啟動失敗：", error);
        handleFailed(toCameraErrorReason(error));
      },
    );

    return () => {
      cancelled = true;

      previousShutdown = started
        .catch(() => {})
        .then(() => (scanner?.isScanning ? scanner.stop() : undefined))
        .catch(() => {});
    };
  }, []);

  return (
    <div className="absolute inset-0">
      <div
        id={SCANNER_ELEMENT_ID}
        className="size-full overflow-hidden [&_video]:absolute [&_video]:inset-0 [&_video]:size-full! [&_video]:object-cover"
      />
    </div>
  );
}
