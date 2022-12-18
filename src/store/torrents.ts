import { Torrent } from "services/api";
import { createStore } from "solid-js/store";

export const [torrents, setTorrents] = createStore<Torrent[]>([]);
