import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const getUserInfo = async (walletAddress) => {
  return axios.get('https://proto-api.onrender.com/users', {
    params: { wallet_address: walletAddress },
  });
};

export const useGetUserInfo = (walletAddress) => {
  return useQuery({
    queryKey: ['userInfo', walletAddress],
    queryFn: () => getUserInfo(walletAddress),
  });
};
