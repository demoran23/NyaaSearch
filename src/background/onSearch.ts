import { IMessage } from 'background/IMessage';
import { search } from 'services/api';

export const onSearch = (
  msg: IMessage,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void,
) => {
  if (msg.type !== 'search') return false;
  console.log('background.ts', msg.type, msg);

  search(msg.data).then((response) => {
    console.log(response);
    sendResponse(response);
  });

  return true;
};
