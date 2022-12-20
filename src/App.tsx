import { TextField } from '@suid/material';
import { TorrentsList } from 'components/TorrentsList';
import { createSignal, Show } from 'solid-js';
import type { Component } from 'solid-js';

import styles from './App.module.css';

export interface AppProps {
  title?: string | null;
}

const App: Component<AppProps> = (props) => {
  const [getTitle, setTitle] = createSignal(props.title ?? '');
  const [getGroup, setGroup] = createSignal('SubsPlease');
  const [getQuality, setQuality] = createSignal('1080');
  return (
    <div class={styles.App}>
      <header class={styles.header}>
        <TextField
          label="Show title"
          value={getTitle()}
          onChange={(e, value) => setTitle((_) => value)}
        />
        <TextField
          label="Group"
          value={getGroup()}
          onChange={(e, value) => setGroup((_) => value)}
        />
        <TextField
          label="Quality"
          value={getQuality()}
          onChange={(e, value) => setQuality((_) => value)}
        />
        {getTitle() && (
          <TorrentsList
            title={getTitle()}
            group={getGroup()}
            quality={getQuality()}
          />
        )}
      </header>
    </div>
  );
};

export default App;
