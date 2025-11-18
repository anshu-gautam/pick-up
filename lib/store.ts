import { create } from "zustand";
import { GradientConfig, DeviceSize, ColorblindType } from "@/types/gradient";
import { generateRandomGradient } from "./gradient-utils";

export type FontSize = "sm" | "md" | "lg" | "xl";
export type TextAlignment = "left" | "center" | "right";

interface GradientStore {
  currentGradient: GradientConfig;
  setCurrentGradient: (gradient: GradientConfig) => void;
  updateGradient: (updates: Partial<GradientConfig>) => void;
  deviceSize: DeviceSize;
  setDeviceSize: (size: DeviceSize) => void;
  colorblindMode: ColorblindType;
  setColorblindMode: (mode: ColorblindType) => void;
  showTextOverlay: boolean;
  setShowTextOverlay: (show: boolean) => void;
  textColor: string;
  setTextColor: (color: string) => void;
  // New text customization options
  headingText: string;
  setHeadingText: (text: string) => void;
  subheadingText: string;
  setSubheadingText: (text: string) => void;
  buttonText: string;
  setButtonText: (text: string) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  textAlignment: TextAlignment;
  setTextAlignment: (alignment: TextAlignment) => void;
  showButton: boolean;
  setShowButton: (show: boolean) => void;
  savedGradients: GradientConfig[];
  saveGradient: (gradient: GradientConfig) => void;
  removeSavedGradient: (id: string) => void;
}

export const useGradientStore = create<GradientStore>((set) => ({
  currentGradient: generateRandomGradient(),
  setCurrentGradient: (gradient) => set({ currentGradient: gradient }),
  updateGradient: (updates) =>
    set((state) => ({
      currentGradient: { ...state.currentGradient, ...updates },
    })),
  deviceSize: "desktop",
  setDeviceSize: (size) => set({ deviceSize: size }),
  colorblindMode: "normal",
  setColorblindMode: (mode) => set({ colorblindMode: mode }),
  showTextOverlay: true,
  setShowTextOverlay: (show) => set({ showTextOverlay: show }),
  textColor: "#ffffff",
  setTextColor: (color) => set({ textColor: color }),
  // New text customization defaults
  headingText: "Your Headline Here",
  setHeadingText: (text) => set({ headingText: text }),
  subheadingText: "Add your compelling subheading to see how it looks on your gradient",
  setSubheadingText: (text) => set({ subheadingText: text }),
  buttonText: "Get Started",
  setButtonText: (text) => set({ buttonText: text }),
  fontSize: "md",
  setFontSize: (size) => set({ fontSize: size }),
  textAlignment: "center",
  setTextAlignment: (alignment) => set({ textAlignment: alignment }),
  showButton: true,
  setShowButton: (show) => set({ showButton: show }),
  savedGradients: [],
  saveGradient: (gradient) =>
    set((state) => ({
      savedGradients: [...state.savedGradients, gradient],
    })),
  removeSavedGradient: (id) =>
    set((state) => ({
      savedGradients: state.savedGradients.filter((g) => g.id !== id),
    })),
}));
