import { SearchButtons } from 'components/SearchButtons';
import { render } from 'solid-js/web';

const addSearchButtons = () => {
  const cards = [...document.querySelectorAll('.media-card')];

  for (const card of cards) {
    const title = (card.querySelector('.overlay .title') as HTMLDivElement)
      ?.innerText;
    if (!title) continue;

    const footer = card.querySelector('.data .footer');
    if (!footer) continue;

    // If we've already got a button, move on
    if (footer.querySelector('.torrent-search-button')) continue;

    const mountPoint = document.createElement('div');
    mountPoint.className = 'torrent-search-button';
    footer.appendChild(mountPoint);

    render(() => <SearchButtons title={title} />, mountPoint);
  }
};

// The page conditionally renders the cards, so keep a watch on it
setInterval(addSearchButtons, 500);

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'refresh') {
    setTimeout(addSearchButtons, 200);
    sendResponse('Refreshing!');
  }

  return true;
});
export {};
