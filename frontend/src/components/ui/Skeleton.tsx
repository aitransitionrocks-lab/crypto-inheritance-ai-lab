import React from "react";

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  rounded?: boolean;
  className?: string;
}

export default function Skeleton({
  width,
  height,
  rounded = false,
  className = "",
}: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-[#e2e8f0] ${rounded ? "rounded-full" : "rounded-lg"} ${className}`}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
      }}
    />
  );
}
