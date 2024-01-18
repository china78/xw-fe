import { useEffect, useState } from 'react';
import {
  MemoryRouter as Router,
  Routes,
  Route,
  useNavigate,
} from 'react-router-dom';
import { Button, Space } from 'antd';
import { FolderOpenOutlined, FileOutlined } from '@ant-design/icons';
import Editor from './pages/editor';
import './App.css';
import { Directory } from '../main/util';
import { useTreeStore } from './store/tree';

interface OutSideProps {
  setTree: (data: Directory[]) => void;
}
function OutSide(props: OutSideProps) {
  const { setTree } = props;
  const navigator = useNavigate();
  const treeStore = useTreeStore.getState();
  const [currentOpenType] = useTreeStore((state) => [state.currentOpenType]);

  interface Arg {
    key: string;
    title: string;
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function operateFile(arg: Arg[]) {
    const { key, title } = arg[0];
    treeStore.setFileName(title);
    treeStore.setActiveKey(key);
    window.electron.ipcRenderer.sendMessage('get-file-content', key);
    // 设置顶部标签
    const fileTab = {
      label: title,
      key,
    };
    treeStore.addTab(fileTab);
  }

  useEffect(() => {
    window.electron.ipcRenderer.on('project-structure', (arg: any) => {
      if (arg) {
        setTree(arg);
        // 打开文件就到此为止了，没有下面的操作，
        if (currentOpenType === 'file') {
          // 打开文件后的操作
          treeStore.clearAllTabs();
          operateFile(arg);
        }
        navigator('editor');
      }
    });
  }, []);

  const handleOpenFolder = () => {
    window.electron.ipcRenderer.sendMessage('open-folder-dialog');
    treeStore.setCurrentOpenType('folder');
  };

  const handleOpenFile = () => {
    // 每次打开都要清空缓存
    window.electron.ipcRenderer.sendMessage('open-file-dialog');
    treeStore.setCurrentOpenType('file');
  };

  return (
    <div className="openfbox">
      <Space>
        <Button
          type="default"
          ghost
          icon={<FolderOpenOutlined />}
          onClick={handleOpenFolder}
        >
          打开一个文件夹
        </Button>
        <Button
          type="primary"
          ghost
          icon={<FileOutlined />}
          onClick={handleOpenFile}
        >
          打开一个文件
        </Button>
      </Space>
    </div>
  );
}

export default function App() {
  const [directoryTree, setDirectoryTree] = useState<Directory[]>([]);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<OutSide setTree={setDirectoryTree} />} />
        <Route path="/editor" element={<Editor treeData={directoryTree} />} />
      </Routes>
    </Router>
  );
}
