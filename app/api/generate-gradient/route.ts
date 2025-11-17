import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { GradientConfig } from "@/types/gradient";
import { createSmoothGradient } from "@/lib/gradient-utils";

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Invalid prompt" }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an expert gradient designer. Generate beautiful, accessible gradients based on user descriptions.

Return ONLY a valid JSON object with this exact structure:
{
  "gradients": [
    {
      "name": "Gradient Name",
      "type": "linear" | "radial" | "conic",
      "angle": 135,
      "colors": ["#hex1", "#hex2", "#hex3"],
      "description": "Brief description"
    }
  ]
}

Guidelines:
- Create 3-5 gradient variations
- Use color theory for harmonious combinations
- Avoid muddy middle colors (use proper color mixing)
- Consider accessibility (high contrast when possible)
- Use descriptive names
- Angles: 0-360 degrees (linear), or rotation for radial/conic
- Return 3-5 colors per gradient max
- All colors must be valid hex codes (#RRGGBB)`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 1500,
      response_format: { type: "json_object" },
    });

    const result = completion.choices[0]?.message?.content;

    if (!result) {
      return NextResponse.json(
        { error: "No response from AI" },
        { status: 500 }
      );
    }

    const parsed = JSON.parse(result) as {
      gradients: Array<{
        name?: string;
        type?: string;
        angle?: number;
        colors?: string[];
        description?: string;
      }>;
    };

    // Convert to our GradientConfig format
    const gradients: GradientConfig[] = parsed.gradients.map(
      (g, index: number) => ({
        id: `ai-${Date.now()}-${index}`,
        name: g.name || "AI Generated Gradient",
        type: (g.type as "linear" | "radial" | "conic") || "linear",
        angle: g.angle || 135,
        colorStops: createSmoothGradient(g.colors || ["#667eea", "#764ba2"]),
        tags: ["ai-generated"],
      })
    );

    return NextResponse.json({ gradients });
  } catch (error) {
    console.error("Error generating gradient:", error);
    return NextResponse.json(
      { error: "Failed to generate gradient" },
      { status: 500 }
    );
  }
}
