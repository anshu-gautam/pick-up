export type GradientType = "linear" | "radial" | "conic";

export interface ColorStop {
  id: string;
  color: string;
  position: number; // 0-100
}

export interface GradientConfig {
  id: string;
  name: string;
  type: GradientType;
  angle: number; // degrees for linear, not used for radial/conic
  colorStops: ColorStop[];
  createdAt?: Date;
  userId?: string;
  tags?: string[];
  isPublic?: boolean;
}

export interface AccessibilityScore {
  aaLarge: boolean;
  aaSmall: boolean;
  aaaLarge: boolean;
  aaaSmall: boolean;
  contrastRatio: number;
}

export interface GradientAccessibility {
  averageContrast: number;
  minContrast: number;
  maxContrast: number;
  wcagCompliance: {
    white: AccessibilityScore;
    black: AccessibilityScore;
  };
  recommendations: string[];
}

export type DeviceSize = "mobile" | "tablet" | "desktop";

export type ExportFormat = "css" | "tailwind" | "react" | "vue" | "svg" | "png";

export interface GradientPreset {
  category: string;
  gradients: GradientConfig[];
}

export type ColorblindType = "normal" | "protanopia" | "deuteranopia" | "tritanopia" | "achromatopsia";
