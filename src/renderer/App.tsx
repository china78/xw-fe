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
import { getExtension } from './utils/format';

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
    currentOpenType: string;
    isRoot?: boolean;
    children?: string;
    isLeaf?: boolean;
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function operateFile(arg: Arg[]) {
    const { key, title } = arg[0];
    treeStore.setFileName(title);
    treeStore.setActiveKey(key);
    window.electron.ipcRenderer.sendMessage('get-file-content', key);
  }

  function preClean() {
    treeStore.clearAllTabs();
  }

  useEffect(() => {
    window.electron.ipcRenderer.on('init-tree-structure', (arg: any) => {
      if (arg) {
        preClean();
        treeStore.setCurrentOpenType(arg[0].currentOpenType);
        setTree(arg);
        if (currentOpenType === 'file') {
          operateFile(arg);
          // 要设置文件后缀
          const fileExtension = getExtension(arg[0].key);
          treeStore.setFileExtension(fileExtension);
        }
        navigator('editor');
      }
    });
  }, []);

  // 预先注册点击事件，以备当文件被点击，显示对应的代码内容
  useEffect(() => {
    window.electron.ipcRenderer.on('file-content', (_event, args: any) => {
      const { err, content } = args;
      if (err) {
        console.error(err);
      } else {
        treeStore.setFileContent(content);
      }
    });
  }, [treeStore]);

  const handleOpenFolder = () => {
    console.log('打开文件夹')
    window.electron.ipcRenderer.sendMessage('open-folder-dialog');
  };

  const handleOpenFile = () => {
    console.log('打开文件')
    window.electron.ipcRenderer.sendMessage('open-file-dialog');
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
