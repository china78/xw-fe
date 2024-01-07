import { configureStore } from '@reduxjs/toolkit';
import editorTabsReducer from './EditorTabs/EditorTabSlice';
import chatReducer from './chat/chatSlice';

// eslint-disable-next-line import/prefer-default-export
export const store = configureStore({
  reducer: {
    editorTabs: editorTabsReducer,
    chat: chatReducer,
  },
});
