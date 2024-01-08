import TalkArea from '../TalkArea';
import WriteArea from '../WriteArea';
import './styles.css';

export default function ChatRoom() {
  return (
    <div className="chatBox">
      {/* 聊天区域 */}
      <TalkArea />
      {/* 发送聊天区域 */}
      <WriteArea />
    </div>
  );
}
