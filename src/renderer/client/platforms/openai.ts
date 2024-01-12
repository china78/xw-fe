import { ChatOptions, LLMApi, getHeaders } from '../api';

const BASE_URL = 'https://api.openai.com';
const CHAT_GPT_PATH = '/v1/chat/completions';

// eslint-disable-next-line import/prefer-default-export
export class ChatGPTApi implements LLMApi {
  path(path: string): string {
    return [BASE_URL, path].join('/');
  }

  extractMessage(res: any) {
    return res.choices?.at(0)?.message?.content ?? '';
  }

  async chat(options: ChatOptions) {
    const messages = options.messages.map((v) => ({
      role: v.role,
      content: v.content,
    }));

    const requestPayload = {
      messages,
      stream: options.config.stream,
      model: options.config.model,
      // temperature: modelConfig.temperature,
      // presence_penalty: modelConfig.presence_penalty,
      // frequency_penalty: modelConfig.frequency_penalty,
      // top_p: modelConfig.top_p,
    };
    console.log('[Request] openai payload: ', requestPayload);

    const shouldStream = !!options.config.stream;
    const controller = new AbortController();
    options.onController?.(controller);

    try {
      const chatPath = this.path(CHAT_GPT_PATH);
      const chatPayload = {
        method: 'POST',
        body: JSON.stringify(requestPayload),
        signal: controller.signal,
        headers: getHeaders(),
      };


    } catch(e) {
      console.log("[Request] failed to make a chat request", e);
      options.onError?.(e as Error);
    }
  }
}
