import { ToolCall } from './ToolFunction.type';

export interface ChatCompletionChoice {
  index: number; // 每条聊天的索引
  message: {
    // 模型生成的聊天消息
    role: string; // 此消息的作者的角色 'user' | 'assistant' | 'tool' | 'function' | 'system'
    content: string | null; // 消息内容
    tool_calls?: ToolCall[]; // 模型生成的工具调用，例如函数调用
  };
  finish_reason:
    | 'stop'
    | 'length'
    | 'content_filter'
    | 'tool_calls'
    | 'function_call'
    | null; // 聊天停止的原因
}

export interface ChatCompletionUsage {
  prompt_tokens: number; // 提示数
  completion_tokens: number; // 完成数
  total_tokens: number; // 总数（提示数 + 完成数）
}

export interface ChatCompletionResponse {
  id: string; // 聊天完成的唯一标识符
  object: 'chat.completion' | 'chat.completion.chunk'; // 对象类型，始终为 chat.completion
  created: number; // 创建聊天完成时的 Unix 时间戳（以秒为单位）
  model: string; // 用于聊天完成的模型
  system_fingerprint: string; // 系统指纹-模型运行时使用的后端配置，可与种子请求参数结合使用
  choices: ChatCompletionChoice[]; // 聊天完成的列表
  usage: ChatCompletionUsage; // 完成请求的使用统计
}
