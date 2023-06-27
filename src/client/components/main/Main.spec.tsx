import { useGetDataQuery } from '../../lib/apiConfig';
import { Main } from './Main';
import TestWrapper from '../../../../tests/components/TestWrapper';
import { render } from '@testing-library/react';

jest.mock('../../lib/apiConfig', () => ({
    useGetDataQuery: jest.fn(),
}));

describe('Main Component', () => {
    const mockUseGetProfitDataQuery = useGetDataQuery as jest.Mock;

    beforeEach(() => {
        jest.resetAllMocks();
    });

    test('renders Main component correctly', () => {
        mockUseGetProfitDataQuery.mockReturnValue({
            data: undefined,
        });

        render(
            <TestWrapper>
                <Main adminAddress />
            </TestWrapper>,
        );
    });

    test('displays last update time correctly', async () => {
        const { useGetDataQuery } = await import('../../lib/apiConfig');
        const mockUseGetPoeFlipDataQuery = useGetDataQuery as jest.Mock;
        const lastUpdate = new Date().toLocaleString();
        mockUseGetPoeFlipDataQuery.mockReturnValue({
            data: { data: [], lastUpdate },
            adminAddress: true,
        });

        render(
            <TestWrapper>
                <Main adminAddress />
            </TestWrapper>,
        );
    });
});
