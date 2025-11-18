"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Save, Loader2, X, Globe, Lock } from "lucide-react";
import { GradientConfig } from "@/types/gradient";
import { useCreateGradient } from "@/hooks/use-gradients";

const saveGradientSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  tags: z.string().optional(),
  isPublic: z.boolean(),
});

type SaveGradientFormData = z.infer<typeof saveGradientSchema>;

interface SaveGradientDialogProps {
  gradient: GradientConfig;
  isOpen: boolean;
  onClose: () => void;
  onSaved?: (gradient: GradientConfig) => void;
}

export function SaveGradientDialog({ gradient, isOpen, onClose, onSaved }: SaveGradientDialogProps) {
  const createMutation = useCreateGradient();
  const [showPublicInfo, setShowPublicInfo] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<SaveGradientFormData>({
    resolver: zodResolver(saveGradientSchema),
    defaultValues: {
      name: gradient.name || "",
      tags: gradient.tags?.join(", ") || "",
      isPublic: false,
    },
  });

  const isPublic = watch("isPublic");

  const onSubmit = async (data: SaveGradientFormData) => {
    try {
      const tags = data.tags
        ? data.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
        : [];

      const result = await createMutation.mutateAsync({
        name: data.name,
        type: gradient.type,
        angle: gradient.angle,
        colorStops: gradient.colorStops,
        tags,
        isPublic: data.isPublic,
      });

      onSaved?.(result);
      reset();
      onClose();
    } catch {
      // Error is handled by the mutation
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card variant="glass" className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Save className="h-5 w-5" />
              Save Gradient
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>
            Save this gradient to your collection
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {/* Preview */}
            <div
              className="h-20 rounded-lg border"
              style={{
                background: `linear-gradient(${gradient.angle}deg, ${gradient.colorStops
                  .map((stop) => `${stop.color} ${stop.position}%`)
                  .join(", ")})`,
              }}
            />

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="My awesome gradient"
                {...register("name")}
                aria-invalid={errors.name ? "true" : "false"}
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                placeholder="sunset, warm, hero"
                {...register("tags")}
              />
              <p className="text-xs text-muted-foreground">
                Add tags to help organize and find your gradients
              </p>
            </div>

            {/* Visibility */}
            <div className="space-y-2">
              <Label>Visibility</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={!isPublic ? "default" : "outline"}
                  size="sm"
                  onClick={() => setValue("isPublic", false)}
                  className="flex-1"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Private
                </Button>
                <Button
                  type="button"
                  variant={isPublic ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setValue("isPublic", true);
                    setShowPublicInfo(true);
                  }}
                  className="flex-1"
                >
                  <Globe className="h-4 w-4 mr-2" />
                  Public
                </Button>
              </div>
              {showPublicInfo && isPublic && (
                <p className="text-xs text-muted-foreground">
                  Public gradients can be discovered by other users in the community gallery
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending} className="flex-1">
              {createMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
