import { getEventConfig } from '@/lib/config';

// Placeholder Schedule screen — proves theming/tokens render. The real
// schedule (day switcher, time-slot grouping, session cards) lands in TASK-06.
export default function SchedulePage() {
  const { brand } = getEventConfig();
  return (
    <section className="px-4 pt-2 pb-3">
      <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold tracking-[1.2px] text-on-surface uppercase">
        <span className="inline-block size-3.5 rounded-[4px] bg-brand" />
        {brand.confName}
      </div>
      <h1 className="text-[30px] leading-[1.05] font-extrabold tracking-[-1px] text-ink">
        {brand.confEdition}
      </h1>
      <p className="mt-1 text-[13.5px] font-medium text-muted">
        Theme + brand foundation ready.
      </p>
    </section>
  );
}
