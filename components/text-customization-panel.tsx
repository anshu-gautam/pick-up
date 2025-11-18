"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FontSize, TextAlignment } from "@/lib/store";
import {
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Palette,
  Eye,
  EyeOff,
} from "lucide-react";

interface TextCustomizationPanelProps {
  headingText: string;
  onHeadingTextChange: (text: string) => void;
  subheadingText: string;
  onSubheadingTextChange: (text: string) => void;
  buttonText: string;
  onButtonTextChange: (text: string) => void;
  fontSize: FontSize;
  onFontSizeChange: (size: FontSize) => void;
  textAlignment: TextAlignment;
  onTextAlignmentChange: (alignment: TextAlignment) => void;
  textColor: string;
  onTextColorChange: (color: string) => void;
  showTextOverlay: boolean;
  onShowTextOverlayChange: (show: boolean) => void;
  showButton: boolean;
  onShowButtonChange: (show: boolean) => void;
}

const fontSizeOptions: { value: FontSize; label: string }[] = [
  { value: "sm", label: "S" },
  { value: "md", label: "M" },
  { value: "lg", label: "L" },
  { value: "xl", label: "XL" },
];

export function TextCustomizationPanel({
  headingText,
  onHeadingTextChange,
  subheadingText,
  onSubheadingTextChange,
  buttonText,
  onButtonTextChange,
  fontSize,
  onFontSizeChange,
  textAlignment,
  onTextAlignmentChange,
  textColor,
  onTextColorChange,
  showTextOverlay,
  onShowTextOverlayChange,
  showButton,
  onShowButtonChange,
}: TextCustomizationPanelProps) {
  return (
    <Card variant="glass">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Type className="h-4 w-4 text-primary" />
            Text Content
          </CardTitle>
          <Button
            variant={showTextOverlay ? "default" : "ghost"}
            size="sm"
            onClick={() => onShowTextOverlayChange(!showTextOverlay)}
            className={showTextOverlay ? "bg-primary/90" : "hover:bg-secondary/50"}
          >
            {showTextOverlay ? (
              <>
                <Eye className="h-3.5 w-3.5 mr-1.5" />
                Visible
              </>
            ) : (
              <>
                <EyeOff className="h-3.5 w-3.5 mr-1.5" />
                Hidden
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {showTextOverlay && (
          <>
            {/* Heading Input */}
            <div className="space-y-2">
              <Label htmlFor="heading" className="text-xs text-muted-foreground">
                Heading
              </Label>
              <Input
                id="heading"
                value={headingText}
                onChange={(e) => onHeadingTextChange(e.target.value)}
                placeholder="Enter your headline..."
                className="bg-background/50"
              />
            </div>

            {/* Subheading Input */}
            <div className="space-y-2">
              <Label htmlFor="subheading" className="text-xs text-muted-foreground">
                Subheading
              </Label>
              <Textarea
                id="subheading"
                value={subheadingText}
                onChange={(e) => onSubheadingTextChange(e.target.value)}
                placeholder="Enter your subheading..."
                className="bg-background/50 min-h-[60px] resize-none"
                rows={2}
              />
            </div>

            {/* Button Text with Toggle */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="button-text" className="text-xs text-muted-foreground">
                  Button Text
                </Label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onShowButtonChange(!showButton)}
                    className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                  >
                    {showButton ? (
                      <Eye className="h-3 w-3" />
                    ) : (
                      <EyeOff className="h-3 w-3" />
                    )}
                  </button>
                </div>
              </div>
              {showButton && (
                <Input
                  id="button-text"
                  value={buttonText}
                  onChange={(e) => onButtonTextChange(e.target.value)}
                  placeholder="Button label..."
                  className="bg-background/50"
                />
              )}
            </div>

            {/* Text Styling Controls */}
            <div className="pt-2 border-t space-y-3">
              {/* Font Size */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Font Size</Label>
                <div className="grid grid-cols-4 gap-1.5">
                  {fontSizeOptions.map((option) => (
                    <Button
                      key={option.value}
                      variant={fontSize === option.value ? "default" : "ghost"}
                      size="sm"
                      onClick={() => onFontSizeChange(option.value)}
                      className={
                        fontSize === option.value
                          ? "bg-primary/90"
                          : "hover:bg-secondary/50"
                      }
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Text Alignment */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Alignment</Label>
                <div className="grid grid-cols-3 gap-1.5">
                  <Button
                    variant={textAlignment === "left" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => onTextAlignmentChange("left")}
                    className={
                      textAlignment === "left"
                        ? "bg-primary/90"
                        : "hover:bg-secondary/50"
                    }
                  >
                    <AlignLeft className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant={textAlignment === "center" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => onTextAlignmentChange("center")}
                    className={
                      textAlignment === "center"
                        ? "bg-primary/90"
                        : "hover:bg-secondary/50"
                    }
                  >
                    <AlignCenter className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant={textAlignment === "right" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => onTextAlignmentChange("right")}
                    className={
                      textAlignment === "right"
                        ? "bg-primary/90"
                        : "hover:bg-secondary/50"
                    }
                  >
                    <AlignRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              {/* Text Color */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Palette className="h-3 w-3" />
                  Text Color
                </Label>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <input
                      type="color"
                      value={textColor}
                      onChange={(e) => onTextColorChange(e.target.value)}
                      className="w-10 h-10 rounded-lg cursor-pointer border-2 border-border bg-transparent"
                    />
                  </div>
                  <Input
                    value={textColor}
                    onChange={(e) => onTextColorChange(e.target.value)}
                    placeholder="#ffffff"
                    className="bg-background/50 font-mono text-sm flex-1"
                  />
                  {/* Quick color presets */}
                  <div className="flex gap-1">
                    <button
                      onClick={() => onTextColorChange("#ffffff")}
                      className="w-6 h-6 rounded-full bg-white border-2 border-gray-200 hover:scale-110 transition-transform"
                      title="White"
                    />
                    <button
                      onClick={() => onTextColorChange("#000000")}
                      className="w-6 h-6 rounded-full bg-black border-2 border-gray-400 hover:scale-110 transition-transform"
                      title="Black"
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {!showTextOverlay && (
          <div className="text-center py-4 text-sm text-muted-foreground">
            Text overlay is hidden. Toggle the switch above to customize text.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
