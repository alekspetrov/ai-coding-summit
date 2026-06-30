import { cx } from '@/lib/cx';

// Small typographic session-kind label (no emoji). Keynote/Lightning render as
// a solid inverted badge; Talk/Workshop/Break as a hairline outline. Ported
// from the prototype KIND_META/KindChip (components.jsx).
//
// `SessionKind` mirrors the kinds the data schema (TASK-02) discriminates on;
// kept local so this presentational atom carries no schema dependency.
export type SessionKind = 'keynote' | 'talk' | 'lightning' | 'workshop' | 'break';

const KIND_LABEL: Record<SessionKind, string> = {
  keynote: 'Keynote',
  talk: 'Talk',
  lightning: 'Lightning',
  workshop: 'Workshop',
  break: 'Break',
};

const KIND_SOLID: Record<SessionKind, boolean> = {
  keynote: true,
  lightning: true,
  talk: false,
  workshop: false,
  break: false,
};

export function KindChip({ kind }: { kind: SessionKind }) {
  return (
    <span
      className={cx(
        'inline-flex items-center rounded-[4px] px-[7px] py-[3px] text-[10.5px] font-bold uppercase tracking-[0.6px]',
        KIND_SOLID[kind] ? 'bg-ink text-surface' : 'border border-line-2 text-muted',
      )}
    >
      {KIND_LABEL[kind]}
    </span>
  );
}
