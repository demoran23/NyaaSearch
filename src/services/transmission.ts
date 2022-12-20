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

export const addTorrent = (url: string, path: string) =>
  api({
    method: 'torrent-add',
    arguments: {
      'download-dir': path,
      filename: url,
    },
  });

export const api = async (req: any): Promise<ITransmissionResponse> => {
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
    body: JSON.stringify(req),
  }).then(async (res) => {
    if (res.status === 409) {
      console.log('Setting transmission session id', res);
      sessionId = res.headers.get('x-transmission-session-id') ?? undefined;
      return api(req);
    }

    if (!res.ok) {
      throw Error(await res.text());
    }

    return (await res.json()) as Promise<ITransmissionResponse>;
  });
};

export const getAllTorrents = () =>
  api({
    arguments: {
      fields: ['id', 'name', 'torrentFile', 'magnetLink'],
    },
    method: 'torrent-get',
  });

export const getTorrentByInfoHash = (infoHash: string) =>
  api({
    arguments: {
      fields: ['id', 'name', 'torrentFile', 'magnetLink'],
      ids: [infoHash],
    },
    method: 'torrent-get',
  });
