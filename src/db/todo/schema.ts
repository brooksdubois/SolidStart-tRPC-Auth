import { pgTable, text, boolean } from 'drizzle-orm/pg-core';
import { ulid } from 'ulidx';
import { z } from "zod";

export const todo = pgTable('todo', {
  id: text('id').primaryKey().$defaultFn(ulid),
  data: text('data').notNull(),
  isEnabled: boolean().notNull().default(false)
});

export const TodoSchema = z.object({
  id: z.string(),
  data: z.string(),
  isEnabled: z.boolean(),
});

export type Todo = z.infer<typeof TodoSchema>;

export const NewTodoSchema = z.object({
  data: z.string(),
});
export type NewTodoInput = z.infer<typeof NewTodoSchema>;

export const CheckedTodoSchema = z.object({
  id: z.string(),
  isEnabled: z.boolean()
});
export type CheckedTodoInput = z.infer<typeof CheckedTodoSchema>;

export const DeletedTodoSchema = z.object({
  id: z.string()
});
export type DeletedTodoInput = z.infer<typeof DeletedTodoSchema>;