"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GradientConfig } from "@/types/gradient";
import { gradientPresets } from "@/lib/presets";
import { generateGradientCSS } from "@/lib/gradient-utils";
import { Palette, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PresetGalleryProps {
  onSelectPreset: (gradient: GradientConfig) => void;
}

export function PresetGallery({ onSelectPreset }: PresetGalleryProps) {
  const [activeCategory, setActiveCategory] = useState(0);
  const currentPreset = gradientPresets[activeCategory];

  const nextCategory = () => {
    setActiveCategory((prev) => (prev + 1) % gradientPresets.length);
  };

  const prevCategory = () => {
    setActiveCategory((prev) => (prev - 1 + gradientPresets.length) % gradientPresets.length);
  };

  return (
    <Card variant="glass" className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4 text-primary" />
            Presets
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={prevCategory}>
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            <span className="text-xs text-muted-foreground min-w-[60px] text-center">
              {currentPreset?.category}
            </span>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={nextCategory}>
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {currentPreset?.gradients.slice(0, 4).map((gradient) => (
            <button
              key={gradient.id}
              onClick={() => onSelectPreset(gradient)}
              className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-white/10 hover:border-primary/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
              style={{ background: generateGradientCSS(gradient) }}
            >
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
              <div className="absolute bottom-0 left-0 right-0 p-1.5 bg-gradient-to-t from-black/60 to-transparent">
                <span className="text-white text-[10px] font-medium truncate block">
                  {gradient.name}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Category dots */}
        <div className="flex items-center justify-center gap-1 mt-3">
          {gradientPresets.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveCategory(index)}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                index === activeCategory
                  ? "bg-primary w-4"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
