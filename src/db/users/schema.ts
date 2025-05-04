import {pgTable, serial, text, varchar} from "drizzle-orm/pg-core";
import {z} from "zod";

export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    username: varchar("username", { length: 255 }).unique().notNull(),
    password: text("password").notNull(),
});

export const UsersSchema = z.object({
    id: z.string(),
    username: z.string(),
    isEnabled: z.boolean(),
});

