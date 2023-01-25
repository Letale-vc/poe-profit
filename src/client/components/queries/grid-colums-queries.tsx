import { IconButton } from '@mui/material';
import { GridColumns, GridRenderCellParams } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import {
    FlipQueriesType,
    QueryTypeSearch,
} from '../../../shared/types/FlipQueriesTypes';

const takeNameSearchItem = (itemQueryString: string) => {
    const tradeQuery: QueryTypeSearch = JSON.parse(itemQueryString);
    const { name, type, term } = tradeQuery.query;
    if (typeof name === 'string' && typeof type === 'string') {
        return name;
    }
    if (!name && typeof type === 'string') {
        return type;
    }
    if (typeof name === 'object' && name.option) {
        return name.option;
    }
    if (!name && typeof type === 'object' && type.option) {
        return type.option;
    }
    if (!!term) {
        return term;
    }
    return '';
};

export const createQueriesColumns = (
    funDelete: (row: FlipQueriesType) => Promise<void>,
): GridColumns<FlipQueriesType> => [
    {
        field: 'BuyingToSellingItem',
        headerName: 'Buying -> Selling item names',
        width: 500,
        type: 'string',
        sortable: false,
        filterable: false,
        renderCell: (params: GridRenderCellParams<string, FlipQueriesType>) => {
            const itemBuyingName = takeNameSearchItem(params.row.itemBuying);
            const itemSellingName = takeNameSearchItem(params.row.itemSelling);

            return <p>{`${itemBuyingName} -> ${itemSellingName}`}</p>;
        },
    },
    {
        field: 'itemBuying',
        headerName: 'Item buying',
        width: 500,
        sortable: false,
        filterable: false,
        editable: true,
    },

    {
        field: 'itemSelling',
        headerName: 'Item selling',
        width: 500,
        sortable: false,
        filterable: false,
        editable: true,
    },
    {
        field: 'itemSellingPriceMultiplier',
        headerName: 'Item selling price multiplier',
        width: 250,
        sortable: false,
        filterable: false,
        editable: true,
    },
    {
        field: 'options',
        headerName: 'options',
        sortable: false,
        filterable: false,
        renderCell: (params: GridRenderCellParams) => {
            const deleteQueryHandler = () => {
                funDelete(params.row);
            };
            return (
                <IconButton
                    key={params.id}
                    aria-label="delete"
                    onClick={deleteQueryHandler}
                >
                    <DeleteIcon />
                </IconButton>
            );
        },
    },
];
