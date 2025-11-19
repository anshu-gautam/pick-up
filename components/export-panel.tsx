"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GradientConfig, ExportFormat } from "@/types/gradient";
import { getExportContent, downloadFile, exportAsPNG } from "@/lib/export-utils";
import { Download, Copy, Check, FileCode, Image } from "lucide-react";
import { toast } from "sonner";

interface ExportPanelProps {
  gradient: GradientConfig;
  previewRef?: React.RefObject<HTMLDivElement | null>;
}

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
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium">
        <FileCode className="h-4 w-4 text-primary" />
        Export
      </div>

      {/* Format Tabs */}
      <Tabs value={selectedFormat} onValueChange={(v) => setSelectedFormat(v as ExportFormat)}>
        <TabsList className="grid grid-cols-6 h-8">
          <TabsTrigger value="css" className="text-[10px] px-2">CSS</TabsTrigger>
          <TabsTrigger value="tailwind" className="text-[10px] px-2">TW</TabsTrigger>
          <TabsTrigger value="react" className="text-[10px] px-2">React</TabsTrigger>
          <TabsTrigger value="vue" className="text-[10px] px-2">Vue</TabsTrigger>
          <TabsTrigger value="svg" className="text-[10px] px-2">SVG</TabsTrigger>
          <TabsTrigger value="png" className="text-[10px] px-2">PNG</TabsTrigger>
        </TabsList>

        {/* Code preview for each format */}
        {["css", "tailwind", "react", "vue", "svg"].map((format) => (
          <TabsContent key={format} value={format} className="mt-3">
            <div className="relative">
              <ScrollArea className="h-32 rounded-lg border bg-muted/30">
                <pre className="p-3 text-[10px] font-mono">
                  <code className="text-foreground/80">{getExportContent(gradient, format as ExportFormat)}</code>
                </pre>
              </ScrollArea>
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-1.5 right-1.5 h-6 w-6 p-0"
                onClick={handleCopy}
              >
                {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
              </Button>
            </div>
          </TabsContent>
        ))}

        <TabsContent value="png" className="mt-3">
          <div className="rounded-lg border bg-muted/30 p-4 text-center">
            <Image className="h-8 w-8 mx-auto mb-2 text-muted-foreground" aria-hidden="true" />
            <p className="text-xs text-muted-foreground">
              Export as PNG (1200x675)
            </p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Action buttons */}
      <div className="flex gap-2">
        {selectedFormat !== "png" && (
          <Button
            onClick={handleCopy}
            variant="outline"
            size="sm"
            className="flex-1 h-8 text-xs"
          >
            <Copy className="h-3.5 w-3.5 mr-1.5" />
            {copied ? "Copied" : "Copy"}
          </Button>
        )}
        <Button
          onClick={handleDownload}
          size="sm"
          className={`flex-1 h-8 text-xs bg-gradient-to-r from-primary to-accent hover:opacity-90 ${
            selectedFormat === "png" ? "w-full" : ""
          }`}
          disabled={exporting}
        >
          <Download className="h-3.5 w-3.5 mr-1.5" />
          {exporting ? "Exporting..." : "Download"}
        </Button>
      </div>
    </div>
  );
}
