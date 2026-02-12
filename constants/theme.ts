import { Platform } from "react-native";

export const Colors = {
  roxo: {
    background: "#21155d",
    textLight: "#f2e7fe",
    accent: "#bb86fc",
    input: "#ffffff",
    primary: "#60439f",
    secondary: "#452f82",
    detail: "#dcc0ff",
    textDark: "#333333",
  },

  lavanda: {
    background: "#F5F3FF",
    textLight: "#4C1D95",
    accent: "#8B5CF6",
    input: "#ffffff",
    primary: "#EDE9FE",
    secondary: "#DDD6FE",
    detail: "#A78BFA",
    textDark: "#1E1B4B",
  },

  ametista: {
    background: "#2E1065",
    textLight: "#F5F3FF",
    accent: "#C084FC",
    input: "#4C1D95",
    primary: "#5B21B6",
    secondary: "#7C3AED",
    detail: "#DDD6FE",
    textDark: "#FFFFFF",
  },

  // --- TECNOLOGIA & FUTURISMO ---
  dark: {
    background: "#0d1117",
    textLight: "#c9d1d9",
    accent: "#58a6ff",
    input: "#161b22",
    primary: "#21262d",
    secondary: "#30363d",
    detail: "#8b949e",
    textDark: "#ffffff",
  },
  cyber: {
    background: "#000000",
    textLight: "#00ff41",
    accent: "#00ff41",
    input: "#0d0d0d",
    primary: "#1a1a1a",
    secondary: "#333333",
    detail: "#003b00",
    textDark: "#00ff41",
  },
  hacker: {
    background: "#1a1b26",
    textLight: "#a9b1d6",
    accent: "#f7768e",
    input: "#24283b",
    primary: "#414868",
    secondary: "#565f89",
    detail: "#7aa2f7",
    textDark: "#ffffff",
  },
  // Estilo "Dracula"
  dracula: {
    background: "#282a36",
    textLight: "#f8f8f2",
    accent: "#bd93f9",
    input: "#44475a",
    primary: "#44475a",
    secondary: "#6272a4",
    detail: "#ff79c6",
    textDark: "#f8f8f2",
  },
  // Estilo "Terminal Retro"
  fallout: {
    background: "#1a1a1a",
    textLight: "#ffb000",
    accent: "#ffb000",
    input: "#2b2b2b",
    primary: "#333333",
    secondary: "#444444",
    detail: "#ffb000",
    textDark: "#ffb000",
  },

  // --- TRANQUILIDADE & BEM-ESTAR ---
  esmeralda: {
    background: "#064e3b",
    textLight: "#ecfdf5",
    accent: "#10b981",
    input: "#ffffff",
    primary: "#065f46",
    secondary: "#047857",
    detail: "#34d399",
    textDark: "#064e3b",
  },
  zen: {
    background: "#fdfbf7",
    textLight: "#433422",
    accent: "#a78bfa",
    input: "#ffffff",
    primary: "#f3f0e9",
    secondary: "#e5e1d3",
    detail: "#d1c9b3",
    textDark: "#433422",
  },
  oceano: {
    background: "#002b36",
    textLight: "#93a1a1",
    accent: "#2aa198",
    input: "#073642",
    primary: "#073642",
    secondary: "#586e75",
    detail: "#268bd2",
    textDark: "#eee8d5",
  },
  geada: {
    background: "#f0f9ff",
    textLight: "#0c4a6e",
    accent: "#0ea5e9",
    input: "#ffffff",
    primary: "#e0f2fe",
    secondary: "#bae6fd",
    detail: "#7dd3fc",
    textDark: "#0369a1",
  },

  // Estilo "Sakura"
  sakura: {
    background: "#fff1f2",
    textLight: "#9f1239",
    accent: "#fda4af",
    input: "#ffffff",
    primary: "#ffe4e6",
    secondary: "#fecdd3",
    detail: "#fb7185",
    textDark: "#881337",
  },
  // Estilo "Floresta"
  forest: {
    background: "#0a1a11",
    textLight: "#dcfce7",
    accent: "#4ade80",
    input: "#142d1e",
    primary: "#142d1e",
    secondary: "#166534",
    detail: "#22c55e",
    textDark: "#dcfce7",
  },

  //ENERGIA & FOCO
  sunset: {
    background: "#451a03",
    textLight: "#ffedd5",
    accent: "#f97316",
    input: "#ffffff",
    primary: "#7c2d12",
    secondary: "#9a3412",
    detail: "#fb923c",
    textDark: "#ffffff",
  },
  // Estilo "Synthwave"
  synthwave: {
    background: "#2b0644",
    textLight: "#ff7edb",
    accent: "#36f9f6",
    input: "#3d0b5e",
    primary: "#511185",
    secondary: "#6f2da8",
    detail: "#fede5d",
    textDark: "#ffffff",
  },
  // Estilo "Papel Antigo"
  sepia: {
    background: "#f4ecd8",
    textLight: "#5b4636",
    accent: "#964b00",
    input: "#fdf6e3",
    primary: "#e6dcc3",
    secondary: "#d5c8a9",
    detail: "#856751",
    textDark: "#433422",
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
