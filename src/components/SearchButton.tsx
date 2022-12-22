import { Theme } from '@suid/material/styles';
import { SxProps } from '@suid/system';
import { Component } from 'solid-js';
import { IconButton } from '@suid/material';
import SearchIcon from '@suid/icons-material/Search';

export interface SearchProps {
  title: string;
  size?: 'small' | 'medium' | 'large';
  sx?: SxProps<Theme>;
}

export const SearchButton: Component<SearchProps> = (props) => {
  const onClickSearch = async () => {
    await chrome.runtime.sendMessage({ type: 'show-app', data: props });
  };
  return (
    <IconButton {...props} onClick={onClickSearch} title={`Search torrents`}>
      <SearchIcon />
    </IconButton>
  );
};
