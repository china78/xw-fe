import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { Button } from 'antd';
import { FolderOpenOutlined } from '@ant-design/icons';
import './App.css';

function OutSide() {
  window.electron.ipcRenderer.on('open-folder-dialog', (arg) => {
    console.log('arg: ', arg);
  });

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
      </Routes>
    </Router>
  );
}
