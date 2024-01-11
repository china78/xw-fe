import { create } from 'zustand';
import { PersistOptions, combine, persist } from 'zustand/middleware';
import { deepClone } from './clone';

// eslint-disable-next-line import/prefer-default-export
export function createPersistStore(
  state: any,
  methods: (set: any, get: any) => void,
  persistOptions: PersistOptions<any, any>,
) {
  return create(
    // persist 接收的是一个状态和方法同层级的的对象， 和一个配置对象
    persist(
      combine(
        {
          ...state,
          lastUpdateTime: 0,
        },
        (set, get) => {
          return {
            ...methods(set, get),
            makeUpdate: () => {
              set({ lastUpdateTime: Date.now() });
            },
            update: (updater: (arg0: any) => void) => {
              const state = deepClone(get());
              updater(state);
              set({ ...state, lastUpdateTime: Date.now() });
            },
          };
        },
      ),
      persistOptions,
    ),
  );
}
