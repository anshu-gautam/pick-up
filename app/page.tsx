"use client";

import { useRef, useState } from "react";
import { useGradientStore } from "@/lib/store";
import { GradientPreview } from "@/components/gradient-preview";
import { GradientEditor } from "@/components/gradient-editor";
import { AccessibilityChecker } from "@/components/accessibility-checker";
import { ExportPanel } from "@/components/export-panel";
import { AIPrompt } from "@/components/ai-prompt";
import { GeneratedGallery } from "@/components/generated-gallery";
import { PresetGallery } from "@/components/preset-gallery";
import { ControlsPanel } from "@/components/controls-panel";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GradientConfig } from "@/types/gradient";
import { Sparkles, Edit3, Layers } from "lucide-react";
import { generateRandomGradient } from "@/lib/gradient-utils";
import { toast } from "sonner";

export default function Home() {
  const previewRef = useRef<HTMLDivElement>(null);
  const [generatedGradients, setGeneratedGradients] = useState<GradientConfig[]>([]);

  const {
    currentGradient,
    setCurrentGradient,
    deviceSize,
    setDeviceSize,
    showTextOverlay,
    setShowTextOverlay,
    textColor,
    setTextColor,
  } = useGradientStore();

  const handleGradientsGenerated = (gradients: GradientConfig[]) => {
    setGeneratedGradients(gradients);
    if (gradients.length > 0) {
      setCurrentGradient(gradients[0]);
    }
  };

  const handleRandomGradient = () => {
    setCurrentGradient(generateRandomGradient());
    toast.success("Random gradient generated!");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
              <Layers className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold">GradientAI</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleRandomGradient}>
              <Sparkles className="h-4 w-4 mr-2" />
              Random
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 space-y-12">
        {/* AI Prompt Section */}
        <section className="py-8">
          <AIPrompt onGradientsGenerated={handleGradientsGenerated} />
        </section>

        {/* Generated Gradients Gallery */}
        {generatedGradients.length > 0 && (
          <section className="py-4">
            <GeneratedGallery
              gradients={generatedGradients}
              selectedGradient={currentGradient}
              onSelectGradient={setCurrentGradient}
            />
          </section>
        )}

        {/* Preview Section */}
        <section className="w-full max-w-6xl mx-auto">
          <div ref={previewRef} className="mb-6">
            <GradientPreview
              gradient={currentGradient}
              deviceSize={deviceSize}
              showTextOverlay={showTextOverlay}
              textColor={textColor}
            />
          </div>

          {/* Controls */}
          <div className="flex justify-center mb-8">
            <ControlsPanel
              deviceSize={deviceSize}
              onDeviceSizeChange={setDeviceSize}
              showTextOverlay={showTextOverlay}
              onShowTextOverlayChange={setShowTextOverlay}
              textColor={textColor}
              onTextColorChange={setTextColor}
            />
          </div>
        </section>

        {/* Tabs: Edit & Presets */}
        <section className="w-full max-w-6xl mx-auto">
          <Tabs defaultValue="edit" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="edit" className="flex items-center gap-2">
                <Edit3 className="h-4 w-4" />
                Edit Gradient
              </TabsTrigger>
              <TabsTrigger value="presets" className="flex items-center gap-2">
                <Layers className="h-4 w-4" />
                Preset Library
              </TabsTrigger>
            </TabsList>

            <TabsContent value="edit" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <GradientEditor
                  gradient={currentGradient}
                  onChange={setCurrentGradient}
                />
                <div className="space-y-6">
                  <AccessibilityChecker gradient={currentGradient} />
                  <ExportPanel gradient={currentGradient} previewRef={previewRef} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="presets">
              <div className="max-w-4xl mx-auto">
                <PresetGallery onSelectPreset={setCurrentGradient} />
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* Footer */}
        <footer className="mt-24 py-8 border-t text-center text-sm text-muted-foreground">
          <p>
            AI Gradient Generator - Create beautiful, accessible gradients for hero sections and landing pages
          </p>
          <p className="mt-2">
            Built with Next.js, TypeScript, TailwindCSS, and OpenAI
          </p>
        </footer>
      </main>
    </div>
  );
}
