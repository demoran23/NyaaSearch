import { IMessage } from 'background/IMessage';

export const onShowApp = async (msg: IMessage) => {
  if (msg.type !== 'show-app') return false;

  await chrome.tabs.create({
    url: `index.html?title=${msg.data.title}`,
  });

  return true;
};
