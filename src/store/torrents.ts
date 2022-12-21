import { Torrent } from 'services/nyaa';
import { createStore } from 'solid-js/store';

export const [torrents, setTorrents] = createStore<Torrent[]>([]);
