"use client";

import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Separator } from "@/components/ui/separator";
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
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium">
        <Settings2 className="h-4 w-4 text-primary" />
        Preview Controls
      </div>

      {/* Device Size */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Device Size</Label>
        <ToggleGroup
          type="single"
          value={deviceSize}
          onValueChange={(value) => value && onDeviceSizeChange(value as DeviceSize)}
          className="justify-start"
        >
          <ToggleGroupItem value="mobile" aria-label="Mobile" className="flex-1">
            <Smartphone className="h-3.5 w-3.5 mr-1.5" />
            <span className="text-xs">Mobile</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="tablet" aria-label="Tablet" className="flex-1">
            <Tablet className="h-3.5 w-3.5 mr-1.5" />
            <span className="text-xs">Tablet</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="desktop" aria-label="Desktop" className="flex-1">
            <Monitor className="h-3.5 w-3.5 mr-1.5" />
            <span className="text-xs">Desktop</span>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <Separator />

      {/* Text Overlay */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Text Overlay</Label>
        <ToggleGroup
          type="single"
          value={showTextOverlay ? "show" : "hide"}
          onValueChange={(value) => onShowTextOverlayChange(value === "show")}
          className="justify-start"
        >
          <ToggleGroupItem value="show" aria-label="Show text" className="flex-1">
            <Eye className="h-3.5 w-3.5 mr-1.5" />
            <span className="text-xs">Show</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="hide" aria-label="Hide text" className="flex-1">
            <EyeOff className="h-3.5 w-3.5 mr-1.5" />
            <span className="text-xs">Hide</span>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Text Color */}
      {showTextOverlay && (
        <>
          <Separator />
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Text Color</Label>
            <ToggleGroup
              type="single"
              value={textColor}
              onValueChange={(value) => value && onTextColorChange(value)}
              className="justify-start"
            >
              <ToggleGroupItem value="#ffffff" aria-label="White text" className="flex-1">
                <div className="w-3 h-3 rounded-full bg-white border border-gray-300 mr-1.5" />
                <span className="text-xs">White</span>
              </ToggleGroupItem>
              <ToggleGroupItem value="#000000" aria-label="Black text" className="flex-1">
                <div className="w-3 h-3 rounded-full bg-black mr-1.5" />
                <span className="text-xs">Black</span>
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </>
      )}
    </div>
  );
}
