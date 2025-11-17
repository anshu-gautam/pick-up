"use client";

import { useRef } from "react";
import { GradientConfig, DeviceSize } from "@/types/gradient";
import { generateGradientCSS } from "@/lib/gradient-utils";
import { cn } from "@/lib/utils";

interface GradientPreviewProps {
  gradient: GradientConfig;
  deviceSize?: DeviceSize;
  showTextOverlay?: boolean;
  textColor?: string;
  className?: string;
}

const deviceSizeClasses: Record<DeviceSize, string> = {
  mobile: "max-w-[375px]",
  tablet: "max-w-[768px]",
  desktop: "w-full",
};

export function GradientPreview({
  gradient,
  deviceSize = "desktop",
  showTextOverlay = true,
  textColor = "#ffffff",
  className,
}: GradientPreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null);
  const gradientCSS = generateGradientCSS(gradient);

  return (
    <div className={cn("mx-auto transition-all duration-300", deviceSizeClasses[deviceSize], className)}>
      <div
        ref={previewRef}
        className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/5"
        style={{
          background: gradientCSS,
        }}
      >
        {showTextOverlay && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 transition-colors drop-shadow-lg"
              style={{ color: textColor }}
            >
              Hero Section
            </h1>
            <p
              className="text-lg md:text-xl lg:text-2xl mb-8 max-w-2xl transition-colors drop-shadow-md"
              style={{ color: textColor, opacity: 0.9 }}
            >
              Test your gradient with real text to ensure perfect readability
            </p>
            <button
              className="px-8 py-3 rounded-xl font-semibold text-base transition-all hover:scale-105 shadow-lg"
              style={{
                backgroundColor: textColor,
                color: gradient.colorStops[0]?.color || "#000000",
              }}
            >
              Call to Action
            </button>
          </div>
        )}
      </div>

      {/* Gradient Name */}
      <div className="mt-4 text-center">
        <p className="text-lg font-semibold">{gradient.name}</p>
        <p className="text-sm text-muted-foreground">
          {gradient.type.charAt(0).toUpperCase() + gradient.type.slice(1)} gradient at {gradient.angle}°
        </p>
      </div>
    </div>
  );
}
