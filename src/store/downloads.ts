import { createStore } from 'solid-js/store';

export interface Downloads {
  [link: string]: boolean;
}

export const [downloads, setDownloads] = createStore<Downloads>({});
