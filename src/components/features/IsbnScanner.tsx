"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";

interface IsbnScannerProps {
  onScanSuccess: (isbn: string) => void;
  onClose?: () => void; // 使用者想手動關閉掃描器（可選）
}

const SCANNER_ELEMENT_ID = "isbn-scanner-region";

export default function IsbnScanner({
  onScanSuccess,
  onClose,
}: IsbnScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const onScanSuccessRef = useRef(onScanSuccess);
  const [error, setError] = useState<string | null>(null);

  // 更新ISBN
  useEffect(() => {
    onScanSuccessRef.current = onScanSuccess;
  }, [onScanSuccess]);

  //
  useEffect(() => {
    const scanner = new Html5Qrcode(SCANNER_ELEMENT_ID, {
      formatsToSupport: [Html5QrcodeSupportedFormats.EAN_13],
      verbose: false,
    });
    scannerRef.current = scanner;

    scanner
      .start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 150 },
        },
        (decodedText) => {
          onScanSuccessRef.current(decodedText); // 呼叫「當下最新」的 ISBN
          scanner.stop().catch(() => {}); // 掃到就關閉相機，省電且避免重複觸發
        },
        () => {},
      )
      .catch((err) => {
        setError("無法啟動相機，請確認已允許相機權限");
        console.error(err);
      });

    return () => {
      scannerRef.current?.stop().catch(() => {});
    };
  }, []);

  return (
    <div>
      <div
        id={SCANNER_ELEMENT_ID}
        className="w-full aspect-video rounded-lg overflow-hidden bg-black"
      />
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
      {onClose && (
        <button
          onClick={onClose}
          className="mt-2 text-sm text-gray-500 underline"
        >
          取消掃描
        </button>
      )}
    </div>
  );
}
