import { Component } from 'solid-js';
import { IconButton } from '@suid/material';
import SearchIcon from '@suid/icons-material/Search';

export interface SearchProps {
  title: string;
}

export const Search: Component<SearchProps> = (props) => {
  const onClick = async () => {
    console.log(props.title);

    await chrome.runtime.sendMessage({ type: 'show-app', data: props });
  };
  return (
    <IconButton onClick={onClick} title={`Search for ${props.title}`}>
      <SearchIcon />
    </IconButton>
  );
};
