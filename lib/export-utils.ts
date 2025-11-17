import { GradientConfig, ExportFormat } from "@/types/gradient";
import { generateGradientCSS } from "./gradient-utils";
import { toPng } from "html-to-image";

/**
 * Export gradient as CSS
 */
export function exportAsCSS(gradient: GradientConfig): string {
  const css = generateGradientCSS(gradient);
  return `.gradient {
  background: ${css};
}`;
}

/**
 * Export gradient as Tailwind CSS
 */
export function exportAsTailwind(gradient: GradientConfig): string {
  const stops = gradient.colorStops
    .sort((a, b) => a.position - b.position)
    .map((stop) => {
      const color = stop.color.replace("#", "");
      return `${color}`;
    });

  const direction =
    gradient.type === "linear"
      ? `${gradient.angle}deg`
      : gradient.type === "radial"
      ? "circle"
      : `${gradient.angle}deg`;

  return `// Add to tailwind.config.ts:
// backgroundImage: {
//   'custom-gradient': '${generateGradientCSS(gradient)}',
// }

// Then use:
// className="bg-custom-gradient"

// Or use arbitrary values:
className="bg-[${generateGradientCSS(gradient).replace(/"/g, "'")}]"`;
}

/**
 * Export gradient as React component
 */
export function exportAsReact(gradient: GradientConfig): string {
  const css = generateGradientCSS(gradient);
  return `export function ${gradient.name.replace(/[^a-zA-Z0-9]/g, "")}Gradient() {
  return (
    <div
      style={{
        background: '${css}',
      }}
      className="w-full h-full"
    >
      {/* Your content here */}
    </div>
  );
}`;
}

/**
 * Export gradient as Vue component
 */
export function exportAsVue(gradient: GradientConfig): string {
  const css = generateGradientCSS(gradient);
  return `<template>
  <div class="gradient-container">
    <!-- Your content here -->
  </div>
</template>

<script setup lang="ts">
// No scripts needed for static gradient
</script>

<style scoped>
.gradient-container {
  width: 100%;
  height: 100%;
  background: ${css};
}
</style>`;
}

/**
 * Export gradient as SVG
 */
export function exportAsSVG(gradient: GradientConfig): string {
  const stops = gradient.colorStops
    .sort((a, b) => a.position - b.position)
    .map(
      (stop) =>
        `<stop offset="${stop.position}%" stop-color="${stop.color}"/>`
    )
    .join("\n    ");

  if (gradient.type === "linear") {
    const angleRad = (gradient.angle * Math.PI) / 180;
    const x1 = 50 - 50 * Math.cos(angleRad);
    const y1 = 50 - 50 * Math.sin(angleRad);
    const x2 = 50 + 50 * Math.cos(angleRad);
    const y2 = 50 + 50 * Math.sin(angleRad);

    return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675">
  <defs>
    <linearGradient id="gradient" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%">
      ${stops}
    </linearGradient>
  </defs>
  <rect width="1200" height="675" fill="url(#gradient)"/>
</svg>`;
  } else if (gradient.type === "radial") {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675">
  <defs>
    <radialGradient id="gradient">
      ${stops}
    </radialGradient>
  </defs>
  <rect width="1200" height="675" fill="url(#gradient)"/>
</svg>`;
  } else {
    // Conic gradients are not well supported in SVG, use linear as fallback
    return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675">
  <defs>
    <linearGradient id="gradient">
      ${stops}
    </linearGradient>
  </defs>
  <rect width="1200" height="675" fill="url(#gradient)"/>
</svg>`;
  }
}

/**
 * Export gradient as PNG
 */
export async function exportAsPNG(element: HTMLElement): Promise<string> {
  try {
    const dataUrl = await toPng(element, {
      quality: 1,
      pixelRatio: 2,
      width: 1200,
      height: 675,
    });
    return dataUrl;
  } catch (error) {
    console.error("Error exporting PNG:", error);
    throw error;
  }
}

/**
 * Get export content based on format
 */
export function getExportContent(
  gradient: GradientConfig,
  format: ExportFormat
): string {
  switch (format) {
    case "css":
      return exportAsCSS(gradient);
    case "tailwind":
      return exportAsTailwind(gradient);
    case "react":
      return exportAsReact(gradient);
    case "vue":
      return exportAsVue(gradient);
    case "svg":
      return exportAsSVG(gradient);
    default:
      return exportAsCSS(gradient);
  }
}

/**
 * Download file
 */
export function downloadFile(content: string, filename: string, type: string = "text/plain") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
