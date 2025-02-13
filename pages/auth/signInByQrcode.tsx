import React, { useEffect, useState } from 'react';
import { useEffectOnce } from 'usehooks-ts';
import { QRCodeSVG } from 'qrcode.react';
import jwtDecode from 'jwt-decode';
import { DecodeToken } from '../../utils/types';

const oamUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/signIn`;
const oamQrcodeUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/signInByQrcode`;
const oamWsUrl = `${process.env.NEXT_PUBLIC_WS_URL}`;

if (process.env.NODE_ENV === 'development') console.log({ oamUrl, oamQrcodeUrl, oamWsUrl });

let tempQrCodeToken = '';

function Qrcode() {
  const [qrCodeData, setQrCodeData] = useState('');
  const [token, setToken] = useState(null);
  let webSocket: WebSocket | null = null;
  // const [id, setId] = useState(1);
  let id = 1;
  const queue: string[] = [];
  const timeout: number = 30000;
  let timeoutObj: ReturnType<typeof setTimeout> | null = null;
  let serverTimeoutObj: ReturnType<typeof setTimeout> | null = null;
  let lockReconnect = false;
  let retry = 0;

  const getJSONRPC = (method: string, params?: Record<string, string>) => {
    const data = {
      jsonrpc: '2.0',
      method,
      params,
      id,
    };

    id++;

    if (typeof params === 'undefined') {
      delete data.params;
    }
    method != 'ping' && queue.push(method);
    return data;
  };

  const reset = () => {
    timeoutObj && clearTimeout(timeoutObj);
    serverTimeoutObj && clearTimeout(serverTimeoutObj);
  };

  const start = () => {
    if (webSocket) {
      timeoutObj = setTimeout(() => {
        if (!webSocket) return;
        webSocket.send(JSON.stringify(getJSONRPC('ping')));

        serverTimeoutObj = setTimeout(() => {
          if (!webSocket) return;
          webSocket.close();
        }, timeout);
      }, timeout);
    }
  };

  const reconnect = () => {
    if (lockReconnect) return;
    if (retry > 5) {
      webSocket?.close();
      console.log('WEBSOCKET_EVENT_CLOSE', Date.now());
    }
    retry++;
    lockReconnect = true;
    setTimeout(() => {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      createWebSocket();
      lockReconnect = false;
    }, 5000);
  };

  const initEventHandle = () => {
    webSocket!.addEventListener('close', (event) => {
      reconnect();
    });

    webSocket!.addEventListener('error', () => {
      reconnect();
    });

    webSocket!.addEventListener('open', () => {
      retry = 0;
      reset();
      start();
      console.log('WEBSOCKET_EVENT_OPEN', Date.now());
      console.log('Open ws and get temp', tempQrCodeToken);
      const qrCodeToken = tempQrCodeToken;
      const getQRCode = getJSONRPC(
        'getCode',
        qrCodeToken
          ? {
              id: qrCodeToken,
            }
          : undefined,
      );
      webSocket!.send(JSON.stringify(getQRCode));
    });

    webSocket!.addEventListener('message', (event) => {
      reset();
      start();
      const response = JSON.parse(event.data);

      if (response.result !== 'pong') {
        try {
          if (response && response.result) {
            const resultString = response.result;
            const method = queue.shift();

            if (method === 'getCode') {
              const qrcodeUrl = `${oamUrl}?qrcode=${resultString}`;
              console.log('Receive message from ws and set in temp', resultString);
              tempQrCodeToken = resultString;
              setQrCodeData(qrcodeUrl);
              webSocket!.send(JSON.stringify(getJSONRPC('queryToken')));

              return;
            }

            // if (method === 'qrCodeToken') {
            const { result } = response;
            const cacheQRCode = tempQrCodeToken;
            console.log('cacheQRCode', cacheQRCode);

            if (result.status === 'success' && response.result.qrcode === cacheQRCode) {
              if (result.accessToken) {
                console.log('WEBSOCKET_EVENT_MSG', event.data, Date.now());
                const decoded = jwtDecode(result.accessToken) as DecodeToken;
                if (decoded && decoded.accountId) {
                  setToken(result.accessToken);
                  const { accountId } = decoded;
                  tempQrCodeToken = '';
                  window.location.href = `${oamQrcodeUrl}?accid=${accountId}&acctoken=${result.accessToken}`;
                } else {
                  console.log('WEBSOCKET_EVENT_LOST_ACCOUNT_ID');
                }
              }
            }
            // }
          }
        } catch (err) {
          console.error('WEBSOCKET_EVENT_PARSED_FAILED', err);
        }
      }
    });
  };

  const createWebSocket = () => {
    try {
      webSocket = new WebSocket(oamWsUrl);
      initEventHandle();
    } catch (err) {
      reconnect();
    }
  };

  // TODO: 使用 useEffectOnce 確保connectWebSocket只會執行一次
  useEffectOnce(() => {
    createWebSocket();
  });

  console.log({ qrCodeData });

  return (
    <div
      className="App"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      {qrCodeData && <QRCodeSVG value={qrCodeData} size={256} />}
    </div>
  );
}

export default Qrcode;
