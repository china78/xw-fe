import { Tooltip, Button } from 'antd';
import { FolderOpenTwoTone, CalendarTwoTone } from '@ant-design/icons';
import './styles.css';

export default function Bighandles() {
  return (
    <div className="bighandleContainer">
      <Tooltip title="分析整体项目">
        <Button
          style={{ backgroundColor: '#252526' }}
          type="default"
          size="middle"
          className="handleBox"
          icon={<FolderOpenTwoTone twoToneColor="#d9d9d9" />}
        />
      </Tooltip>
      <Tooltip title="新需求">
        <Button
          style={{ backgroundColor: '#252526' }}
          type="default"
          size="middle"
          className="handleBox"
          icon={<CalendarTwoTone twoToneColor="#d9d9d9" />}
        />
      </Tooltip>
    </div>
  );
}
