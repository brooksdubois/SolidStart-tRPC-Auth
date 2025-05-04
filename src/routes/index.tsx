import { createSignal, onMount, onCleanup, createResource, Suspense } from 'solid-js';
import { createTRPCClient, createWSClient, wsLink } from '@trpc/client';
import type { AppRouter } from '~/server/api';
import * as R from 'ramda';
import Button from "~/components/button";

const socketUrl = 'ws://localhost:3000/trpc/';

const client = createTRPCClient<AppRouter>({
    links: [wsLink({ client: createWSClient({ url: socketUrl }) })],
});

const logError = (err: any) => console.error('tRPC error:', err);

const unsubscribeAll = (...subs: Array<() => void>) => () =>
    R.forEach(R.invoker(0, 'unsubscribe'), subs);

const incrementRPC = () => client.increment.mutate().catch(logError);
const decrementRPC = () => client.decrement.mutate().catch(logError);
const startTimerRPC = () => client.startTimer.mutate().catch(logError);
const pauseTimeRPC = () => client.pauseTimer.mutate().catch(logError);
const resetRPC = () => client.reset.mutate().catch(logError);
const createTodo = () => client.createTodo.mutate({ data: "hello Brooks" }).catch(logError);

export default function Home() {
    const [count, setCount] = createSignal<number | null>(null);
    const [timerIsRunning, setTimerIsRunning] = createSignal<boolean | null>(null);

    onMount(() => {
        const valueSub = client.onCounterChange.subscribe(undefined, {
            onData: setCount,
            onError: logError,
        });

        const timerSub = client.onTimerStatusChange.subscribe(undefined, {
            onData: setTimerIsRunning,
            onError: logError,
        });

        onCleanup(unsubscribeAll(valueSub.unsubscribe, timerSub.unsubscribe));
    });

    return (
        <main>
            <h1>
                <Suspense fallback={<span>Counter:</span>}>
                    Counter: {count() ?? '…'}
                </Suspense>
            </h1>
            <div>
                <Button onClick={incrementRPC}>＋</Button>
                <Button onClick={decrementRPC}>－</Button>
            </div>
            <h2>
                <Suspense fallback={<span>Timer:</span>}>
                    Timer: {timerIsRunning() === null
                    ? '…'
                    : timerIsRunning()
                        ? 'Running'
                        : 'Paused'}
                </Suspense>
            </h2>
            <div>
                <Button onClick={startTimerRPC} disabled={timerIsRunning() ?? true}>
                    Start Timer
                </Button>
                <Button onClick={pauseTimeRPC} disabled={!timerIsRunning()}>
                    Pause Timer
                </Button>
                <Button onClick={resetRPC}>Reset Timer</Button>
            </div>
            <div>
                TODO STUFF
                <Button onClick={createTodo}>Create Todo</Button>
            </div>
        </main>
    );
}
