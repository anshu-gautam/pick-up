"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { GradientConfig, DeviceSize } from "@/types/gradient";
import { generateGradientCSS } from "@/lib/gradient-utils";
import { cn } from "@/lib/utils";
import { Monitor, Tablet, Smartphone, Move, RotateCcw } from "lucide-react";
import { FontSize, TextAlignment, ElementPosition } from "@/lib/store";
import { Button } from "@/components/ui/button";

interface DraggableCanvasProps {
  gradient: GradientConfig;
  deviceSize?: DeviceSize;
  showTextOverlay?: boolean;
  textColor?: string;
  headingText?: string;
  subheadingText?: string;
  buttonText?: string;
  fontSize?: FontSize;
  textAlignment?: TextAlignment;
  showButton?: boolean;
  headingPosition: ElementPosition;
  subheadingPosition: ElementPosition;
  buttonPosition: ElementPosition;
  selectedElement: "heading" | "subheading" | "button" | null;
  onHeadingPositionChange: (position: ElementPosition) => void;
  onSubheadingPositionChange: (position: ElementPosition) => void;
  onButtonPositionChange: (position: ElementPosition) => void;
  onSelectedElementChange: (element: "heading" | "subheading" | "button" | null) => void;
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

const fontSizeClasses: Record<FontSize, { heading: string; subheading: string; button: string }> = {
  sm: {
    heading: "text-xl sm:text-2xl md:text-3xl lg:text-4xl",
    subheading: "text-sm sm:text-base md:text-lg",
    button: "px-4 py-2 text-sm",
  },
  md: {
    heading: "text-2xl sm:text-3xl md:text-4xl lg:text-5xl",
    subheading: "text-base sm:text-lg md:text-xl",
    button: "px-5 py-2.5 text-base",
  },
  lg: {
    heading: "text-3xl sm:text-4xl md:text-5xl lg:text-6xl",
    subheading: "text-lg sm:text-xl md:text-2xl",
    button: "px-6 py-3 text-lg",
  },
  xl: {
    heading: "text-4xl sm:text-5xl md:text-6xl lg:text-7xl",
    subheading: "text-xl sm:text-2xl md:text-3xl",
    button: "px-8 py-4 text-xl",
  },
};

export function DraggableCanvas({
  gradient,
  deviceSize = "desktop",
  showTextOverlay = true,
  textColor = "#ffffff",
  headingText = "Your Headline Here",
  subheadingText = "Add your compelling subheading to see how it looks on your gradient",
  buttonText = "Get Started",
  fontSize = "md",
  textAlignment = "center",
  showButton = true,
  headingPosition,
  subheadingPosition,
  buttonPosition,
  selectedElement,
  onHeadingPositionChange,
  onSubheadingPositionChange,
  onButtonPositionChange,
  onSelectedElementChange,
  className,
}: DraggableCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const gradientCSS = generateGradientCSS(gradient);

  const getPositionFromEvent = useCallback((e: MouseEvent | TouchEvent) => {
    if (!canvasRef.current) return null;

    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;

    return {
      x: Math.max(5, Math.min(95, x)),
      y: Math.max(5, Math.min(95, y)),
    };
  }, []);

  const handleMouseDown = useCallback((
    e: React.MouseEvent | React.TouchEvent,
    element: "heading" | "subheading" | "button"
  ) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDragging(true);
    onSelectedElementChange(element);

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    setDragStart({ x: clientX, y: clientY });
  }, [onSelectedElementChange]);

  const handleMouseMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDragging || !selectedElement) return;

    const newPosition = getPositionFromEvent(e);
    if (!newPosition) return;

    switch (selectedElement) {
      case "heading":
        onHeadingPositionChange(newPosition);
        break;
      case "subheading":
        onSubheadingPositionChange(newPosition);
        break;
      case "button":
        onButtonPositionChange(newPosition);
        break;
    }
  }, [isDragging, selectedElement, getPositionFromEvent, onHeadingPositionChange, onSubheadingPositionChange, onButtonPositionChange]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
      onSelectedElementChange(null);
    }
  }, [onSelectedElementChange]);

  const resetPositions = useCallback(() => {
    onHeadingPositionChange({ x: 50, y: 35 });
    onSubheadingPositionChange({ x: 50, y: 50 });
    onButtonPositionChange({ x: 50, y: 70 });
  }, [onHeadingPositionChange, onSubheadingPositionChange, onButtonPositionChange]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleMouseMove);
      window.addEventListener("touchend", handleMouseUp);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
        window.removeEventListener("touchmove", handleMouseMove);
        window.removeEventListener("touchend", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const getAlignmentStyle = (alignment: TextAlignment) => {
    switch (alignment) {
      case "left": return "left";
      case "right": return "right";
      default: return "center";
    }
  };

  return (
    <div className={cn("h-full flex flex-col", className)}>
      <div className={cn("mx-auto transition-all duration-500 flex-1 w-full", deviceSizeClasses[deviceSize])}>
        <div
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="relative w-full h-full min-h-[400px] lg:min-h-[500px] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 cursor-crosshair"
          style={{
            background: gradientCSS,
          }}
        >
          {/* Noise texture overlay */}
          <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")"
          }} />

          {showTextOverlay && (
            <>
              {/* Heading - Draggable */}
              {headingText && (
                <div
                  className={cn(
                    "absolute cursor-move select-none transition-shadow",
                    selectedElement === "heading" && "ring-2 ring-blue-500 ring-offset-2 ring-offset-transparent rounded-lg"
                  )}
                  style={{
                    left: `${headingPosition.x}%`,
                    top: `${headingPosition.y}%`,
                    transform: "translate(-50%, -50%)",
                    textAlign: getAlignmentStyle(textAlignment),
                  }}
                  onMouseDown={(e) => handleMouseDown(e, "heading")}
                  onTouchStart={(e) => handleMouseDown(e, "heading")}
                >
                  <h1
                    className={cn(
                      "font-bold transition-colors drop-shadow-sm whitespace-nowrap",
                      fontSizeClasses[fontSize].heading
                    )}
                    style={{ color: textColor }}
                  >
                    {headingText}
                  </h1>
                  {selectedElement === "heading" && (
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2 py-0.5 rounded bg-blue-500 text-white text-xs">
                      <Move className="h-3 w-3" />
                      Heading
                    </div>
                  )}
                </div>
              )}

              {/* Subheading - Draggable */}
              {subheadingText && (
                <div
                  className={cn(
                    "absolute cursor-move select-none transition-shadow max-w-[80%]",
                    selectedElement === "subheading" && "ring-2 ring-green-500 ring-offset-2 ring-offset-transparent rounded-lg"
                  )}
                  style={{
                    left: `${subheadingPosition.x}%`,
                    top: `${subheadingPosition.y}%`,
                    transform: "translate(-50%, -50%)",
                    textAlign: getAlignmentStyle(textAlignment),
                  }}
                  onMouseDown={(e) => handleMouseDown(e, "subheading")}
                  onTouchStart={(e) => handleMouseDown(e, "subheading")}
                >
                  <p
                    className={cn(
                      "transition-colors",
                      fontSizeClasses[fontSize].subheading
                    )}
                    style={{ color: textColor, opacity: 0.9 }}
                  >
                    {subheadingText}
                  </p>
                  {selectedElement === "subheading" && (
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2 py-0.5 rounded bg-green-500 text-white text-xs">
                      <Move className="h-3 w-3" />
                      Subheading
                    </div>
                  )}
                </div>
              )}

              {/* Button - Draggable */}
              {showButton && buttonText && (
                <div
                  className={cn(
                    "absolute cursor-move select-none transition-shadow",
                    selectedElement === "button" && "ring-2 ring-purple-500 ring-offset-2 ring-offset-transparent rounded-lg"
                  )}
                  style={{
                    left: `${buttonPosition.x}%`,
                    top: `${buttonPosition.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                  onMouseDown={(e) => handleMouseDown(e, "button")}
                  onTouchStart={(e) => handleMouseDown(e, "button")}
                >
                  <button
                    className={cn(
                      "rounded-xl font-semibold shadow-lg pointer-events-none",
                      fontSizeClasses[fontSize].button
                    )}
                    style={{
                      backgroundColor: textColor,
                      color: gradient.colorStops[0]?.color || "#000000",
                    }}
                  >
                    {buttonText}
                  </button>
                  {selectedElement === "button" && (
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2 py-0.5 rounded bg-purple-500 text-white text-xs">
                      <Move className="h-3 w-3" />
                      Button
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* Canvas Controls */}
          <div className="absolute top-4 left-4 flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={resetPositions}
              className="bg-black/30 backdrop-blur-md hover:bg-black/50 text-white border-none"
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
              Reset
            </Button>
          </div>

          {/* Instructions */}
          {showTextOverlay && !selectedElement && (
            <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-md text-white/80 text-xs">
              Click & drag elements to reposition
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
