import {
  EventStreamContentType,
  fetchEventSource,
} from '@fortaine/fetch-event-source';
// eslint-disable-next-line
import { ChatOptions, LLMApi, getHeaders } from '../api';
import { prettyObject } from '../../utils/format';

export const REQUEST_TIMEOUT_MS = 60000;

const BASE_URL = 'http://localhost:3006/api/openai';
const CHAT_GPT_PATH = 'v1/chat/completions';

// eslint-disable-next-line import/prefer-default-export
export class ChatGPTApi implements LLMApi {
  // eslint-disable-next-line class-methods-use-this
  path(path: string): string {
    return [BASE_URL, path].join('/');
  }

  // eslint-disable-next-line class-methods-use-this
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

      const requestTimeoutId = setTimeout(
        () => controller.abort(),
        REQUEST_TIMEOUT_MS,
      );

      if (shouldStream) {
        let responseText = '';
        let remainText = '';
        let finished = false;

        // eslint-disable-next-line no-inner-declarations
        function animateResponseText() {
          if (finished || controller.signal.aborted) {
            responseText += remainText;
            console.log('[Response Animation] finished');
            return;
          }

          if (remainText.length > 0) {
            const fetchCount = Math.max(1, Math.round(remainText.length / 60));
            const fetchText = remainText.slice(0, fetchCount);
            responseText += fetchText;
            remainText = remainText.slice(fetchCount);
            console.log('-------- responseText: -------', responseText)
            console.log('-------- fetchText: -------', fetchText)
            options.onUpdate?.(responseText, fetchText);
          }

          requestAnimationFrame(animateResponseText);
        }

        // start animaion
        animateResponseText();

        const finish = () => {
          if (!finished) {
            finished = true;
            options.onFinish(responseText + remainText);
          }
        };

        controller.signal.onabort = finish;

        fetchEventSource(chatPath, {
          ...chatPayload,
          // eslint-disable-next-line consistent-return
          async onopen(res) {
            clearTimeout(requestTimeoutId);
            const contentType = res.headers.get('content-type');
            console.log(
              '[OpenAI] request response content type: ',
              contentType,
            );

            if (contentType?.startsWith('text/plain')) {
              responseText = await res.clone().text();
              return finish();
            }

            if (
              !res.ok ||
              !res.headers
                .get('content-type')
                ?.startsWith(EventStreamContentType) ||
              res.status !== 200
            ) {
              const responseTexts = [responseText];
              let extraInfo = await res.clone().text();
              try {
                const resJson = await res.clone().json();
                extraInfo = prettyObject(resJson);
              } catch (e) {
                console.log(e);
              }

              if (res.status === 401) {
                responseTexts.push('401');
              }

              if (extraInfo) {
                responseTexts.push(extraInfo);
              }

              responseText = responseTexts.join('\n\n');

              return finish();
            }
          },
          // eslint-disable-next-line consistent-return
          onmessage(msg) {
            console.log('---------msg----------: ', msg);
            if (msg.data === '[DONE]' || finished) {
              return finish();
            }
            const text = msg.data;
            try {
              const json = JSON.parse(text) as {
                choices: Array<{
                  delta: {
                    content: string;
                  };
                }>;
              };
              const delta = json.choices[0]?.delta?.content;
              if (delta) {
                remainText += delta;
              }
            } catch (e) {
              console.error('[Request] parse error', text);
            }
          },
          onclose() {
            finish();
          },
          onerror(e) {
            options.onError?.(e);
            throw e;
          },
          openWhenHidden: true,
        });
      } else {
        const res = await fetch(chatPath, chatPayload);
        clearTimeout(requestTimeoutId);

        const resJson = await res.json();
        const message = this.extractMessage(resJson);
        options.onFinish(message);
      }
    } catch (e) {
      console.log('[Request] failed to make a chat request', e);
      options.onError?.(e as Error);
    }
  }
}
