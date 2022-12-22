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
import { TorrentIcon } from 'components/TorrentIcon';
import { formatDistance } from 'date-fns';
import { Torrent } from 'services/nyaa';
import { Component, Match, Switch } from 'solid-js';
import { downloads } from 'store/downloads';

export interface TorrentCardProps {
  torrent: Torrent;
  onClickDownload: (torrent: Torrent) => Promise<boolean>;
}

export const TorrentCard: Component<TorrentCardProps> = (props) => {
  const today = new Date();
  const publishDate = new Date(props.torrent.pubDate);
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
          justifyContent: 'space-between',
          pl: 1,
          pb: 1,
          pr: 1,
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
        <Chip
          color={'primary'}
          label={formatDistance(publishDate, today, { addSuffix: true })}
          size={'small'}
        />
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
            {/*<IconButton*/}
            {/*  edge={'end'}*/}
            {/*  onClick={async () => {*/}
            {/*    window.open(props.torrent.link, '_blank');*/}
            {/*  }}*/}
            {/*>*/}
            {/*  {<TorrentIcon />}*/}
            {/*</IconButton>*/}
          </Match>
        </Switch>
      </Box>
    </Card>
  );
};
