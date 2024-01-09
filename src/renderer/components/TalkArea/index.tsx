import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RedditOutlined, UserOutlined, RedoOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import { selectChatHistory } from '../../store/chat/chatSlice';
import { ChatMessage, CreateChatCompletionRequest } from '../../types';
import './styles.css';

export default function TalkArea() {
  const [mouseEnt, setMouseEnt] = useState(false);
  const chatHistory: CreateChatCompletionRequest =
    useSelector(selectChatHistory);

  const reloadGptRes = () => {
    window.electron.ipcRenderer.sendMessage(
      'get-gpt-response',
      chatHistory.messages,
    );
  };

  const onMouseEnt = () => {
    if (mouseEnt) {
      return;
    }
    setMouseEnt(true);
  };

  const onMouseOut = () => {
    setMouseEnt(false);
  };

  return (
    <div className="talkbox">
      {chatHistory.messages.map((message: ChatMessage, index) => {
        return (
          <div
            key={index}
            className="contentBox"
            onMouseEnter={() => setMouseEnt(true)}
            onMouseLeave={() => setMouseEnt(false)}
          >
            <div className="itemBox">
              {message.role === 'assistant' ? (
                <RedditOutlined style={{ fontSize: 20, color: 'cadetblue' }} />
              ) : (
                <UserOutlined style={{ fontSize: 20, color: 'chocolate' }} />
              )}
              <div className="message">{message.content}</div>
            </div>
            {/* 细节操作：重发、复制当前 mouseEnt ? 'visible' : 'hidden' */}
            <div
              className="operates"
              style={{ visibility: mouseEnt ? 'visible' : 'hidden' }}
            >
              <Tooltip title="重新发送">
                <Button
                  size="small"
                  icon={<RedoOutlined />}
                  type="link"
                  onClick={reloadGptRes}
                />
              </Tooltip>
            </div>
          </div>
        );
      })}
    </div>
  );
}
