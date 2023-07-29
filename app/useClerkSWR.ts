// @ts-ignore
import useSWR from 'swr';
// @ts-ignore
import { useAuth } from '@clerk/nextjs';
// @ts-ignore
export default function useClerkSWR(url) {
  // @ts-ignore
  const { getToken } = useAuth();
    // @ts-ignore
  const fetcher = async (...args) => {
    // @ts-ignore
    return fetch(...args, {
      headers: { Authorization: `Bearer ${await getToken()}` }
    }).then(res => res.json());
  };
  // @ts-ignore
  return useSWR(url, fetcher);
}
