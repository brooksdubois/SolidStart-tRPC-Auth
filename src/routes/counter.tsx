import { createSignal, onMount, onCleanup, createResource, Suspense } from 'solid-js';
import Button from "~/components/button";
import {getClient, logError, unsubscribeAll} from "~/util/rxUtils";

const client = getClient()

const incrementRPC = () => client.increment.mutate().catch(logError);
const decrementRPC = () => client.decrement.mutate().catch(logError);
const startTimerRPC = () => client.startTimer.mutate().catch(logError);
const pauseTimeRPC = () => client.pauseTimer.mutate().catch(logError);
const resetRPC = () => client.reset.mutate().catch(logError);

export default function Counter() {
    const [count, setCount] = createSignal<number | null>(null);
    const [timerIsRunning, setTimerIsRunning] = createSignal<boolean | null>(null);

    onMount(() => {
        const valueSub = client.onCounterChange.subscribe(undefined, {
            onData: setCount, onError: logError,
        });

        const timerSub = client.onTimerStatusChange.subscribe(undefined, {
            onData: setTimerIsRunning, onError: logError,
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
        </main>
    );
}
