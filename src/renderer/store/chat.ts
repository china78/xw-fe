import { nanoid } from 'nanoid';
import { ChatMessage, CreateChatCompletionRequest } from '../types';
import { UserMessage } from '../types/UserMessage.type';
import { createPersistStore } from './store';
import { ClientApi, ModelProvider } from '../client/api';

type ExtractType = {
  lastUpdate: number;
  stat: {
    tokenCount: number;
    wordCount: number;
    charCount: number;
  };
};
export interface ChatState {
  chatHistory: CreateChatCompletionRequest & ExtractType;
}

const DEFAULT_CHAT_TREE: ChatState = {
  chatHistory: {
    model: 'gpt-3.5-turbo',
    messages: [],
    lastUpdate: Date.now(),
    stat: {
      tokenCount: 0,
      wordCount: 0,
      charCount: 0,
    },
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
  (set, _get) => {
    function get() {
      return {
        ..._get(),
        ...methods,
      };
    }
    const methods = {
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
      updateStat(message: ChatMessage) {
        set((state) => {
          const newCharCount =
            state.chatHistory.stat.charCount + message.content.length;
          return {
            ...state.chatHistory,
            stat: {
              ...state.chatHistory.stat,
              charCount: newCharCount,
            },
          };
        });
      },
      onNewMessage(message: ChatMessage) {
        get().updateMessage((messages: ChatMessage[]) => {
          return messages.concat();
        });
        get().updateStat(message);
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

        const recentMessages = get().chatHistory.messages.concat(userMessage);

        // 保存用户和机器消息
        get().updateMessage((messages: ChatMessage[]) => {
          return messages.concat([userMessage, botMessage]);
        });

        let api: ClientApi;
        if (get().chatHistory.model === 'GPT') {
          api = new ClientApi(ModelProvider.GPT);
        }

        api.llm.chat({
          messages: recentMessages,
          config: { model: get().chatHistory.model, stream: true }, // 这里暂时先不加 其他 modelConfig
          onUpdate(message) {
            botMessage.streaming = true;
            if (message) {
              botMessage.content = message;
            }
            get().updateMessage((messages) => {
              return messages.concat();
            });
          },
          onFinish(message) {
            botMessage.streaming = false;
            if (message) {
              botMessage.content = message;
            }
            get().onNewMessage(botMessage);
          },
          onError(err) {
            console.log(err);
          },
          onController(controller) {
            console.log(controller);
          },
        });
      },
    };

    return methods;
  },
  {
    name: 'chat',
  },
);
