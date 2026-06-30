import type { ReactNode } from 'react';

// Centered empty/zero-results state: framed icon + title + body. Ported from
// the prototype EmptyState (components.jsx). The icon inherits `text-faint`
// from the frame unless the caller colors it.
export type EmptyStateProps = {
  icon: ReactNode;
  title: string;
  body: string;
};

export function EmptyState({ icon, title, body }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center px-10 pb-20 pt-[60px] text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-[18px] border-[0.5px] border-line bg-surface text-faint">
        {icon}
      </div>
      <div className="mb-1.5 text-[17px] font-bold tracking-[-0.3px] text-ink">{title}</div>
      <div className="max-w-[280px] text-[14px] font-medium leading-[1.4] text-muted text-pretty">
        {body}
      </div>
    </div>
  );
}
