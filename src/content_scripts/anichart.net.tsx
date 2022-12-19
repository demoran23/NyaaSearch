import { Search } from 'components/Search';
import { render } from 'solid-js/web';

const renderCards = () => {
  const cards = [...document.querySelectorAll('.media-card')];

  for (const card of cards) {
    const title = card.querySelector('.overlay .title')?.innerHTML;
    if (!title) continue;

    const footer = card.querySelector('.data .footer');
    if (!footer) continue;

    const mountPoint = document.createElement('div');
    footer.appendChild(mountPoint);

    render(() => <Search title={title} />, mountPoint);
  }
};

setTimeout(renderCards, 500);

export {};
