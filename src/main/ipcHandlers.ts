import { ipcMain, dialog, BrowserWindow } from 'electron';
import path from 'path';
import fs from 'fs';
import { readDirectoryAsync } from './util';
import PJParser from './PJParser';

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
            currentOpenType: 'folder',
          },
        ];
        mainWindow?.webContents.send('init-tree-structure', rootStructure);
      }
    } catch (error) {
      console.error(error);
    }
  });

  // 文件
  ipcMain.on('open-file-dialog', async () => {
    try {
      const result = await dialog.showOpenDialog(mainWindow!, {
        properties: ['openFile'],
      });
      if (!result.canceled && result.filePaths.length > 0) {
        const selectedFilePath = result.filePaths[0];
        const fileName = path.basename(selectedFilePath);
        // 处理打开文件的逻辑...
        const fileStructure = [
          {
            key: selectedFilePath,
            title: fileName,
            isLeaf: true,
            isRoot: true,
            currentOpenType: 'file',
          },
        ];
        mainWindow?.webContents.send('init-tree-structure', fileStructure);
      }
    } catch (error) {
      console.error(error);
    }
  });

  // 读取指定的文件路径
  ipcMain.on('get-file-content', (event, filePath) => {
    fs.stat(filePath, (err, stats) => {
      if (err) {
        event.sender.send('file-content', null, { err: err.message });
      } else if (stats.isFile()) {
        // 异步读取文件
        fs.readFile(filePath, 'utf-8', (err, content) => {
          if (err) {
            event.sender.send('file-content', null, { err: err.message });
          } else {
            event.sender.send('file-content', null, { content });
          }
        });
      }
    });
  });

  let pjp: PJParser;
  ipcMain.on('init-pjparser', (event, dirPath: string) => {
    if (!pjp) {
      pjp = new PJParser(dirPath);
    }
    console.log('pjp.metadataJson: ', pjp.metadataJson);
    console.log('pjp.compressedBlocks: ', pjp.compressedBlocks);
    // console.log('什么情况');
    const { metadataJson, compressedBlocks } = pjp;
    event.sender.send('pjp-instance', null, { metadataJson, compressedBlocks });
  });
};

export default setupIPCHandlers;
