import { z } from 'zod';

export const settingsTypeSchema = z.object({
  expGemUpdate: z.boolean(),
  flipUpdate: z.boolean(),
  poesessid: z.string(),
});

export const settingsReturnTypeSchema = z.object({
  expGemUpdate: z.boolean(),
  flipUpdate: z.boolean(),
  poesessid: z.string(),
});

export type SettingsType = z.infer<typeof settingsTypeSchema>;

export type SettingsReturnType = z.infer<typeof settingsReturnTypeSchema>;
