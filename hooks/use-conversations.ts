"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import {
  Conversation,
  ConversationListResponse,
  CreateConversationRequest,
  SendMessageRequest,
  SendMessageResponse,
} from "@/lib/api/types";
import { toast } from "sonner";

// Query keys
export const conversationKeys = {
  all: ["conversations"] as const,
  lists: () => [...conversationKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...conversationKeys.lists(), filters] as const,
  details: () => [...conversationKeys.all, "detail"] as const,
  detail: (id: string) => [...conversationKeys.details(), id] as const,
};

// Fetch user's conversations
export function useConversations(page = 1, limit = 10) {
  return useQuery({
    queryKey: conversationKeys.list({ page, limit }),
    queryFn: async () => {
      const response = await apiClient.get<ConversationListResponse>("/conversations", {
        page,
        limit,
      });
      return response;
    },
  });
}

// Fetch single conversation
export function useConversation(id: string) {
  return useQuery({
    queryKey: conversationKeys.detail(id),
    queryFn: async () => {
      const response = await apiClient.get<Conversation>(`/conversations/${id}`);
      return response;
    },
    enabled: !!id,
  });
}

// Create conversation
export function useCreateConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: CreateConversationRequest) => {
      const response = await apiClient.post<Conversation>("/conversations", request);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: conversationKeys.lists() });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create conversation");
    },
  });
}

// Send message to conversation
export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: SendMessageRequest) => {
      const response = await apiClient.post<SendMessageResponse>("/conversations/messages", request);
      return response;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: conversationKeys.detail(variables.conversationId) });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to send message");
    },
  });
}

// Update conversation
export function useUpdateConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, title }: { id: string; title: string }) => {
      const response = await apiClient.put<Conversation>(`/conversations/${id}`, { title });
      return response;
    },
    onSuccess: (_, variables) => {
      toast.success("Conversation updated!");
      queryClient.invalidateQueries({ queryKey: conversationKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: conversationKeys.lists() });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update conversation");
    },
  });
}

// Delete conversation
export function useDeleteConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/conversations/${id}`);
      return id;
    },
    onSuccess: () => {
      toast.success("Conversation deleted!");
      queryClient.invalidateQueries({ queryKey: conversationKeys.lists() });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete conversation");
    },
  });
}
