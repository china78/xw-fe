import axios from 'axios';

const GPT_API_BASE_URL = 'https://api.openai.com';
const OPENAI_API_KEY = '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';

const instance = axios.create({
  baseURL: GPT_API_BASE_URL,
  timeout: 10000,
  proxy: {
    protocol: 'http',
    host: '127.0.0.1',
    port: 7890,
  },
});

instance.interceptors.request.use(
  (config) => {
    const token = OPENAI_API_KEY;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers['Content-Type'] = 'application/json';
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  (response) => {
    console.log('instance.interceptors.response: ', response)
    // 对响应数据做点什么
    return response;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default instance;
