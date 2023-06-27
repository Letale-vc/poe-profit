import { GetServerSideProps } from 'next';
import {
    DataRequestGrid,
    QueriesListPropsType,
} from '../client/components/Requests/RequestDataGrid';
import { flipApi, getPoeRequestsData } from '../client/lib/apiConfig';
import { wrapper } from '../client/lib/store';
import { RequestAndDataTypeNames } from '../shared/constants/RequestAndDataType';

export default DataRequestGrid;

export const getServerSideProps: GetServerSideProps<QueriesListPropsType> =
    wrapper.getServerSideProps((store) => async () => {
        await store.dispatch(
            getPoeRequestsData.initiate(RequestAndDataTypeNames.flip),
        );

        await Promise.all(
            store.dispatch(flipApi.util.getRunningQueriesThunk()),
        );
        const { data } = getPoeRequestsData.select(
            RequestAndDataTypeNames.flip,
        )(store.getState());

        return {
            props: { requests: data || [] },
        };
    });
