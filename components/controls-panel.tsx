"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DeviceSize } from "@/types/gradient";
import { Monitor, Tablet, Smartphone, Eye, EyeOff, Settings2 } from "lucide-react";

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
    <Card variant="glass">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Settings2 className="h-4 w-4 text-primary" />
          Preview Controls
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Device Size */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Device Size</Label>
          <div className="grid grid-cols-3 gap-1.5">
            <Button
              variant={deviceSize === "mobile" ? "default" : "ghost"}
              size="sm"
              onClick={() => onDeviceSizeChange("mobile")}
              className={deviceSize === "mobile" ? "bg-primary/90" : "hover:bg-secondary/50"}
            >
              <Smartphone className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant={deviceSize === "tablet" ? "default" : "ghost"}
              size="sm"
              onClick={() => onDeviceSizeChange("tablet")}
              className={deviceSize === "tablet" ? "bg-primary/90" : "hover:bg-secondary/50"}
            >
              <Tablet className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant={deviceSize === "desktop" ? "default" : "ghost"}
              size="sm"
              onClick={() => onDeviceSizeChange("desktop")}
              className={deviceSize === "desktop" ? "bg-primary/90" : "hover:bg-secondary/50"}
            >
              <Monitor className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Text Overlay */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Text Overlay</Label>
          <div className="flex gap-1.5">
            <Button
              variant={showTextOverlay ? "default" : "ghost"}
              size="sm"
              onClick={() => onShowTextOverlayChange(true)}
              className={cn("flex-1", showTextOverlay ? "bg-primary/90" : "hover:bg-secondary/50")}
            >
              <Eye className="h-3.5 w-3.5 mr-1.5" />
              Show
            </Button>
            <Button
              variant={!showTextOverlay ? "default" : "ghost"}
              size="sm"
              onClick={() => onShowTextOverlayChange(false)}
              className={cn("flex-1", !showTextOverlay ? "bg-primary/90" : "hover:bg-secondary/50")}
            >
              <EyeOff className="h-3.5 w-3.5 mr-1.5" />
              Hide
            </Button>
          </div>
        </div>

        {/* Text Color */}
        {showTextOverlay && (
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Text Color</Label>
            <div className="flex gap-1.5">
              <Button
                variant={textColor === "#ffffff" ? "default" : "ghost"}
                size="sm"
                onClick={() => onTextColorChange("#ffffff")}
                className={cn("flex-1", textColor === "#ffffff" ? "bg-primary/90" : "hover:bg-secondary/50")}
              >
                <div className="w-3 h-3 rounded-full bg-white border border-gray-200 mr-1.5" />
                White
              </Button>
              <Button
                variant={textColor === "#000000" ? "default" : "ghost"}
                size="sm"
                onClick={() => onTextColorChange("#000000")}
                className={cn("flex-1", textColor === "#000000" ? "bg-primary/90" : "hover:bg-secondary/50")}
              >
                <div className="w-3 h-3 rounded-full bg-black mr-1.5" />
                Black
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
