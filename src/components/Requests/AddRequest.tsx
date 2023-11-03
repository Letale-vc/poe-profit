import { type AlertProps, Box, Button, TextField } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import React, { type FC, useCallback, useState } from 'react';
import { type NewRequestType } from '~/server/MyApp/FileManagers';
import { type DataNamesType } from '~/server/api/routers/profitData';
import { api } from '~/utils/api';

interface AddRequestPropsType {
  setSnackbar: React.Dispatch<
    React.SetStateAction<Pick<AlertProps, 'children' | 'severity'> | null>
  >;
  requestType: DataNamesType;
}

export const AddRequest: FC<AddRequestPropsType> = ({
  setSnackbar,
  requestType,
}) => {
  const [newRow, setNewRow] = useState<NewRequestType>({
    itemBuying: '',
    itemSelling: '',
  });
  const { mutate, isLoading } = api.requestData.create.useMutation({
    onSuccess: () => {
      setSnackbar({
        children: 'Successfully saved',
        severity: 'success',
      });
      setNewRow({
        itemBuying: '',
        itemSelling: '',
      });
    },
    onError: (err) => {
      setSnackbar({
        children: `${err.message}`,
        severity: 'error',
      });
    },
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

  const addRowFromServerHandler = useCallback(() => {
    mutate({ newRequest: newRow, type: requestType });
  }, [mutate, newRow, requestType]);

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
