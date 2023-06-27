import { GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import { ObjectRequestType } from '../../../MyApp/FileManagers';
import Link from '../link/Link';

export const createGridRequestColumns = (
    removeFunction: (row: ObjectRequestType) => Promise<void>,
): GridColDef<ObjectRequestType>[] => [
    {
        field: 'itemBuying',
        headerName: 'Item buying',
        width: 500,
        type: 'string',
        sortable: false,
        filterable: false,
        renderCell: (params) => {
            return (
                <Link href={params.row.itemBuying.url} target="_blank">
                    {params.row.itemBuying.name}
                </Link>
            );
        },
    },

    {
        field: 'itemSelling',
        headerName: 'Item selling',
        width: 500,
        sortable: false,
        filterable: false,
        renderCell: (params) => {
            return (
                <Link href={params.row.itemSelling.url} target="_blank">
                    {params.row.itemSelling.name}
                </Link>
            );
        },
    },
    {
        field: 'actions',
        type: 'actions',
        headerName: 'actions',
        sortable: false,
        filterable: false,
        getActions: ({ row, id }) => {
            const removeRequestHandler = () => {
                removeFunction(row);
            };
            return [
                <GridActionsCellItem
                    key={id}
                    icon={<DeleteIcon />}
                    label="Delete"
                    onClick={removeRequestHandler}
                    color="inherit"
                />,
            ];
        },
    },
];
