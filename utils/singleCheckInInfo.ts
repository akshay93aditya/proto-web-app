import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const getSingleCheckIn = async (slug) => {
  return axios.get(`https://proto-api.onrender.com/checkins/${slug}`);
};

export const useSingleCheckIn = (slug) => {
  return useQuery({
    queryKey: ['singleCheckInData', slug],
    queryFn: () => getSingleCheckIn(slug),
  });
};
