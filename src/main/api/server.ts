import express, { Express } from 'express';
import { Server } from 'http';
import cors from 'cors';
import { HttpProxyAgent } from 'http-proxy-agent';
import fetch from 'electron-fetch';

const GPT_API_BASE_URL = 'https://api.openai.com';
const agent = new HttpProxyAgent('http://127.0.0.1:7890');

const app = express();
app.use(cors());
app.use(express.json());
const port = 3006;
let server: Server;

app.post('/api/openai/v1/chat/completions', async (req, res) => {
  const controller = new AbortController();
  const authValue = req.headers ? req.headers.authorization ?? '' : '';
  const authHeaderName = 'Authorization';

  const path = `${req.path}`.replaceAll('/api/openai/', '');

  let baseUrl = GPT_API_BASE_URL;
  if (!baseUrl.startsWith('http')) {
    baseUrl = `https://${baseUrl}`;
  }

  if (baseUrl.endsWith('/')) {
    baseUrl = baseUrl.slice(0, -1);
  }

  const timeoutId = setTimeout(
    () => {
      controller.abort();
    },
    10 * 60 * 1000,
  );

  const fetchUrl = `${baseUrl}/${path}`;
  const fetchOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      [authHeaderName]: authValue,
    },
    method: req.method,
    body: JSON.stringify(req.body),
    redirect: 'manual',
    duplex: 'half',
    signal: controller.signal,
    agent,
  };

  try {
    const response = await fetch(fetchUrl, fetchOptions);

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    // eslint-disable-next-line no-restricted-syntax
    for await (const chunk of response.body) {
      res.write(chunk.toString());
    }
  } finally {
    clearTimeout(timeoutId);
  }
});

// eslint-disable-next-line import/prefer-default-export
export function useServer(
  callback: (app: Express, server: Server, port: number) => void,
) {
  const startListen = () => {
    server = app.listen(port, () => {
      // eslint-disable-next-line no-console
      console.log(`app listening on port ${port}`);
    });
  };
  if (!server) {
    startListen();
  }
  callback(app, server, port);
}
