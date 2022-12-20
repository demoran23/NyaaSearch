import { SearchButtons } from 'components/SearchButtons';
import { render } from 'solid-js/web';

const addOrUpdateSearchButton = () => {
  const h1 = document.querySelector<HTMLElement>(
    '.header .container .content h1',
  );

  if (!h1) return;

  const title = h1.innerText.trim();
  const existing = h1.querySelector('.torrent-search-button');

  if (existing) h1.removeChild(existing);

  const mountPoint = document.createElement('span');
  mountPoint.className = 'torrent-search-button';
  h1.appendChild(mountPoint);

  console.log('Adding search button to', title);
  render(() => <SearchButtons title={title} />, mountPoint);
};

// Allow the page to load fully before attempting mutate
setTimeout(addOrUpdateSearchButton, 500);

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'refresh') {
    console.log('REFRESHING');
    setTimeout(addOrUpdateSearchButton, 200);
    sendResponse('Refreshing!');
  }

  return true;
});

export {};
