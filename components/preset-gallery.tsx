"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GradientConfig } from "@/types/gradient";
import { gradientPresets } from "@/lib/presets";
import { generateGradientCSS } from "@/lib/gradient-utils";

interface PresetGalleryProps {
  onSelectPreset: (gradient: GradientConfig) => void;
}

export function PresetGallery({ onSelectPreset }: PresetGalleryProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Curated Presets</h2>
        <p className="text-muted-foreground">
          Browse our collection of professionally designed gradients
        </p>
      </div>

      <Tabs defaultValue={gradientPresets[0]?.category} className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 h-auto gap-2 bg-transparent">
          {gradientPresets.map((preset) => (
            <TabsTrigger
              key={preset.category}
              value={preset.category}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              {preset.category}
            </TabsTrigger>
          ))}
        </TabsList>

        {gradientPresets.map((preset) => (
          <TabsContent key={preset.category} value={preset.category} className="mt-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {preset.gradients.map((gradient) => (
                <button
                  key={gradient.id}
                  onClick={() => onSelectPreset(gradient)}
                  className="group relative aspect-video rounded-xl overflow-hidden border-2 border-border hover:border-primary transition-all hover:scale-105 shadow-sm hover:shadow-xl"
                  style={{ background: generateGradientCSS(gradient) }}
                >
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-white text-xs font-semibold truncate">
                      {gradient.name}
                    </p>
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
