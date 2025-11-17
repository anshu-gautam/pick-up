"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GradientConfig } from "@/types/gradient";
import { gradientPresets } from "@/lib/presets";
import { generateGradientCSS } from "@/lib/gradient-utils";

interface PresetGalleryProps {
  onSelectPreset: (gradient: GradientConfig) => void;
}

export function PresetGallery({ onSelectPreset }: PresetGalleryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Preset Library</CardTitle>
        <CardDescription>Choose from curated gradients</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={gradientPresets[0]?.category}>
          <TabsList className="grid w-full grid-cols-3">
            {gradientPresets.slice(0, 3).map((preset) => (
              <TabsTrigger key={preset.category} value={preset.category}>
                {preset.category}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsList className="grid w-full grid-cols-3 mt-2">
            {gradientPresets.slice(3, 6).map((preset) => (
              <TabsTrigger key={preset.category} value={preset.category}>
                {preset.category}
              </TabsTrigger>
            ))}
          </TabsList>

          {gradientPresets.map((preset) => (
            <TabsContent key={preset.category} value={preset.category} className="mt-4">
              <div className="grid grid-cols-2 gap-3">
                {preset.gradients.map((gradient) => (
                  <button
                    key={gradient.id}
                    onClick={() => onSelectPreset(gradient)}
                    className="group relative aspect-video rounded-lg overflow-hidden border hover:border-primary transition-all hover:scale-105"
                    style={{ background: generateGradientCSS(gradient) }}
                  >
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/60 text-white text-xs font-medium">
                      {gradient.name}
                    </div>
                  </button>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
