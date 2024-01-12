// import { AssistantMessage } from './AssistantMessage.type';
// import { FunctionMessage } from './FunctionMessage.type';
// import { SystemMessage } from './SystemMessage.type';
// import { ToolMessage } from './ToolMessage.type';
// import { UserMessage } from './UserMessage.type';

// 联合类型，包含所有可能的消息类型
// export type ChatMessage =
//   | SystemMessage
//   | UserMessage
//   | AssistantMessage
//   | ToolMessage
//   | FunctionMessage;

export const ROLES = ['system', 'user', 'assistant'] as const;

export type MessageRole = (typeof ROLES)[number];

export interface RequestMessage {
  role: MessageRole;
  content: string;
}

export type ChatMessage = RequestMessage & {
  date: string;
  streaming?: boolean;
  isError?: boolean;
  id: string;
  model?: string;
};

// JSON Schema 描述接口
export interface JSONSchema {
  type: 'object';
  properties: {
    [key: string]: any;
  };
}

// 工具描述接口
export interface ToolDescription {
  type: 'function';
  function: {
    description?: string;
    name: string;
    parameters: JSONSchema;
  };
}

// 定义请求体的结构
export interface CreateChatCompletionRequest {
  model: string; // 使用的模型ID
  messages: Array<ChatMessage>; // 包含迄今为止对话的消息列表
  frequency_penalty?: number; // 惩罚率 （-2.0 - 2.0）
  logit_bias?: { [token: number]: number }; // 逻辑偏差
  max_tokens?: number; // 聊天完成时生成的最大令牌数
  n?: number; // 为每条输入消息生成多少个聊天完成选项
  presence_penalty?: number; // 存在惩罚
  response_format?: 'text' | { type: 'json_object' }; // 指定模型必须输出的格式的对象
  seed?: number; // 种子
  stop?: string | string[]; // API 将停止生成更多令牌的最多4个序列
  stream?: boolean; // 如果设置，将发送部分消息增量
  temperature?: number; // 采样温度（0-2）
  top_p?: number; // 温度采样的替代方法称为核采样
  tools?: ToolDescription[]; // 模型可能调用的工具列表
  tool_choice?:
    | 'none'
    | 'auto'
    | { type: 'function'; function: { name: string } }; // 控制模型调用哪个函数（如果有）
  user?: string; // 代表您的最终用户的唯一标识符，可以帮助 OpenAI 监控和检测滥用行为
}
