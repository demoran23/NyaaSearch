import { onAddTorrent } from 'background/onAddTorrent';
import { onGetTransmissionOptions } from 'background/onGetTransmissionOptions';
import { onSearch } from 'background/onSearch';
import { onShowApp } from 'background/onShowApp';

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
    const response = await chrome.tabs.sendMessage(tabId, { type: 'refresh' });
    console.log('got response', response);
  }

  return true;
});

chrome.runtime.onInstalled.addListener(async () => {
  console.log('background.ts', 'onInstalled');
});
