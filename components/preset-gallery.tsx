"use client";

import { useState } from "react";
import { GradientConfig } from "@/types/gradient";
import { gradientPresets } from "@/lib/presets";
import { generateGradientCSS } from "@/lib/gradient-utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Palette, Grid3X3 } from "lucide-react";

interface PresetGalleryProps {
  onSelectPreset: (gradient: GradientConfig) => void;
}

export function PresetGallery({ onSelectPreset }: PresetGalleryProps) {
  const [activeCategory, setActiveCategory] = useState(gradientPresets[0]?.category || "");

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Palette className="h-4 w-4 text-primary" />
          Presets
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 text-xs">
              <Grid3X3 className="h-3.5 w-3.5 mr-1" />
              View All
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[400px] sm:w-[540px]">
            <SheetHeader>
              <SheetTitle>All Presets</SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-6rem)] mt-4">
              <div className="space-y-6 pr-4">
                {gradientPresets.map((preset) => (
                  <div key={preset.category}>
                    <h3 className="text-sm font-medium mb-3">{preset.category}</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {preset.gradients.map((gradient) => (
                        <button
                          key={gradient.id}
                          onClick={() => onSelectPreset(gradient)}
                          className="group relative aspect-square rounded-lg overflow-hidden border border-border/50 hover:border-primary/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                          style={{ background: generateGradientCSS(gradient) }}
                        >
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                          <div className="absolute bottom-0 left-0 right-0 p-1.5 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-white text-[9px] font-medium truncate block">
                              {gradient.name}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>

      {/* Category Tabs */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <ScrollArea className="w-full">
          <TabsList className="h-8 w-max">
            {gradientPresets.map((preset) => (
              <TabsTrigger
                key={preset.category}
                value={preset.category}
                className="text-[10px] px-2"
              >
                {preset.category}
              </TabsTrigger>
            ))}
          </TabsList>
        </ScrollArea>

        {gradientPresets.map((preset) => (
          <TabsContent key={preset.category} value={preset.category} className="mt-3">
            <div className="grid grid-cols-2 gap-2">
              {preset.gradients.slice(0, 6).map((gradient) => (
                <button
                  key={gradient.id}
                  onClick={() => onSelectPreset(gradient)}
                  className="group relative aspect-[4/3] rounded-lg overflow-hidden border border-border/50 hover:border-primary/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
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
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
