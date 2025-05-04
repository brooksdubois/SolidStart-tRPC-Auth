import { createSignal, onMount, onCleanup, createResource, Suspense } from 'solid-js';
import { createTRPCClient, createWSClient, wsLink } from '@trpc/client';
import type { AppRouter } from '~/server/api';
import * as R from 'ramda';

const socketUrl = 'ws://localhost:3000/trpc/';
// const socketUrl = 'wss://solid-rx-rpc-ws-bun.deno.dev/trpc/';

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
                <button onClick={incrementRPC} class="button-increment">＋</button>
                <button onClick={decrementRPC} class="button-decrement">－</button>
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
                <button onClick={startTimerRPC} class="button-base" disabled={timerIsRunning() ?? true}>
                    Start Timer
                </button>
                <button onClick={pauseTimeRPC} class="button-base" disabled={!timerIsRunning()}>
                    Pause Timer
                </button>
                <button onClick={resetRPC} class="button-stop">Reset Timer</button>
            </div>
        </main>
    );
}
