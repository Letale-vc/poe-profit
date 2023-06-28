import { GetServerSideProps } from 'next';
import { Main } from '../client/components/Main/Main';
import { MainPropsType } from '../client/components/Main/Types/MainTypes';
import { flipApi, getData } from '../client/lib/apiConfig';
import { wrapper } from '../client/lib/store';
import { RequestAndDataTypeNames } from '../shared/constants/RequestAndDataType';
import { checkIpAddress } from '../shared/utils/checkIpAddress';

export const getServerSideProps: GetServerSideProps<MainPropsType> =
    wrapper.getServerSideProps((store) => async (ctx) => {
        store.dispatch(getData.initiate(RequestAndDataTypeNames.flip));
        const ipv6Address =
            ctx.req.headers['X-Real-IP'] || ctx.req.socket.remoteAddress;

        const adminAddress = checkIpAddress(ipv6Address);

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
    });

export default Main;
