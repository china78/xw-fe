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
    resetMessages: (state) => {
      state.chatHistory.messages = [];
    },
    updateLastMessageContent: (state, action: PayloadAction<string>) => {
      const lastMessage =
        state.chatHistory.messages[state.chatHistory.messages.length - 1];
      if (lastMessage) {
        lastMessage.content += action.payload;
      } else {
        state.chatHistory.messages.push({
          role: 'assistant',
          content: '',
        });
      }
    },
  },
});

export const { addUserMessage, resetMessages, updateLastMessageContent } =
  chatSlice.actions;

export const selectChatHistory = (state: { chat: ChatState }) =>
  state.chat.chatHistory;

export const selectModel = (state: { chat: ChatState }) =>
  state.chat.chatHistory.model;

export default chatSlice.reducer;
