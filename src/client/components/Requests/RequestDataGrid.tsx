import { useCallback, useState } from 'react';
import { Alert, AlertProps, Box, Button, Snackbar } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Link from '../link/Link';
import { createGridRequestColumns } from './GridColumnsRequest';
import { AddRequest } from './AddRequest';
import TabContext from '@mui/lab/TabContext';
import { TabList } from '@mui/lab';
import TabPanel from '@mui/lab/TabPanel';
import Tab from '@mui/material/Tab';
import {
    useDeletePoeRequestMutation,
    useGetPoeRequestsDataQuery,
} from '../../lib/apiConfig';
import {
    RequestAndDataTypeNames,
    RequestAndDataTypeNamesTypes,
} from '../../../shared/constants/RequestAndDataType';
import { NODE_ENV } from '../../../shared/constants/env';
import { ObjectRequestType } from '../../../MyApp/FileManagers';
import { NextPage } from 'next';

export interface QueriesListPropsType {
    requests?: ObjectRequestType[];
}

export const DataRequestGrid: NextPage<{ requests: ObjectRequestType[] }> = ({
    requests,
}) => {
    const [removeQuery] = useDeletePoeRequestMutation();
    // const [editQuery] = useEditPoeRequestMutation();
    const [value, setValue] = useState<RequestAndDataTypeNamesTypes>(
        RequestAndDataTypeNames.flip,
    );
    const { data = requests } = useGetPoeRequestsDataQuery(value);
    const handleChangeTab = (
        event: React.SyntheticEvent,
        newValue: RequestAndDataTypeNamesTypes,
    ) => {
        setValue(newValue);
    };

    const [snackbar, setSnackbar] = useState<Pick<
        AlertProps,
        'children' | 'severity'
    > | null>(null);

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
        async (deletedRow: ObjectRequestType) =>
            removeQuery({ request: deletedRow, requestType: value })
                .unwrap()
                .then(() => {
                    setSnackbar({
                        children: 'Successfully saved',
                        severity: 'success',
                    });
                })
                .catch((err) => {
                    setSnackbar({
                        children: `Status: ${err.status} ${
                            err.data.error || 'Unknown Error'
                        }`,
                        severity: 'error',
                    });
                }),
        [removeQuery, value],
    );
    const queriesColumns = createGridRequestColumns(deleteRowHandlerFromServer);

    return NODE_ENV === 'production' ? null : (
        <Box sx={{ width: '100%', height: '100vh', mt: 2 }} mb={2}>
            <Box display="flex" justifyContent="flex-start" alignItems="center">
                <Button component={Link} href="/">
                    go to main
                </Button>
            </Box>
            <AddRequest setSnackbar={setSnackbar} requestType={value} />
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList
                        onChange={handleChangeTab}
                        aria-label="Poe Requests"
                    >
                        <Tab
                            label="Flip Requests"
                            value={RequestAndDataTypeNames.flip}
                        />
                        <Tab
                            disabled
                            label="ExpGem Requests"
                            value={RequestAndDataTypeNames.expGems}
                        />
                    </TabList>
                </Box>
                <TabPanel value={value}>
                    <DataGrid
                        getRowId={(row) => row.uuid}
                        rows={data}
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
