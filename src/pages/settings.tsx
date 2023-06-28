import { GetServerSideProps } from 'next';

import { Settings } from '../client/components/Settings/Settings';
import { SettingsPropsType } from '../client/components/Settings/types/SettingsPropsType';
import { flipApi, getSettings } from '../client/lib/apiConfig';
import { wrapper } from '../client/lib/store';

export const getServerSideProps: GetServerSideProps<SettingsPropsType> =
    wrapper.getServerSideProps((store) => async ({ req }) => {
        store.dispatch(getSettings.initiate());

        const realIpAddress = req.headers['x-real-ip']?.toString();

        await Promise.all(
            store.dispatch(flipApi.util.getRunningQueriesThunk()),
        );
        const { data } = getSettings.select(realIpAddress)(store.getState());

        return {
            props: (data && data) || {},
        };
    });

export default Settings;
