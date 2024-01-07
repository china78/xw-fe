/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/button-has-type */
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { CreateChatCompletionRequest } from '../../types';
import { UserMessage } from '../../types/UserMessage.type';
import { addUserMessage } from '../../store/chat/chatSlice';

export default function WriteArea() {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);

    // 如果有ref引用并且实际的高度大于1行的高度，更新高度
    const target = textareaRef.current;
    if (target) {
      target.style.height = 'auto'; // 重置高度以获得正确的滚动高度
      const { scrollHeight } = target;
      target.style.height = scrollHeight > 200 ? '200px' : `${scrollHeight}px`;
    }
  };

  const data: CreateChatCompletionRequest = {
    messages: [{ role: 'user', content: text }],
    model: 'gpt-3.5-turbo',
    // stream: true,
  };

  const handleSend = () => {
    if (text.trim()) {
      // 创建用户消息对象
      const userMessage: UserMessage = {
        role: 'user',
        content: text,
      };

      // 更新 Redux 状态以包含用户消息
      dispatch(addUserMessage(userMessage));

      // 准备发送到 OpenAI 的请求数据
      const requestData: CreateChatCompletionRequest = {
        model: 'gpt-3.5-turbo',
        messages: [userMessage],
      };

      // dispatch(createChatCompletionAsync(requestData));
      // 给主进程发消息
      // 发送消息的逻辑

      setText(''); // 清空消息
      // 重置高度为单行输入的高度
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-center bg-white p-2 rounded-lg shadow w-full">
      {/* 文件上传按钮 */}
      <label
        htmlFor="file-upload"
        className="cursor-pointer p-2 hover:bg-gray-200 rounded-full transition duration-150 ease-in-out"
      >
        {/* <PaperClipIcon className="h-6 w-6 text-gray-500" /> */}
        ⬅️
      </label>
      <input id="file-upload" type="file" className="hidden" />

      {/* 文本输入框 */}
      <textarea
        ref={textareaRef}
        rows={1}
        placeholder="输入消息..."
        value={text}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className="flex-1 bg-transparent px-4 py-2 mx-2 resize-none overflow-hidden focus:outline-none"
        style={{ maxHeight: '200px' }}
      />

      {/* 发送按钮 */}
      <button
        onClick={handleSend}
        className="p-2 hover:bg-blue-600 rounded-full transition duration-150 ease-in-out"
      >
        {/* <ArrowRightIcon className="h-6 w-6 text-blue-500 hover:text-white" /> */}
        ➡️
      </button>
    </div>
  );
}
