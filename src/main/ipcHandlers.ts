import { ipcMain, dialog, BrowserWindow } from 'electron';
import path from 'path';
import fs from 'fs';
import { Readable } from 'node:stream';
import { readDirectoryAsync } from './util';
import { fetchGPTResponse } from './api';
import { UserMessage } from '../renderer/types/UserMessage.type';

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

  ipcMain.on(
    'get-gpt-response',
    async (event, request: { messages: UserMessage; model: string }) => {
      console.log('渲染进程传递来的参数', request);
      try {
        const gptResponse = await fetchGPTResponse(request);
        // 直接返回
        // event.sender.send('gpt-response', null, { data: gptResponse });

        const { content } = gptResponse.choices[0].message;
        // 将字符串转换为字符数组
        const charArray = content.split('');
        // 定义分块大小
        const chunkSize = 50;
        // 创建可读流，将数据分块传送
        const readable = Readable.from(charArray, { objectMode: true });
        const sendDataChunk = () => {
          const chunk = readable.read(chunkSize);
          if (chunk) {
            console.log('--chunk--: ', chunk);
            event.sender.send('gpt-response-chunk', null, { chunk });
            setImmediate(sendDataChunk); // 使用 setImmediate 以确保异步执行
          } else {
            event.sender.send('gpt-response-end');
          }
        };

        // 开始分块传送
        setImmediate(sendDataChunk);
      } catch (error) {
        event.sender.send('gpt-response', null, { error: error.message });
      }
    },
  );
};

export default setupIPCHandlers;
