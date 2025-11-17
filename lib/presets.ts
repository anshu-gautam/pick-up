import { GradientConfig, GradientPreset } from "@/types/gradient";
import { createSmoothGradient } from "./gradient-utils";

export const gradientPresets: GradientPreset[] = [
  {
    category: "Hero Sections",
    gradients: [
      {
        id: "hero-sunset",
        name: "Warm Sunset",
        type: "linear",
        angle: 135,
        colorStops: createSmoothGradient(["#ff6b6b", "#feca57", "#ee5a6f"]),
        tags: ["warm", "hero", "sunset"],
      },
      {
        id: "hero-ocean",
        name: "Deep Ocean",
        type: "linear",
        angle: 180,
        colorStops: createSmoothGradient(["#667eea", "#764ba2", "#f093fb"]),
        tags: ["blue", "hero", "ocean"],
      },
      {
        id: "hero-forest",
        name: "Forest Green",
        type: "linear",
        angle: 45,
        colorStops: createSmoothGradient(["#11998e", "#38ef7d"]),
        tags: ["green", "hero", "nature"],
      },
      {
        id: "hero-midnight",
        name: "Midnight Blue",
        type: "linear",
        angle: 90,
        colorStops: createSmoothGradient(["#2c3e50", "#3498db", "#2980b9"]),
        tags: ["blue", "hero", "dark"],
      },
    ],
  },
  {
    category: "Tech & Startup",
    gradients: [
      {
        id: "tech-modern",
        name: "Modern Tech",
        type: "linear",
        angle: 135,
        colorStops: createSmoothGradient(["#667eea", "#764ba2"]),
        tags: ["tech", "modern", "purple"],
      },
      {
        id: "tech-gradient",
        name: "Digital Future",
        type: "linear",
        angle: 45,
        colorStops: createSmoothGradient(["#4facfe", "#00f2fe"]),
        tags: ["tech", "blue", "cyan"],
      },
      {
        id: "tech-startup",
        name: "Startup Energy",
        type: "linear",
        angle: 135,
        colorStops: createSmoothGradient(["#f093fb", "#f5576c"]),
        tags: ["tech", "pink", "vibrant"],
      },
      {
        id: "tech-professional",
        name: "Professional",
        type: "linear",
        angle: 90,
        colorStops: createSmoothGradient(["#4b6cb7", "#182848"]),
        tags: ["tech", "professional", "blue"],
      },
    ],
  },
  {
    category: "E-commerce",
    gradients: [
      {
        id: "ecom-luxury",
        name: "Luxury Gold",
        type: "linear",
        angle: 135,
        colorStops: createSmoothGradient(["#f12711", "#f5af19"]),
        tags: ["ecommerce", "gold", "luxury"],
      },
      {
        id: "ecom-fashion",
        name: "Fashion Pink",
        type: "linear",
        angle: 45,
        colorStops: createSmoothGradient(["#ff9a9e", "#fecfef", "#fad0c4"]),
        tags: ["ecommerce", "pink", "fashion"],
      },
      {
        id: "ecom-premium",
        name: "Premium Dark",
        type: "linear",
        angle: 180,
        colorStops: createSmoothGradient(["#000000", "#434343"]),
        tags: ["ecommerce", "dark", "premium"],
      },
    ],
  },
  {
    category: "Creative",
    gradients: [
      {
        id: "creative-rainbow",
        name: "Rainbow Blast",
        type: "linear",
        angle: 90,
        colorStops: createSmoothGradient([
          "#ff0844",
          "#ffb199",
          "#ffd700",
          "#00f2fe",
          "#4facfe",
        ]),
        tags: ["creative", "rainbow", "vibrant"],
      },
      {
        id: "creative-cosmic",
        name: "Cosmic",
        type: "radial",
        angle: 0,
        colorStops: createSmoothGradient(["#833ab4", "#fd1d1d", "#fcb045"]),
        tags: ["creative", "radial", "vibrant"],
      },
      {
        id: "creative-neon",
        name: "Neon Dreams",
        type: "linear",
        angle: 135,
        colorStops: createSmoothGradient(["#fa709a", "#fee140"]),
        tags: ["creative", "neon", "bright"],
      },
    ],
  },
  {
    category: "Minimal",
    gradients: [
      {
        id: "minimal-soft",
        name: "Soft Minimal",
        type: "linear",
        angle: 135,
        colorStops: createSmoothGradient(["#e0e7ff", "#f3f4f6"]),
        tags: ["minimal", "soft", "light"],
      },
      {
        id: "minimal-clean",
        name: "Clean White",
        type: "linear",
        angle: 180,
        colorStops: createSmoothGradient(["#ffffff", "#f7f7f7", "#ececec"]),
        tags: ["minimal", "white", "clean"],
      },
      {
        id: "minimal-elegant",
        name: "Elegant Gray",
        type: "linear",
        angle: 45,
        colorStops: createSmoothGradient(["#bdc3c7", "#2c3e50"]),
        tags: ["minimal", "gray", "elegant"],
      },
    ],
  },
  {
    category: "CTAs & Buttons",
    gradients: [
      {
        id: "cta-action",
        name: "Call to Action",
        type: "linear",
        angle: 135,
        colorStops: createSmoothGradient(["#f2994a", "#f2c94c"]),
        tags: ["cta", "orange", "action"],
      },
      {
        id: "cta-success",
        name: "Success Green",
        type: "linear",
        angle: 90,
        colorStops: createSmoothGradient(["#56ab2f", "#a8e063"]),
        tags: ["cta", "green", "success"],
      },
      {
        id: "cta-urgent",
        name: "Urgent Red",
        type: "linear",
        angle: 45,
        colorStops: createSmoothGradient(["#eb3349", "#f45c43"]),
        tags: ["cta", "red", "urgent"],
      },
    ],
  },
];

export function getAllPresets(): GradientConfig[] {
  return gradientPresets.flatMap((preset) => preset.gradients);
}

export function getPresetsByCategory(category: string): GradientConfig[] {
  const preset = gradientPresets.find((p) => p.category === category);
  return preset ? preset.gradients : [];
}

export function getPresetById(id: string): GradientConfig | undefined {
  return getAllPresets().find((g) => g.id === id);
}
