"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, Wand2 } from "lucide-react";
import { GradientConfig } from "@/types/gradient";
import { toast } from "sonner";

interface AIPromptProps {
  onGradientsGenerated: (gradients: GradientConfig[]) => void;
}

const examplePrompts = [
  "warm sunset gradient for tech startup hero",
  "professional blue gradient with high contrast",
  "vibrant e-commerce gradient for fashion brand",
  "minimal elegant gradient for landing page",
  "energetic gradient for fitness app",
  "soft pastel gradient for wellness app",
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
    if (e.key === "Enter" && !loading) {
      handleGenerate();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 mb-4">
          <Wand2 className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          AI Gradient Generator
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Describe your vision and watch AI create stunning gradients for your hero sections
        </p>
      </div>

      {/* Prompt Input */}
      <div className="relative">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Input
              placeholder="Describe your gradient (e.g., warm sunset gradient for tech startup)"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              className="h-14 text-base px-6 pr-12 rounded-xl border-2 focus-visible:ring-2 focus-visible:ring-offset-2"
            />
            <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          </div>
          <Button
            onClick={handleGenerate}
            disabled={loading}
            size="lg"
            className="h-14 px-8 rounded-xl text-base font-semibold"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                Generate
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Example Prompts */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-muted-foreground text-center">
          Try these examples or create your own
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          {examplePrompts.map((example, index) => (
            <button
              key={index}
              onClick={() => setPrompt(example)}
              className="text-sm px-4 py-2 rounded-full bg-secondary hover:bg-secondary/80 transition-all hover:scale-105 border border-border"
              disabled={loading}
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
