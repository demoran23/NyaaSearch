import { List, ListItemText, TextField } from '@suid/material';
import { extensionId } from 'index';
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
import { setTorrents, torrents } from 'store/torrents';

export interface TorrentsProps {
  title: string;
  group: string;
  quality: string;
}

export const Torrents: Component<TorrentsProps> = (props) => {
  const [getBaseDir, setBaseDir] = createSignal<string>('');
  const [getSubDir, setSubDir] = createSignal<string>(props.title);
  const [options, actions] = createResource<Partial<ITransmissionOptions>>(
    () => {
      return chrome.runtime.sendMessage(extensionId, {
        type: 'get-transmission-options',
      });
    },
  );
  createEffect(() => {
    if (options.state === 'ready' && options()?.baseDir) {
      setBaseDir((_) => options()!.baseDir!);
    }
  });
  createEffect(() => {
    setSubDir((_) => props.title);
  });
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
            <List>
              <For each={torrents}>
                {(item, index) => (
                  <ListItemText
                    data-index={index()}
                    onClick={async () => {
                      chrome.runtime.sendMessage(
                        extensionId,
                        {
                          type: 'add-torrent',
                          data: {
                            url: item.link,
                            path: `${getBaseDir()}/${getSubDir()}`,
                          },
                        },
                        (res) => {
                          console.log(res);
                        },
                      );
                    }}
                  >
                    {item.title}
                  </ListItemText>
                )}
              </For>
            </List>
          </Match>
        </Switch>
      </Match>
    </Switch>
  );
};
