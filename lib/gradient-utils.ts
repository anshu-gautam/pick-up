import { colord, extend } from "colord";
import a11yPlugin from "colord/plugins/a11y";
import { GradientConfig, ColorStop, GradientAccessibility, AccessibilityScore } from "@/types/gradient";

extend([a11yPlugin]);

/**
 * Generate CSS gradient string from gradient config
 */
export function generateGradientCSS(gradient: GradientConfig): string {
  const stops = gradient.colorStops
    .sort((a, b) => a.position - b.position)
    .map((stop) => `${stop.color} ${stop.position}%`)
    .join(", ");

  switch (gradient.type) {
    case "linear":
      return `linear-gradient(${gradient.angle}deg, ${stops})`;
    case "radial":
      return `radial-gradient(circle, ${stops})`;
    case "conic":
      return `conic-gradient(from ${gradient.angle}deg, ${stops})`;
    default:
      return `linear-gradient(${gradient.angle}deg, ${stops})`;
  }
}

/**
 * Calculate contrast ratio between two colors
 */
export function getContrastRatio(color1: string, color2: string): number {
  try {
    const c1 = colord(color1);
    const c2 = colord(color2);
    return c1.contrast(c2);
  } catch (error) {
    console.error("Error calculating contrast:", error);
    return 1;
  }
}

/**
 * Get accessibility score for a color against white/black backgrounds
 */
function getAccessibilityScore(color: string, background: string): AccessibilityScore {
  const contrast = getContrastRatio(color, background);

  return {
    contrastRatio: contrast,
    aaLarge: contrast >= 3,
    aaSmall: contrast >= 4.5,
    aaaLarge: contrast >= 4.5,
    aaaSmall: contrast >= 7,
  };
}

/**
 * Analyze gradient accessibility for text overlays
 */
export function analyzeGradientAccessibility(gradient: GradientConfig): GradientAccessibility {
  const contrastRatios: number[] = [];

  // Check each color stop against white and black
  gradient.colorStops.forEach((stop) => {
    const whiteContrast = getContrastRatio(stop.color, "#ffffff");
    const blackContrast = getContrastRatio(stop.color, "#000000");
    contrastRatios.push(whiteContrast, blackContrast);
  });

  const minContrast = Math.min(...contrastRatios);
  const maxContrast = Math.max(...contrastRatios);
  const averageContrast = contrastRatios.reduce((a, b) => a + b, 0) / contrastRatios.length;

  // Get average color of gradient for overall assessment
  const averageColor = getAverageGradientColor(gradient);

  const recommendations: string[] = [];

  const whiteScore = getAccessibilityScore(averageColor, "#ffffff");
  const blackScore = getAccessibilityScore(averageColor, "#000000");

  if (!whiteScore.aaSmall && !blackScore.aaSmall) {
    recommendations.push("Consider using a semi-transparent overlay to improve text contrast");
  }

  if (whiteScore.aaSmall) {
    recommendations.push("Use white text for best contrast");
  } else if (blackScore.aaSmall) {
    recommendations.push("Use black text for best contrast");
  }

  if (minContrast < 3) {
    recommendations.push("Some gradient stops have very low contrast - consider adjusting colors");
  }

  return {
    averageContrast,
    minContrast,
    maxContrast,
    wcagCompliance: {
      white: whiteScore,
      black: blackScore,
    },
    recommendations,
  };
}

/**
 * Get average color of a gradient
 */
function getAverageGradientColor(gradient: GradientConfig): string {
  const colors = gradient.colorStops.map((stop) => colord(stop.color));

  let r = 0, g = 0, b = 0;

  colors.forEach((color) => {
    const rgb = color.toRgb();
    r += rgb.r;
    g += rgb.g;
    b += rgb.b;
  });

  const count = colors.length;
  return colord({ r: r / count, g: g / count, b: b / count }).toHex();
}

/**
 * Generate complementary color
 */
export function getComplementaryColor(color: string): string {
  return colord(color).rotate(180).toHex();
}

/**
 * Generate analogous colors
 */
export function getAnalogousColors(color: string): string[] {
  const base = colord(color);
  return [
    base.rotate(-30).toHex(),
    color,
    base.rotate(30).toHex(),
  ];
}

/**
 * Generate triadic colors
 */
export function getTriadicColors(color: string): string[] {
  const base = colord(color);
  return [
    color,
    base.rotate(120).toHex(),
    base.rotate(240).toHex(),
  ];
}

/**
 * Adjust color brightness
 */
export function adjustBrightness(color: string, amount: number): string {
  return colord(color).lighten(amount).toHex();
}

/**
 * Generate harmonious color palette using color theory
 */
export function generateHarmoniousPalette(baseColor: string, count: number = 5): string[] {
  const base = colord(baseColor);
  const baseHsl = base.toHsl();
  const colors: string[] = [baseColor];

  // Generate variations using saturation and lightness
  for (let i = 1; i < count; i++) {
    const hue = (baseHsl.h + (360 / count) * i) % 360;
    const saturation = baseHsl.s * (0.7 + Math.random() * 0.3);
    const lightness = baseHsl.l * (0.7 + Math.random() * 0.3);

    colors.push(
      colord({ h: hue, s: saturation, l: lightness }).toHex()
    );
  }

  return colors;
}

/**
 * Create gradient with smooth color transitions to avoid muddy colors
 */
export function createSmoothGradient(colors: string[], steps: number = 5): ColorStop[] {
  const colorStops: ColorStop[] = [];
  const segmentSize = 100 / (colors.length - 1);

  colors.forEach((color, index) => {
    colorStops.push({
      id: `stop-${index}`,
      color,
      position: index * segmentSize,
    });
  });

  return colorStops;
}

/**
 * Validate hex color
 */
export function isValidHexColor(color: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
}

/**
 * Generate random gradient
 */
export function generateRandomGradient(): GradientConfig {
  const baseColor = colord({ h: Math.random() * 360, s: 70, l: 60 }).toHex();
  const colors = generateHarmoniousPalette(baseColor, 3);

  return {
    id: `gradient-${Date.now()}`,
    name: "Random Gradient",
    type: "linear",
    angle: Math.floor(Math.random() * 360),
    colorStops: createSmoothGradient(colors),
  };
}
