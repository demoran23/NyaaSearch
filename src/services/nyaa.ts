import { XMLParser } from 'fast-xml-parser';
import { debounce } from 'lodash';
const parser = new XMLParser();

export interface Torrent {
  category: string;
  description: string;
  // torrent link
  guid: string;
  // html
  link: string;
  // link to details page
  'nyaa:category': string;
  // date
  'nyaa:categoryId': string;
  'nyaa:comments': number;
  'nyaa:downloads': number;
  'nyaa:infoHash': string;
  'nyaa:leechers': number;
  'nyaa:remake': 'No' | 'No';
  'nyaa:seeders': number;
  'nyaa:size': string;
  'nyaa:trusted': 'Yes' | 'No';
  pubDate: string;
  title: string;
}

export interface ISearchRequest {
  title: string;
  group: string;
  quality: string;
}

export const search = debounce(
  async (req: ISearchRequest) => {
    const url = `https://nyaa.si/?page=rss&q=${req.title}+${req.group}+${req.quality}`;
    const response = await fetch(url);

    if (!response.ok) throw Error(await response.text());

    const xml = await response.text();
    let {
      rss: {
        channel: { item },
      },
    } = parser.parse(xml);
    item ??= [];
    const torrents = Array.isArray(item) ? item : [item];
    return torrents as Torrent[];
  },
  100,
  { leading: true },
);
