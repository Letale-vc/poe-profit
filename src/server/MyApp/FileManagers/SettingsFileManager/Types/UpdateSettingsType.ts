import { type ZodType, z } from 'zod'

export const updateSettingsSchema = z.object({
  expGemUpdate: z.boolean().optional(),
  flipUpdate: z.boolean().optional(),
  poesessid: z.string().optional(),
})

type DeepNonNullable<T> = T extends (infer U)[]
  ? DeepNonNullable<U>[]
  : T extends object
  ? { [K in keyof T]: DeepNonNullable<T[K]> }
  : NonNullable<T>

export type Infer<T extends ZodType> = DeepNonNullable<z.infer<T>>

export type UpdateSettingsType = z.infer<typeof updateSettingsSchema>
