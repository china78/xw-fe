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
    messages: [
      // {
      //   role: 'assistant',
      //   content:
      //     '聊天模型将消息列表作为输入，并返回模型生成的消息作为输出。尽管聊天格式旨在使多轮对话变得容易，但它对于没有任何对话的单轮任务也同样有用。',
      // },
      // {
      //   role: 'user',
      //   content: '吃了吗您',
      // },
    ],
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
