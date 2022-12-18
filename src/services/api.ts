import { XMLParser } from 'fast-xml-parser';

const parser = new XMLParser();

export interface Torrent {
  category: string;
  title: string;
  // torrent link
  link: string;
  // html
  description: string;
  // link to details page
  guid: 'https://www.tokyotosho.info/details.php?id=1720777';
  pubDate: 'Sun, 04 Dec 2022 13:20:07 GMT';
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
