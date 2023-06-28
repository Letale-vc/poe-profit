import { RouterContext } from 'next/dist/shared/lib/router-context';
import { ReactNode } from 'react';

interface TestWrapperProps {
    children: ReactNode;
}
export const MockWrapper: React.FC<TestWrapperProps> = ({ children }) => {
    const router = {
        basePath: '',
        pathname: '/',
        route: '/',
        asPath: '/',
        query: {},
        push: jest.fn(),
        replace: jest.fn(),
        reload: jest.fn(),
        back: jest.fn(),
        prefetch: jest.fn(),
        beforePopState: jest.fn(),
        isFallback: false,
        events: {
            on: jest.fn(),
            off: jest.fn(),
            emit: jest.fn(),
        },
    };

    return (
        <RouterContext.Provider value={router as any}>
            {children}
        </RouterContext.Provider>
    );
};

export default MockWrapper;
