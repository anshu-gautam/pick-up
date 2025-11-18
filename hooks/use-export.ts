"use client";

import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { ExportCssRequest, ExportTailwindRequest, ExportImageRequest } from "@/lib/api/types";
import { toast } from "sonner";

// Export to CSS
export function useExportCss() {
  return useMutation({
    mutationFn: async (request: ExportCssRequest) => {
      const response = await apiClient.post<{ css: string }>("/export/css", request);
      return response;
    },
    onSuccess: () => {
      toast.success("CSS exported!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to export CSS");
    },
  });
}

// Export to Tailwind
export function useExportTailwind() {
  return useMutation({
    mutationFn: async (request: ExportTailwindRequest) => {
      const response = await apiClient.post<{ tailwind: string }>("/export/tailwind", request);
      return response;
    },
    onSuccess: () => {
      toast.success("Tailwind config exported!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to export Tailwind config");
    },
  });
}

// Export to Image
export function useExportImage() {
  return useMutation({
    mutationFn: async (request: ExportImageRequest) => {
      const response = await apiClient.post<{ imageUrl: string }>("/export/image", request);
      return response;
    },
    onSuccess: () => {
      toast.success("Image exported!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to export image");
    },
  });
}
