import { IMessage } from 'background/IMessage';
import { search, Torrent } from 'services/api';
import { getTorrentByInfoHash } from 'services/transmission';
import { Downloads } from 'store/downloads';

export interface SearchResponse {
  torrents: Torrent[];
  downloads: Downloads;
}

export const onSearch = (
  msg: IMessage,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void,
) => {
  if (msg.type !== 'search') return false;

  search(msg.data).then(async (torrents) => {
    const downloads = await torrents.reduce(async (p, c) => {
      const prev = await p;
      const curr = await c;
      const existing = await getTorrentByInfoHash(curr['nyaa:infoHash']);
      return { ...prev, [curr.link]: !!existing };
    }, Promise.resolve({} as Downloads));

    const response: SearchResponse = { torrents, downloads };

    sendResponse(response);
  });

  return true;
};
