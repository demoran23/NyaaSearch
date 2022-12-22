import { RedditButton } from 'components/RedditButton';
import { SearchButton } from 'components/SearchButton';
import { render } from 'solid-js/web';

const addOrUpdateSearchButton = () => {
  const h1 = document.querySelector<HTMLElement>(
    '.header .container .content h1',
  );

  if (!h1) return;

  const title = h1.innerText.trim();
  const existing = h1.querySelector('.torrent-search-button');

  // The page will mutate the show info, so we need to update our title when it changes
  if (existing) h1.removeChild(existing);

  const mountPoint = document.createElement('span');
  mountPoint.className = 'torrent-search-button';
  h1.appendChild(mountPoint);

  render(
    () => (
      <>
        <SearchButton title={title} />
        <RedditButton title={title} />
      </>
    ),
    mountPoint,
  );
};

// Allow the page to load fully before attempting mutate
setTimeout(addOrUpdateSearchButton, 500);

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'refresh') {
    setTimeout(addOrUpdateSearchButton, 200);
  }

  return true;
});

export {};
