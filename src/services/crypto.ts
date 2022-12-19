import { Buffer } from 'buffer';
import crypto from 'crypto';

/**
 *
 * @param url The torrent url
 */
export const getHash = async (url: string) => {
  const res = await fetch(url);
  const buffer = new Buffer(new Uint8Array(await res.arrayBuffer()));
  const hash = crypto.createHash('sha1').update(buffer).digest('hex');
  return hash;
};
