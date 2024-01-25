import { Tooltip, Button } from 'antd';
import { FolderOpenTwoTone, CalendarTwoTone } from '@ant-design/icons';
import './styles.css';
import { useChatStore, useTreeStore } from '../../store';

interface Props {
  setOpenDraw: (oepn: boolean) => void;
}
export default function Bighandles(props: Props) {
  const { setOpenDraw } = props;
  const treeStore = useTreeStore.getState();
  const chatStore = useChatStore.getState();

  window.electron.ipcRenderer.on('pjp-instance', (_event, args: any) => {
    const { err, metadataJson, compressedBlocks } = args;
    if (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    } else {
      // console.log('-- pjp.metadataJson: --', metadataJson);
      // console.log('-- pjp.compressedBlocks: --', compressedBlocks);
      // if (metadataJson && compressedBlocks) {
      //   const prompt = `
      //   请分析整个项目,\n
      //   项目的文件结构关系是这样的-${metadataJson},\n
      //   所有的文件内容被转化为Buffer并压缩在了这里-${compressedBlocks},\n
      //   是否可以直接解码解压二进制内容，并分析内容，是否需要我提供明确的解码方法\n
      //   `;

      //   chatStore.onUserInput(prompt);
      //   setOpenDraw(true);
      // }
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
