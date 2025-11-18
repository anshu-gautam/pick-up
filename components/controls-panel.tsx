"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DeviceSize } from "@/types/gradient";
import { Monitor, Tablet, Smartphone } from "lucide-react";

interface ControlsPanelProps {
  deviceSize: DeviceSize;
  onDeviceSizeChange: (size: DeviceSize) => void;
  // Legacy props - kept for compatibility but no longer used
  showTextOverlay?: boolean;
  onShowTextOverlayChange?: (show: boolean) => void;
  textColor?: string;
  onTextColorChange?: (color: string) => void;
}

export function ControlsPanel({
  deviceSize,
  onDeviceSizeChange,
}: ControlsPanelProps) {
  return (
    <Card variant="glass">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Monitor className="h-4 w-4 text-primary" />
          Device Preview
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Device Size */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Preview Size</Label>
          <div className="grid grid-cols-3 gap-1.5">
            <Button
              variant={deviceSize === "mobile" ? "default" : "ghost"}
              size="sm"
              onClick={() => onDeviceSizeChange("mobile")}
              className={deviceSize === "mobile" ? "bg-primary/90" : "hover:bg-secondary/50"}
            >
              <Smartphone className="h-3.5 w-3.5 mr-1.5" />
              <span className="text-xs">Mobile</span>
            </Button>
            <Button
              variant={deviceSize === "tablet" ? "default" : "ghost"}
              size="sm"
              onClick={() => onDeviceSizeChange("tablet")}
              className={deviceSize === "tablet" ? "bg-primary/90" : "hover:bg-secondary/50"}
            >
              <Tablet className="h-3.5 w-3.5 mr-1.5" />
              <span className="text-xs">Tablet</span>
            </Button>
            <Button
              variant={deviceSize === "desktop" ? "default" : "ghost"}
              size="sm"
              onClick={() => onDeviceSizeChange("desktop")}
              className={deviceSize === "desktop" ? "bg-primary/90" : "hover:bg-secondary/50"}
            >
              <Monitor className="h-3.5 w-3.5 mr-1.5" />
              <span className="text-xs">Desktop</span>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Test how your gradient looks on different screen sizes
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
