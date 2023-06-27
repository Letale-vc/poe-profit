import { GetServerSideProps } from 'next';

import { Settings } from '../client/components/Settings/Settings';
import { SettingsPropsType } from '../client/components/Settings/types/SettingsPropsType';
import { flipApi, getSettings } from '../client/lib/apiConfig';
import { wrapper } from '../client/lib/store';
import { checkIpAddress } from '../shared/utils/checkIpAddress';

export const getServerSideProps: GetServerSideProps<SettingsPropsType> =
    wrapper.getServerSideProps((store) => async (ctx) => {
        store.dispatch(getSettings.initiate());
        const ipv6Address =
            ctx.req.headers['x-forwarded-for'] || ctx.req.socket.remoteAddress;

        const adminAddress = checkIpAddress(ipv6Address);

        await Promise.all(
            store.dispatch(flipApi.util.getRunningQueriesThunk()),
        );
        const { data } = getSettings.select()(store.getState());

        return {
            props: (data && { data, adminAddress }) || {
                adminAddress,
            },
        };
    });

export default Settings;
