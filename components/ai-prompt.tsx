"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Sparkles, Loader2, Wand2, Info } from "lucide-react";
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
  const count = watch("count");

  const onSubmit = async (data: GenerateFormData) => {
    try {
      const result = await generateMutation.mutateAsync({
        prompt: data.prompt,
        count: data.count,
      });

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

  const charCount = prompt.length;
  const maxChars = 500;
  const charPercentage = (charCount / maxChars) * 100;

  return (
    <div className="space-y-4">
      {/* Main form - clean inline design */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            {generateMutation.isPending ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <div className="relative">
                <Input
                  placeholder="Describe your ideal gradient... e.g., warm sunset for tech startup hero"
                  {...register("prompt")}
                  onKeyPress={handleKeyPress}
                  disabled={generateMutation.isPending}
                  aria-invalid={errors.prompt ? "true" : "false"}
                  className="h-10 pr-10 bg-background/50 border-border/50 focus:border-primary/50 transition-colors"
                />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Info className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    <p className="text-xs">
                      Describe the mood, colors, or purpose of your gradient. AI will generate matching options.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
            )}
            {errors.prompt && (
              <p className="text-xs text-destructive mt-1">{errors.prompt.message}</p>
            )}
          </div>

          {/* Count selector */}
          <Select
            value={count.toString()}
            onValueChange={(value) => setValue("count", parseInt(value))}
            disabled={generateMutation.isPending}
          >
            <SelectTrigger className="w-16 h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3</SelectItem>
              <SelectItem value="4">4</SelectItem>
              <SelectItem value="5">5</SelectItem>
            </SelectContent>
          </Select>

          <Button
            type="submit"
            disabled={generateMutation.isPending || !prompt.trim()}
            className="h-10 px-4 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
          >
            {generateMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Wand2 className="h-4 w-4 mr-2" />
                Generate
              </>
            )}
          </Button>
        </div>

        {/* Character count progress */}
        {prompt && (
          <div className="space-y-1">
            <Progress value={charPercentage} className="h-1" />
            <p className="text-[10px] text-muted-foreground text-right">
              {charCount}/{maxChars} characters
            </p>
          </div>
        )}
      </form>

      {/* Example prompts as badges */}
      <div className="flex flex-wrap gap-1.5">
        <span className="text-xs text-muted-foreground mr-1 flex items-center">
          <Sparkles className="h-3 w-3 mr-1" />
          Try:
        </span>
        {examplePrompts.map((example, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="cursor-pointer hover:bg-secondary/80 transition-colors text-xs font-normal"
            onClick={() => {
              if (!generateMutation.isPending) {
                setValue("prompt", example);
              }
            }}
          >
            {example}
          </Badge>
        ))}
      </div>
    </div>
  );
}
