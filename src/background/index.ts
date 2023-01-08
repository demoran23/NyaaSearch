import { IMessage } from 'background/IMessage';
import { onAddTorrent } from 'background/onAddTorrent';
import { onGetTransmissionOptions } from 'background/onGetTransmissionOptions';
import { onSearch } from 'background/onSearch';
import { onShowApp } from 'background/onShowApp';
import { extensionId } from 'index';

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
  if (!tab.active) return;

  if (changeInfo.url) {
    await chrome.tabs.sendMessage(tabId, { type: 'refresh' });
  }

  return true;
});

chrome.runtime.onInstalled.addListener(async () => {
  console.log('background.ts', 'onInstalled');
});

chrome.contextMenus.create(
  {
    contexts: ['selection'],
    id: chrome.runtime.id,
    title: `Search Nyaa for '%s'`,
  },
  console.log,
);
chrome.contextMenus.onClicked.addListener((info, tab) => {
  const message: IMessage = {
    type: 'show-app',
    data: { title: info.selectionText },
  };
  onShowApp(message).then(console.log);
  return true;
});
