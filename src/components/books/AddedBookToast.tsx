interface AddedBookToastProps {
  title: string;
  duplicate: boolean;
}

// 新增書籍後的 toast 文字：只截斷書名本身，《》與前後文字永遠完整顯示
export default function AddedBookToast({
  title,
  duplicate,
}: AddedBookToastProps) {
  return (
    <span className="flex min-w-0">
      {!duplicate && <span className="shrink-0">已新增</span>}
      <span className="shrink-0">《</span>
      <span className="truncate">{title}</span>
      <span className="shrink-0">》</span>
      {duplicate && <span className="shrink-0">已在你的書單中</span>}
    </span>
  );
}
