import { useCallback, useState } from 'react';
import { Alert, type AlertProps, Box, Button, Snackbar } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Link from '../link/Link';
import { createGridRequestColumns } from './GridColumnsRequest';
import { AddRequest } from './AddRequest';
import TabContext from '@mui/lab/TabContext';
import { TabList } from '@mui/lab';
import TabPanel from '@mui/lab/TabPanel';
import Tab from '@mui/material/Tab';

import { type NextPage } from 'next';
import { type ObjectRequestType } from '~/server/MyApp/FileManagers';
import { api } from '~/utils/api';

import { env } from '~/env.mjs';
import { TYPE_DATA_NAMES, type DataNamesType } from '~/helpers/constants';

const TabNamesLabel = {
  [TYPE_DATA_NAMES.flipData]: 'Flip Requests',
  [TYPE_DATA_NAMES.expGemsData]: 'ExpGem Requests',
};

export const DataRequestGrid: NextPage = () => {
  const [snackbar, setSnackbar] = useState<Pick<
    AlertProps,
    'children' | 'severity'
  > | null>(null);

  const [value, setValue] = useState<DataNamesType>(TYPE_DATA_NAMES.flipData);
  const { data } = api.requestData.get.useQuery(value);

  const handleChangeTab = (
    _: React.SyntheticEvent,
    newValue: DataNamesType,
  ) => {
    setValue(newValue);
  };

  const { mutate } = api.requestData.remove.useMutation({
    onSuccess: () => {
      setSnackbar({
        children: 'Successfully saved',
        severity: 'success',
      });
    },
    onError: (err) => {
      setSnackbar({
        children: `${err.message}`,
        severity: 'error',
      });
    },
  });
  const handleCloseSnackbar = () => setSnackbar(null);

  const handleProcessRowUpdateError = useCallback((err: Error) => {
    setSnackbar({ children: err.message, severity: 'error' });
  }, []);

  // const processRowUpdate = useCallback(
  //     async (newGridRow: ObjectRequestType, oldGridRow: ObjectRequestType) =>
  //         editQuery({ request: newGridRow, requestType: value })
  //             .unwrap()
  //             .then(() => {
  //                 setSnackbar({
  //                     children: 'Successfully saved',
  //                     severity: 'success',
  //                 });
  //                 return newGridRow;
  //             })
  //             .catch((err) => {
  //                 setSnackbar({
  //                     children: `Status: ${err.status} ${
  //                         err.data.error || 'Unknown Error'
  //                     }`,
  //                     severity: 'error',
  //                 });
  //                 return oldGridRow;
  //             }),
  //     [editQuery, value],
  // );

  const deleteRowHandlerFromServer = useCallback(
    (deletedRow: ObjectRequestType) => {
      mutate({ request: deletedRow.uuid, type: value });
    },
    [mutate, value],
  );
  const queriesColumns = createGridRequestColumns(deleteRowHandlerFromServer);

  return env.NEXT_PUBLIC_NODE_ENV === 'production' ? null : (
    <Box sx={{ width: '100%', height: '100vh', mt: 2 }} mb={2}>
      <Box display="flex" justifyContent="flex-start" alignItems="center">
        <Button component={Link} href="/">
          go to main
        </Button>
      </Box>
      <AddRequest setSnackbar={setSnackbar} requestType={value} />
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChangeTab} aria-label="Poe Requests">
            <Tab
              label={TabNamesLabel[TYPE_DATA_NAMES.flipData]}
              value={TYPE_DATA_NAMES.flipData}
            />
            <Tab
              disabled
              label={TabNamesLabel[TYPE_DATA_NAMES.expGemsData]}
              value={TYPE_DATA_NAMES.expGemsData}
            />
          </TabList>
        </Box>
        <TabPanel value={value}>
          <DataGrid
            getRowId={(row) => row.uuid}
            rows={data ?? []}
            columns={queriesColumns}
            // disableSelectionOnClick
            autoHeight
            density="compact"
            // processRowUpdate={processRowUpdate}
            onProcessRowUpdateError={handleProcessRowUpdateError}
            hideFooter
          />
        </TabPanel>
      </TabContext>
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
