export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex h-full w-full flex-1 flex-col items-center justify-center gap-6">
      {children}
    </main>
  );
}
