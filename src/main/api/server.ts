import express, { Express } from 'express';
import { Server } from 'http';

const app = express();
const port = 3000;
let server: Server;

app.get('/api/v1/chat/completions', (req, res) => {
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
