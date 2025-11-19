"use client";

import { useState } from "react";
import { GradientConfig, DeviceSize } from "@/types/gradient";
import { generateGradientCSS } from "@/lib/gradient-utils";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Monitor, Tablet, Smartphone, Maximize2, Copy, Check } from "lucide-react";
import { toast } from "sonner";

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
  const [copied, setCopied] = useState(false);
  const gradientCSS = generateGradientCSS(gradient);

  const handleCopyCSS = async () => {
    try {
      await navigator.clipboard.writeText(`background: ${gradientCSS};`);
      setCopied(true);
      toast.success("CSS copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const PreviewContent = ({ isFullscreen = false }: { isFullscreen?: boolean }) => (
    <div
      className={cn(
        "relative w-full rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 transition-all duration-500",
        isFullscreen ? "h-full" : "h-full min-h-[500px]"
      )}
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
            className={cn(
              "font-bold mb-4 transition-colors drop-shadow-sm",
              isFullscreen ? "text-5xl md:text-7xl" : "text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
            )}
            style={{ color: textColor }}
          >
            Hero Section
          </h1>
          <p
            className={cn(
              "mb-8 max-w-2xl transition-colors",
              isFullscreen ? "text-xl md:text-2xl" : "text-base sm:text-lg md:text-xl lg:text-2xl"
            )}
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

      {/* Action buttons */}
      <div className="absolute top-4 right-4 flex gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant="secondary"
              className="h-8 w-8 p-0 bg-black/30 backdrop-blur-md border-0 hover:bg-black/50"
              onClick={handleCopyCSS}
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-emerald-400" />
              ) : (
                <Copy className="h-3.5 w-3.5 text-white" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>Copy CSS</TooltipContent>
        </Tooltip>

        {!isFullscreen && (
          <Dialog>
            <Tooltip>
              <TooltipTrigger asChild>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 w-8 p-0 bg-black/30 backdrop-blur-md border-0 hover:bg-black/50"
                  >
                    <Maximize2 className="h-3.5 w-3.5 text-white" />
                  </Button>
                </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent>Fullscreen</TooltipContent>
            </Tooltip>
            <DialogContent className="max-w-[95vw] h-[90vh] p-0 overflow-hidden">
              <DialogHeader className="sr-only">
                <DialogTitle>Gradient Preview</DialogTitle>
              </DialogHeader>
              <PreviewContent isFullscreen />
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Device size indicator badge */}
      <div className="absolute bottom-4 right-4">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-md text-white/80 text-xs font-medium">
          {deviceIcons[deviceSize]}
          <span>{deviceLabels[deviceSize]}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className={cn("h-full flex flex-col", className)}>
      <div className={cn("mx-auto transition-all duration-500 flex-1 w-full", deviceSizeClasses[deviceSize])}>
        <PreviewContent />
      </div>
    </div>
  );
}
