import TalkArea from '../TalkArea';
import WriteArea from '../WriteArea';
import './styles.css';

export default function ChatRoom() {
  return (
    <div className="flex flex-col h-full">
      {/* 聊天区域 */}
      <div className="flex-1 bg-gray-100 overflow-auto p-4">
        <TalkArea />
      </div>
      {/* 发送聊天区域 */}
      <div className="p-4 flex items-center">
        <WriteArea />
      </div>
    </div>
  );
}
