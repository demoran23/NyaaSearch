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

export const search = async (value: string) => {
  console.log("search", "start")
  const response = await getXmlSearchRepsonse(value);
  const xml = await response.text();
  const json = parser.parse(xml);
  console.log("search", json);
  return json.rss.channel.item as Torrent[];
};

const getXmlSearchRepsonse = async (value: string) => {
  // const url = `https://www.tokyotosho.info/rss.php?terms=${value}+subsplease+1080&type=1&searchName=true`;
  const url = `https://nyaa.si/?page=rss&q=${value}+subsplease+1080`;
  const response = await fetch(url);
  return response;
};

// https://nyaa.si/?f=0&c=1_2&q=maid+subsplease+1080
