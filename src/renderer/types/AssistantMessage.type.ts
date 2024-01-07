import { ToolCall } from './ToolFunction.type';

export interface AssistantMessage {
  content: string | null; // 助手消息的内容
  role: 'assistant'; // 消息作者的角色
  name?: string; // 参与者的可选名称
  tool_calls?: ToolCall[]; // 由模型生成的工具调用数组
}
