"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GradientConfig, ExportFormat } from "@/types/gradient";
import { getExportContent, downloadFile, exportAsPNG } from "@/lib/export-utils";
import { Download, Copy, Check, FileCode, Image } from "lucide-react";
import { toast } from "sonner";

interface ExportPanelProps {
  gradient: GradientConfig;
  previewRef?: React.RefObject<HTMLDivElement | null>;
}

const formats: { value: ExportFormat; label: string }[] = [
  { value: "css", label: "CSS" },
  { value: "tailwind", label: "TW" },
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "svg", label: "SVG" },
  { value: "png", label: "PNG" },
];

export function ExportPanel({ gradient, previewRef }: ExportPanelProps) {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>("css");
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);

  const codeContent = getExportContent(gradient, selectedFormat);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeContent);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleDownload = async () => {
    setExporting(true);
    try {
      if (selectedFormat === "png" && previewRef?.current) {
        const dataUrl = await exportAsPNG(previewRef.current);
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `${gradient.name.replace(/[^a-zA-Z0-9]/g, "-")}.png`;
        link.click();
        toast.success("PNG exported!");
      } else {
        const extensions: Record<ExportFormat, string> = {
          css: "css",
          tailwind: "txt",
          react: "tsx",
          vue: "vue",
          svg: "svg",
          png: "png",
        };

        downloadFile(
          codeContent,
          `${gradient.name.replace(/[^a-zA-Z0-9]/g, "-")}.${extensions[selectedFormat]}`,
          selectedFormat === "svg" ? "image/svg+xml" : "text/plain"
        );
        toast.success("File downloaded!");
      }
    } catch {
      toast.error("Export failed");
    } finally {
      setExporting(false);
    }
  };

  return (
    <Card variant="glass">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <FileCode className="h-4 w-4 text-primary" />
          Export
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Format selector */}
        <div className="grid grid-cols-6 gap-1">
          {formats.map((format) => (
            <button
              key={format.value}
              onClick={() => setSelectedFormat(format.value)}
              className={`px-2 py-1.5 text-[10px] font-medium rounded-lg transition-all ${
                selectedFormat === format.value
                  ? "bg-primary text-white"
                  : "bg-secondary/50 hover:bg-secondary text-muted-foreground"
              }`}
            >
              {format.label}
            </button>
          ))}
        </div>

        {/* Code preview */}
        {selectedFormat !== "png" ? (
          <div className="relative">
            <pre className="bg-secondary/30 border border-white/5 p-3 rounded-xl overflow-x-auto text-[10px] max-h-40 scrollbar-thin font-mono">
              <code className="text-foreground/80">{codeContent}</code>
            </pre>
            <Button
              size="sm"
              variant="ghost"
              className="absolute top-1.5 right-1.5 h-6 w-6 p-0"
              onClick={handleCopy}
            >
              {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
            </Button>
          </div>
        ) : (
          <div className="bg-secondary/30 border border-white/5 p-4 rounded-xl text-center">
            <Image className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">
              Export as PNG (1200x675)
            </p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2">
          {selectedFormat !== "png" && (
            <Button
              onClick={handleCopy}
              variant="outline"
              size="sm"
              className="flex-1 bg-transparent border-white/10"
            >
              <Copy className="h-3.5 w-3.5 mr-1.5" />
              {copied ? "Copied" : "Copy"}
            </Button>
          )}
          <Button
            onClick={handleDownload}
            size="sm"
            className={`flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90 ${
              selectedFormat === "png" ? "w-full" : ""
            }`}
            disabled={exporting}
          >
            <Download className="h-3.5 w-3.5 mr-1.5" />
            {exporting ? "Exporting..." : "Download"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
