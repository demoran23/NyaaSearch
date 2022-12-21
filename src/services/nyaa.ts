import { XMLParser } from 'fast-xml-parser';

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

export const search = async (req: ISearchRequest) => {
  const url = `https://nyaa.si/?page=rss&q=${req.title}+${req.group}+${req.quality}`;
  console.log('search', 'url', url);
  const response = await fetch(url);

  if (!response.ok) throw Error(await response.text());

  const xml = await response.text();
  const json = parser.parse(xml);
  console.log('search', 'json', json);
  return (json.rss.channel.item ?? []) as Torrent[];
};
