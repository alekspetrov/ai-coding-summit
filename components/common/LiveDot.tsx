// Animated "happening now" beacon: a solid dot with an expanding pulse ring.
// The pulse uses .animate-beacon (defined in theme.css), which is disabled
// under prefers-reduced-motion. Ported from the prototype LiveDot.
//
// #FF4D4D is the fixed "live" red — identical in light and dark — so it is a
// literal rather than a theme token.
const LIVE_RED = '#FF4D4D';

export function LiveDot({ label }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-[5px]">
      <span className="relative" style={{ width: 7, height: 7 }}>
        <span className="absolute inset-0 rounded-pill" style={{ background: LIVE_RED }} />
        <span
          className="animate-beacon absolute -inset-[3px] rounded-pill"
          style={{ background: LIVE_RED, opacity: 0.4 }}
        />
      </span>
      {label && (
        <span
          className="text-[10.5px] font-extrabold uppercase tracking-[0.8px]"
          style={{ color: LIVE_RED }}
        >
          {label}
        </span>
      )}
    </span>
  );
}
