"use client";

import { useRef, useState } from "react";
import { useGradientStore } from "@/lib/store";
import { GradientPreview } from "@/components/gradient-preview";
import { GradientEditor } from "@/components/gradient-editor";
import { AccessibilityChecker } from "@/components/accessibility-checker";
import { ExportPanel } from "@/components/export-panel";
import { AIPrompt } from "@/components/ai-prompt";
import { PresetGallery } from "@/components/preset-gallery";
import { ControlsPanel } from "@/components/controls-panel";
import { TextCustomizationPanel } from "@/components/text-customization-panel";
import { ThemeToggle } from "@/components/theme-toggle";
import { SaveGradientDialog } from "@/components/save-gradient-dialog";
import { SavedGradients } from "@/components/saved-gradients";
import { Button } from "@/components/ui/button";
import { GradientConfig } from "@/types/gradient";
import { Sparkles, Save, FolderOpen, Wand2, Github } from "lucide-react";
import { generateRandomGradient } from "@/lib/gradient-utils";
import { toast } from "sonner";

export default function Home() {
  const previewRef = useRef<HTMLDivElement>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showSavedGradients, setShowSavedGradients] = useState(false);

  const {
    currentGradient,
    setCurrentGradient,
    deviceSize,
    setDeviceSize,
    showTextOverlay,
    setShowTextOverlay,
    textColor,
    setTextColor,
    headingText,
    setHeadingText,
    subheadingText,
    setSubheadingText,
    buttonText,
    setButtonText,
    fontSize,
    setFontSize,
    textAlignment,
    setTextAlignment,
    showButton,
    setShowButton,
  } = useGradientStore();

  const handleGradientsGenerated = (gradients: GradientConfig[]) => {
    if (gradients.length > 0) {
      setCurrentGradient(gradients[0]);
    }
  };

  const handleRandomGradient = () => {
    setCurrentGradient(generateRandomGradient());
    toast.success("Random gradient generated!");
  };

  const handleSaveGradient = () => {
    setShowSaveDialog(true);
  };

  const handleSelectSavedGradient = (gradient: GradientConfig) => {
    setCurrentGradient(gradient);
    setShowSavedGradients(false);
    toast.success(`Loaded "${gradient.name}"`);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="fixed inset-0 gradient-bg-animated opacity-50 pointer-events-none" />

      {/* Floating orbs for visual interest */}
      <div className="fixed top-1/4 -left-32 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-float pointer-events-none" />
      <div className="fixed bottom-1/4 -right-32 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float pointer-events-none" style={{ animationDelay: "-3s" }} />

      {/* Header */}
      <header className="relative border-b bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-accent">
                <Wand2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">Gradient Studio</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">AI-Powered Design Tool</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSavedGradients(!showSavedGradients)}
                className="hidden sm:flex"
              >
                <FolderOpen className="h-4 w-4 mr-2" />
                Saved
              </Button>
              <Button variant="ghost" size="sm" onClick={handleSaveGradient}>
                <Save className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Save</span>
              </Button>
              <Button variant="default" size="sm" onClick={handleRandomGradient} className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
                <Sparkles className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Random</span>
              </Button>
              <ThemeToggle />
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center justify-center h-9 w-9 rounded-md hover:bg-secondary transition-colors"
              >
                <Github className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative container mx-auto px-4 py-8">
        {/* Improved Layout - Clear workflow: Generate → Preview → Customize → Export */}
        <div className="space-y-6">

          {/* Section 1: AI Generation - Full width for prominence */}
          <div className="animate-slide-up">
            <AIPrompt onGradientsGenerated={handleGradientsGenerated} />
          </div>

          {/* Section 2: Main workspace - Preview + Customization */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">

            {/* Left Column: Preview (Main Focus) */}
            <div className="lg:col-span-8 animate-slide-up" style={{ animationDelay: "0.1s" }}>
              <div ref={previewRef} className="h-full">
                <GradientPreview
                  gradient={currentGradient}
                  deviceSize={deviceSize}
                  showTextOverlay={showTextOverlay}
                  textColor={textColor}
                  headingText={headingText}
                  subheadingText={subheadingText}
                  buttonText={buttonText}
                  fontSize={fontSize}
                  textAlignment={textAlignment}
                  showButton={showButton}
                />
              </div>
            </div>

            {/* Right Column: Text & Preview Controls */}
            <div className="lg:col-span-4 space-y-4">
              {/* Text Customization - Primary control */}
              <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
                <TextCustomizationPanel
                  headingText={headingText}
                  onHeadingTextChange={setHeadingText}
                  subheadingText={subheadingText}
                  onSubheadingTextChange={setSubheadingText}
                  buttonText={buttonText}
                  onButtonTextChange={setButtonText}
                  fontSize={fontSize}
                  onFontSizeChange={setFontSize}
                  textAlignment={textAlignment}
                  onTextAlignmentChange={setTextAlignment}
                  textColor={textColor}
                  onTextColorChange={setTextColor}
                  showTextOverlay={showTextOverlay}
                  onShowTextOverlayChange={setShowTextOverlay}
                  showButton={showButton}
                  onShowButtonChange={setShowButton}
                />
              </div>

              {/* Device Preview Controls */}
              <div className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
                <ControlsPanel
                  deviceSize={deviceSize}
                  onDeviceSizeChange={setDeviceSize}
                  showTextOverlay={showTextOverlay}
                  onShowTextOverlayChange={setShowTextOverlay}
                  textColor={textColor}
                  onTextColorChange={setTextColor}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Presets & Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
            <div className="lg:col-span-8 animate-slide-up" style={{ animationDelay: "0.4s" }}>
              {showSavedGradients ? (
                <SavedGradients onSelect={handleSelectSavedGradient} />
              ) : (
                <PresetGallery onSelectPreset={setCurrentGradient} />
              )}
            </div>

            {/* Accessibility Checker */}
            <div className="lg:col-span-4 animate-slide-up" style={{ animationDelay: "0.5s" }}>
              <AccessibilityChecker gradient={currentGradient} />
            </div>
          </div>

          {/* Section 4: Fine-tune & Export */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            {/* Gradient Editor - Detailed controls */}
            <div className="animate-slide-up" style={{ animationDelay: "0.6s" }}>
              <GradientEditor
                gradient={currentGradient}
                onChange={setCurrentGradient}
              />
            </div>

            {/* Export Panel */}
            <div className="animate-slide-up" style={{ animationDelay: "0.7s" }}>
              <ExportPanel gradient={currentGradient} previewRef={previewRef} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 py-8 border-t text-center">
          <p className="text-sm text-muted-foreground">
            <span className="gradient-text font-semibold">Gradient Studio</span> - Create beautiful, accessible gradients for hero sections and landing pages
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Built with Next.js, TypeScript, TailwindCSS, and AI
          </p>
        </footer>
      </main>

      {/* Save Gradient Dialog */}
      <SaveGradientDialog
        gradient={currentGradient}
        isOpen={showSaveDialog}
        onClose={() => setShowSaveDialog(false)}
      />
    </div>
  );
}
