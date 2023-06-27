import { AlertProps, Box, Button, TextField } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import React, { FC, useCallback, useState } from 'react';
import { NewRequestType } from '../../../MyApp/FileManagers';
import { RequestAndDataTypeNamesTypes } from '../../../shared/constants/RequestAndDataType';
import { useAddPoeRequestMutation } from '../../lib/apiConfig';

interface AddRequestPropsType {
    setSnackbar: React.Dispatch<
        React.SetStateAction<Pick<AlertProps, 'children' | 'severity'> | null>
    >;
    requestType: RequestAndDataTypeNamesTypes;
}

export const AddRequest: FC<AddRequestPropsType> = ({
    setSnackbar,
    requestType,
}) => {
    const [addQuery, { isLoading }] = useAddPoeRequestMutation();
    const [newRow, setNewRow] = useState<NewRequestType>({
        itemBuying: '',
        itemSelling: '',
    });

    const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const urlRegex =
            /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

        // Перевірка, чи відповідає рядок регулярному виразу URL-адреси
        if (urlRegex.test(event.target.value)) {
            // Розділення URL на частини
            const url = new URL(event.target.value);

            // Отримання останньої частини шляху як ID
            const pathParts = url.pathname.split('/');
            const id = pathParts[pathParts.length - 1];

            setNewRow((prevRow) => ({ ...prevRow, [event.target.name]: id }));
            return;
        }
        setNewRow((prevRow) => ({
            ...prevRow,
            [event.target.name]: event.target.value,
        }));
    };

    const addRowFromServerHandler = useCallback(async () => {
        try {
            await addQuery({ request: newRow, requestType });
            setSnackbar({
                children: 'Successfully saved',
                severity: 'success',
            });
            setNewRow({
                itemBuying: '',
                itemSelling: '',
            });
        } catch (error: any) {
            setSnackbar({
                children: `${error.data.error}`,
                severity: 'error',
            });
        }
    }, [addQuery, newRow, requestType, setSnackbar]);
    return (
        <Box display="flex" sx={{ alignItems: 'flex-end' }}>
            <TextField
                sx={{ width: 499, marginLeft: 62 }}
                multiline
                rows={5}
                name="itemBuying"
                id="itemBuying"
                label="Item Buying Query"
                variant="filled"
                value={newRow.itemBuying}
                onChange={handleTextChange}
            />
            <TextField
                sx={{ width: 499, marginLeft: 1 }}
                multiline
                rows={5}
                name="itemSelling"
                id="itemSelling"
                label="Item Selling query"
                variant="filled"
                value={newRow.itemSelling}
                onChange={handleTextChange}
            />
            <Button
                onClick={addRowFromServerHandler}
                disabled={newRow.itemBuying === '' || newRow.itemSelling === ''}
            >
                {isLoading ? <CircularProgress size={24} /> : 'Add new Request'}
            </Button>
        </Box>
    );
};
