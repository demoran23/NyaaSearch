import { IMessage } from 'background/IMessage';
import { addTorrent } from 'services/transmission';

export const onAddTorrent = (
  msg: IMessage,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void,
) => {
  if (msg.type !== 'add-torrent') return false;
  console.log('background.ts', 'add-torrent');

  addTorrent(msg.data.url, msg.data.path)
    .then(sendResponse)
    .catch(console.error);

  return true;
};
