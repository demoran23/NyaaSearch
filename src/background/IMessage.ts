export type MessageType =
  | 'search'
  | 'add-torrent'
  | 'get-transmission-options'
  | 'show-app';

export interface IMessage {
  type: MessageType;
  data: any;
}
