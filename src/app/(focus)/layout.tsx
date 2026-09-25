export default function FocusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-background pb-[env(safe-area-inset-bottom)]">
      <main>{children}</main>
    </div>
  );
}
