import axios from './axios';

interface RequestParams {
  messages: string;
  model: string;
}
// eslint-disable-next-line import/prefer-default-export
export const fetchGPTResponse = async (
  requestParams: RequestParams,
): Promise<string> => {
  const { messages, model } = requestParams;
  try {
    const response = await axios.post(`/v1/chat/completions`, {
      messages,
      model,
      // ...其他参数
    });

    // 返回从 GPT API 获取的响应
    return response.data.result;
  } catch (error) {
    console.error('Error fetching GPT response:', error.message);
    throw error;
  }
};
