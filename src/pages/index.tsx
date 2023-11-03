import { checkIpAddress } from '~/utils/checkIpAddress';
import { Main } from '../components/Main/Main';
import type {
  InferGetServerSidePropsType,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from 'next';

export const getServerSideProps = (
  context: GetServerSidePropsContext,
): GetServerSidePropsResult<{
  adminAddress: boolean;
}> => {
  const adminAddress = checkIpAddress(context.req);
  return {
    props: {
      adminAddress,
    },
  };
};

export type PropsMain = InferGetServerSidePropsType<typeof getServerSideProps>;

export default Main;
