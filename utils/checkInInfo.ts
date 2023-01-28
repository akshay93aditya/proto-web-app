import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const getTimelineData = async (walletAddress) => {
  return axios.get('https://proto-api.onrender.com/checkins', {
    params: { user_wallet_address: walletAddress },
  });
};

export const useTimelineData = (walletAddress) => {
  return useQuery({
    queryKey: ['timelineData', walletAddress],
    queryFn: () => getTimelineData(walletAddress),
  });
};
