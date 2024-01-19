/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/button-has-type */
import React, { useState, useEffect, useRef } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
import { Button, Upload } from 'antd';
import { UploadOutlined, ArrowUpOutlined } from '@ant-design/icons';
import './styles.css';
import { useChatStore } from '../../store/chat';

export default function WriteArea() {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const chatStore = useChatStore.getState();

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
      target.style.height = scrollHeight > 300 ? '300px' : `${scrollHeight}px`;
    }
    if (event.target.value === '') {
      target!.style.height = 'auto'; // 重置高度以获得正确的滚动高度
    }
  };

  const handleSend = () => {
    if (text.trim()) {
      // 发消息就发消息，纯粹一点，别整那些乱逻辑
      // 整合数据结构的事不在这层做，在仓库里用单独的方法做
      // 创建用户消息对象
      // const userMessage: UserMessage = {
      //   role: 'user',
      //   content: text,
      // };
      console.log('----- userMessage ----: ', text);

      // if (userMessage) {
      //   chatStore.addUserMessage(userMessage);
      // }

      // const requestParams = {
      //   messages: [...chatHistory.messages, userMessage],
      //   model: chatHistory.model,
      // };
      // 以往这里是调主进程，现在走仓库的方法
      // window.electron.ipcRenderer.sendMessage(
      //   'get-gpt-response',
      //   requestParams,
      // );
      chatStore.onUserInput(text);

      setText(''); // 清空消息
      // 重置高度为单行输入的高度
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  // const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
  //   if (event.key === 'Enter' && !event.shiftKey) {
  //     event.preventDefault();
  //     handleSend();
  //   }
  // };

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
        // onKeyDown={handleKeyDown}
        className="textarea focus input"
        style={{ maxHeight: 300 }}
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
