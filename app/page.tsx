"use client";

import { useRef, useState } from "react";
import { useGradientStore } from "@/lib/store";
import { DraggableCanvas } from "@/components/draggable-canvas";
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
import { Sparkles, Save, FolderOpen, Wand2, Github, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { generateRandomGradient } from "@/lib/gradient-utils";
import { toast } from "sonner";

export default function Home() {
  const previewRef = useRef<HTMLDivElement>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showSavedGradients, setShowSavedGradients] = useState(false);
  const [showAISidebar, setShowAISidebar] = useState(true);

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
    headingPosition,
    setHeadingPosition,
    subheadingPosition,
    setSubheadingPosition,
    buttonPosition,
    setButtonPosition,
    selectedElement,
    setSelectedElement,
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
    <div className="h-screen flex flex-col bg-background relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="fixed inset-0 gradient-bg-animated opacity-50 pointer-events-none" />

      {/* Floating orbs for visual interest */}
      <div className="fixed top-1/4 -left-32 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-float pointer-events-none" />
      <div className="fixed bottom-1/4 -right-32 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float pointer-events-none" style={{ animationDelay: "-3s" }} />

      {/* Header */}
      <header className="relative border-b bg-background/80 backdrop-blur-xl z-50 flex-shrink-0">
        <div className="px-4 py-3">
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

      {/* Main Content - App-like Layout */}
      <main className="relative flex-1 flex overflow-hidden">
        {/* Left Sidebar - AI Generation */}
        <aside className={`
          ${showAISidebar ? 'w-80' : 'w-0'}
          transition-all duration-300 ease-in-out
          border-r bg-background/80 backdrop-blur-xl
          flex-shrink-0 overflow-hidden
        `}>
          <div className="w-80 h-full overflow-y-auto p-4">
            <AIPrompt onGradientsGenerated={handleGradientsGenerated} />
          </div>
        </aside>

        {/* Toggle Sidebar Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAISidebar(!showAISidebar)}
          className="absolute left-0 top-4 z-10 ml-2"
          style={{ left: showAISidebar ? '320px' : '0' }}
        >
          {showAISidebar ? (
            <PanelLeftClose className="h-4 w-4" />
          ) : (
            <PanelLeftOpen className="h-4 w-4" />
          )}
        </Button>

        {/* Center - Main Canvas */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Canvas Area */}
          <div className="flex-1 p-4 lg:p-6 overflow-y-auto">
            <div ref={previewRef} className="h-full min-h-[500px]">
              <DraggableCanvas
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
                headingPosition={headingPosition}
                subheadingPosition={subheadingPosition}
                buttonPosition={buttonPosition}
                selectedElement={selectedElement}
                onHeadingPositionChange={setHeadingPosition}
                onSubheadingPositionChange={setSubheadingPosition}
                onButtonPositionChange={setButtonPosition}
                onSelectedElementChange={setSelectedElement}
              />
            </div>
          </div>

          {/* Bottom Section - Presets, Editor, Export */}
          <div className="border-t bg-background/80 backdrop-blur-xl p-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Presets / Saved */}
              <div className="lg:col-span-1">
                {showSavedGradients ? (
                  <SavedGradients onSelect={handleSelectSavedGradient} />
                ) : (
                  <PresetGallery onSelectPreset={setCurrentGradient} />
                )}
              </div>

              {/* Gradient Editor */}
              <div className="lg:col-span-1">
                <GradientEditor
                  gradient={currentGradient}
                  onChange={setCurrentGradient}
                />
              </div>

              {/* Export Panel */}
              <div className="lg:col-span-1">
                <ExportPanel gradient={currentGradient} previewRef={previewRef} />
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Controls */}
        <aside className="w-80 border-l bg-background/80 backdrop-blur-xl flex-shrink-0 overflow-y-auto hidden xl:block">
          <div className="p-4 space-y-4">
            {/* Text Customization */}
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

            {/* Device Preview Controls */}
            <ControlsPanel
              deviceSize={deviceSize}
              onDeviceSizeChange={setDeviceSize}
            />

            {/* Accessibility Checker */}
            <AccessibilityChecker gradient={currentGradient} />
          </div>
        </aside>
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
