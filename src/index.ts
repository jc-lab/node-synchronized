import { shim as promiseFinallyShim } from 'promise.prototype.finally';
promiseFinallyShim();

type SynchronizedFunction<T> = (isFirst?: boolean) => PromiseLike<T> | T;

interface IWorkQueueItem<T> {
  fn: SynchronizedFunction<T>;
  resolve: () => T;
  reject: (err: any) => void;
}

function removeReduce<T>(arr: T[], reducer: (chain: T, item: T) => T, initial: T): T {
  let prev = initial;
  arr.forEach((item: T, index: number, object: T[]) => {
    prev = reducer(prev, item);
    object.splice(index, 1);
  });
  return prev;
}

const symLocked = Symbol();
const symRunQueue = Symbol();
const symWorkQueue = Symbol();

export class Synchronized {
  private [symLocked]: boolean = false;
  private [symWorkQueue]: IWorkQueueItem<any>[] = [];

  private [symRunQueue]() {
    return removeReduce<any>(this[symWorkQueue],
      (chain, item) => chain.finally(() => new Promise<void>((resolve) => {
        Promise.resolve(item.fn(false))
          .then(item.resolve)
          .catch(item.reject)
          .finally(resolve);
      })),
      Promise.resolve()).then(() => {
      if (this[symWorkQueue].length > 0) {
        this[symRunQueue]();
      }
    });
  }

  public synchronized<T = void>(fn: SynchronizedFunction<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      if (this[symLocked]) {
        this[symWorkQueue].push({
          fn,
          resolve: resolve as any,
          reject
        });
      } else {
        this[symLocked] = true;
        Promise.resolve(fn(true))
          .then(resolve)
          .catch(reject)
          .finally(() => this[symRunQueue]()
            .finally(() => {
              this[symLocked] = false;
            }));
      }
    });
  }
}

