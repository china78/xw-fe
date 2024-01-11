/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/button-has-type */
import React, { useState, useEffect, useRef } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
import { Button, Upload } from 'antd';
import { UploadOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { UserMessage } from '../../types/UserMessage.type';
import './styles.css';
import { useChatStore } from '../../store/chat';

export default function WriteArea() {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const chatStore = useChatStore.getState();
  const [chatHistory] = useChatStore((state) => [state.chatHistory]);

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
      target!.style.height = 'auto'; // 重置高度以获得正确的滚动高度
      const { scrollHeight } = target;
      target.style.height = scrollHeight > 200 ? '200px' : `${scrollHeight}px`;
    }
    if (event.target.value === '') {
      target!.style.height = 'auto'; // 重置高度以获得正确的滚动高度
    }
  };

  const handleSend = () => {
    if (text.trim()) {
      // 创建用户消息对象
      const userMessage: UserMessage = {
        role: 'user',
        content: text,
      };
      console.log('----- userMessage ----: ', userMessage);

      if (userMessage) {
        chatStore.addUserMessage(userMessage);
      }

      console.log(
        '----- 注意！！！ 这里没有取到 追问 最新的数据 ！！！ ----',
        chatHistory,
      );
      window.electron.ipcRenderer.sendMessage('get-gpt-response', chatHistory);
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
    <div className="writeBox">
      {/* 文件上传按钮 */}
      <Upload>
        <Button className="btnc" icon={<UploadOutlined />} />
      </Upload>
      {/* 文本输入框 */}
      <textarea
        ref={textareaRef}
        rows={1}
        placeholder="输入消息..."
        value={text}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className="textarea focus input"
        style={{ maxHeight: 200 }}
      />

      {/* 发送按钮 */}
      <Button
        className="btnc"
        icon={<ArrowUpOutlined />}
        onClick={handleSend}
      />
    </div>
  );
}
