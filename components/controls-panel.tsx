"use client";

import { Button } from "@/components/ui/button";
import { DeviceSize } from "@/types/gradient";
import { Monitor, Tablet, Smartphone, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface ControlsPanelProps {
  deviceSize: DeviceSize;
  onDeviceSizeChange: (size: DeviceSize) => void;
  showTextOverlay: boolean;
  onShowTextOverlayChange: (show: boolean) => void;
  textColor: string;
  onTextColorChange: (color: string) => void;
}

export function ControlsPanel({
  deviceSize,
  onDeviceSizeChange,
  showTextOverlay,
  onShowTextOverlayChange,
  textColor,
  onTextColorChange,
}: ControlsPanelProps) {
  return (
    <div className="inline-flex items-center gap-4 p-4 rounded-2xl bg-card border shadow-sm">
      {/* Device Size */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground">Device:</span>
        <div className="flex items-center gap-1 p-1 rounded-lg bg-secondary">
          <Button
            variant={deviceSize === "mobile" ? "default" : "ghost"}
            size="sm"
            onClick={() => onDeviceSizeChange("mobile")}
            className={cn("h-8 w-8 p-0", deviceSize === "mobile" && "shadow-sm")}
          >
            <Smartphone className="h-4 w-4" />
          </Button>
          <Button
            variant={deviceSize === "tablet" ? "default" : "ghost"}
            size="sm"
            onClick={() => onDeviceSizeChange("tablet")}
            className={cn("h-8 w-8 p-0", deviceSize === "tablet" && "shadow-sm")}
          >
            <Tablet className="h-4 w-4" />
          </Button>
          <Button
            variant={deviceSize === "desktop" ? "default" : "ghost"}
            size="sm"
            onClick={() => onDeviceSizeChange("desktop")}
            className={cn("h-8 w-8 p-0", deviceSize === "desktop" && "shadow-sm")}
          >
            <Monitor className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="w-px h-6 bg-border" />

      {/* Text Overlay */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground">Text:</span>
        <div className="flex items-center gap-1 p-1 rounded-lg bg-secondary">
          <Button
            variant={showTextOverlay ? "default" : "ghost"}
            size="sm"
            onClick={() => onShowTextOverlayChange(true)}
            className={cn("h-8 px-3", showTextOverlay && "shadow-sm")}
          >
            <Eye className="h-4 w-4 mr-1" />
            Show
          </Button>
          <Button
            variant={!showTextOverlay ? "default" : "ghost"}
            size="sm"
            onClick={() => onShowTextOverlayChange(false)}
            className={cn("h-8 px-3", !showTextOverlay && "shadow-sm")}
          >
            <EyeOff className="h-4 w-4 mr-1" />
            Hide
          </Button>
        </div>
      </div>

      {/* Text Color */}
      {showTextOverlay && (
        <>
          <div className="w-px h-6 bg-border" />
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">Color:</span>
            <div className="flex items-center gap-1 p-1 rounded-lg bg-secondary">
              <Button
                variant={textColor === "#ffffff" ? "default" : "ghost"}
                size="sm"
                onClick={() => onTextColorChange("#ffffff")}
                className={cn("h-8 px-3", textColor === "#ffffff" && "shadow-sm")}
              >
                <div className="w-4 h-4 rounded-full bg-white border border-border mr-1" />
                White
              </Button>
              <Button
                variant={textColor === "#000000" ? "default" : "ghost"}
                size="sm"
                onClick={() => onTextColorChange("#000000")}
                className={cn("h-8 px-3", textColor === "#000000" && "shadow-sm")}
              >
                <div className="w-4 h-4 rounded-full bg-black border border-border mr-1" />
                Black
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
