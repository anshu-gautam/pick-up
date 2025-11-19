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
import { ThemeToggle } from "@/components/theme-toggle";
import { SaveGradientDialog } from "@/components/save-gradient-dialog";
import { SavedGradients } from "@/components/saved-gradients";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GradientConfig } from "@/types/gradient";
import { Sparkles, Save, Wand2, Github, LogIn, PanelRight, Palette, FolderOpen } from "lucide-react";
import { generateRandomGradient } from "@/lib/gradient-utils";
import { toast } from "sonner";
import { UserButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  const { isSignedIn, isLoaded } = useAuth();
  const previewRef = useRef<HTMLDivElement>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    toast.success(`Loaded "${gradient.name}"`);
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Animated gradient background */}
        <div className="fixed inset-0 gradient-bg-animated opacity-30 pointer-events-none" />

        {/* Floating orbs for visual interest */}
        <div className="fixed top-1/4 -left-32 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float pointer-events-none" />
        <div className="fixed bottom-1/4 -right-32 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float pointer-events-none" style={{ animationDelay: "-3s" }} />

        {/* Header - Reduced height */}
        <header className="border-b bg-background/80 backdrop-blur-xl sticky top-0 z-50 h-14">
          <div className="container mx-auto px-4 h-full">
            <div className="flex items-center justify-between h-full">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary to-accent">
                  <Wand2 className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold gradient-text">Gradient Studio</h1>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <Button variant="ghost" size="sm" onClick={handleSaveGradient} className="h-8">
                  <Save className="h-3.5 w-3.5 sm:mr-1.5" />
                  <span className="hidden sm:inline text-xs">Save</span>
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleRandomGradient}
                  className="h-8 bg-gradient-to-r from-primary to-accent hover:opacity-90"
                >
                  <Sparkles className="h-3.5 w-3.5 sm:mr-1.5" />
                  <span className="hidden sm:inline text-xs">Random</span>
                </Button>
                <ThemeToggle />

                {/* Auth Buttons */}
                {!isLoaded ? (
                  <div className="h-8 w-16 bg-secondary animate-pulse rounded" />
                ) : isSignedIn ? (
                  <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        avatarBox: "h-8 w-8"
                      }
                    }}
                  />
                ) : (
                  <>
                    <Link href="/sign-in">
                      <Button variant="ghost" size="sm" className="h-8 text-xs">
                        <LogIn className="h-3.5 w-3.5 mr-1" />
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/sign-up" className="hidden sm:block">
                      <Button size="sm" className="h-8 text-xs bg-gradient-to-r from-primary to-accent hover:opacity-90">
                        Sign Up
                      </Button>
                    </Link>
                  </>
                )}

                {/* Mobile sidebar toggle */}
                <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="sm" className="lg:hidden h-8 w-8 p-0">
                      <PanelRight className="h-4 w-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[340px] p-0">
                    <ScrollArea className="h-full">
                      <div className="p-4 space-y-4">
                        <Tabs defaultValue="presets" className="w-full">
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="presets" className="text-xs">
                              <Palette className="h-3.5 w-3.5 mr-1.5" />
                              Presets
                            </TabsTrigger>
                            <TabsTrigger value="saved" className="text-xs">
                              <FolderOpen className="h-3.5 w-3.5 mr-1.5" />
                              Saved
                            </TabsTrigger>
                          </TabsList>
                          <TabsContent value="presets" className="mt-3">
                            <PresetGallery onSelectPreset={(g) => { setCurrentGradient(g); setSidebarOpen(false); }} />
                          </TabsContent>
                          <TabsContent value="saved" className="mt-3">
                            <SavedGradients onSelect={(g) => { handleSelectSavedGradient(g); setSidebarOpen(false); }} />
                          </TabsContent>
                        </Tabs>
                        <Separator />
                        <ControlsPanel
                          deviceSize={deviceSize}
                          onDeviceSizeChange={setDeviceSize}
                          showTextOverlay={showTextOverlay}
                          onShowTextOverlayChange={setShowTextOverlay}
                          textColor={textColor}
                          onTextColorChange={setTextColor}
                        />
                        <Separator />
                        <AccessibilityChecker gradient={currentGradient} />
                        <Separator />
                        <GradientEditor
                          gradient={currentGradient}
                          onChange={setCurrentGradient}
                        />
                        <Separator />
                        <ExportPanel gradient={currentGradient} previewRef={previewRef} />
                      </div>
                    </ScrollArea>
                  </SheetContent>
                </Sheet>

                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:flex items-center justify-center h-8 w-8 rounded-md hover:bg-secondary transition-colors"
                >
                  <Github className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content - Two Column Layout */}
        <main className="relative container mx-auto px-4 py-6">
          <div className="flex gap-6">
            {/* Left Column - Preview + AI (main content area) */}
            <div className="flex-1 space-y-6 min-w-0">
              {/* AI Prompt - Inline design */}
              <div className="animate-fade-in">
                <AIPrompt onGradientsGenerated={handleGradientsGenerated} />
              </div>

              {/* Gradient Preview - Hero element (70vh minimum) */}
              <div ref={previewRef} className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
                <GradientPreview
                  gradient={currentGradient}
                  deviceSize={deviceSize}
                  showTextOverlay={showTextOverlay}
                  textColor={textColor}
                  className="min-h-[70vh]"
                />
              </div>
            </div>

            {/* Right Sidebar - Settings (hidden on mobile) */}
            <div className="hidden lg:block w-[340px] shrink-0">
              <div className="sticky top-20 space-y-4">
                <ScrollArea className="h-[calc(100vh-6rem)]">
                  <div className="pr-4 space-y-4">
                    {/* Presets / Saved Toggle */}
                    <Tabs defaultValue="presets" className="w-full">
                      <TabsList className="grid w-full grid-cols-2 h-9">
                        <TabsTrigger value="presets" className="text-xs">
                          <Palette className="h-3.5 w-3.5 mr-1.5" />
                          Presets
                        </TabsTrigger>
                        <TabsTrigger value="saved" className="text-xs">
                          <FolderOpen className="h-3.5 w-3.5 mr-1.5" />
                          Saved
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="presets" className="mt-3">
                        <PresetGallery onSelectPreset={setCurrentGradient} />
                      </TabsContent>
                      <TabsContent value="saved" className="mt-3">
                        <SavedGradients onSelect={handleSelectSavedGradient} />
                      </TabsContent>
                    </Tabs>

                    <Separator />

                    {/* Controls Panel */}
                    <ControlsPanel
                      deviceSize={deviceSize}
                      onDeviceSizeChange={setDeviceSize}
                      showTextOverlay={showTextOverlay}
                      onShowTextOverlayChange={setShowTextOverlay}
                      textColor={textColor}
                      onTextColorChange={setTextColor}
                    />

                    <Separator />

                    {/* Accessibility Checker */}
                    <AccessibilityChecker gradient={currentGradient} />

                    <Separator />

                    {/* Gradient Editor */}
                    <GradientEditor
                      gradient={currentGradient}
                      onChange={setCurrentGradient}
                    />

                    <Separator />

                    {/* Export Panel */}
                    <ExportPanel gradient={currentGradient} previewRef={previewRef} />
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-12 py-6 border-t text-center">
            <p className="text-xs text-muted-foreground">
              <span className="gradient-text font-semibold">Gradient Studio</span> - Create beautiful, accessible gradients
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
    </TooltipProvider>
  );
}
