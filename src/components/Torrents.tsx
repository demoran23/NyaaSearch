import { TextField } from '@suid/material';
import { OptionsPage } from 'components/OptionsPage';
import { extensionId } from 'index';
import { getTransmissionOptions, ITransmissionOptions } from 'services/options';
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
      console.log('options', options());
      setBaseDir((_) => options()!.baseDir!);
    }
  });
  createEffect(() => {
    chrome.runtime.sendMessage(
      extensionId,
      {
        type: 'search',
        data: props.title,
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
        <For each={torrents}>
          {(item, index) => (
            <div
              data-index={index()}
              onClick={async () => {
                console.log('adding torrent');
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
            </div>
          )}
        </For>
      </Match>
    </Switch>
  );
};
