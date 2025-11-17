import { create } from "zustand";
import { GradientConfig, DeviceSize, ColorblindType } from "@/types/gradient";
import { generateRandomGradient } from "./gradient-utils";

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
