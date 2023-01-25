import { AlertProps, Box, Button, TextField } from '@mui/material';
import React, { FC, useCallback, useState } from 'react';
import { NewFlipQueriesType } from '../../../shared/types/FlipQueriesTypes';
import { useAddFlipQueryMutation } from '../../lib/apiConfig';

interface AddQueryFlipPropsType {
    setSnackbar: React.Dispatch<
        React.SetStateAction<Pick<AlertProps, 'children' | 'severity'> | null>
    >;
}

export const AddQueryFlip: FC<AddQueryFlipPropsType> = ({ setSnackbar }) => {
    const [addQuery] = useAddFlipQueryMutation();
    const [newRow, setNewRow] = useState<NewFlipQueriesType>({
        itemBuying: '',
        itemSelling: '',
        itemSellingPriceMultiplier: 1,
    });

    const addRowFromServerHandler = useCallback(async () => {
        await addQuery(newRow)
            .unwrap()
            .then(() => {
                setSnackbar({
                    children: 'Successfully saved',
                    severity: 'success',
                });
                setNewRow({
                    itemBuying: '',
                    itemSelling: '',
                    itemSellingPriceMultiplier: 1,
                });
            })
            .catch((err) => {
                {
                    setSnackbar({
                        children: `${err.data.error}`,
                        severity: 'error',
                    });
                }
            });
    }, [addQuery, newRow, setSnackbar]);
    return (
        <Box display="flex" sx={{ alignItems: 'flex-end' }}>
            <TextField
                sx={{ width: 499, marginLeft: 62 }}
                multiline
                rows={5}
                id="itemBuying"
                label="Item Buying Query"
                variant="filled"
                value={newRow.itemBuying}
                onChange={(ev) =>
                    setNewRow({ ...newRow, itemBuying: ev.target.value })
                }
            />
            <TextField
                sx={{ width: 499, marginLeft: 1 }}
                multiline
                rows={5}
                id="itemSelling"
                label="Item Selling query"
                variant="filled"
                value={newRow.itemSelling}
                onChange={(ev) =>
                    setNewRow({ ...newRow, itemSelling: ev.target.value })
                }
            />
            <TextField
                sx={{ width: 150, marginLeft: 1 }}
                rows={5}
                type="number"
                id="itemSellingPriceMultiplier"
                label="Selling price multiplier"
                variant="filled"
                value={newRow.itemSellingPriceMultiplier}
                onChange={(ev) =>
                    setNewRow({
                        ...newRow,
                        itemSellingPriceMultiplier: Number.parseInt(
                            ev.target.value,
                        ),
                    })
                }
            />
            <Button onClick={addRowFromServerHandler}>Add new query</Button>
        </Box>
    );
};
