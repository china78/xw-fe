import { RedditOutlined, UserOutlined, RedoOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import { ChatMessage } from '../../types';
import './styles.css';
import { useChatStore } from '../../store/chat';

export default function TalkArea() {
  const [chatHistory] = useChatStore((state) => [state.chatHistory]);

  const reloadGptRes = () => {
    window.electron.ipcRenderer.sendMessage('get-gpt-response', chatHistory);
  };

  return (
    <div className="talkbox">
      {chatHistory.messages.map((message: ChatMessage, index) => {
        return (
          <div key={index} className="contentBox">
            <div className="itemBox">
              {message.role === 'assistant' ? (
                <RedditOutlined style={{ fontSize: 20, color: 'cadetblue' }} />
              ) : (
                <UserOutlined style={{ fontSize: 20, color: 'chocolate' }} />
              )}
              <div className="message">{message.content}</div>
            </div>
            {/* 细节操作：重发、复制当前 mouseEnt ? 'visible' : 'hidden' */}
            <div className="operates">
              <Tooltip title="重新发送">
                <Button
                  color="#404040"
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
