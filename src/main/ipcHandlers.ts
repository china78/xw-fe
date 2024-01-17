import { ipcMain, dialog, BrowserWindow } from 'electron';
import path from 'path';
import fs from 'fs';
import { readDirectoryAsync } from './util';

// const openai = new OpenAI();

const setupIPCHandlers = (mainWindow: BrowserWindow) => {
  ipcMain.on('ipc-example', async (event, arg) => {
    const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
    console.log(msgTemplate(arg));
    event.reply('ipc-example', msgTemplate('pong'));
  });

  /**
   * 打开文件夹
   */
  ipcMain.on('open-folder-dialog', async () => {
    try {
      const result = await dialog.showOpenDialog(mainWindow!, {
        properties: ['openDirectory'],
      });
      if (!result.canceled && result.filePaths.length > 0) {
        const selectedDirectory = result.filePaths[0];
        const projectStructure = await readDirectoryAsync(selectedDirectory);
        const rootFileName = path.basename(selectedDirectory);
        const rootStructure = [
          {
            isRoot: true,
            key: selectedDirectory,
            title: rootFileName,
            children: projectStructure,
          },
        ];
        mainWindow?.webContents.send('project-structure', rootStructure);
      }
    } catch (error) {
      console.error(error);
    }
  });

  // 读取指定的文件路径
  ipcMain.on('get-file-content', (event, filePath) => {
    // 异步读取文件
    fs.readFile(filePath, 'utf-8', (err, content) => {
      if (err) {
        event.sender.send('file-content', null, { err: err.message });
      } else {
        event.sender.send('file-content', null, { content });
      }
    });
  });
};

export default setupIPCHandlers;
