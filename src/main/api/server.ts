import express, { Express } from 'express';
import { Server } from 'http';
import cors from 'cors';

const GPT_API_BASE_URL = 'https://api.openai.com';

const app = express();
app.use(cors());
app.use(express.json());
const port = 3006;
let server: Server;

app.post('/api/openai/v1/chat/completions', async (req, res) => {
  console.log('服务被触发！ params', req.path);
  console.log('服务被触发！ params', req.headers);

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

  console.log('[Proxy] ', path);
  console.log('[Base Url]', baseUrl);

  const timeoutId = setTimeout(
    () => {
      controller.abort();
    },
    10 * 60 * 1000,
  );
  console.log('------Request Body-------:', req.body);

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
  };

  try {
    const openAIRes = await fetch(fetchUrl, fetchOptions);

    console.log('openAIRes: ', openAIRes);

    const newHeaders = new Headers(openAIRes.headers);
    newHeaders.delete('www-authenticate');
    newHeaders.set('X-Accel-Buffering', 'no');
    newHeaders.delete('content-encoding');

    // const responseBody = await openAIRes.json();

    // console.log('从openai返回的: ', responseBody);

    res.send({
      body: openAIRes.body,
      status: openAIRes.status,
      statusText: openAIRes.statusText,
      headers: newHeaders,
    });
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
