import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { isPersonaModel } from "./persona-models";
export const generateIdentity = createServerFn({ method: "POST" })
 .middleware([requireSupabaseAuth])
 .inputValidator(z.object({ model: z.string().refine(isPersonaModel, "Choose a supported AI model."), name: z.string().trim().min(1).max(100), niche: z.string().trim().min(1).max(200), direction: z.string().max(2000) }))
 .handler(async ({ data }) => { const { generatePersonaIdentity } = await import("./ai/persona.server"); return generatePersonaIdentity(data); });
