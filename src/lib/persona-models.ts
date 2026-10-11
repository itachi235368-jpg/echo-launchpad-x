export const personaModels = [
  { id: "openai/gpt-6-astra", name: "GPT-6 Astra" },
  { id: "openai/gpt-6-luna", name: "GPT-6 Luna" },
  { id: "google/gemini-3.8-flash", name: "Gemini 3.8 Flash" },
  { id: "google/gemini-3.1-flash-lite", name: "Gemini 3.1 Flash Lite" },
] as const;
export const defaultPersonaModel = "openai/gpt-6-astra";
export function isPersonaModel(id: string) { return personaModels.some((model) => model.id === id); }
