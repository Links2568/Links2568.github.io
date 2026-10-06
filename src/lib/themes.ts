/** Research themes = the four research interests on the CV. Colors live in CSS (--t-<id>). */
export const THEMES = [
  { id: "hai", label: "Human–AI interaction" },
  { id: "context", label: "Context-aware systems" },
  { id: "sensing", label: "Ubiquitous sensing" },
  { id: "ai4sci", label: "AI4Science" },
] as const;

export type ThemeId = (typeof THEMES)[number]["id"];
export const themeLabel = (id: string) => THEMES.find((t) => t.id === id)?.label ?? id;
