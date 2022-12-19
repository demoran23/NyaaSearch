import { Search } from 'components/Search';
import { render } from 'solid-js/web';

const renderCards = () => {
  const cards = [...document.querySelectorAll('.media-card')];

  if (cards.length > 0) {
    console.log('Adding torrent search buttons');
  }

  for (const card of cards) {
    const title = (card.querySelector('.overlay .title') as HTMLDivElement)
      ?.innerText;
    if (!title) continue;

    const footer = card.querySelector('.data .footer');
    if (!footer) continue;

    const mountPoint = document.createElement('div');
    footer.appendChild(mountPoint);

    render(() => <Search title={title} />, mountPoint);
  }
};

// Allow enough time for the page to render its contents before attempting to manipulate it
setTimeout(renderCards, 500);

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'refresh') {
    setTimeout(renderCards, 200);
    sendResponse('Refreshing!');
  }

  return true;
});
export {};
