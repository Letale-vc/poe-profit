import { Box, Link } from "@mui/material";
import { type GridColDef } from "@mui/x-data-grid";
import { DivProfitObject, GemsExpProfit } from "../Types/DataTypes";

export const createProfitDataColumns = (): GridColDef<
    DivProfitObject | GemsExpProfit
>[] => [
    {
        sortable: false,
        field: "itemBuying",
        headerName: "Item buying",
        renderCell: (params) => (
            <Box display={"flex"} alignItems={"center"} height={"100%"}>
                {params.row.itemBuying.icon && (
                    <img src={params.row.itemBuying.icon} height={30} />
                )}
                <Link href={params.row.itemBuying.tradeLink} target="_blank">
                    {params.row.itemBuying.name}
                </Link>
            </Box>
        ),
        flex: 2,
    },
    {
        disableColumnMenu: true,
        filterable: false,
        sortable: false,
        field: "itemBuying.listings",
        headerName: "Listings",
        type: "number",
        flex: 0.3,
        minWidth: 75,
        renderCell: (params) => params.row.itemBuying.listings,
    },
    {
        disableColumnMenu: true,
        filterable: false,
        sortable: false,
        field: "itemBuying.chaosValue",
        headerName: "Buying chaos",
        type: "number",
        flex: 1,
        renderCell: (params) => params.row.itemBuying.chaosValue,
    },
    {
        disableColumnMenu: true,
        filterable: false,
        sortable: false,
        field: "itemBuying.divineValue",
        headerName: "Divine value",
        type: "number",
        flex: 1,
        renderCell: (params) => params.row.itemBuying.divineValue,
    },
    {
        sortable: false,
        field: "itemSelling",
        headerName: "Item selling",
        flex: 2,
        renderCell: (params) => (
            <Box display={"flex"} alignItems={"center"} height={"100%"}>
                {params.row.itemSelling.icon && (
                    <img src={params.row.itemSelling.icon} height={30} />
                )}
                <Link href={params.row.itemSelling.tradeLink} target="_blank">
                    {params.row.itemSelling.name}
                </Link>
            </Box>
        ),
    },
    {
        disableColumnMenu: true,
        filterable: false,
        sortable: false,
        field: "itemSelling.listings",
        headerName: "Listings",
        type: "number",
        flex: 0.3,
        minWidth: 75,
        renderCell: (params) => params.row.itemSelling.listings,
    },
    {
        disableColumnMenu: true,
        filterable: false,
        sortable: false,
        field: "itemSelling.chaosValue",
        headerName: "Chaos Value",
        type: "number",
        flex: 1,
        renderCell: (params) => params.row.itemSelling.chaosValue,
    },
    {
        disableColumnMenu: true,
        filterable: false,
        sortable: false,
        field: "itemSelling.divineValue",
        headerName: "Divine value",
        type: "number",
        flex: 1,
        renderCell: (params) => params.row.itemSelling.divineValue,
    },
    // {
    //     sortable: false,
    //     field: "maxStackSize",
    //     headerName: "Stack size",
    //     type: "number",
    //     minWidth: 140,
    //     renderCell: (params) => params.row.itemBuying.stackSize && 1,
    // },

    // {
    //     disableColumnMenu: true,
    //     filterable: false,
    //     sortable: false,
    //     field: "fullStackSizeDivine",
    //     headerName: "Full stack size in divine",
    //     type: "number",
    //     minWidth: 180,
    //     renderCell: (params) =>
    //         params.row.itemBuying.price.fullStackSize.divine,
    // },

    {
        field: "profitPerTradeInChaos",
        headerName: "Per trade in chaos",
        type: "number",
        width: 150,
        renderCell: (params) => {
            if ("profitPerTradeInChaos" in params.row) {
                return params.row.profitPerTradeInChaos;
            }
        },
        flex: 1,
    },
    {
        disableColumnMenu: true,
        filterable: false,
        field: "profitPerTradeInDivine",
        headerName: "Per trade in divine",
        type: "number",
        flex: 1,
        renderCell: (params) => {
            if ("profitPerTradeInDivine" in params.row) {
                return params.row.profitPerTradeInDivine;
            }
        },
    },

    {
        disableColumnMenu: true,
        filterable: false,
        field: "profitInChaos",
        headerName: "Profit in chaos",
        type: "number",
        flex: 1,
        renderCell: (params) => params.row.profitInChaos,
    },
    {
        disableColumnMenu: true,
        filterable: false,
        field: "profitInDivine",
        headerName: "Profit in divine",
        type: "number",
        flex: 1,
        renderCell: (params) => params.row.profitInDivine,
    },
];
