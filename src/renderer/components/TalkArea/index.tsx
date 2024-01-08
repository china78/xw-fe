import { useSelector } from 'react-redux';
import { RedditOutlined, UserOutlined } from '@ant-design/icons';
import { selectChatHistory } from '../../store/chat/chatSlice';
import { ChatMessage, CreateChatCompletionRequest } from '../../types';
import './styles.css';

export default function TalkArea() {
  const chatHistory: CreateChatCompletionRequest =
    useSelector(selectChatHistory);
  console.log('chatHistory: ', chatHistory);

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
          </div>
        );
      })}
    </div>
  );
}
