import { useGetDataQuery } from '../../lib/apiConfig';
import { render, screen, fireEvent } from '@testing-library/react';
import MockWrapper from '../../../../tests/components/MockWrapper';
import { Main } from './Main';

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
            <MockWrapper>
                <Main adminAddress />
            </MockWrapper>,
        );

        expect(screen.getByText(`Last update:`)).toBeInTheDocument();
        expect(screen.getByText('settings')).toBeInTheDocument();
        expect(screen.getByText('change queries')).toBeInTheDocument();
        expect(screen.queryByText('Flip Table profit info')).toBeNull();
        expect(screen.queryByText('ExpGem Table profit info')).toBeNull();
    });

    test('renders Main component correctly №2', async () => {
        const { useGetDataQuery } = await import('../../lib/apiConfig');
        const mockUseGetPoeFlipDataQuery = useGetDataQuery as jest.Mock;
        const lastUpdate = new Date().toLocaleString();
        mockUseGetPoeFlipDataQuery.mockReturnValue({
            data: { data: [], lastUpdate },
            adminAddress: true,
        });

        render(
            <MockWrapper>
                <Main adminAddress={false} />
            </MockWrapper>,
        );

        expect(
            screen.getByText(`Last update: ${lastUpdate}`),
        ).toBeInTheDocument();
        expect(screen.queryByText('settings')).toBeNull();
        expect(screen.queryByText('change queries')).toBeNull();
        expect(screen.getByText('Flip Table profit info')).toBeInTheDocument();
        expect(
            screen.getByText('ExpGem Table profit info'),
        ).toBeInTheDocument();
    });

    test('changes active tab correctly', () => {
        const mockData = {
            data: [],
            lastUpdate: new Date().toLocaleString(),
        };

        mockUseGetProfitDataQuery.mockReturnValue({
            data: mockData,
        });

        render(
            <MockWrapper>
                <Main adminAddress />
            </MockWrapper>,
        );

        const flipTab = screen.getByText('Flip Table profit info');
        const expGemTab = screen.getByText('ExpGem Table profit info');

        expect(flipTab).toHaveAttribute('aria-selected', 'true');
        expect(expGemTab).toHaveAttribute('aria-selected', 'false');

        fireEvent.click(expGemTab);

        expect(flipTab).toHaveAttribute('aria-selected', 'false');
        expect(expGemTab).toHaveAttribute('aria-selected', 'true');
    });
});
