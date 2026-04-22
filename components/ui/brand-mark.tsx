export function BrandMark() {
  return (
    <div className="relative h-11 w-11 rounded-full bg-accent shadow-accent">
      <div className="absolute inset-[8px] rounded-full border-2 border-black/70" />
      <div className="absolute left-[10px] top-[13px] h-[3px] w-5 rounded-full bg-black/80" />
      <div className="absolute left-[10px] top-[20px] h-[3px] w-[18px] rounded-full bg-black/80" />
      <div className="absolute left-[10px] top-[27px] h-[3px] w-[14px] rounded-full bg-black/80" />
    </div>
  );
}
