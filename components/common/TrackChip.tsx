// Low-saturation track pill — the track color as a 0.5px ring + faint wash + a
// glowing dot, so it reads against any background without fighting the brand
// color. Ported from the prototype TrackChip (components.jsx).
export type TrackChipProps = {
  name: string;
  color: string;
};

export function TrackChip({ name, color }: TrackChipProps) {
  return (
    <span
      className="inline-flex items-center gap-[6px] whitespace-nowrap rounded-pill text-[11px] font-semibold tracking-[0.2px] text-ink"
      style={{
        padding: '3px 8px 3px 7px',
        background: `${color}22`,
        border: `0.5px solid ${color}66`,
      }}
    >
      <span
        className="rounded-pill"
        style={{ width: 6, height: 6, background: color, boxShadow: `0 0 0 2px ${color}33` }}
      />
      {name}
    </span>
  );
}
