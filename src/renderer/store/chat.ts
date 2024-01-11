import { CreateChatCompletionRequest } from '../types';
import { UserMessage } from '../types/UserMessage.type';
import { createPersistStore } from './store';

export interface ChatState {
  chatHistory: CreateChatCompletionRequest;
  error: string | null;
}

const DEFAULT_CHAT_TREE: ChatState = {
  chatHistory: {
    model: 'gpt-3.5-turbo',
    messages: [],
  }, // 聊天会话的历史记录
  error: null,
};

// eslint-disable-next-line import/prefer-default-export
export const useChatStore = createPersistStore(
  DEFAULT_CHAT_TREE,
  (set, get) => ({
    addUserMessage(msg: UserMessage) {
      set((state) => ({
        chatHistory: {
          ...state.chatHistory,
          messages: [...state.chatHistory.messages, msg],
        },
      }));
    },
    // 每次审核代码都是新的开始
    resetMessages() {
      set((state) => ({
        chatHistory: {
          ...state.chatHistory,
          messages: [],
        },
      }));
    },
  }),
  {
    name: 'chat',
  },
);
