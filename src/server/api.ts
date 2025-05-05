import {initTRPC, TRPCError} from '@trpc/server';
import {
  counter$,
  increment,
  decrement,
  startAutoIncrement,
  startTimer,
  pauseTimer,
  reset,
  isRunning$
} from '../shared/counter';
import {addTodo, checkedTodo, deleteTodo, initTodoList, todoList$} from "../shared/todoList";
import {NewTodoSchema, CheckedTodoSchema, DeletedTodoSchema} from "../db/todo/schema";
import {Context} from "../lib/trpc";

const t = initTRPC.context<Context>().create();

startAutoIncrement();

initTodoList();

export const appRouter = t.router({

    increment: t.procedure.mutation(increment),

    decrement: t.procedure.mutation(decrement),

    startTimer: t.procedure.mutation(({ ctx }) => {
        console.log(ctx)
        // @ts-ignore
        if (!ctx.user) throw new TRPCError({ code: 'UNAUTHORIZED' });
        startTimer()
    }),

    pauseTimer: t.procedure.mutation(pauseTimer),

    reset: t.procedure.mutation(reset),

    onCounterChange: t.procedure.subscription(() => counter$.asObservable()),

    onTimerStatusChange: t.procedure.subscription(() => isRunning$.asObservable()),

    onTodoListChange: t.procedure.subscription(() => todoList$.asObservable()),

    createTodo: t.procedure.input(NewTodoSchema).mutation(addTodo),

    updateTodoChecked: t.procedure.input(CheckedTodoSchema).mutation(checkedTodo),

    deleteTodo: t.procedure.input(DeletedTodoSchema).mutation(deleteTodo)

});

export type AppRouter = typeof appRouter;