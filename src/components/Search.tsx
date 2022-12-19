import { Component } from 'solid-js';
import { IconButton } from '@suid/material';
import SearchIcon from '@suid/icons-material/Search';
export interface SearchProps {
  title: string;
}
export const Search: Component<SearchProps> = (props) => {
  const onClick = () => console.log(props.title);
  return (
    <IconButton onClick={onClick}>
      <SearchIcon />
    </IconButton>
  );
};
