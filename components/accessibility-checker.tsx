"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GradientConfig } from "@/types/gradient";
import { analyzeGradientAccessibility } from "@/lib/gradient-utils";
import { AlertCircle, CheckCircle2, Info, Shield } from "lucide-react";

interface AccessibilityCheckerProps {
  gradient: GradientConfig;
}

export function AccessibilityChecker({ gradient }: AccessibilityCheckerProps) {
  const accessibility = analyzeGradientAccessibility(gradient);

  const getComplianceIcon = (passes: boolean) => {
    return passes ? (
      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
    ) : (
      <AlertCircle className="h-3.5 w-3.5 text-rose-500" />
    );
  };

  const getOverallScore = () => {
    const whiteScore = Object.values(accessibility.wcagCompliance.white).filter(v => v === true).length;
    const blackScore = Object.values(accessibility.wcagCompliance.black).filter(v => v === true).length;
    return Math.max(whiteScore, blackScore);
  };

  const score = getOverallScore();
  const scoreColor = score >= 3 ? "text-emerald-500" : score >= 2 ? "text-amber-500" : "text-rose-500";

  return (
    <Card variant="glass">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            Accessibility
          </div>
          <span className={`text-xs font-mono ${scoreColor}`}>
            {score}/4 WCAG
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Contrast Ratios */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-secondary/30 border border-white/5">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Average</p>
            <p className="font-mono text-sm font-medium">{accessibility.averageContrast.toFixed(1)}:1</p>
          </div>
          <div className="p-3 rounded-xl bg-secondary/30 border border-white/5">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Minimum</p>
            <p className="font-mono text-sm font-medium">{accessibility.minContrast.toFixed(1)}:1</p>
          </div>
        </div>

        {/* White Text Compliance */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-medium flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-white border" />
              White Text
            </h4>
            <span className="text-[10px] font-mono text-muted-foreground">
              {accessibility.wcagCompliance.white.contrastRatio.toFixed(1)}:1
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <div className="flex items-center gap-1.5 text-xs p-1.5 rounded-md bg-secondary/20">
              {getComplianceIcon(accessibility.wcagCompliance.white.aaLarge)}
              <span className="text-muted-foreground">AA Lg</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs p-1.5 rounded-md bg-secondary/20">
              {getComplianceIcon(accessibility.wcagCompliance.white.aaSmall)}
              <span className="text-muted-foreground">AA Sm</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs p-1.5 rounded-md bg-secondary/20">
              {getComplianceIcon(accessibility.wcagCompliance.white.aaaLarge)}
              <span className="text-muted-foreground">AAA Lg</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs p-1.5 rounded-md bg-secondary/20">
              {getComplianceIcon(accessibility.wcagCompliance.white.aaaSmall)}
              <span className="text-muted-foreground">AAA Sm</span>
            </div>
          </div>
        </div>

        {/* Black Text Compliance */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-medium flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-black" />
              Black Text
            </h4>
            <span className="text-[10px] font-mono text-muted-foreground">
              {accessibility.wcagCompliance.black.contrastRatio.toFixed(1)}:1
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <div className="flex items-center gap-1.5 text-xs p-1.5 rounded-md bg-secondary/20">
              {getComplianceIcon(accessibility.wcagCompliance.black.aaLarge)}
              <span className="text-muted-foreground">AA Lg</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs p-1.5 rounded-md bg-secondary/20">
              {getComplianceIcon(accessibility.wcagCompliance.black.aaSmall)}
              <span className="text-muted-foreground">AA Sm</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs p-1.5 rounded-md bg-secondary/20">
              {getComplianceIcon(accessibility.wcagCompliance.black.aaaLarge)}
              <span className="text-muted-foreground">AAA Lg</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs p-1.5 rounded-md bg-secondary/20">
              {getComplianceIcon(accessibility.wcagCompliance.black.aaaSmall)}
              <span className="text-muted-foreground">AAA Sm</span>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        {accessibility.recommendations.length > 0 && (
          <div className="pt-2 border-t border-white/5">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
              <Info className="h-3 w-3" />
              <span>Tips</span>
            </div>
            <ul className="space-y-1">
              {accessibility.recommendations.slice(0, 2).map((rec, index) => (
                <li key={index} className="text-[11px] text-muted-foreground leading-tight">
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
