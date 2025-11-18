"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import {
  GenerateGradientRequest,
  GenerateGradientResponse,
  CreateGradientRequest,
  UpdateGradientRequest,
  GradientListResponse,
} from "@/lib/api/types";
import { GradientConfig } from "@/types/gradient";
import { toast } from "sonner";

// Query keys
export const gradientKeys = {
  all: ["gradients"] as const,
  lists: () => [...gradientKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...gradientKeys.lists(), filters] as const,
  public: () => [...gradientKeys.all, "public"] as const,
  details: () => [...gradientKeys.all, "detail"] as const,
  detail: (id: string) => [...gradientKeys.details(), id] as const,
};

// Generate gradients with AI
export function useGenerateGradients() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: GenerateGradientRequest) => {
      const response = await apiClient.post<GenerateGradientResponse>("/generate", request);
      return response;
    },
    onSuccess: (data) => {
      toast.success(`Generated ${data.gradients.length} gradients!`);
      // Invalidate gradient lists to refresh
      queryClient.invalidateQueries({ queryKey: gradientKeys.lists() });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to generate gradients");
    },
  });
}

// Fetch user's gradients
export function useUserGradients(page = 1, limit = 10) {
  return useQuery({
    queryKey: gradientKeys.list({ page, limit }),
    queryFn: async () => {
      const response = await apiClient.get<GradientListResponse>("/gradients", {
        page,
        limit,
      });
      return response;
    },
  });
}

// Fetch public/community gradients
export function usePublicGradients(page = 1, limit = 10) {
  return useQuery({
    queryKey: [...gradientKeys.public(), { page, limit }],
    queryFn: async () => {
      const response = await apiClient.get<GradientListResponse>("/gradients/public", {
        page,
        limit,
      });
      return response;
    },
  });
}

// Fetch single gradient
export function useGradient(id: string) {
  return useQuery({
    queryKey: gradientKeys.detail(id),
    queryFn: async () => {
      const response = await apiClient.get<GradientConfig>(`/gradients/${id}`);
      return response;
    },
    enabled: !!id,
  });
}

// Create gradient
export function useCreateGradient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: CreateGradientRequest) => {
      const response = await apiClient.post<GradientConfig>("/gradients", request);
      return response;
    },
    onSuccess: () => {
      toast.success("Gradient saved!");
      queryClient.invalidateQueries({ queryKey: gradientKeys.lists() });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to save gradient");
    },
  });
}

// Update gradient
export function useUpdateGradient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateGradientRequest & { id: string }) => {
      const response = await apiClient.put<GradientConfig>(`/gradients/${id}`, data);
      return response;
    },
    onSuccess: (_, variables) => {
      toast.success("Gradient updated!");
      queryClient.invalidateQueries({ queryKey: gradientKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: gradientKeys.lists() });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update gradient");
    },
  });
}

// Delete gradient
export function useDeleteGradient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/gradients/${id}`);
      return id;
    },
    onSuccess: () => {
      toast.success("Gradient deleted!");
      queryClient.invalidateQueries({ queryKey: gradientKeys.lists() });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete gradient");
    },
  });
}
