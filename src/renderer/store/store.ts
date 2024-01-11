import { create, StateCreator } from 'zustand';
import { combine, persist, PersistOptions } from 'zustand/middleware';

// eslint-disable-next-line import/prefer-default-export
export function createPersistStore<T extends object, U extends object>(
  state: T,
  methods: StateCreator<T, [], [], U>,
  persistOptions: PersistOptions<T, U>,
) {
  return create<T & U>()(
    persist(
      combine(
        {
          ...state,
        },
        methods,
      ) as any,
      persistOptions,
    ) as any,
  );
}
