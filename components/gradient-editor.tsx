"use client";

import { useState } from "react";
import { GradientConfig, ColorStop, GradientType } from "@/types/gradient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2 } from "lucide-react";
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
      return; // Keep at least 2 stops
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
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Gradient Editor</CardTitle>
        <CardDescription>Customize your gradient</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Gradient Type */}
        <div className="space-y-2">
          <Label>Gradient Type</Label>
          <Tabs value={gradient.type} onValueChange={(v) => updateGradientType(v as GradientType)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="linear">Linear</TabsTrigger>
              <TabsTrigger value="radial">Radial</TabsTrigger>
              <TabsTrigger value="conic">Conic</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Angle Control */}
        <div className="space-y-2">
          <Label>
            {gradient.type === "linear" ? "Angle" : "Rotation"} ({gradient.angle}°)
          </Label>
          <Slider value={gradient.angle} onChange={updateAngle} min={0} max={360} step={1} />
        </div>

        {/* Color Stops */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Color Stops</Label>
            <Button size="sm" variant="outline" onClick={addColorStop}>
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>

          {/* Visual gradient bar */}
          <div
            className="h-12 rounded-md border relative"
            style={{ background: generateGradientCSS(gradient) }}
          >
            {gradient.colorStops.map((stop) => (
              <button
                key={stop.id}
                className={cn(
                  "absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-2 cursor-pointer transition-transform hover:scale-110",
                  selectedStopId === stop.id ? "border-white scale-125 shadow-lg" : "border-gray-400"
                )}
                style={{
                  left: `${stop.position}%`,
                  transform: `translateX(-50%) translateY(-50%) ${
                    selectedStopId === stop.id ? "scale(1.25)" : ""
                  }`,
                  backgroundColor: stop.color,
                }}
                onClick={() => setSelectedStopId(stop.id)}
              />
            ))}
          </div>

          {/* Selected stop controls */}
          {selectedStop && (
            <div className="space-y-3 p-4 bg-secondary/50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  Stop {gradient.colorStops.findIndex((s) => s.id === selectedStop.id) + 1}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeColorStop(selectedStop.id)}
                  disabled={gradient.colorStops.length <= 2}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="color-input">Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="color-input"
                    type="color"
                    value={selectedStop.color}
                    onChange={(e) => updateColorStop(selectedStop.id, { color: e.target.value })}
                    className="w-20 h-10 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={selectedStop.color}
                    onChange={(e) => updateColorStop(selectedStop.id, { color: e.target.value })}
                    className="flex-1 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Position ({selectedStop.position}%)</Label>
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
          <div className="space-y-1">
            {gradient.colorStops
              .sort((a, b) => a.position - b.position)
              .map((stop, index) => (
                <button
                  key={stop.id}
                  onClick={() => setSelectedStopId(stop.id)}
                  className={cn(
                    "w-full flex items-center gap-3 p-2 rounded text-sm hover:bg-secondary/50 transition-colors",
                    selectedStopId === stop.id && "bg-secondary"
                  )}
                >
                  <div
                    className="w-8 h-8 rounded border"
                    style={{ backgroundColor: stop.color }}
                  />
                  <div className="flex-1 text-left">
                    <div className="font-medium">Stop {index + 1}</div>
                    <div className="text-xs text-muted-foreground">
                      {stop.color} at {stop.position}%
                    </div>
                  </div>
                </button>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
