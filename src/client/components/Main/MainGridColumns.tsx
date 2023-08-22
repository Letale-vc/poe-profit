import { GridColDef } from '@mui/x-data-grid';
import Link from '../link/Link';
import { Box } from '@mui/material';
import {
    RequestAndDataTypeNames,
    RequestAndDataTypeNamesTypes,
} from '../../../shared/constants/RequestAndDataType';
import { ObjectProfitDataType } from '../../../MyApp/FileManagers';

export const createProfitDataColumns = (
    type: RequestAndDataTypeNamesTypes,
): GridColDef<ObjectProfitDataType>[] => [
    {
        sortable: false,
        field: 'itemBuyingInfo',
        headerName:
            type === RequestAndDataTypeNames.flip ? 'Item buying' : 'Gem lvl 1',
        renderCell: (params) => (
            <Box
                display={'flex'}
                alignItems={'center'}
                justifyContent={'space-between'}
                width={'100%'}
            >
                <Link href={params.row.itemBuying.poeTradeLink} target="_blank">
                    {params.row.itemBuying.name}
                </Link>
                <p>~{params.row.itemBuying.totalInTrade}</p>
            </Box>
        ),
        minWidth: type === RequestAndDataTypeNames.flip ? 230 : 380,
    },

    {
        sortable: false,
        field: 'itemSelling',
        headerName:
            type === RequestAndDataTypeNames.flip
                ? 'Item selling'
                : 'Gem lvl 5',
        minWidth: type === RequestAndDataTypeNames.flip ? 230 : 380,
        renderCell: (params) => (
            <Box
                display={'flex'}
                alignItems={'center'}
                justifyContent={'space-between'}
                width={'100%'}
            >
                <Link
                    href={params.row.itemSelling.poeTradeLink}
                    target="_blank"
                >
                    {params.row.itemSelling.name}
                </Link>
                <p> ~{params.row.itemSelling.totalInTrade}</p>
            </Box>
        ),
    },
    {
        sortable: false,
        field: 'maxStackSize',
        headerName: 'Stack size',
        type: 'number',
        minWidth: 140,
        renderCell: (params) => params.row.itemBuying.maxStackSize,
    },
    {
        disableColumnMenu: true,
        filterable: false,
        sortable: false,
        field: 'ItemBuyingInChaos',
        headerName: 'Buying chaos',
        type: 'number',
        minWidth: 120,
        renderCell: (params) => params.row.itemBuying.price.oneItem.chaos,
    },
    {
        disableColumnMenu: true,
        filterable: false,
        sortable: false,
        field: 'ItemBuyingInDivine',
        headerName: 'Buying divine',
        type: 'number',
        minWidth: 120,
        renderCell: (params) => params.row.itemBuying.price.oneItem.divine,
    },
    {
        disableColumnMenu: true,
        filterable: false,
        sortable: false,
        field: 'fullStackSizeDivine',
        headerName: 'Full stack size in divine',
        type: 'number',
        minWidth: 180,
        renderCell: (params) =>
            params.row.itemBuying.price.fullStackSize.divine,
    },
    {
        disableColumnMenu: true,
        filterable: false,
        sortable: false,
        field: 'sellingInChaos',
        headerName: 'Selling in Chaos',
        type: 'number',
        minWidth: 160,
        renderCell: (params) => params.row.itemSelling.price.oneItem.chaos,
    },
    {
        disableColumnMenu: true,
        filterable: false,
        sortable: false,
        field: 'sellingInDivine',
        headerName: 'Selling in divine',
        type: 'number',
        minWidth: 150,
        renderCell: (params) => params.row.itemSelling.price.oneItem.divine,
    },
    {
        field: 'profitPerTradeInChaos',
        headerName: 'Per trade in chaos',
        type: 'number',
        width: 150,
        renderCell: (params) => params.row.profitPerTradeInChaos,
    },
    {
        disableColumnMenu: true,
        filterable: false,
        field: 'profitPerTradeInDivine',
        headerName: 'Per trade in divine',
        type: 'number',
        width: 150,
        renderCell: (params) => params.row.profitPerTradeInDivine,
    },

    {
        disableColumnMenu: true,
        filterable: false,
        field: 'profitInChaos',
        headerName: 'Profit in chaos',
        type: 'number',
        width: 140,
        renderCell: (params) => params.row.profitInChaos,
    },
    {
        disableColumnMenu: true,
        filterable: false,
        field: 'profitInDivine',
        headerName: 'Profit in divine',
        type: 'number',
        width: 140,
        renderCell: (params) => params.row.profitInDivine,
    },
];
