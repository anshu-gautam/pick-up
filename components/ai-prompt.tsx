"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, Wand2 } from "lucide-react";
import { GradientConfig } from "@/types/gradient";
import { useGenerateGradients } from "@/hooks/use-gradients";

const generateSchema = z.object({
  prompt: z.string().min(1, "Please enter a prompt").max(500, "Prompt is too long"),
  count: z.number().min(1).max(5),
});

type GenerateFormData = z.infer<typeof generateSchema>;

interface AIPromptProps {
  onGradientsGenerated: (gradients: GradientConfig[]) => void;
}

const examplePrompts = [
  "warm sunset for tech startup",
  "ocean blue with high contrast",
  "vibrant purple for creative agency",
  "minimal elegant for portfolio",
  "energetic orange for fitness app",
];

export function AIPrompt({ onGradientsGenerated }: AIPromptProps) {
  const generateMutation = useGenerateGradients();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<GenerateFormData>({
    resolver: zodResolver(generateSchema),
    defaultValues: {
      prompt: "",
      count: 3,
    },
  });

  const prompt = watch("prompt");

  const onSubmit = async (data: GenerateFormData) => {
    try {
      const result = await generateMutation.mutateAsync({
        prompt: data.prompt,
        count: data.count,
      });

      // Transform API response to match GradientConfig
      const gradients: GradientConfig[] = result.gradients.map((g) => ({
        id: g.id,
        name: g.name,
        type: g.type,
        angle: g.angle,
        colorStops: g.colorStops,
        tags: g.tags,
      }));

      onGradientsGenerated(gradients);
    } catch {
      // Error is already handled by the mutation
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !generateMutation.isPending) {
      handleSubmit(onSubmit)();
    }
  };

  return (
    <Card variant="glass" className="overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary to-accent">
            <Wand2 className="h-4 w-4 text-white" />
          </div>
          <span className="gradient-text">AI Generator</span>
        </CardTitle>
        <CardDescription>
          Describe your ideal gradient and let AI create it
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="e.g., warm sunset for tech startup hero..."
                {...register("prompt")}
                onKeyPress={handleKeyPress}
                disabled={generateMutation.isPending}
                aria-invalid={errors.prompt ? "true" : "false"}
                className="bg-background/50 border-white/10 focus:border-primary/50 transition-colors"
              />
              {errors.prompt && (
                <p className="text-xs text-destructive mt-1">{errors.prompt.message}</p>
              )}
            </div>
            <Button
              type="submit"
              disabled={generateMutation.isPending}
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
            >
              {generateMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
            </Button>
          </div>
        </form>

        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-medium">Quick prompts:</p>
          <div className="flex flex-wrap gap-1.5">
            {examplePrompts.map((example, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setValue("prompt", example)}
                className="text-xs px-2.5 py-1 rounded-full bg-secondary/50 hover:bg-secondary border border-white/5 hover:border-primary/30 transition-all duration-200"
                disabled={generateMutation.isPending}
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        {prompt && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t border-white/5">
            <span>Generate</span>
            <select
              {...register("count", { valueAsNumber: true })}
              className="bg-secondary/50 rounded-md px-2 py-1 text-xs border border-white/10 focus:border-primary/50 outline-none"
              disabled={generateMutation.isPending}
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
            </select>
            <span>gradient{watch("count") !== 1 ? "s" : ""}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
