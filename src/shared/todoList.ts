import { BehaviorSubject } from "rxjs";
import {CheckedTodoInput, DeletedTodoInput, NewTodoInput, todo, type Todo} from "../db/todo/schema";
import { db } from "../db/client";
import { eq } from 'drizzle-orm';

export const todoList$ = new BehaviorSubject<Todo[]>([]);

export const initTodoList = async () => {
    const existingTodos = await db.select().from(todo);
    todoList$.next(existingTodos);
};

export const addTodo = async ({ input }: { input: NewTodoInput }) => {
    const [inserted] = await db.insert(todo).values({ data: input.data }).returning();
    if (inserted) { todoList$.next([...todoList$.value, inserted]); }
    return inserted;
};

export const checkedTodo = async ({ input }: { input: CheckedTodoInput }) => {
    await db.update(todo).set({ isEnabled: input.isEnabled }).where(eq(todo.id, input.id));
    const newTodoList = todoList$.value.map((it) =>
        it.id === input.id ? { ...it, isEnabled: input.isEnabled } : it
    );
    todoList$.next(newTodoList);
};

export const deleteTodo = async ({ input }: { input: DeletedTodoInput }) => {
    await db.delete(todo).where(eq(todo.id, input.id))
    const newTodoList = todoList$.value.filter(it => it.id !== input.id);
    todoList$.next(newTodoList);
};
