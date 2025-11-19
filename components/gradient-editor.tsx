"use client";

import { useState } from "react";
import { GradientConfig, ColorStop, GradientType } from "@/types/gradient";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, Palette } from "lucide-react";
import { generateGradientCSS } from "@/lib/gradient-utils";
import { cn } from "@/lib/utils";

interface GradientEditorProps {
  gradient: GradientConfig;
  onChange: (gradient: GradientConfig) => void;
}

export function GradientEditor({ gradient, onChange }: GradientEditorProps) {
  const [selectedStopId, setSelectedStopId] = useState<string | null>(
    gradient.colorStops[0]?.id || null
  );

  const updateColorStop = (id: string, updates: Partial<ColorStop>) => {
    onChange({
      ...gradient,
      colorStops: gradient.colorStops.map((stop) =>
        stop.id === id ? { ...stop, ...updates } : stop
      ),
    });
  };

  const addColorStop = () => {
    const newPosition = gradient.colorStops.length > 0
      ? Math.max(...gradient.colorStops.map((s) => s.position)) + 10
      : 0;

    const newStop: ColorStop = {
      id: `stop-${Date.now()}`,
      color: "#8b5cf6",
      position: Math.min(newPosition, 100),
    };

    onChange({
      ...gradient,
      colorStops: [...gradient.colorStops, newStop],
    });
    setSelectedStopId(newStop.id);
  };

  const removeColorStop = (id: string) => {
    if (gradient.colorStops.length <= 2) {
      return;
    }

    onChange({
      ...gradient,
      colorStops: gradient.colorStops.filter((stop) => stop.id !== id),
    });

    if (selectedStopId === id) {
      setSelectedStopId(gradient.colorStops[0]?.id || null);
    }
  };

  const updateGradientType = (type: GradientType) => {
    onChange({ ...gradient, type });
  };

  const updateAngle = (angle: number) => {
    onChange({ ...gradient, angle });
  };

  const selectedStop = gradient.colorStops.find((s) => s.id === selectedStopId);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium">
        <Palette className="h-4 w-4 text-primary" />
        Gradient Editor
      </div>

      {/* Gradient Type */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Type</Label>
        <ToggleGroup
          type="single"
          value={gradient.type}
          onValueChange={(v) => v && updateGradientType(v as GradientType)}
          className="justify-start"
        >
          <ToggleGroupItem value="linear" className="flex-1 text-xs">Linear</ToggleGroupItem>
          <ToggleGroupItem value="radial" className="flex-1 text-xs">Radial</ToggleGroupItem>
          <ToggleGroupItem value="conic" className="flex-1 text-xs">Conic</ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Angle Control */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-muted-foreground">
            {gradient.type === "linear" ? "Angle" : "Rotation"}
          </Label>
          <span className="text-xs font-mono text-muted-foreground">{gradient.angle}°</span>
        </div>
        <Slider value={gradient.angle} onChange={updateAngle} min={0} max={360} step={1} />
      </div>

      <Separator />

      {/* Color Stops */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-muted-foreground">Color Stops</Label>
          <Button size="sm" variant="outline" onClick={addColorStop} className="h-7 text-xs">
            <Plus className="h-3 w-3 mr-1" />
            Add
          </Button>
        </div>

        {/* Visual gradient bar */}
        <div
          className="h-10 rounded-lg border relative cursor-crosshair"
          style={{ background: generateGradientCSS(gradient) }}
        >
          {gradient.colorStops.map((stop) => (
            <button
              key={stop.id}
              className={cn(
                "absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 cursor-pointer transition-all hover:scale-110",
                selectedStopId === stop.id
                  ? "border-white scale-110 shadow-lg ring-2 ring-primary/50"
                  : "border-white/70"
              )}
              style={{
                left: `${stop.position}%`,
                transform: `translateX(-50%) translateY(-50%)`,
                backgroundColor: stop.color,
              }}
              onClick={() => setSelectedStopId(stop.id)}
            />
          ))}
        </div>

        {/* Selected stop controls */}
        {selectedStop && (
          <div className="space-y-3 p-3 bg-muted/30 rounded-lg border">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">
                Stop {gradient.colorStops.findIndex((s) => s.id === selectedStop.id) + 1}
              </span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => removeColorStop(selectedStop.id)}
                disabled={gradient.colorStops.length <= 2}
                className="h-6 w-6 p-0"
              >
                <Trash2 className="h-3.5 w-3.5 text-destructive" />
              </Button>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Color</Label>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      className="w-10 h-8 rounded-md border cursor-pointer hover:ring-2 ring-primary/50 transition-all"
                      style={{ backgroundColor: selectedStop.color }}
                    />
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-3" align="start">
                    <Input
                      type="color"
                      value={selectedStop.color}
                      onChange={(e) => updateColorStop(selectedStop.id, { color: e.target.value })}
                      className="w-32 h-32 p-0 border-0 cursor-pointer"
                    />
                  </PopoverContent>
                </Popover>
                <Input
                  type="text"
                  value={selectedStop.color}
                  onChange={(e) => updateColorStop(selectedStop.id, { color: e.target.value })}
                  className="flex-1 font-mono text-xs h-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs text-muted-foreground">Position</Label>
                <span className="text-xs font-mono text-muted-foreground">{selectedStop.position}%</span>
              </div>
              <Slider
                value={selectedStop.position}
                onChange={(value) => updateColorStop(selectedStop.id, { position: value })}
                min={0}
                max={100}
                step={1}
              />
            </div>
          </div>
        )}

        {/* All stops list */}
        <ScrollArea className="h-24">
          <div className="space-y-1">
            {gradient.colorStops
              .sort((a, b) => a.position - b.position)
              .map((stop) => (
                <button
                  key={stop.id}
                  onClick={() => setSelectedStopId(stop.id)}
                  className={cn(
                    "w-full flex items-center gap-2 p-1.5 rounded text-xs hover:bg-muted/50 transition-colors",
                    selectedStopId === stop.id && "bg-muted"
                  )}
                >
                  <div
                    className="w-6 h-6 rounded border shrink-0"
                    style={{ backgroundColor: stop.color }}
                  />
                  <div className="flex-1 text-left truncate">
                    <span className="font-mono text-muted-foreground">
                      {stop.color} @ {stop.position}%
                    </span>
                  </div>
                </button>
              ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
