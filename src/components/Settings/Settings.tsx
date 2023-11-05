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
  const [pin, setPin] = useState<string>('');
  const [forbidden, setForbidden] = useState<boolean>(false);
  const { data, refetch } = api.settings.get.useQuery({ pin });

  const { mutateAsync } = api.settings.updateSettings.useMutation({
    onSuccess: () => {
      setSnackbar({ children: 'Settings saved', severity: 'success' });
      void refetch;
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
      setForbidden(true);
      setSettings(data);
    }
  }, [data]);

  const [snackbar, setSnackbar] = useState<Pick<
    AlertProps,
    'children' | 'severity'
  > | null>(null);
  const handleCloseSnackbar = () => setSnackbar(null);

  const handlePinChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setPin(event.target.value);
    await refetch();
  };

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

  const handleSubmit = async () => {
    await mutateAsync({ pin, settings });
  };

  return (
    <>
      <Box m={4}>
        {!forbidden ? (
          <TextField
            value={pin}
            onChange={handlePinChange}
            type="number"
            id="PIN"
            name="PIN"
            label="PIN"
            variant="outlined"
          />
        ) : (
          <>
            <Box
              display="flex"
              alignItems="center"
              justifyContent={'space-between'}
            >
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
                  onClick={handleSubmit}
                >
                  Save
                </Button>
              </FormGroup>
            </Box>
          </>
        )}
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
    </>
  );
};
