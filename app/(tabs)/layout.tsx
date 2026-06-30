import type { ReactNode } from 'react';
import { getEvent } from '@/lib/event';
import { NowProvider } from '@/context/NowProvider';
import { FavoritesProvider } from '@/context/FavoritesProvider';
import { RecentsProvider } from '@/context/RecentsProvider';
import { HappeningNowBanner } from '@/components/chrome/HappeningNowBanner';
import { BottomNav } from '@/components/chrome/BottomNav';

// Tab shell: mobile-first centered column, native window scroll. The server
// reads the validated event once and hands the banner the data it needs; the
// client providers (now / favorites / recents) wrap the screens. The sticky
// banner sits at the top of the column; the fixed BottomNav clears the inset.
export default function TabsLayout({ children }: { children: ReactNode }) {
  const event = getEvent();

  return (
    <NowProvider>
      <FavoritesProvider>
        <RecentsProvider>
          <div className="mx-auto min-h-dvh w-full max-w-[480px]">
            <HappeningNowBanner
              sessions={event.sessions}
              rooms={event.rooms}
              conf={{ startsAt: event.conference.startsAt, endsAt: event.conference.endsAt }}
            />
            <main className="pb-[88px]">{children}</main>
            <BottomNav />
          </div>
        </RecentsProvider>
      </FavoritesProvider>
    </NowProvider>
  );
}
