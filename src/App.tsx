import { Box, TextField } from '@suid/material';
import { TorrentsList } from 'components/TorrentsList';
import { extensionId } from 'index';
import { ITransmissionOptions } from 'services/options';
import { createEffect, createResource, createSignal } from 'solid-js';
import type { Component } from 'solid-js';

import styles from './App.module.css';

export interface AppProps {
  title?: string | null;
}

const App: Component<AppProps> = (props) => {
  const [getTitle, setTitle] = createSignal(props.title ?? '');
  const [getGroup, setGroup] = createSignal('SubsPlease');
  const [getQuality, setQuality] = createSignal('1080');
  const [getBaseDir, setBaseDir] = createSignal<string>('');
  const [getSubDir, setSubDir] = createSignal<string>(getTitle());
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
    setSubDir(() => getTitle());
  });
  return (
    <div class={styles.App}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '1em',
        }}
      >
        <TextField
          label="Show title"
          value={getTitle()}
          onChange={(e, value) => setTitle(() => value)}
        />
        <TextField
          label="Group"
          value={getGroup()}
          onChange={(e, value) => setGroup(() => value)}
        />
        <TextField
          label="Quality"
          value={getQuality()}
          onChange={(e, value) => setQuality(() => value)}
        />
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
      </Box>
      {getTitle() && (
        <TorrentsList
          title={getTitle()}
          group={getGroup()}
          quality={getQuality()}
          baseDir={getBaseDir()}
          subDir={getSubDir()}
        />
      )}
    </div>
  );
};

export default App;
