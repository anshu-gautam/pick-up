"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FolderOpen, Loader2, Trash2, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import { GradientConfig } from "@/types/gradient";
import { useUserGradients, useDeleteGradient } from "@/hooks/use-gradients";
import { generateGradientCSS } from "@/lib/gradient-utils";

interface SavedGradientsProps {
  onSelect: (gradient: GradientConfig) => void;
}

export function SavedGradients({ onSelect }: SavedGradientsProps) {
  const [page, setPage] = useState(1);
  const { data, isLoading, error, refetch } = useUserGradients(page, 6);
  const deleteMutation = useDeleteGradient();

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this gradient?")) {
      await deleteMutation.mutateAsync(id);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <FolderOpen className="h-5 w-5" />
              Saved Gradients
            </CardTitle>
            <CardDescription>
              Your saved gradient collection
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={() => refetch()}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <p className="text-sm text-destructive mb-2">Failed to load gradients</p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Try again
            </Button>
          </div>
        )}

        {!isLoading && !error && data?.gradients.length === 0 && (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">
              No saved gradients yet. Generate and save your first gradient!
            </p>
          </div>
        )}

        {!isLoading && !error && data && data.gradients.length > 0 && (
          <>
            <div className="grid grid-cols-2 gap-3">
              {data.gradients.map((gradient) => (
                <div
                  key={gradient.id}
                  className="group relative cursor-pointer rounded-lg overflow-hidden border hover:border-primary transition-colors"
                  onClick={() => onSelect(gradient)}
                >
                  <div
                    className="h-20"
                    style={{ background: generateGradientCSS(gradient) }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <Button
                      variant="destructive"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                      onClick={(e) => handleDelete(gradient.id, e)}
                      disabled={deleteMutation.isPending}
                    >
                      {deleteMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <div className="p-2">
                    <p className="text-xs font-medium truncate">{gradient.name}</p>
                    {gradient.tags && gradient.tags.length > 0 && (
                      <p className="text-xs text-muted-foreground truncate">
                        {gradient.tags.slice(0, 2).join(", ")}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {data.pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground">
                  {page} / {data.pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setPage((p) => Math.min(data.pagination.totalPages, p + 1))}
                  disabled={page === data.pagination.totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
