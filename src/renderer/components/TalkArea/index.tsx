import {
  RedditOutlined,
  UserOutlined,
  RedoOutlined,
  PauseOutlined,
} from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import { ChatMessage } from '../../types';
import './styles.css';
import { useChatStore } from '../../store/chat';
import { Markdown } from '../Markdown';

export default function TalkArea() {
  const chatStore = useChatStore.getState();
  const [chatHistory] = useChatStore((state) => [state.chatHistory]);

  const reloadGptRes = () => {
    console.log('reload');
  };

  function handlePause() {
    chatStore.abortController();
  }

  // console.log('controller?.signal: ', controller?.signal);

  return (
    <div className="talkbox">
      {chatHistory.messages.slice(1).map((message: ChatMessage) => {
        const isUser = message.role === 'user';
        return (
          <div key={message.id} className="contentBox">
            <div className="itemBox">
              {message.role === 'assistant' ? (
                <RedditOutlined style={{ fontSize: 20, color: 'cadetblue' }} />
              ) : (
                <UserOutlined style={{ fontSize: 20, color: 'chocolate' }} />
              )}
              <div className="message">
                <Markdown
                  content={message.content}
                  loading={
                    message.streaming && message.content.length === 0 && !isUser
                  }
                />
              </div>
            </div>
            {/* 细节操作：重发、复制当前 mouseEnt ? 'visible' : 'hidden' */}
            <div className="operates">
              <Tooltip title="重新发送">
                <Button
                  color="#404040"
                  icon={<RedoOutlined />}
                  type="link"
                  onClick={reloadGptRes}
                />
              </Tooltip>
              {message.streaming && (
                <Tooltip title="暂停">
                  <Button
                    color="#404040"
                    icon={<PauseOutlined />}
                    type="link"
                    onClick={() => handlePause()}
                  />
                </Tooltip>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
