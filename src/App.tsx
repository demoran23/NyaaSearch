import { Torrents } from 'components/Torrents';
import type { Component } from 'solid-js';

import logo from './logo.svg';
import styles from './App.module.css';
import { QueryClient, QueryClientProvider } from '@tanstack/solid-query';

const client = new QueryClient();

const App: Component = () => {
  console.log('re-rendering');
  return (
    <QueryClientProvider client={client}>
      <div class={styles.App}>
        <header class={styles.header}>
          <img src={logo} class={styles.logo} alt="logo" />
          <Torrents title={'Akiba Maid Sensou'} />
        </header>
      </div>
    </QueryClientProvider>
  );
};

export default App;
