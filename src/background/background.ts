import { search } from 'services/api';
import { ITransmissionOptions } from 'services/options';
import { addTorrent } from 'services/transmission';

export type MessageType =
  | 'search'
  | 'add-torrent'
  | 'get-transmission-options'
  | 'show-app';
export interface IMessage {
  type: MessageType;
  data: any;
}

chrome.runtime.onInstalled.addListener(() => {
  console.log('background.ts', 'onInstalled');
});

const onSearch = (
  msg: IMessage,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void,
) => {
  if (msg.type !== 'search') return false;
  console.log('background.ts', msg.type, msg);

  search(msg.data).then(sendResponse).catch(console.error);

  return true;
};

const onAddTorrent = (
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
const onGetTransmissionOptions = (
  msg: IMessage,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void,
) => {
  if (msg.type !== 'get-transmission-options') return false;
  console.log('background.ts', msg.type);

  getTransmissionOptions().then((res) => {
    console.log('res internal', res);
    sendResponse(res);
  });

  return true;
};

const onShowApp = async (
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
const getTransmissionOptions = async () => {
  const { transmission } = await chrome.storage.sync.get('transmission');
  transmission.host ??= 'localhost';
  transmission.port ??= '9091';
  console.log('transmission options', transmission);
  return transmission as ITransmissionOptions;
};

for (const onMessage of [
  chrome.runtime.onMessageExternal,
  chrome.runtime.onMessage,
]) {
  for (const listener of [
    onAddTorrent,
    onSearch,
    onGetTransmissionOptions,
    onShowApp,
  ]) {
    onMessage.addListener(listener);
  }
}

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  // If the url changes, instruct to refresh
  if (changeInfo.url) {
    const response = await chrome.tabs.sendMessage(tabId, { type: 'refresh' });
    console.log('got response', response);
  }

  return true;
});
