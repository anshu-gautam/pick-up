"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
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
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          AI Gradient Generator
        </CardTitle>
        <CardDescription>
          Describe your ideal gradient and let AI create it
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="e.g., warm sunset gradient for tech startup hero"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
          />
          <Button onClick={handleGenerate} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate
              </>
            )}
          </Button>
        </div>

        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Try these examples:</p>
          <div className="flex flex-wrap gap-2">
            {examplePrompts.slice(0, 3).map((example, index) => (
              <button
                key={index}
                onClick={() => setPrompt(example)}
                className="text-xs px-2 py-1 rounded bg-secondary hover:bg-secondary/80 transition-colors"
                disabled={loading}
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
