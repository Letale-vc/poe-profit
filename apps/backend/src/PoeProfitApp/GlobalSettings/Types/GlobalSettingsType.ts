import { z, type ZodType } from "zod";

export const settingsSchema = z.object({
    plugins: z.array(
        z.object({
            name: z.string(),
            active: z.boolean(),
        }),
    ),
});

type DeepNonNullable<T> = T extends (infer U)[]
    ? DeepNonNullable<U>[]
    : T extends object
    ? { [K in keyof T]: DeepNonNullable<T[K]> }
    : NonNullable<T>;

export type Infer<T extends ZodType> = DeepNonNullable<z.infer<T>>;

export type SettingsType = z.infer<typeof settingsSchema>;
