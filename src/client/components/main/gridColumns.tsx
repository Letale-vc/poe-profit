import { GridColumns, GridRenderCellParams } from '@mui/x-data-grid';
import { FlipItemTypes } from '../../../shared/types/flipObjectTypes';
import Link from '../link/Link';

export const flipDataColumns: GridColumns<FlipItemTypes> = [
    {
        field: 'itemBuyingInfo',
        headerName: 'Item buying',
        renderCell: (params: GridRenderCellParams<string, FlipItemTypes>) => (
            <div>
                <Link
                    href={params.row.itemBuyingInfo.poeTradeLink}
                    target="_blank"
                >
                    {params.row.itemBuyingInfo.name}
                </Link>
                <p>~{params.row.itemBuyingInfo.totalInTrade}</p>
            </div>
        ),
        minWidth: 210,
    },
    {
        field: 'itemSelling',
        headerName: 'Item selling',
        minWidth: 200,
        renderCell: (params: GridRenderCellParams<string, FlipItemTypes>) => (
            <Link
                href={params.row.itemSellingInfo.poeTradeLink}
                target="_blank"
            >
                {params.row.itemSellingInfo.name}
            </Link>
        ),
    },
    {
        field: 'ItemBuyingStackSize',
        headerName: 'buying stackSize',
        type: 'number',
        minWidth: 140,
        renderCell: (params: GridRenderCellParams<string, FlipItemTypes>) => (
            <p>{params.row.itemBuyingInfo.maxStackSize}</p>
        ),
    },
    {
        field: 'ItemBuyingInChaos',
        headerName: 'buying in chaos',
        type: 'number',
        minWidth: 140,
        renderCell: (params: GridRenderCellParams<string, FlipItemTypes>) => (
            <p>{params.row.itemBuyingInfo.price.chaos}</p>
        ),
    },
    {
        field: 'ItemBuyingInDivine',
        headerName: 'buying in divine',
        type: 'number',
        minWidth: 140,
        renderCell: (params: GridRenderCellParams<string, FlipItemTypes>) => (
            <p>{params.row.itemBuyingInfo.price.divine}</p>
        ),
    },
    {
        field: 'ItemBuyingInDivineIfFullStackSize',
        headerName: 'buying in divine full stack size',
        type: 'number',
        minWidth: 200,
        renderCell: (params: GridRenderCellParams<string, FlipItemTypes>) => (
            <p>
                {params.row.itemBuyingInfo.price.priceInDivineIfFullStackSize}
            </p>
        ),
    },
    {
        field: 'ItemSellingInChaos',
        headerName: 'selling in chaos',
        type: 'number',
        minWidth: 140,
        renderCell: (params: GridRenderCellParams<string, FlipItemTypes>) => (
            <p>{params.row.itemSellingInfo.price.chaos}</p>
        ),
    },

    {
        field: 'ItemSellingInDivine',
        headerName: 'selling in divine',
        type: 'number',
        minWidth: 160,
        renderCell: (params: GridRenderCellParams<string, FlipItemTypes>) => (
            <p>{params.row.itemSellingInfo.price.divine}</p>
        ),
    },
    {
        field: 'profitInChaosPerTrade',
        headerName: 'Profit in chaos per trade',
        type: 'number',
        width: 200,
        renderCell: (params: GridRenderCellParams<string, FlipItemTypes>) => (
            <p>{params.row.profitInChaosPerTrade}</p>
        ),
    },
    // {
    //     field: 'profitInDivinePerTrade',
    //     headerName: 'profitInDivinePerTrade',
    //     type: 'number',
    //     width: 170,
    // },

    {
        field: 'profitInChaos',
        headerName: 'Profit in chaos',
        type: 'number',
        width: 140,
    },
    {
        field: 'profitInDivine',
        headerName: 'Profit in divine',
        type: 'number',
        width: 140,
    },
];
