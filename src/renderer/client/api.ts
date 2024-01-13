// eslint-disable-next-line max-classes-per-file
import { ChatGPTApi } from './platforms/openai';
import { LLMConfig, MessageRole } from '../types';

export enum ModelProvider {
  GPT = 'GPT',
  GeminiPro = 'GeminiPro',
}

export interface RequestMessage {
  role: MessageRole;
  content: string;
}

export interface ChatOptions {
  messages: RequestMessage[];
  config: LLMConfig;

  onUpdate?: (message: string, chunk: string) => void;
  onFinish: (message: string) => void;
  onError?: (err: Error) => void;
  onController?: (controller: AbortController) => void;
}

export abstract class LLMApi {
  abstract chat(options: ChatOptions): Promise<void>;
}

export class ClientApi {
  public llm: LLMApi | undefined;

  constructor(provider: ModelProvider = ModelProvider.GPT) {
    if (provider === ModelProvider.GPT) {
      this.llm = new ChatGPTApi();
    }
  }
}

const OPENAI_API_KEY = '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';
export function getHeaders() {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-requested-with': 'XMLHttpRequest',
    Accept: 'application/json',
  };

  const authHeader = 'Authorization';
  const apiKey = OPENAI_API_KEY;

  const makeBearer = (s: string) => `"Bearer "${s.trim()}`;
  const validString = (x: string) => x && x.length > 0;

  if (validString(apiKey)) {
    headers[authHeader] = makeBearer(apiKey);
  }

  return headers;
}
