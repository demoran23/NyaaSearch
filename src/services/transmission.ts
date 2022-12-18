import { getTransmissionOptions } from 'services/options';

let sessionId: string | undefined;

export const addTorrent = async (
  url: string,
  path: string,
): Promise<Response> => {
  const config = await getTransmissionOptions();
  return fetch(`http://${config.host}:${config.port}/transmission/rpc`, {
    method: 'POST',
    headers: {
      Time: new Date().toISOString(),
      Host: config.host + ':' + config.port,
      'X-Requested-With': 'Node',
      'X-Transmission-Session-Id': sessionId ?? '',
      'Content-Type': 'application/json',
      Authorization: `Basic ${btoa(
        config.username + (config.password ? ':' + config.password : ''),
      )}`,
    },
    body: JSON.stringify({
      method: 'torrent-add',
      arguments: {
        'download-dir': path,
        filename: url,
      },
    }),
  }).then((res) => {
    if (res.status === 409) {
      console.log('Setting transmission session id', res);
      sessionId = res.headers.get('x-transmission-session-id') ?? undefined;
      return addTorrent(url, path);
    }
    return res;
  });
};
