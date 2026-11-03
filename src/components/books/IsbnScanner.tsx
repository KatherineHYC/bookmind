"use client";

import { useEffect, useEffectEvent, useRef } from "react";
import { BarcodeDetector } from "barcode-detector/ponyfill";
import { isIsbn13 } from "@/lib/isbn";

const DETECT_INTERVAL_MS = 150;

export type CameraErrorReason = "denied" | "unavailable" | "failed";

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
  paused: boolean;
  onDetected: (isbn13: string) => void;
  onReady: () => void;
  onError: (reason: CameraErrorReason) => void;
}

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

    const detector = new BarcodeDetector({ formats: ["ean_13"] });

    async function detectLoop() {
      const video = videoRef.current;
      if (cancelled || !video) return;

      if (video.readyState >= 2) {
        try {
          const barcodes = await detector.detect(video);
          if (cancelled) return;
          for (const barcode of barcodes) handleDecoded(barcode.rawValue);
        } catch (error) {
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
            facingMode: "environment",
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
        });

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
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <video
        ref={videoRef}
        playsInline
        muted
        className="absolute inset-0 size-full object-cover"
      />
    </div>
  );
}
