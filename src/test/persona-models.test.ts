import { describe, expect, it } from "vitest";
import { defaultPersonaModel, isPersonaModel, personaModels } from "@/lib/persona-models";
describe("persona models", () => {
 it("offers four model choices", () => { expect(personaModels.map(m => m.id)).toEqual(["openai/gpt-6-astra", "openai/gpt-6-luna", "google/gemini-3.8-flash", "google/gemini-3.1-flash-lite"]); });
 it("defaults to Astra and rejects arbitrary models", () => { expect(defaultPersonaModel).toBe("openai/gpt-6-astra"); expect(isPersonaModel(defaultPersonaModel)).toBe(true); expect(isPersonaModel("unknown/model")).toBe(false); });
});
