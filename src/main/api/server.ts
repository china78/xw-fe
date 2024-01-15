import express, { Express } from 'express';
import { Server } from 'http';
import cors from 'cors';

const app = express();
app.use(cors());
const port = 3006;
let server: Server;

app.post('/api/openai/v1/chat/completions', (req, res) => {
  console.log('服务被触发！');
  res.send('IM GPT!');
});

// eslint-disable-next-line import/prefer-default-export
export function useServer(
  callback: (app: Express, server: Server, port: number) => void,
) {
  const startListen = () => {
    server = app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  };
  if (!server) {
    startListen();
  }
  callback(app, server, port);
}
