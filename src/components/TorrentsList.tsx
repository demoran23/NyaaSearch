import { Button, Container, List } from '@suid/material';
import { SearchResponse } from 'background/onSearch';
import { TorrentCard } from 'components/TorrentCard';
import { extensionId } from 'index';
import { ISearchRequest, Torrent } from 'services/nyaa';
import {
  Component,
  createEffect,
  createMemo,
  For,
  Match,
  Switch,
} from 'solid-js';
import { setDownloads, downloads } from 'store/downloads';
import { setTorrents, torrents } from 'store/torrents';
import { Input } from '@suid/icons-material';

export interface TorrentsProps extends ISearchRequest {
  baseDir: string;
  subDir: string;
}

export const TorrentsList: Component<TorrentsProps> = (props) => {
  // Update our list when props change
  createEffect(() => {
    chrome.runtime.sendMessage(
      extensionId,
      {
        type: 'search',
        data: {
          title: props.title,
          group: props.group,
          quality: props.quality,
        },
      },
      (res: SearchResponse) => {
        console.log('SEARCH_RESPONSE', res);
        setTorrents(res?.torrents ?? []);
        setDownloads(res?.downloads ?? {});
      },
    );
  });

  const downloadTorrent = async (item: Torrent) => {
    const res = await chrome.runtime.sendMessage(extensionId, {
      type: 'add-torrent',
      data: {
        url: item.link,
        path: `${props.baseDir}/${props.subDir}`,
      },
    });
    const success = res.result === 'success';
    setDownloads({ [item.link]: success });
    if (!success) console.warn(res);
    return success;
  };

  const missing = createMemo(() => torrents.filter((t) => !downloads[t.link]));

  return (
    <Switch
      fallback={<span>Set your base dir and sub dir to see torrents</span>}
    >
      <Match when={props.baseDir && props.subDir} keyed={true}>
        <Button
          sx={{ margin: 4 }}
          variant={'contained'}
          endIcon={<Input />}
          disabled={!missing().length}
          onClick={async () => {
            await Promise.all(missing().map(downloadTorrent));
          }}
        >
          Download missing [{missing().length}/{torrents.length}]
        </Button>
        <Container>
          <List>
            <For each={torrents}>
              {(item, index) => (
                <TorrentCard
                  data-index={index()}
                  torrent={item}
                  onClickDownload={downloadTorrent}
                />
              )}
            </For>
          </List>
        </Container>
      </Match>
    </Switch>
  );
};
