import axios from 'axios';

// 创建 axios 实例
const instance = axios.create({
  baseURL: process.env.BASE_URL || '/',
  timeout: 10000,
  proxy: {
    protocol: 'http',
    host: '127.0.0.1',
    port: 7890,
  },
});

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 在发送请求前做些什么，例如添加认证头部信息
    const token = process.env.OPENAI_API_KEY; // 假设 api-key 存储在环境变量中
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error);
  },
);

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    return response;
  },
  (error) => {
    // 对响应错误做点什么
    // 这里可以根据需求进行错误处理，比如跳转到错误页面或者弹出一个错误提示
    if (error.response) {
      // 请求已发出，服务器用状态码响应
      console.error('Error status', error.response.status);
    } else if (error.request) {
      // 请求已发出，但没有收到响应
      console.error('Error request', error.request);
    } else {
      // 发生了其他问题，比如设置请求时发生错误
      console.error('Error', error.message);
    }
    return Promise.reject(error);
  },
);

export default instance;
