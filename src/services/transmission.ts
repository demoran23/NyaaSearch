import { getTransmissionOptions } from 'services/options';

let sessionId: string | undefined;

export interface ITransmissionResponse {
  arguments: {
    'torrent-duplicate'?: {
      hashString: string;
      id: number;
      name: string;
    };
  };
  result: 'success' | string;
}
export const addTorrent = async (
  url: string,
  path: string,
): Promise<ITransmissionResponse> => {
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
  }).then(async (res) => {
    if (res.status === 409) {
      console.log('Setting transmission session id', res);
      sessionId = res.headers.get('x-transmission-session-id') ?? undefined;
      return addTorrent(url, path);
    }
    if (!res.ok) {
      throw Error(await res.text());
    }

    return (await res.json()) as Promise<ITransmissionResponse>;
  });
};
