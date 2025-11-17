"use client";

import { useRef } from "react";
import { useGradientStore } from "@/lib/store";
import { GradientPreview } from "@/components/gradient-preview";
import { GradientEditor } from "@/components/gradient-editor";
import { AccessibilityChecker } from "@/components/accessibility-checker";
import { ExportPanel } from "@/components/export-panel";
import { AIPrompt } from "@/components/ai-prompt";
import { PresetGallery } from "@/components/preset-gallery";
import { ControlsPanel } from "@/components/controls-panel";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { GradientConfig } from "@/types/gradient";
import { Palette, Sparkles } from "lucide-react";
import { generateRandomGradient } from "@/lib/gradient-utils";
import { toast } from "sonner";

export default function Home() {
  const previewRef = useRef<HTMLDivElement>(null);

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
    if (gradients.length > 0) {
      setCurrentGradient(gradients[0]);
      // You could also show a modal to let users choose from all generated gradients
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
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette className="h-6 w-6" />
            <h1 className="text-2xl font-bold">AI Gradient Generator</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleRandomGradient}>
              <Sparkles className="h-4 w-4 mr-2" />
              Random
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar */}
          <div className="space-y-6 lg:col-span-1">
            <AIPrompt onGradientsGenerated={handleGradientsGenerated} />
            <PresetGallery onSelectPreset={setCurrentGradient} />
          </div>

          {/* Center - Preview */}
          <div className="lg:col-span-2 space-y-6">
            <div ref={previewRef}>
              <GradientPreview
                gradient={currentGradient}
                deviceSize={deviceSize}
                showTextOverlay={showTextOverlay}
                textColor={textColor}
              />
            </div>

            <ControlsPanel
              deviceSize={deviceSize}
              onDeviceSizeChange={setDeviceSize}
              showTextOverlay={showTextOverlay}
              onShowTextOverlayChange={setShowTextOverlay}
              textColor={textColor}
              onTextColorChange={setTextColor}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GradientEditor
                gradient={currentGradient}
                onChange={setCurrentGradient}
              />
              <div className="space-y-6">
                <AccessibilityChecker gradient={currentGradient} />
                <ExportPanel gradient={currentGradient} previewRef={previewRef} />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 py-8 border-t text-center text-sm text-muted-foreground">
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
