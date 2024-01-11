import { create } from 'zustand';
import { combine, persist } from 'zustand/middleware';

type SecondParam<T> = T extends (
  _f: infer _F,
  _s: infer S,
  ...args: infer _U
) => any
  ? S
  : never;

type SetStoreState<T> = (
  partial: T | Partial<T> | ((state: T) => T | Partial<T>),
  replace?: boolean | undefined,
) => void;

// eslint-disable-next-line import/prefer-default-export
export function createPersistStore<T extends object, M>(
  state: T,
  methods: (set: SetStoreState<T>, get: () => T) => M,
  persistOptions: SecondParam<typeof persist<T & M>>,
) {
  return create(
    persist(
      combine(
        {
          ...state,
        },
        (set, get) => {
          return {
            ...methods(set, get as any),
          } as M;
        },
      ),
      persistOptions as any,
    ),
  );
}
