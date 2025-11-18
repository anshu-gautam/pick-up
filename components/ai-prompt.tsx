"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
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
  "warm sunset gradient for tech startup hero",
  "professional blue gradient with high contrast",
  "vibrant e-commerce gradient for fashion brand",
  "minimal elegant gradient for landing page",
  "energetic gradient for fitness app",
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="e.g., warm sunset gradient for tech startup hero"
                {...register("prompt")}
                onKeyPress={handleKeyPress}
                disabled={generateMutation.isPending}
                aria-invalid={errors.prompt ? "true" : "false"}
              />
              {errors.prompt && (
                <p className="text-xs text-destructive mt-1">{errors.prompt.message}</p>
              )}
            </div>
            <Button type="submit" disabled={generateMutation.isPending}>
              {generateMutation.isPending ? (
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
        </form>

        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Try these examples:</p>
          <div className="flex flex-wrap gap-2">
            {examplePrompts.slice(0, 3).map((example, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setValue("prompt", example)}
                className="text-xs px-2 py-1 rounded bg-secondary hover:bg-secondary/80 transition-colors"
                disabled={generateMutation.isPending}
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        {prompt && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Generating</span>
            <select
              {...register("count", { valueAsNumber: true })}
              className="bg-secondary rounded px-2 py-1 text-xs"
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
