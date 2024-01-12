import { nanoid } from 'nanoid';
import { ChatMessage, CreateChatCompletionRequest } from '../types';
import { UserMessage } from '../types/UserMessage.type';
import { createPersistStore } from './store';

export interface ChatState {
  chatHistory: CreateChatCompletionRequest;
}

const DEFAULT_CHAT_TREE: ChatState = {
  chatHistory: {
    model: 'gpt-3.5-turbo',
    messages: [],
  },
};

export function createMessage(override: Partial<ChatMessage>): ChatMessage {
  return {
    id: nanoid(),
    date: new Date().toLocaleString(),
    role: 'user',
    content: '',
    ...override,
  };
}

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
    updateMessage(updater: (messages: ChatMessage[]) => ChatMessage[]) {
      set((state) => {
        const updatedMessages = updater(state.chatHistory.messages);
        return {
          ...state.chatHistory,
          messages: updatedMessages,
        };
      });
    },
    // 执行检查事件 或 用户说话的入口
    async onUserInput(userContent: string) {
      // 创建用户和机器消息
      const userMessage: ChatMessage = createMessage({
        role: 'user',
        content: userContent,
      });

      const botMessage: ChatMessage = createMessage({
        role: 'assistant',
        streaming: true,
        model: get().chatHistory.model,
      });

      // 保存用户和机器消息
      this.updateMessage((messages: ChatMessage[]) => {
        return messages.concat([userMessage, botMessage]);
      });
    },
  }),
  {
    name: 'chat',
  },
);
