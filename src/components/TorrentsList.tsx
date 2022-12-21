import { Button, List, TextField } from '@suid/material';
import { SearchResponse } from 'background/onSearch';
import { TorrentCard } from 'components/TorrentCard';
import { extensionId } from 'index';
import { ISearchRequest, Torrent } from 'services/nyaa';
import { ITransmissionOptions } from 'services/options';
import {
  Component,
  createEffect,
  createResource,
  createSignal,
  For,
  Match,
  Switch,
} from 'solid-js';
import { setDownloads } from 'store/downloads';
import { setTorrents, torrents } from 'store/torrents';
import { Input } from '@suid/icons-material';

export type TorrentsProps = ISearchRequest;

export const TorrentsList: Component<TorrentsProps> = (props) => {
  const [getBaseDir, setBaseDir] = createSignal<string>('');
  const [getSubDir, setSubDir] = createSignal<string>(props.title);
  const [options] = createResource<Partial<ITransmissionOptions>>(() => {
    return chrome.runtime.sendMessage(extensionId, {
      type: 'get-transmission-options',
    });
  });

  // When we get an options default base dir, set our mutable basedir
  createEffect(() => {
    if (options.state === 'ready' && options()?.baseDir) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      setBaseDir(() => options()!.baseDir!);
    }
  });

  // When our title changes, update our subdir
  createEffect(() => {
    setSubDir(() => props.title);
  });

  // Update our list when props change
  createEffect(() => {
    chrome.runtime.sendMessage(
      extensionId,
      {
        type: 'search',
        data: props,
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
        path: `${getBaseDir()}/${getSubDir()}`,
      },
    });
    const success = res.result === 'success';
    setDownloads({ [item.link]: success });
    if (!success) console.warn(res);
    return success;
  };

  return (
    <Switch>
      <Match when={options.state === 'pending'} keyed>
        Loading...
      </Match>
      <Match when={options.state === 'errored'} keyed>
        {options.error}
      </Match>
      <Match when={options.state === 'ready'} keyed>
        <TextField
          label="Base dir"
          value={getBaseDir()}
          onChange={(e, value) => setBaseDir(() => value)}
        />
        <TextField
          label="Sub dir"
          value={getSubDir()}
          onChange={(e, value) => setSubDir(() => value)}
        />
        <Switch
          fallback={<span>Set your base dir and sub dir to see torrents</span>}
        >
          <Match when={getBaseDir() && getSubDir()} keyed={true}>
            <Button
              sx={{ margin: 4 }}
              variant={'contained'}
              endIcon={<Input />}
              onClick={async () => {
                await Promise.all(torrents.map(downloadTorrent));
              }}
            >
              Download all
            </Button>
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
          </Match>
        </Switch>
      </Match>
    </Switch>
  );
};
