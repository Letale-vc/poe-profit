import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { Main } from '../client/components/Main/Main';
import { MainPropsType } from '../client/components/Main/Types/MainTypes';
import { flipApi, getData } from '../client/lib/apiConfig';
import { wrapper } from '../client/lib/store';
import { RequestAndDataTypeNames } from '../shared/constants/RequestAndDataType';
import { checkIpAddress } from '../shared/utils/checkIpAddress';

export const getServerSideProps: GetServerSideProps<MainPropsType> =
    wrapper.getServerSideProps(
        (store) => async (ctx: GetServerSidePropsContext) => {
            store.dispatch(getData.initiate(RequestAndDataTypeNames.flip));

            const adminAddress = checkIpAddress(ctx.req);

            await Promise.all(
                store.dispatch(flipApi.util.getRunningQueriesThunk()),
            );
            const { data } = getData.select(RequestAndDataTypeNames.flip)(
                store.getState(),
            );
            return {
                props: (data && { data, adminAddress }) || {
                    adminAddress,
                },
            };
        },
    );

export default Main;
