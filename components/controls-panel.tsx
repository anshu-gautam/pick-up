"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DeviceSize } from "@/types/gradient";
import { Monitor, Tablet, Smartphone } from "lucide-react";

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
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Preview Controls</CardTitle>
        <CardDescription>Customize preview settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Device Size */}
        <div className="space-y-2">
          <Label>Device Size</Label>
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant={deviceSize === "mobile" ? "default" : "outline"}
              size="sm"
              onClick={() => onDeviceSizeChange("mobile")}
              className="flex items-center gap-2"
            >
              <Smartphone className="h-4 w-4" />
              Mobile
            </Button>
            <Button
              variant={deviceSize === "tablet" ? "default" : "outline"}
              size="sm"
              onClick={() => onDeviceSizeChange("tablet")}
              className="flex items-center gap-2"
            >
              <Tablet className="h-4 w-4" />
              Tablet
            </Button>
            <Button
              variant={deviceSize === "desktop" ? "default" : "outline"}
              size="sm"
              onClick={() => onDeviceSizeChange("desktop")}
              className="flex items-center gap-2"
            >
              <Monitor className="h-4 w-4" />
              Desktop
            </Button>
          </div>
        </div>

        {/* Text Overlay */}
        <div className="space-y-2">
          <Label>Text Overlay</Label>
          <div className="flex gap-2">
            <Button
              variant={showTextOverlay ? "default" : "outline"}
              size="sm"
              onClick={() => onShowTextOverlayChange(true)}
              className="flex-1"
            >
              Show
            </Button>
            <Button
              variant={!showTextOverlay ? "default" : "outline"}
              size="sm"
              onClick={() => onShowTextOverlayChange(false)}
              className="flex-1"
            >
              Hide
            </Button>
          </div>
        </div>

        {/* Text Color */}
        {showTextOverlay && (
          <div className="space-y-2">
            <Label>Text Color</Label>
            <div className="flex gap-2">
              <Button
                variant={textColor === "#ffffff" ? "default" : "outline"}
                size="sm"
                onClick={() => onTextColorChange("#ffffff")}
                className="flex-1"
              >
                White
              </Button>
              <Button
                variant={textColor === "#000000" ? "default" : "outline"}
                size="sm"
                onClick={() => onTextColorChange("#000000")}
                className="flex-1"
              >
                Black
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
