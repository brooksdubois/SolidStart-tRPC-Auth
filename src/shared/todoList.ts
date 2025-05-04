import { BehaviorSubject } from "rxjs";
import {NewTodoInput, todo, type Todo} from "../db/todo/schema";
import { db } from "../db/client";

export const todoList$ = new BehaviorSubject<Todo[]>([]);

export const initTodoList = async () => {
    const existingTodos = await db.select().from(todo);
    todoList$.next(existingTodos);
};

export const addTodo = async ({ input }: { input: NewTodoInput }) => {
    const [inserted] = await db
        .insert(todo)
        .values({ data: input.data })
        .returning();

    if (inserted) {
        todoList$.next([...todoList$.value, inserted]);
    }

    return inserted;
};