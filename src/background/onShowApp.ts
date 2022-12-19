import { IMessage } from 'background/IMessage';

export const onShowApp = async (
  msg: IMessage,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void,
) => {
  if (msg.type !== 'show-app') return false;
  console.log('background.ts', msg.type);

  const tab = await chrome.tabs.create({
    url: `index.html?title=${msg.data.title}`,
  });
  console.log('opened tab', tab);

  return true;
};
