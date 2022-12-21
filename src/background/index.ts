import { onAddTorrent } from 'background/onAddTorrent';
import { onGetTransmissionOptions } from 'background/onGetTransmissionOptions';
import { onSearch } from 'background/onSearch';
import { onShowApp } from 'background/onShowApp';
import { getTorrentsByInfoHash } from 'services/transmission';

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

  console.log('onUpdated', changeInfo, tab);
  if (changeInfo.url) {
    const response = await chrome.tabs.sendMessage(tabId, { type: 'refresh' });
    console.log('got response', response);
  }

  return true;
});

chrome.runtime.onInstalled.addListener(async () => {
  console.log('background.ts', 'onInstalled');
  const res = await getTorrentsByInfoHash(
    'f9261d860c983f9666712cd6392868cca17c4afc',
  );
  console.log('f9261d860c983f9666712cd6392868cca17c4afe', res);
});
