type TextSkeletonProps = {
  width?: string | number;
  height?: string | number;
  className?: string;
};

export default function TextSkeleton({
  width = "100%",
  height = 16,
  className = "",
}: TextSkeletonProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-md bg-white/15 ${className}`}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
      }}
    >
      {/* shimmer */}
      <div className="absolute inset-0">
        <div className="h-full w-[200%] -translate-x-full animate-[shimmer_1.2s_linear_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      </div>
      <style>
        {`
          @keyframes shimmer {
            100% {
              transform: translateX(150%);
            }
          }
        `}
      </style>
    </div>
  );
}