// import { render, screen } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
// import { useRouter } from 'next/router';
// import Link from './Link'; // adjust this import to your file structure

// jest.mock('next/router', () => ({
//   useRouter: jest.fn(),
// }));

// describe('Link', () => {
//   let router: {
//     pathname: string;
//     push: jest.Mock;
//   };

//   beforeEach(() => {
//     router = {
//       pathname: '/',
//       push: jest.fn(),
//     };
//     (useRouter as jest.Mock).mockReturnValue(router);
//   });

//   afterAll(() => {
//     jest.clearAllMocks();
//   });

//   it('renders an internal link', () => {
//     render(<Link href="/internal">Internal Link</Link>);
//     const link = screen.getByRole('link', { name: 'Internal Link' });
//     expect(link).toBeInTheDocument();
//     expect(link).toHaveAttribute('href', '/internal');
//   });

//   it('renders an external link', () => {
//     render(<Link href="http://external.com">External Link</Link>);
//     const link = screen.getByRole('link', { name: 'External Link' });
//     expect(link).toBeInTheDocument();
//     expect(link).toHaveAttribute('href', 'http://external.com');
//   });

//   it('adds active class for the current route', () => {
//     router.pathname = '/internal';
//     render(<Link href="/internal">Internal Link</Link>);
//     const link = screen.getByRole('link', { name: 'Internal Link' });
//     expect(link).toHaveClass('active');
//   });

//   it('does not add active class for a non-current route', () => {
//     router.pathname = '/other';
//     render(<Link href="/internal">Internal Link</Link>);
//     const link = screen.getByRole('link', { name: 'Internal Link' });
//     expect(link).not.toHaveClass('active');
//   });

//   it('does not navigate to external link on click', () => {
//     render(<Link href="http://external.com">External Link</Link>);
//     const link = screen.getByRole('link', { name: 'External Link' });
//     userEvent.click(link);
//     expect(router.push).not.toHaveBeenCalled();
//   });
// });
