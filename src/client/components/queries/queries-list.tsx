import { FC, useCallback, useState } from 'react';
import { Alert, AlertProps, Box, Button, Snackbar } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {
    useDeletePoeFlipQueryMutation,
    useEditFlipQueryMutation,
    useGetPoeFlipQueryQuery,
} from '../../lib/apiConfig';
import Link from '../link/Link';
import { createQueriesColumns } from './grid-colums-queries';
import { FlipQueriesType } from '../../../shared/types/FlipQueriesTypes';
import { AddQueryFlip } from './add-query-flip';

export interface QueriesListPropsType {
    queries: FlipQueriesType[];
}

export const QueriesList: FC<{ queries: FlipQueriesType[] }> = ({
    queries,
}) => {
    const { data = queries } = useGetPoeFlipQueryQuery();
    const [removeQuery] = useDeletePoeFlipQueryMutation();
    const [editQuery] = useEditFlipQueryMutation();

    const [snackbar, setSnackbar] = useState<Pick<
        AlertProps,
        'children' | 'severity'
    > | null>(null);

    const handleCloseSnackbar = () => setSnackbar(null);

    const handleProcessRowUpdateError = useCallback((err: Error) => {
        setSnackbar({ children: err.message, severity: 'error' });
    }, []);

    const processRowUpdate = useCallback(
        async (newGridRow: FlipQueriesType, oldGridRow: FlipQueriesType) =>
            editQuery(newGridRow)
                .unwrap()
                .then(() => {
                    setSnackbar({
                        children: 'Successfully saved',
                        severity: 'success',
                    });
                    return newGridRow;
                })
                .catch((err) => {
                    setSnackbar({
                        children: `Status: ${err.status} ${
                            err.data.error || 'Unknown Error'
                        }`,
                        severity: 'error',
                    });
                    return oldGridRow;
                }),
        [editQuery],
    );

    const deleteRowHandlerFromServer = useCallback(
        async (deletedRow: FlipQueriesType) =>
            removeQuery(deletedRow)
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
        [removeQuery],
    );
    const queriesColumns = createQueriesColumns(deleteRowHandlerFromServer);

    return (
        <Box sx={{ width: '100%', height: '100vh', mt: 2 }} mb={2}>
            <Box display="flex" justifyContent="flex-start" alignItems="center">
                <Button component={Link} href="/">
                    go to main
                </Button>
            </Box>
            <AddQueryFlip setSnackbar={setSnackbar} />
            <div>
                <DataGrid
                    getRowId={(row) => row.uuid}
                    rows={data}
                    columns={queriesColumns}
                    disableSelectionOnClick
                    autoHeight
                    density="compact"
                    processRowUpdate={processRowUpdate}
                    onProcessRowUpdateError={handleProcessRowUpdateError}
                    experimentalFeatures={{ newEditingApi: true }}
                    hideFooter
                />
            </div>
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
