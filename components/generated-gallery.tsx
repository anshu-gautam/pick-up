"use client";

import { GradientConfig } from "@/types/gradient";
import { generateGradientCSS } from "@/lib/gradient-utils";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface GeneratedGalleryProps {
  gradients: GradientConfig[];
  selectedGradient: GradientConfig;
  onSelectGradient: (gradient: GradientConfig) => void;
}

export function GeneratedGallery({
  gradients,
  selectedGradient,
  onSelectGradient,
}: GeneratedGalleryProps) {
  if (gradients.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Generated Gradients ({gradients.length})
        </h2>
        <p className="text-sm text-muted-foreground">
          Click to select and customize
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {gradients.map((gradient) => {
          const isSelected = selectedGradient.id === gradient.id;

          return (
            <button
              key={gradient.id}
              onClick={() => onSelectGradient(gradient)}
              className={cn(
                "group relative aspect-[16/9] rounded-2xl overflow-hidden transition-all duration-300",
                "hover:scale-105 hover:shadow-2xl",
                isSelected
                  ? "ring-4 ring-primary ring-offset-4 ring-offset-background shadow-2xl scale-[1.02]"
                  : "ring-2 ring-border hover:ring-primary/50"
              )}
              style={{ background: generateGradientCSS(gradient) }}
            >
              {/* Overlay */}
              <div
                className={cn(
                  "absolute inset-0 bg-black/0 transition-colors duration-300",
                  !isSelected && "group-hover:bg-black/10"
                )}
              />

              {/* Gradient Name */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-white font-semibold text-sm line-clamp-2">
                  {gradient.name}
                </p>
              </div>

              {/* Selected Indicator */}
              {isSelected && (
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg">
                  <Check className="h-5 w-5 text-primary-foreground" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
