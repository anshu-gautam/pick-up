"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GradientConfig, ExportFormat } from "@/types/gradient";
import { getExportContent, downloadFile, exportAsPNG } from "@/lib/export-utils";
import { Download, Copy, Check } from "lucide-react";
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
    } catch (error) {
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
    } catch (error) {
      toast.error("Export failed");
    } finally {
      setExporting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Export</CardTitle>
        <CardDescription>Export your gradient in various formats</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedFormat} onValueChange={(v) => setSelectedFormat(v as ExportFormat)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="css">CSS</TabsTrigger>
            <TabsTrigger value="tailwind">Tailwind</TabsTrigger>
            <TabsTrigger value="react">React</TabsTrigger>
          </TabsList>
          <TabsList className="grid w-full grid-cols-3 mt-2">
            <TabsTrigger value="vue">Vue</TabsTrigger>
            <TabsTrigger value="svg">SVG</TabsTrigger>
            <TabsTrigger value="png">PNG</TabsTrigger>
          </TabsList>

          <div className="mt-4">
            <TabsContent value={selectedFormat} className="mt-0">
              {selectedFormat !== "png" ? (
                <div className="relative">
                  <pre className="bg-secondary p-4 rounded-lg overflow-x-auto text-xs max-h-64">
                    <code>{codeContent}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute top-2 right-2"
                    onClick={handleCopy}
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              ) : (
                <div className="bg-secondary p-4 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">
                    Click download to export as PNG image (1200x675px)
                  </p>
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>

        <div className="flex gap-2 mt-4">
          {selectedFormat !== "png" && (
            <Button onClick={handleCopy} variant="outline" className="flex-1">
              <Copy className="h-4 w-4 mr-2" />
              {copied ? "Copied!" : "Copy"}
            </Button>
          )}
          <Button onClick={handleDownload} className="flex-1" disabled={exporting}>
            <Download className="h-4 w-4 mr-2" />
            {exporting ? "Exporting..." : "Download"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
