import { createPersistStore } from './store';

interface Tabs {
  label: string; // 文件名
  children?: string; // null
  key: string; // 文件路径
}

type OpenType = 'file' | 'folder' | null;
interface InitialState {
  tabs: Tabs[];
  activeKey: string;
  fileName: string;
  fileContent: string;
  fileDesc: string;
  currentOpenType: OpenType;
  fileExtension: string;
}

const DEFAULT_TREE: InitialState = {
  tabs: [],
  activeKey: '',
  fileName: '',
  fileContent: '',
  fileDesc: '',
  currentOpenType: 'file',
  fileExtension: '',
};

// eslint-disable-next-line import/prefer-default-export
export const useTreeStore = createPersistStore(
  DEFAULT_TREE,
  (set) => ({
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
    setFileExtension(ext: string) {
      set(() => ({
        fileExtension: ext,
      }));
    },
    setCurrentOpenType(type: OpenType) {
      set(() => ({
        currentOpenType: type,
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
    setFileDesc(desc: string) {
      set(() => ({
        fileDesc: desc,
      }));
    },
    clearAllData() {
      window.localStorage.clear();
    },
    clearAllTabs() {
      set(() => ({
        tabs: [],
      }));
    },
  }),
  {
    name: 'tree',
  },
);
