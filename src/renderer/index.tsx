import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/highlight.scss';
import './styles/markdown.scss';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(<App />);

// calling IPC exposed from preload script
window.electron.ipcRenderer.once('ipc-example', (arg) => {
  // eslint-disable-next-line no-console
  console.log(arg);
});
window.electron.ipcRenderer.sendMessage('ipc-example', ['ping']);

window.electron.ipcRenderer.once('express-info', (args: any) => {
  // eslint-disable-next-line no-console
  console.log('server-port: ', args);
});
