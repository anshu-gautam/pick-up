"use client";

import { useAuth } from '@clerk/nextjs';
import { useEffect } from 'react';
import { apiClient } from './client';
import type { GradientConfig } from '@/types/gradient';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

export function useApiClient() {
  const { getToken, isSignedIn } = useAuth();

  // Set up the token getter for the API client
  useEffect(() => {
    apiClient.setTokenGetter(async () => {
      if (!isSignedIn) return null;
      return await getToken();
    });
  }, [getToken, isSignedIn]);

  const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
    const token = isSignedIn ? await getToken() : null;

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.error || error.message || 'API request failed');
    }

    return response.json();
  };

  return {
    // Generate gradients
    generate: (prompt: string, count?: number) =>
      fetchWithAuth('/generate', {
        method: 'POST',
        body: JSON.stringify({ prompt, count }),
      }),

    // Get user's gradients
    getGradients: (page = 1, limit = 10) =>
      fetchWithAuth(`/gradients?page=${page}&limit=${limit}`),

    // Get single gradient
    getGradient: (id: string) =>
      fetchWithAuth(`/gradients/${id}`),

    // Save gradient
    saveGradient: (gradient: Partial<GradientConfig>) =>
      fetchWithAuth('/gradients', {
        method: 'POST',
        body: JSON.stringify(gradient),
      }),

    // Update gradient
    updateGradient: (id: string, gradient: Partial<GradientConfig>) =>
      fetchWithAuth(`/gradients/${id}`, {
        method: 'PUT',
        body: JSON.stringify(gradient),
      }),

    // Delete gradient
    deleteGradient: (id: string) =>
      fetchWithAuth(`/gradients/${id}`, { method: 'DELETE' }),

    // Send chat message
    sendMessage: (content: string, conversationId?: string) =>
      fetchWithAuth('/conversations/messages', {
        method: 'POST',
        body: JSON.stringify({ content, conversationId }),
      }),

    // Get conversations
    getConversations: (page = 1, limit = 20) =>
      fetchWithAuth(`/conversations?page=${page}&limit=${limit}`),

    // Get conversation with messages
    getConversation: (id: string) =>
      fetchWithAuth(`/conversations/${id}`),

    // Create conversation
    createConversation: (title?: string) =>
      fetchWithAuth('/conversations', {
        method: 'POST',
        body: JSON.stringify({ title }),
      }),

    // Update conversation
    updateConversation: (id: string, title: string) =>
      fetchWithAuth(`/conversations/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ title }),
      }),

    // Delete conversation
    deleteConversation: (id: string) =>
      fetchWithAuth(`/conversations/${id}`, { method: 'DELETE' }),

    // Get user profile
    getProfile: () =>
      fetchWithAuth('/users/profile'),

    // Update user profile
    updateProfile: (data: { name?: string; preferences?: Record<string, unknown> }) =>
      fetchWithAuth('/users/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),

    // Get user stats
    getStats: () =>
      fetchWithAuth('/users/stats'),

    // Export as CSS
    exportCSS: (gradient: Partial<GradientConfig>) =>
      fetchWithAuth('/export/css', {
        method: 'POST',
        body: JSON.stringify({ gradient }),
      }),

    // Export as Tailwind
    exportTailwind: (gradient: Partial<GradientConfig>) =>
      fetchWithAuth('/export/tailwind', {
        method: 'POST',
        body: JSON.stringify({ gradient }),
      }),

    // Export as image
    exportImage: async (gradient: Partial<GradientConfig>, format: 'png' | 'svg', width = 800, height = 600) => {
      const token = isSignedIn ? await getToken() : null;
      
      const response = await fetch(`${API_BASE}/export/image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify({ gradient, format, width, height }),
      });

      if (!response.ok) {
        throw new Error('Failed to export image');
      }

      return response.blob();
    },

    // Validate accessibility
    validateAccessibility: (gradient: Partial<GradientConfig>, foregroundColor: string, fontSize = 16, fontWeight: 'normal' | 'bold' = 'normal') =>
      fetchWithAuth('/validate/accessibility', {
        method: 'POST',
        body: JSON.stringify({ gradient, foregroundColor, fontSize, fontWeight }),
      }),

    // Analytics
    trackEvent: (eventType: string, gradientId?: string, metadata?: Record<string, unknown>) =>
      fetchWithAuth('/analytics/track', {
        method: 'POST',
        body: JSON.stringify({ eventType, gradientId, metadata }),
      }),

    // Get trending gradients
    getTrending: (limit = 10) =>
      fetchWithAuth(`/analytics/trending?limit=${limit}`),

    // Get popular gradients
    getPopular: (limit = 10) =>
      fetchWithAuth(`/analytics/popular?limit=${limit}`),
  };
}
