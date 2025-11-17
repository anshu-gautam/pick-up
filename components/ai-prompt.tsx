"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, Wand2, Palette, Zap, Image } from "lucide-react";
import { GradientConfig } from "@/types/gradient";
import { toast } from "sonner";

interface AIPromptProps {
  onGradientsGenerated: (gradients: GradientConfig[]) => void;
}

const examplePrompts = [
  {
    icon: Palette,
    text: "warm sunset gradient for tech startup hero",
    label: "Sunset Vibes",
  },
  {
    icon: Zap,
    text: "professional blue gradient with high contrast",
    label: "Professional",
  },
  {
    icon: Sparkles,
    text: "vibrant e-commerce gradient for fashion brand",
    label: "Fashion",
  },
  {
    icon: Image,
    text: "minimal elegant gradient for landing page",
    label: "Minimal",
  },
  {
    icon: Wand2,
    text: "energetic gradient for fitness app",
    label: "Energetic",
  },
];

export function AIPrompt({ onGradientsGenerated }: AIPromptProps) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/generate-gradient", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate gradient");
      }

      const data = await response.json();
      onGradientsGenerated(data.gradients);
      toast.success(`Generated ${data.gradients.length} gradients!`);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to generate gradient. Make sure OPENAI_API_KEY is set.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey && !loading) {
      handleGenerate();
    }
  };

  const charCount = prompt.length;
  const maxChars = 500;

  return (
    <div className="space-y-6">
      {/* Main Prompt Card */}
      <Card className="border-2 hover:border-primary/50 transition-all duration-300 overflow-hidden">
        <div className="relative">
          {/* Gradient Background Accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

          <CardContent className="pt-8 pb-6 px-6">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Generate Your Gradient</h2>
                  <p className="text-sm text-muted-foreground">
                    Describe your vision in natural language
                  </p>
                </div>
              </div>
            </div>

            {/* Prompt Input */}
            <div className="space-y-3">
              <Textarea
                placeholder="e.g., Create a warm sunset gradient with orange and purple hues, perfect for a tech startup hero section with modern feel..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={loading}
                className="min-h-[120px] text-base resize-none focus-visible:ring-2 focus-visible:ring-primary transition-all"
                maxLength={maxChars}
              />

              {/* Character Counter & Hint */}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-1 rounded bg-muted font-mono text-xs">Ctrl</kbd>
                  <span>+</span>
                  <kbd className="px-2 py-1 rounded bg-muted font-mono text-xs">Enter</kbd>
                  <span>to generate</span>
                </div>
                <span className={charCount > maxChars * 0.9 ? "text-orange-500 font-medium" : ""}>
                  {charCount} / {maxChars}
                </span>
              </div>
            </div>

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              className="w-full mt-6 h-12 text-base font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-300"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Generating your gradient...
                </>
              ) : (
                <>
                  <Wand2 className="h-5 w-5 mr-2" />
                  Generate Gradient
                </>
              )}
            </Button>
          </CardContent>
        </div>
      </Card>

      {/* Example Prompts */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">
            ✨ Try these examples
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {examplePrompts.slice(0, 4).map((example, index) => {
            const Icon = example.icon;
            return (
              <button
                key={index}
                onClick={() => setPrompt(example.text)}
                disabled={loading}
                className="group relative p-3 rounded-lg border-2 border-border hover:border-primary/50 bg-card hover:bg-accent/50 transition-all duration-300 text-left disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
              >
                {/* Hover Gradient Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <div className="relative flex items-start gap-3">
                  <div className="p-1.5 rounded-md bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold mb-1 text-foreground">
                      {example.label}
                    </div>
                    <div className="text-xs text-muted-foreground line-clamp-2">
                      {example.text}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Pro Tips */}
      <Card className="bg-muted/50 border-dashed">
        <CardContent className="pt-4 pb-4">
          <div className="flex items-start gap-3">
            <div className="p-1.5 rounded-md bg-primary/10">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-xs font-semibold">Pro Tips for Better Results</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Describe the mood, colors, and intended use</li>
                <li>• Mention your brand style (modern, minimal, vibrant, etc.)</li>
                <li>• Specify contrast needs for text readability</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
