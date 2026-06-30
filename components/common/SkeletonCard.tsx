// Loading placeholder mirroring SessionCard's frame (left stripe + three text
// bars). Ported from the prototype SkeletonCard (components.jsx). Widths are
// configurable so a list of skeletons looks naturally varied.
export type SkeletonCardProps = {
  w1?: string;
  w2?: string;
};

export function SkeletonCard({ w1 = '40%', w2 = '78%' }: SkeletonCardProps) {
  return (
    <div className="mx-3 flex overflow-hidden rounded-card border-[0.5px] border-line bg-surface">
      <div className="w-[3px] bg-line-2" />
      <div className="flex-1 px-3 py-[14px]">
        <div className="mb-2.5 h-3 rounded-[4px] bg-chip" style={{ width: w1 }} />
        <div className="mb-2.5 h-4 rounded-[4px] bg-chip" style={{ width: w2 }} />
        <div className="h-3 w-[55%] rounded-[4px] bg-chip" />
      </div>
    </div>
  );
}
