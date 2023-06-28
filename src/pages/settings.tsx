import { GetServerSideProps, GetServerSidePropsContext } from 'next';

import { Settings } from '../client/components/Settings/Settings';
import { SettingsPropsType } from '../client/components/Settings/types/SettingsPropsType';
import { flipApi, getSettings } from '../client/lib/apiConfig';
import { wrapper } from '../client/lib/store';
import { checkIpAddress } from '../shared/utils/checkIpAddress';

export const getServerSideProps: GetServerSideProps<SettingsPropsType> =
    wrapper.getServerSideProps(
        (store) => async (ctx: GetServerSidePropsContext) => {
            store.dispatch(getSettings.initiate());

            const adminAddress = checkIpAddress(ctx.req);

            await Promise.all(
                store.dispatch(flipApi.util.getRunningQueriesThunk()),
            );
            const { data } = getSettings.select()(store.getState());

            return {
                props: (data && { data, adminAddress }) || {
                    adminAddress,
                },
            };
        },
    );

export default Settings;
