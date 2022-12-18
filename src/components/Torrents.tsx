import {
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  TextField,
} from '@suid/material';
import { extensionId } from 'index';
import { ISearchRequest, Torrent } from 'services/api';
import { ITransmissionOptions } from 'services/options';
import { ITransmissionResponse } from 'services/transmission';
import {
  Component,
  createEffect,
  createResource,
  createSignal,
  For,
  Match,
  Switch,
} from 'solid-js';
import { setTorrents, torrents } from 'store/torrents';
import { Check, Input } from '@suid/icons-material';

export type TorrentsProps = ISearchRequest;

export const Torrents: Component<TorrentsProps> = (props) => {
  const [getDownloaded, setDownloaded] = createSignal<Record<string, boolean>>(
    {},
  );
  const [getBaseDir, setBaseDir] = createSignal<string>('');
  const [getSubDir, setSubDir] = createSignal<string>(props.title);
  const [options, actions] = createResource<Partial<ITransmissionOptions>>(
    () => {
      return chrome.runtime.sendMessage(extensionId, {
        type: 'get-transmission-options',
      });
    },
  );

  // When we get an options default base dir, set our mutable basedir
  createEffect(() => {
    if (options.state === 'ready' && options()?.baseDir) {
      setBaseDir((_) => options()!.baseDir!);
    }
  });

  // When our title changes, update our subdir
  createEffect(() => {
    setSubDir((_) => props.title);
  });

  // Update our list when props change
  createEffect(() => {
    chrome.runtime.sendMessage(
      extensionId,
      {
        type: 'search',
        data: props,
      },
      setTorrents,
    );
  });

  const downloadTorrent = async (item: Torrent) => {
    chrome.runtime.sendMessage(
      extensionId,
      {
        type: 'add-torrent',
        data: {
          url: item.link,
          path: `${getBaseDir()}/${getSubDir()}`,
        },
      },
      (res: ITransmissionResponse) => {
        if (res.result === 'success') {
          setDownloaded((e) => ({
            ...e,
            [item.link]: true,
          }));
        } else {
          console.error(res);
        }
      },
    );
  };

  return (
    <Switch>
      <Match when={options.state === 'pending'} keyed={true}>
        Loading...
      </Match>
      <Match when={options.state === 'errored'}>{options.error}</Match>
      <Match when={options.state === 'ready'} keyed={true}>
        <TextField
          label="Base dir"
          value={getBaseDir()}
          onChange={(e, value) => setBaseDir((_) => value)}
        />
        <TextField
          label="Sub dir"
          value={getSubDir()}
          onChange={(e, value) => setSubDir((_) => value)}
        />
        <Switch
          fallback={<span>Set your base dir and sub dir to see torrents</span>}
        >
          <Match when={getBaseDir() && getSubDir()} keyed={true}>
            <Button
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
                  // TODO: break this out into its own component
                  <ListItem
                    secondaryAction={
                      <Switch fallback={<Check />}>
                        <Match when={!getDownloaded()[item.link]}>
                          <IconButton
                            edge={'end'}
                            onClick={async () => {
                              await downloadTorrent(item);
                            }}
                          >
                            <Input />
                          </IconButton>
                        </Match>
                      </Switch>
                    }
                  >
                    <ListItemText data-index={index()}>
                      {item.title}
                    </ListItemText>
                  </ListItem>
                )}
              </For>
            </List>
          </Match>
        </Switch>
      </Match>
    </Switch>
  );
};
