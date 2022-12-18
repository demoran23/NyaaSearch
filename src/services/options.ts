export interface ITransmissionOptions {
  // default: localhost
  host: string;
  // default: 9091
  port: string;
  username: string;
  password: string;
  // absolute path of default base directory to save files in
  baseDir: string;
}

export const setTransmissionOptions = (
  transmission: Partial<ITransmissionOptions>,
) => chrome.storage.sync.set({ transmission });

export const getTransmissionOptions = async () => {
  const { transmission } = await chrome.storage.sync.get('transmission');
  transmission.host ??= 'localhost';
  transmission.port ??= '9091';
  return transmission as ITransmissionOptions;
};
