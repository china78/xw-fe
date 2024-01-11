import { createPersistStore } from './store';

interface Tabs {
  label: string; // 文件名
  children?: string; // null
  key: string; // 文件路径
}
interface InitialState {
  tabs: Tabs[];
  activeKey: string;
  fileName: string;
  fileContent: string;
}

const DEFAULT_PROJECT_TREE: InitialState = {
  tabs: [],
  activeKey: '',
  fileName: '',
  fileContent: '',
};

// eslint-disable-next-line import/prefer-default-export
export const useChatStore = createPersistStore(
  DEFAULT_PROJECT_TREE,
  (set, get) => ({
    // 点文件树，上部出现对应的 tab
    addTab(tab: Tabs) {
      set((state) => ({
        tabs: [
          ...state.tabs,
          {
            label: tab.label,
            key: tab.key,
          },
        ],
      }));
    },
    removeTab(key: string) {
      set((state) => ({
        tabs: state.tabs.filter((tab) => tab.key !== key),
      }));
    },
    setActiveKey(key: string) {
      set(() => ({
        activeKey: key,
      }));
    },
    setFileName(name: string) {
      set(() => ({
        fileName: name,
      }));
    },
    setFileContent(content: string) {
      set(() => ({
        fileContent: content,
      }));
    },
  }),
  {
    name: 'projectTree',
  },
);
