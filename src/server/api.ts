import { initTRPC } from '@trpc/server';
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

});

export type AppRouter = typeof appRouter;