"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GradientConfig } from "@/types/gradient";
import { analyzeGradientAccessibility } from "@/lib/gradient-utils";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";

interface AccessibilityCheckerProps {
  gradient: GradientConfig;
}

export function AccessibilityChecker({ gradient }: AccessibilityCheckerProps) {
  const accessibility = analyzeGradientAccessibility(gradient);

  const getComplianceIcon = (passes: boolean) => {
    return passes ? (
      <CheckCircle2 className="h-4 w-4 text-green-500" />
    ) : (
      <AlertCircle className="h-4 w-4 text-red-500" />
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Accessibility</CardTitle>
        <CardDescription>WCAG 2.2 Compliance Check</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Contrast Ratios */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Contrast Analysis</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">Average:</span>{" "}
              <span className="font-mono">{accessibility.averageContrast.toFixed(2)}:1</span>
            </div>
            <div>
              <span className="text-muted-foreground">Min:</span>{" "}
              <span className="font-mono">{accessibility.minContrast.toFixed(2)}:1</span>
            </div>
          </div>
        </div>

        {/* White Text Compliance */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium flex items-center gap-2">
            White Text Overlay
            <span className="text-xs text-muted-foreground">
              ({accessibility.wcagCompliance.white.contrastRatio.toFixed(2)}:1)
            </span>
          </h4>
          <div className="space-y-1.5 pl-4">
            <div className="flex items-center gap-2 text-sm">
              {getComplianceIcon(accessibility.wcagCompliance.white.aaLarge)}
              <span>AA Large (3:1)</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              {getComplianceIcon(accessibility.wcagCompliance.white.aaSmall)}
              <span>AA Small (4.5:1)</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              {getComplianceIcon(accessibility.wcagCompliance.white.aaaLarge)}
              <span>AAA Large (4.5:1)</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              {getComplianceIcon(accessibility.wcagCompliance.white.aaaSmall)}
              <span>AAA Small (7:1)</span>
            </div>
          </div>
        </div>

        {/* Black Text Compliance */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium flex items-center gap-2">
            Black Text Overlay
            <span className="text-xs text-muted-foreground">
              ({accessibility.wcagCompliance.black.contrastRatio.toFixed(2)}:1)
            </span>
          </h4>
          <div className="space-y-1.5 pl-4">
            <div className="flex items-center gap-2 text-sm">
              {getComplianceIcon(accessibility.wcagCompliance.black.aaLarge)}
              <span>AA Large (3:1)</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              {getComplianceIcon(accessibility.wcagCompliance.black.aaSmall)}
              <span>AA Small (4.5:1)</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              {getComplianceIcon(accessibility.wcagCompliance.black.aaaLarge)}
              <span>AAA Large (4.5:1)</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              {getComplianceIcon(accessibility.wcagCompliance.black.aaaSmall)}
              <span>AAA Small (7:1)</span>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        {accessibility.recommendations.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Info className="h-4 w-4" />
              Recommendations
            </h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {accessibility.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-xs mt-0.5">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
