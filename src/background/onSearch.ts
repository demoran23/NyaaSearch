import { IMessage } from 'background/IMessage';
import { search, Torrent } from 'services/nyaa';
import { getTorrentsByInfoHash } from 'services/transmission';
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

  search(msg.data)?.then(async (torrents) => {
    torrents ??= [];
    console.log('TORRENTS', torrents);
    const existing = await getTorrentsByInfoHash(
      ...torrents.map((t) => t['nyaa:infoHash']),
    );
    const dl = torrents.reduce((prev, curr) => {
      return {
        ...prev,
        [curr.link]: existing.some(
          (t) => t.hashString === curr['nyaa:infoHash'],
        ),
      };
    }, {} as Downloads);
    const response: SearchResponse = { torrents, downloads: dl };

    sendResponse(response);
  });

  return true;
};
