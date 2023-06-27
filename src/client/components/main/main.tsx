import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { Box, Button, Tab } from '@mui/material';
import Link from '../link/Link';
import { createProfitDataColumns } from './MainGridColumns';
import {
    RequestAndDataTypeNames,
    RequestAndDataTypeNamesTypes,
} from '../../../shared/constants/RequestAndDataType';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { useGetDataQuery } from '../../lib/apiConfig';
import { MainPropsType } from './Types/MainTypes';
import { NextPage } from 'next';

export const Main: NextPage<MainPropsType> = ({ data, adminAddress }) => {
    const [value, setValue] = useState<RequestAndDataTypeNamesTypes>(
        RequestAndDataTypeNames.flip,
    );
    const { data: profitData = data, refetch } = useGetDataQuery(value);
    const handleChangeTab = (
        event: React.SyntheticEvent,
        newValue: RequestAndDataTypeNamesTypes,
    ) => {
        setValue(newValue);
    };
    useEffect(() => {
        const interval = setInterval(refetch, 5000);
        return () => {
            clearInterval(interval);
        };
    }, [refetch]);

    const lastUpdate =
        profitData && profitData.lastUpdate
            ? new Date(profitData.lastUpdate).toLocaleString()
            : '';
    const profitDataColumns = createProfitDataColumns(value);

    return (
        <Box sx={{ width: '100%', height: '100vh', mt: 2 }}>
            <Box
                display="flex"
                justifyContent="flex-start"
                alignItems="center"
                mb={2}
            >
                <Box marginLeft={2} flexGrow={1}>
                    <p
                        suppressHydrationWarning
                    >{`Last update:  ${lastUpdate}`}</p>
                </Box>
                {adminAddress && (
                    <>
                        <Button component={Link} href="/settings">
                            settings
                        </Button>
                        <Button component={Link} href="/changeRequest">
                            change queries
                        </Button>
                    </>
                )}
            </Box>

            {profitData && profitData.data && (
                <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList
                            onChange={handleChangeTab}
                            aria-label="Table profit info"
                        >
                            <Tab
                                label="Flip Table profit info"
                                value={RequestAndDataTypeNames.flip}
                            />
                            <Tab
                                label="ExpGem Table profit info"
                                value={RequestAndDataTypeNames.expGems}
                            />
                        </TabList>
                    </Box>
                    <TabPanel value={RequestAndDataTypeNames.flip}>
                        <DataGrid
                            sx={{ minHeight: '82vh' }}
                            getRowId={(row) =>
                                `${row.itemBuying.name}_${row?.itemSelling?.name}_${row.requestUuid}`
                            }
                            columnVisibilityModel={{
                                sellingInChaos: false,
                            }}
                            initialState={{
                                sorting: {
                                    sortModel: [
                                        {
                                            field: 'profitInChaos',
                                            sort: 'desc',
                                        },
                                    ],
                                },
                            }}
                            rows={profitData.data}
                            columns={profitDataColumns}
                            disableRowSelectionOnClick
                            // autoHeight
                            density="compact"
                            hideFooter
                        />
                    </TabPanel>
                    <TabPanel value={RequestAndDataTypeNames.expGems}>
                        <DataGrid
                            sx={{ minHeight: '82vh' }}
                            getRowId={(row) =>
                                `${row.itemBuying.name}_${row.itemSelling.name}_${row.requestUuid}`
                            }
                            columnVisibilityModel={{
                                profitPerTradeInChaos: false,
                                maxStackSize: false,
                                profitPerTradeInDivine: false,
                                fullStackSizeDivine: false,
                            }}
                            rows={profitData.data}
                            columns={profitDataColumns}
                            disableRowSelectionOnClick
                            // autoHeight
                            density="compact"
                            hideFooter
                        />
                    </TabPanel>
                </TabContext>
            )}
        </Box>
    );
};
