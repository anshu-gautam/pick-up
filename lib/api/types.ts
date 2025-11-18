import { GradientConfig, ColorStop } from "@/types/gradient";

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// Health Check
export interface HealthResponse {
  status: "ok";
  timestamp: string;
}

// Generate Gradient
export interface GenerateGradientRequest {
  prompt: string;
  count?: number; // 1-5
}

export interface GeneratedGradient {
  id: string;
  name: string;
  type: "linear" | "radial" | "conic";
  angle: number;
  colorStops: ColorStop[];
  tags: string[];
  accessibilityScore: number;
}

export interface GenerateGradientResponse {
  gradients: GeneratedGradient[];
}

// Gradient CRUD
export interface CreateGradientRequest {
  name: string;
  type: "linear" | "radial" | "conic";
  angle: number;
  colorStops: ColorStop[];
  tags?: string[];
  isPublic?: boolean;
}

export interface UpdateGradientRequest {
  name?: string;
  type?: "linear" | "radial" | "conic";
  angle?: number;
  colorStops?: ColorStop[];
  tags?: string[];
  isPublic?: boolean;
}

export interface GradientListResponse {
  gradients: GradientConfig[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Conversations
export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  gradients?: GeneratedGradient[];
  createdAt: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface ConversationListResponse {
  conversations: Conversation[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateConversationRequest {
  title?: string;
}

export interface SendMessageRequest {
  conversationId: string;
  content: string;
}

export interface SendMessageResponse {
  message: Message;
  suggestions?: GeneratedGradient[];
}

// Export
export interface ExportCssRequest {
  gradient: GradientConfig;
  options?: {
    includeVendorPrefixes?: boolean;
    minified?: boolean;
  };
}

export interface ExportTailwindRequest {
  gradient: GradientConfig;
}

export interface ExportImageRequest {
  gradient: GradientConfig;
  width?: number;
  height?: number;
  format?: "png" | "jpeg" | "webp";
}

// Accessibility
export interface ValidateAccessibilityRequest {
  gradient: GradientConfig;
  textColor?: string;
}

export interface ValidateAccessibilityResponse {
  score: number;
  wcagLevel: "AAA" | "AA" | "A" | "Fail";
  issues: string[];
  recommendations: string[];
}

// User Profile
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  preferences?: {
    defaultGradientType?: "linear" | "radial" | "conic";
    theme?: "light" | "dark" | "system";
  };
  createdAt: string;
}

export interface UpdateProfileRequest {
  name?: string;
  preferences?: {
    defaultGradientType?: "linear" | "radial" | "conic";
    theme?: "light" | "dark" | "system";
  };
}

// Analytics
export interface TrackEventRequest {
  event: string;
  properties?: Record<string, unknown>;
}

export interface TrendingGradient extends GradientConfig {
  usageCount: number;
  likes: number;
}

export interface TrendingResponse {
  gradients: TrendingGradient[];
}
