import {pgTable, serial, text, varchar} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    username: varchar("username", { length: 255 }).unique().notNull(),
    password: text("password").notNull(),
});

