"use client";

import { GradientConfig } from "@/types/gradient";
import { analyzeGradientAccessibility } from "@/lib/gradient-utils";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AlertCircle, CheckCircle2, Info, Shield } from "lucide-react";

interface AccessibilityCheckerProps {
  gradient: GradientConfig;
}

export function AccessibilityChecker({ gradient }: AccessibilityCheckerProps) {
  const accessibility = analyzeGradientAccessibility(gradient);

  const getOverallScore = () => {
    const whiteScore = Object.values(accessibility.wcagCompliance.white).filter(v => v === true).length;
    const blackScore = Object.values(accessibility.wcagCompliance.black).filter(v => v === true).length;
    return Math.max(whiteScore, blackScore);
  };

  const score = getOverallScore();
  const scorePercentage = (score / 4) * 100;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Shield className="h-4 w-4 text-primary" />
          Accessibility
        </div>
        <Badge variant={score >= 3 ? "success" : score >= 2 ? "warning" : "destructive"}>
          {score}/4 WCAG
        </Badge>
      </div>

      {/* Overall Score Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Compliance Score</span>
          <span>{scorePercentage.toFixed(0)}%</span>
        </div>
        <Progress value={scorePercentage} className="h-2" />
      </div>

      {/* Contrast Ratios */}
      <div className="grid grid-cols-2 gap-2">
        <div className="p-2 rounded-lg bg-muted/50">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Average</p>
          <p className="font-mono text-sm font-medium">{accessibility.averageContrast.toFixed(1)}:1</p>
        </div>
        <div className="p-2 rounded-lg bg-muted/50">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Minimum</p>
          <p className="font-mono text-sm font-medium">{accessibility.minContrast.toFixed(1)}:1</p>
        </div>
      </div>

      {/* Detailed Compliance - Accordion */}
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="white" className="border-b-0">
          <AccordionTrigger className="py-2 hover:no-underline">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-2.5 h-2.5 rounded-full bg-white border" />
              White Text
              <span className="text-muted-foreground font-mono">
                ({accessibility.wcagCompliance.white.contrastRatio.toFixed(1)}:1)
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              <ComplianceItem
                label="AA Large"
                passes={accessibility.wcagCompliance.white.aaLarge}
                description="4.5:1 for large text (18pt+)"
              />
              <ComplianceItem
                label="AA Small"
                passes={accessibility.wcagCompliance.white.aaSmall}
                description="4.5:1 for normal text"
              />
              <ComplianceItem
                label="AAA Large"
                passes={accessibility.wcagCompliance.white.aaaLarge}
                description="7:1 for large text"
              />
              <ComplianceItem
                label="AAA Small"
                passes={accessibility.wcagCompliance.white.aaaSmall}
                description="7:1 for normal text"
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="black" className="border-b-0">
          <AccordionTrigger className="py-2 hover:no-underline">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-2.5 h-2.5 rounded-full bg-black" />
              Black Text
              <span className="text-muted-foreground font-mono">
                ({accessibility.wcagCompliance.black.contrastRatio.toFixed(1)}:1)
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              <ComplianceItem
                label="AA Large"
                passes={accessibility.wcagCompliance.black.aaLarge}
                description="4.5:1 for large text (18pt+)"
              />
              <ComplianceItem
                label="AA Small"
                passes={accessibility.wcagCompliance.black.aaSmall}
                description="4.5:1 for normal text"
              />
              <ComplianceItem
                label="AAA Large"
                passes={accessibility.wcagCompliance.black.aaaLarge}
                description="7:1 for large text"
              />
              <ComplianceItem
                label="AAA Small"
                passes={accessibility.wcagCompliance.black.aaaSmall}
                description="7:1 for normal text"
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Recommendations Alert */}
      {accessibility.recommendations.length > 0 && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription className="text-xs">
            {accessibility.recommendations[0]}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

function ComplianceItem({
  label,
  passes,
  description
}: {
  label: string;
  passes: boolean;
  description: string;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-1.5 text-xs p-1.5 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors w-full">
          {passes ? (
            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
          ) : (
            <AlertCircle className="h-3 w-3 text-rose-500" />
          )}
          <span className="text-muted-foreground">{label}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent side="top" className="w-48 p-2">
        <p className="text-xs text-muted-foreground">{description}</p>
      </PopoverContent>
    </Popover>
  );
}
