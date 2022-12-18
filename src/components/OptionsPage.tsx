import { Box, Stack, TextField } from '@suid/material';
import {
  getTransmissionOptions,
  ITransmissionOptions,
  setTransmissionOptions,
} from 'services/options';
import {
  Component,
  createEffect,
  createResource,
  Match,
  Switch,
} from 'solid-js';

export const OptionsPage: Component = () => {
  const [options, actions] = createResource<Partial<ITransmissionOptions>>(
    getTransmissionOptions,
  );
  createEffect(async () => {
    if (options.state === 'ready') await setTransmissionOptions(options());
  });
  const onChange = (event: any, value: any) => {
    actions.mutate((e) => ({ ...e, [event.target.id]: value }));
  };
  return (
    <Switch>
      <Match when={options.loading} keyed>
        <p>Loading...</p>
      </Match>
      <Match when={options.error} keyed>
        <p>{options.error}</p>
      </Match>
      <Match when={options.state === 'ready'} keyed>
        <Box
          component="form"
          sx={{
            '& > :not(style)': { m: 1, width: '50ch' },
            textAlign: 'center',
          }}
          novalidate
          autocomplete="off"
        >
          <Stack spacing={2}>
            <TextField
              id="host"
              label="Host"
              value={options()?.host}
              onChange={onChange}
            />
            <TextField
              id="port"
              label="Port"
              value={options()?.port}
              onChange={onChange}
            />
            <TextField
              id="username"
              label="Username"
              value={options()?.username ?? ''}
              onChange={onChange}
            />
            <TextField
              id="password"
              label="Password"
              type="password"
              value={options()?.password ?? ''}
              onChange={onChange}
            />
            <TextField
              id="baseDir"
              label="Base Dir"
              value={options()?.baseDir ?? ''}
              onChange={onChange}
              helperText="Absolute path of base directory to save files in"
            />
          </Stack>
        </Box>
      </Match>
    </Switch>
  );
};
