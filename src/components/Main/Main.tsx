import { DataGrid } from '@mui/x-data-grid';
import { useState } from 'react';
import { Box, Button, Tab } from '@mui/material';
import Link from '../link/Link';
import { createProfitDataColumns } from './MainGridColumns';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { type NextPage } from 'next';
import { api } from '~/utils/api';
import { env } from '~/env.mjs';
import { type DataNamesType, TYPE_DATA_NAMES } from '~/helpers/constants';

const adminAddress = true;

export const Main: NextPage = () => {
  const [value, setValue] = useState<keyof typeof TYPE_DATA_NAMES>(
    TYPE_DATA_NAMES.flipData,
  );
  const { data } = api.profitData.get.useQuery(value);
  const handleChangeTab = (
    _: React.SyntheticEvent,
    newValue: DataNamesType,
  ) => {
    setValue(newValue);
  };

  // useEffect(() => {
  //   const interval = setInterval(refetch, 5000);
  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, [refetch]);

  const lastUpdate = data?.lastUpdate
    ? new Date(data.lastUpdate).toLocaleString()
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
          <p suppressHydrationWarning>{`Last update: ${lastUpdate}`}</p>
        </Box>
        {adminAddress && (
          <>
            <Button component={Link} href="/settings">
              settings
            </Button>
            {env.NEXT_PUBLIC_NODE_ENV === 'development' && (
              <Button component={Link} href="/changeRequest">
                change queries
              </Button>
            )}
          </>
        )}
      </Box>

      {data?.data && (
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChangeTab} aria-label="Table profit info">
              <Tab
                label="Flip Table profit info"
                value={TYPE_DATA_NAMES.flipData}
              />
              <Tab
                label="ExpGem Table profit info"
                value={TYPE_DATA_NAMES.expGemsData}
              />
            </TabList>
          </Box>
          <TabPanel value={TYPE_DATA_NAMES.flipData}>
            <DataGrid
              sx={{ minHeight: '82vh' }}
              getRowId={(row) =>
                `${row.itemBuying.name}_${row.itemSelling.name}_${row.requestUuid}`
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
              rows={data.data}
              columns={profitDataColumns}
              disableRowSelectionOnClick
              // autoHeight
              density="compact"
              hideFooter
            />
          </TabPanel>
          <TabPanel value={TYPE_DATA_NAMES.expGemsData}>
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
              rows={data.data}
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
