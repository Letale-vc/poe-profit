import { GetServerSideProps } from 'next';
import {
    QueriesList,
    QueriesListPropsType,
} from '../client/components/queries/queries-list';
import { flipApi, getPoeFlipQuery } from '../client/lib/apiConfig';
import { wrapper } from '../client/lib/store';

export default QueriesList;

export const getServerSideProps: GetServerSideProps<QueriesListPropsType> =
    wrapper.getServerSideProps((store) => async () => {
        await store.dispatch(getPoeFlipQuery.initiate());

        await Promise.all(
            store.dispatch(flipApi.util.getRunningQueriesThunk()),
        );
        const { data } = getPoeFlipQuery.select()(store.getState());

        return {
            props: { queries: data || [] },
        };
    });
