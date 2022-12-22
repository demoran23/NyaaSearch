import { RedditButton } from 'components/RedditButton';
import { SearchButton } from 'components/SearchButton';
import { render } from 'solid-js/web';

function addButtons() {
  const cards = document.querySelectorAll(
    '.js-seasonal-anime:not(.kids):not(.r18)',
  );

  for (const card of cards) {
    const title = card.querySelector<HTMLElement>('.js-title')?.innerText;
    if (!title) continue;

    // Lazy workaround for button sizing
    const prodSrc = card.querySelector<HTMLDivElement>('.prodsrc');
    if (!prodSrc) continue;
    prodSrc.style.height = 'auto';

    // Add buttons
    addSearchButton(card, title);
    addRedditButton(card, title);
  }
}

function addSearchButton(card: Element, title: string) {
  const className = 'torrent-search-button';
  const existing = card.querySelector(`.${className}`);
  if (existing) return;

  const parent = card.querySelector('.broadcast');
  if (!parent) return;

  const mountPoint = document.createElement('span');
  mountPoint.className = className;
  parent.appendChild(mountPoint);

  render(() => <SearchButton size={'small'} title={title} />, mountPoint);
}
function addRedditButton(card: Element, title: string) {
  const className = 'reddit-search-button';
  const existing = card.querySelector(`.${className}`);
  if (existing) return;

  const parent = card.querySelector('.video');
  if (!parent) return;

  const mountPoint = document.createElement('span');
  mountPoint.className = className;
  parent.appendChild(mountPoint);

  render(() => <RedditButton sx={{ height: 22 }} title={title} />, mountPoint);
}

addButtons();

export {};
