import {BehaviorSubject, filter, interval, Subscription} from 'rxjs';

export const counter$ = new BehaviorSubject<number>(0);
export const isRunning$ = new BehaviorSubject(false);

export const increment = () => {
  const newCount = counter$.value + 1
  counter$.next(newCount);
  return newCount
}

export const decrement = () => {
  const newCount = counter$.value - 1
  counter$.next(newCount);
  return newCount
}

let timerSub: Subscription | null = null;

export const startAutoIncrement = () => {
  if (!timerSub) {
    timerSub = interval(3000)
        .pipe(filter(() => isRunning$.value))
        .subscribe(() => increment());
  }
};

export const startTimer = () => {
  isRunning$.next(true);
  return true;
}

export const pauseTimer = () => {
  isRunning$.next(false);
  return false;
}

export const reset = () => {
  pauseTimer();
  counter$.next(0);
  timerSub?.unsubscribe();
  timerSub = null;
  startAutoIncrement()
  pauseTimer()
};


