import { create, StateCreator } from 'zustand';
import { combine, persist, PersistOptions } from 'zustand/middleware';

type Write<T, U> = Omit<T, keyof U> & U;

// eslint-disable-next-line import/prefer-default-export
export function createPersistStore<T extends object, U extends object>(
  state: T,
  methods: StateCreator<T, [], [], U>,
  persistOptions: PersistOptions<Write<T, U>, U>,
) {
  return create<Write<T, U>>()(
    persist(
      combine(
        {
          ...state,
        },
        methods,
      ),
      persistOptions,
    ),
  );
}
