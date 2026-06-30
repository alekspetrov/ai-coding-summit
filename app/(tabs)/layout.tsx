import type { ReactNode } from 'react';

// Tab shell. The sticky HappeningNowBanner and BottomNav land here in
// TASK-05/06; for now it establishes the mobile-first centered column with
// safe-area padding. Native window scroll (no inner overflow containers).
export default function TabsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto min-h-dvh w-full max-w-[480px]">
      <main>{children}</main>
    </div>
  );
}
