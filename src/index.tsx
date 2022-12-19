/* @refresh reload */
import { render } from 'solid-js/web';

import './index.css';
import App from './App';
export const extensionId = 'cjeohjhhkdmecfpcpidfjmgipmfifnce';
render(
  () => (
    <App title={new URLSearchParams(window.location.search).get('title')} />
  ),
  document.getElementById('root') as HTMLElement,
);
