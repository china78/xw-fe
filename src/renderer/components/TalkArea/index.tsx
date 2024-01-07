import { useSelector } from 'react-redux';
import { selectChatHistory } from '../../store/chat/chatSlice';
import { ChatMessage, CreateChatCompletionRequest } from '../../types';
import './styles.css';

export default function TalkArea() {
  const chatHistory: CreateChatCompletionRequest =
    useSelector(selectChatHistory);
  console.log('chatHistory: ', chatHistory);

  return (
    <div className="flex flex-col space-y-2 p-4 overflow-auto">
      {chatHistory.messages.map((message: ChatMessage) => {
        return (
          <div
            key={message.id}
            className={`flex items-end ${
              message.role === 'assistant' ? 'justify-start' : 'justify-end'
            }`}
          >
            <div className="max-w-xs md:max-w-md bg-gray-200 text-gray-700 p-2 rounded-lg">
              <p className="text-sm">{message.content}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
