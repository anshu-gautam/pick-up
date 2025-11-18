"use client";

import { useRef } from "react";
import { GradientConfig, DeviceSize } from "@/types/gradient";
import { generateGradientCSS } from "@/lib/gradient-utils";
import { cn } from "@/lib/utils";
import { Monitor, Tablet, Smartphone } from "lucide-react";

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

const deviceIcons: Record<DeviceSize, React.ReactNode> = {
  mobile: <Smartphone className="h-3 w-3" />,
  tablet: <Tablet className="h-3 w-3" />,
  desktop: <Monitor className="h-3 w-3" />,
};

const deviceLabels: Record<DeviceSize, string> = {
  mobile: "375px",
  tablet: "768px",
  desktop: "Full",
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
    <div className={cn("h-full flex flex-col", className)}>
      <div className={cn("mx-auto transition-all duration-500 flex-1 w-full", deviceSizeClasses[deviceSize])}>
        <div
          ref={previewRef}
          className="relative w-full h-full min-h-[400px] lg:min-h-[500px] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10"
          style={{
            background: gradientCSS,
          }}
        >
          {/* Noise texture overlay */}
          <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")"
          }} />

          {showTextOverlay && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
              <h1
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 transition-colors drop-shadow-sm"
                style={{ color: textColor }}
              >
                Hero Section
              </h1>
              <p
                className="text-base sm:text-lg md:text-xl lg:text-2xl mb-8 max-w-2xl transition-colors"
                style={{ color: textColor, opacity: 0.9 }}
              >
                Test your gradient with real text to ensure perfect readability
              </p>
              <button
                className="px-6 py-3 rounded-xl font-semibold text-base transition-all hover:scale-105 shadow-lg"
                style={{
                  backgroundColor: textColor,
                  color: gradient.colorStops[0]?.color || "#000000",
                }}
              >
                Call to Action
              </button>
            </div>
          )}

          {/* Device size indicator badge */}
          <div className="absolute bottom-4 right-4">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-md text-white/80 text-xs font-medium">
              {deviceIcons[deviceSize]}
              <span>{deviceLabels[deviceSize]}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
