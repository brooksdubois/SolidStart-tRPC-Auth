import { initTRPC } from '@trpc/server';
import { z } from "zod";
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
import {db} from "../db/client";
import { todo } from "../db/schema";

const t = initTRPC.create();

startAutoIncrement(); // Auto-increment every second

export const appRouter = t.router({

    increment: t.procedure.mutation(increment),

    decrement: t.procedure.mutation(decrement),

    startTimer: t.procedure.mutation(startTimer),

    pauseTimer: t.procedure.mutation(pauseTimer),

    reset: t.procedure.mutation(reset),

    onCounterChange: t.procedure.subscription(() => counter$.asObservable()),

    onTimerStatusChange: t.procedure.subscription(() => isRunning$.asObservable()),

    createTodo: t.procedure
        .input(z.object({ data: z.string().min(1) }))
        .mutation(async ({ input }) => {
            await db.insert(todo).values({ data: input.data });
            return { success: true };
        }),
});

export type AppRouter = typeof appRouter;