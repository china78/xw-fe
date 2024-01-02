import { useEffect, useState } from 'react';
import {
  MemoryRouter as Router,
  Routes,
  Route,
  useNavigate,
} from 'react-router-dom';
import { Button } from 'antd';
import { FolderOpenOutlined } from '@ant-design/icons';
import Editor from './pages/Editor';
import './App.css';
import { Directory } from '../main/util';

interface OutSideProps {
  setTree: (data: Directory[]) => void;
}
function OutSide(props: OutSideProps) {
  const { setTree } = props;
  const navigator = useNavigate();

  useEffect(() => {
    window.electron.ipcRenderer.on('project-structure', (arg) => {
      console.log('arg: ', arg);
      if (arg) {
        setTree(arg);
        navigator('editor');
      }
    });
  }, [navigator, setTree]);

  const handleOpenFolder = () => {
    window.electron.ipcRenderer.sendMessage('open-folder-dialog');
  };

  return (
    <div className="openfbox">
      <Button
        type="default"
        icon={<FolderOpenOutlined />}
        onClick={handleOpenFolder}
      >
        打开一个文件或文件夹
      </Button>
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
