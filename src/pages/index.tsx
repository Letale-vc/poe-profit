import { GetServerSideProps } from 'next';
import { Main, MainPropsType } from '../client/components/main/main';
import { flipApi, getPoeFlipData } from '../client/lib/apiConfig';
import { wrapper } from '../client/lib/store';

export const getServerSideProps: GetServerSideProps<MainPropsType> =
    wrapper.getServerSideProps((store) => async () => {
        store.dispatch(getPoeFlipData.initiate());

        await Promise.all(
            store.dispatch(flipApi.util.getRunningQueriesThunk()),
        );
        const { data } = getPoeFlipData.select()(store.getState());
        return {
            props: data || {},
        };
    });

export default Main;
