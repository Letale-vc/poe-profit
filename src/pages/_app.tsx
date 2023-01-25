import '../client/styles/globals.css';
import type { AppProps } from 'next/app';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider, EmotionCache } from '@emotion/react';
import { FC } from 'react';
import { Provider } from 'react-redux';
import theme from '../client/styles/theme';
import createEmotionCache from '../client/createEmotionCache';
import { wrapper } from '../client/lib/store';
import { HeadWrapper } from '../client/components/head';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface NewAppProps extends AppProps {
    emotionCache: EmotionCache;
}

const App: FC<NewAppProps> = ({ Component, ...rest }) => {
    const { store, props } = wrapper.useWrappedStore(rest);
    const { emotionCache = clientSideEmotionCache, pageProps } = props;

    return (
        <Provider store={store}>
            <CacheProvider value={emotionCache}>
                <HeadWrapper />
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <Component {...pageProps} />{' '}
                </ThemeProvider>
            </CacheProvider>
        </Provider>
    );
};

export default App;
