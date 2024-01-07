import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { CreateChatCompletionRequest } from '../../types';
import { UserMessage } from '../../types/UserMessage.type';

export interface ChatState {
  chatHistory: CreateChatCompletionRequest;
  error: string | null;
}

const initialState: ChatState = {
  chatHistory: {
    model: 'gpt-3.5-turbo',
    messages: [],
  }, // 聊天会话的历史记录
  error: null,
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addUserMessage: (state, action: PayloadAction<UserMessage>) => {
      // 追加用户消息 response['choices'][0]['message']['content']
      state.chatHistory.messages.push(action.payload);
    },
  },
});

export const { addUserMessage } = chatSlice.actions;

export const selectChatHistory = (state: { chat: ChatState }) =>
  state.chat.chatHistory;

export default chatSlice.reducer;
