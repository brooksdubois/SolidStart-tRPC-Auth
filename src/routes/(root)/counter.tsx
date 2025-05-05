import { createSignal, onMount, onCleanup, createResource, Suspense } from 'solid-js';
import FancyButton from "~/components/FancyButton";
import {getClient, logError, unsubscribeAll} from "~/util/rxUtils";

export default function Counter() {
    const [count, setCount] = createSignal<number | null>(null);
    const [timerIsRunning, setTimerIsRunning] = createSignal<boolean | null>(null);

    const client = getClient()

    const incrementRPC = () => client!.increment.mutate().catch(logError);
    const decrementRPC = () => client!.decrement.mutate().catch(logError);
    const startTimerRPC = () => client!.startTimer.mutate().catch(logError);
    const pauseTimeRPC = () => client!.pauseTimer.mutate().catch(logError);
    const resetRPC = () => client!.reset.mutate().catch(logError);

    onMount(() => {
        const valueSub = client!.onCounterChange.subscribe(undefined, {
            onData: setCount, onError: logError,
        });

        const timerSub = client!.onTimerStatusChange.subscribe(undefined, {
            onData: setTimerIsRunning, onError: logError,
        });

        onCleanup(() => {
            valueSub.unsubscribe()
            timerSub.unsubscribe()
        });
    });

    return (
        <main>
            <h1>
                <Suspense fallback={<span>Counter:</span>}>
                    Counter: {count() ?? '…'}
                </Suspense>
            </h1>
            <div>
                <FancyButton onClick={incrementRPC}>＋</FancyButton>
                <FancyButton onClick={decrementRPC}>－</FancyButton>
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
                <FancyButton onClick={startTimerRPC} disabled={timerIsRunning() ?? true}>
                    Start Timer
                </FancyButton>
                <FancyButton onClick={pauseTimeRPC} disabled={!timerIsRunning()}>
                    Pause Timer
                </FancyButton>
                <FancyButton onClick={resetRPC}>Reset Timer</FancyButton>
            </div>
        </main>
    );
}
