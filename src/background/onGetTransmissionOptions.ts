import { IMessage } from 'background/IMessage';
import { ITransmissionOptions } from 'services/options';

export const onGetTransmissionOptions = (
  msg: IMessage,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void,
) => {
  if (msg.type !== 'get-transmission-options') return false;
  getTransmissionOptions().then((res) => {
    sendResponse(res);
  });

  return true;
};
const getTransmissionOptions = async () => {
  const { transmission } = await chrome.storage.sync.get('transmission');
  transmission.host ??= 'localhost';
  transmission.port ??= '9091';
  return transmission as ITransmissionOptions;
};
