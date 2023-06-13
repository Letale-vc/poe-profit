import { DataGrid } from '@mui/x-data-grid';
import { FC, useEffect } from 'react';
import { Box, Button } from '@mui/material';
import Link from '../link/Link';
import { useGetPoeFlipDataQuery } from '../../lib/apiConfig';
import { flipDataColumns } from './gridColumns';
import { PoeFlipDataType } from '../../../shared/types/flipObjectTypes';

export interface MainPropsType {
    flipData?: PoeFlipDataType;
}

export const Main: FC<MainPropsType> = ({ flipData }) => {
    const { data = flipData, refetch } = useGetPoeFlipDataQuery();
    useEffect(() => {
        const interval = setInterval(refetch, 5000);
        return () => {
            clearInterval(interval);
        };
    }, [refetch]);

    return (
        <Box sx={{ width: '100%', height: '100vh', mt: 2 }}>
            <Box
                display="flex"
                justifyContent="flex-start"
                alignItems="center"
                mb={2}
            >
                <Box marginLeft={2} flexGrow={1}>
                    <p suppressHydrationWarning>{`Last update:  ${
                        (data && new Date(data.lastUpdate).toLocaleString()) ||
                        ''
                    }`}</p>
                </Box>
                <Button component={Link} href="/change-queries">
                    change queries
                </Button>
            </Box>

            {data && (
                <DataGrid
                    getRowId={(row) =>
                        `${row.itemBuyingInfo.name}_${row?.itemSellingInfo?.name}_${row.queriesFlipUuid}`
                    }
                    initialState={{
                        sorting: {
                            sortModel: [
                                {
                                    field: 'profitInChaosPerTrade',
                                    sort: 'desc',
                                },
                            ],
                        },
                    }}
                    rows={data.flipData}
                    columns={flipDataColumns}
                    disableSelectionOnClick
                    autoHeight
                    density="compact"
                    hideFooter
                />
            )}
        </Box>
    );
};
