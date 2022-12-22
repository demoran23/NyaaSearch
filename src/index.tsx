/* @refresh reload */
import { createTheme, ThemeProvider } from '@suid/material';
import { render } from 'solid-js/web';

import './index.css';
import App from './App';
export const extensionId = chrome.runtime.id;
const theme = createTheme({
  palette: {
    reddit: 'orangered',
  },
} as any);
render(
  () => (
    <ThemeProvider theme={theme}>
      <App title={new URLSearchParams(window.location.search).get('title')} />
    </ThemeProvider>
  ),
  document.getElementById('root') as HTMLElement,
);
