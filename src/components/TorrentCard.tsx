import { Check, Input } from '@suid/icons-material';
import {
  Box,
  Chip,
  Card,
  CardActions,
  CardContent,
  Typography,
  IconButton,
} from '@suid/material';
import { Torrent } from 'services/api';
import { Component, Match, Switch } from 'solid-js';
import { downloads } from 'store/downloads';

export interface TorrentCardProps {
  torrent: Torrent;
  onClickDownload: (torrent: Torrent) => Promise<boolean>;
}

export const TorrentCard: Component<TorrentCardProps> = (props) => {
  return (
    <Card sx={{ minWidth: 275, margin: 2 }}>
      <CardContent>
        <Typography
          sx={{ fontWeight: 'bold' }}
          color="text.primary"
          gutterBottom
        >
          {props.torrent.title}
        </Typography>
      </CardContent>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          pl: 1,
          pb: 1,
        }}
      >
        <Chip
          color={'primary'}
          label={'seeders: ' + props.torrent['nyaa:seeders']}
          size={'small'}
        />
        <Chip
          color={'primary'}
          label={'downloads: ' + props.torrent['nyaa:downloads']}
          size={'small'}
        />
        <Chip
          color={'primary'}
          label={props.torrent['nyaa:size']}
          size={'small'}
        />
      </Box>
      <CardActions>
        <Switch fallback={<Check />}>
          <Match when={!downloads[props.torrent.link]}>
            <IconButton
              edge={'end'}
              onClick={async () => {
                await props.onClickDownload(props.torrent);
              }}
            >
              <Input />
            </IconButton>
          </Match>
        </Switch>
      </CardActions>
    </Card>
  );
};
