import { AlertProps } from '@mui/lab';
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
import { NextPage } from 'next';
import Link from 'next/link';
import { useState } from 'react';
import { SettingsType } from '../../../MyApp/FileManagers';
import {
    useChangeSettingsMutation,
    useGetSettingsQuery,
} from '../../lib/apiConfig';
import { SettingsPropsType } from './types/SettingsPropsType';
import { NODE_ENV } from '../../../shared';

export const Settings: NextPage<SettingsPropsType> = ({
    settings: DefaultSettings,
}) => {
    const { data = DefaultSettings } = useGetSettingsQuery();

    const [changeSettings] = useChangeSettingsMutation();
    const [settings, setSettings] = useState<SettingsType | undefined>(data);

    const [snackbar, setSnackbar] = useState<Pick<
        AlertProps,
        'children' | 'severity'
    > | null>(null);
    const handleCloseSnackbar = () => setSnackbar(null);

    const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSettings((prevSettings) => {
            if (!prevSettings) {
                return undefined;
            }

            return {
                ...prevSettings,
                [event.target.name]: event.target.value,
            };
        });
    };
    const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSettings((prevSettings) => {
            if (!prevSettings) {
                return undefined;
            }

            return {
                ...prevSettings,
                [event.target.name]: event.target.checked,
            };
        });
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            if (!settings) {
                return;
            }
            await changeSettings(settings).unwrap();

            setSnackbar({ children: 'Settings saved', severity: 'success' });
        } catch (error) {
            console.error(error);
            setSettings(data);
            setSnackbar({
                children: 'Error saving settings',
                severity: 'error',
            });
        }
    };
    if (!data) {
        return null;
    }
    return (
        <Box m={4}>
            <Box
                display="flex"
                alignItems="center"
                justifyContent={'space-between'}
            >
                <Button component={Link} href="/">
                    go to main
                </Button>
                {NODE_ENV === 'development' && (
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
