import { createSlice } from '@reduxjs/toolkit';

interface Tabs {
  label: string; // 文件名
  children: string; // null
  key: string; // 文件路径
}
interface InitialState {
  tabs: Tabs[];
  activeKey: string;
  fileName: string;
}
const initialState: InitialState = {
  tabs: [],
  activeKey: '',
  fileName: '',
};

export const editorTabsSlice = createSlice({
  name: 'editorTabs',
  initialState,
  reducers: {
    addTab: (state: any, action) => {
      state.tabs = [
        ...state.tabs,
        { label: action.payload.label, key: action.payload.key },
      ];
    },
    removeTab: (state, action) => {
      state.tabs = state.tabs.filter((tab) => tab.key !== action.payload.key);
    },
    setActiveKey: (state, action) => {
      state.activeKey = action.payload;
    },
    setFileName: (state, action) => {
      state.activeKey = action.payload;
    },
  },
});

export const { addTab, removeTab, setActiveKey, setFileName } =
  editorTabsSlice.actions;

export const selectTabs = (state: { editorTabs: { tabs: Tabs[] } }) =>
  state.editorTabs.tabs;

export const selectActiveKey = (state: { editorTabs: { activeKey: string } }) =>
  state.editorTabs.activeKey;

export const selectFileName = (state: { editorTabs: { fileName: string } }) =>
  state.editorTabs.fileName;

export default editorTabsSlice.reducer;