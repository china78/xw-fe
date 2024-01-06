import axios from './axios';

const GPT_API_BASE_URL = 'https://example.com/gpt'; // 替换成实际的 GPT API 地址

// eslint-disable-next-line import/prefer-default-export
export const fetchGPTResponse = async (inputText: string): Promise<string> => {
  try {
    const response = await axios.post(`${GPT_API_BASE_URL}/generate`, {
      input: inputText,
    });

    // 返回从 GPT API 获取的响应
    return response.data.result;
  } catch (error) {
    console.error('Error fetching GPT response:', error.message);
    throw error;
  }
};
