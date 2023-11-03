import { type AlertProps } from '@mui/lab';
import {
  FormGroup,
  FormControlLabel,
  Switch,
  FormLabel,
  TextField,
  Snackbar,
  Alert,
  Button,
} from '@mui/material';
import Box from '@mui/material/Box';
import { type NextPage } from 'next';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { env } from '~/env.mjs';
import { type SettingsType } from '~/server/MyApp/FileManagers';
import { api } from '~/utils/api';

export const Settings: NextPage = () => {
  const { data } = api.settings.get.useQuery();
  const { mutate } = api.settings.updateSettings.useMutation({
    onSuccess: () => {
      setSnackbar({ children: 'Settings saved', severity: 'success' });
    },
    onError: () => {
      setSnackbar({
        children: 'Error saving settings',
        severity: 'error',
      });
    },
  });
  const [settings, setSettings] = useState<SettingsType>({
    flipUpdate: false,
    expGemUpdate: false,
    poesessid: '',
  });

  useEffect(() => {
    if (data) {
      console.log(data);
      setSettings(data);
    }
  }, [data]);

  const [snackbar, setSnackbar] = useState<Pick<
    AlertProps,
    'children' | 'severity'
  > | null>(null);
  const handleCloseSnackbar = () => setSnackbar(null);

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings((prevSettings) => {
      return {
        ...prevSettings,
        [event.target.name]: event.target.value,
      };
    });
  };
  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings((prevSettings) => {
      return {
        ...prevSettings,
        [event.target.name]: event.target.checked,
      };
    });
  };

  const handleSubmit = (_: React.FormEvent<HTMLFormElement>) => {
    mutate(settings);
  };

  return (
    <Box m={4}>
      <Box display="flex" alignItems="center" justifyContent={'space-between'}>
        <Button component={Link} href="/">
          go to main
        </Button>
        {env.NEXT_PUBLIC_NODE_ENV === 'development' && (
          <Button component={Link} href="/changeRequest">
            change queries
          </Button>
        )}
      </Box>
      <Box mt={4} maxWidth={450}>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <FormLabel component="legend">Settings</FormLabel>
            <FormControlLabel
              control={
                <Switch
                  checked={settings?.flipUpdate || false}
                  onChange={handleSwitchChange}
                  name="flipUpdate"
                />
              }
              label="flipUpdate"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings?.expGemUpdate || false}
                  onChange={handleSwitchChange}
                  name="expGemUpdate"
                />
              }
              label="expGemUpdate"
            />

            <TextField
              value={settings?.poesessid || ''}
              onChange={handleTextChange}
              id="poesessid"
              name="poesessid"
              label="Poesessid"
              variant="outlined"
            />
            <Button
              sx={{ mt: 4, maxWidth: 100, alignSelf: 'center' }}
              type="submit"
              variant="contained"
              color="primary"
            >
              Save
            </Button>
          </FormGroup>
        </form>
      </Box>
      {!!snackbar && (
        <Snackbar
          open
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          onClose={handleCloseSnackbar}
          autoHideDuration={5000}
        >
          <Alert {...snackbar} onClose={handleCloseSnackbar} />
        </Snackbar>
      )}
    </Box>
  );
};
