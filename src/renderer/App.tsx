import { useEffect } from 'react';
import {
  MemoryRouter as Router,
  Routes,
  Route,
  useNavigate,
} from 'react-router-dom';
import { Button } from 'antd';
import { FolderOpenOutlined } from '@ant-design/icons';
import Editor from './pages/editor';
import './App.css';

function OutSide() {
  const navigator = useNavigate();

  useEffect(() => {
    window.electron.ipcRenderer.on('open-folder-dialog', (arg) => {
      console.log('arg: ', arg);
      if (arg) {
        navigator('editor');
      }
    });
  }, [navigator]);

  const handleOpenFolder = () => {
    window.electron.ipcRenderer.sendMessage('open-folder-dialog');
  };

  return (
    <div>
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
  return (
    <Router>
      <Routes>
        <Route path="/" element={<OutSide />} />
        <Route path="/editor" element={<Editor />} />
      </Routes>
    </Router>
  );
}
