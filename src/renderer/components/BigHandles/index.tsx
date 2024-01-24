import { Tooltip, Button } from 'antd';
import { FolderOpenTwoTone, CalendarTwoTone } from '@ant-design/icons';
import './styles.css';
import { useTreeStore } from '../../store';

export default function Bighandles() {
  const treeStore = useTreeStore.getState();

  window.electron.ipcRenderer.on('pjp-instance', (_event, args: any) => {
    console.log('args', args);
    const { err, pjp } = args;
    if (err) {
      console.error(err);
    } else {
      console.log(pjp.metadataList);
      console.log(pjp.compressedBlocks);
    }
  });

  function handleAnalyseProject() {
    if (treeStore.rootDirPath) {
      window.electron.ipcRenderer.sendMessage(
        'init-pjparser',
        treeStore.rootDirPath,
      );
    }
  }

  return (
    <div className="bighandleContainer">
      <Tooltip title="分析整体项目">
        <Button
          style={{ backgroundColor: '#252526' }}
          type="default"
          size="middle"
          className="handleBox"
          icon={<FolderOpenTwoTone twoToneColor="#d9d9d9" />}
          onClick={() => handleAnalyseProject()}
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
