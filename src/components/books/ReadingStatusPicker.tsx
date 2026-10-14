"use client";

import SegmentedControl from "@/components/features/SegmentedControl";
import { READING_STATUSES, STATUS_CONFIG } from "@/lib/book-status";
import type { ReadingStatus } from "@/types/book";

const STATUS_OPTIONS = READING_STATUSES.map((status) => ({
  value: status,
  label: STATUS_CONFIG[status].label,
}));

interface ReadingStatusPickerProps {
  value: ReadingStatus;
  onChange: (status: ReadingStatus) => void;
  disabled?: boolean;
}

// 三選一的閱讀狀態滑動切換（想讀 / 正在閱讀 / 已完成）
export default function ReadingStatusPicker({
  value,
  onChange,
  disabled = false,
}: ReadingStatusPickerProps) {
  return (
    <SegmentedControl
      options={STATUS_OPTIONS}
      value={value}
      onChange={onChange}
      legend="要加到哪裡？"
      disabled={disabled}
    />
  );
}
