import axios from 'axios';
import { CheckInTransaction } from './checkInTransaction';

let baseUrl = 'https://proto-api.onrender.com';

export async function handleCheckInSubmit(
  e: any,
  wallet,
  setcheckIn,
  setLoading,
  setSuccess,
  checkInMessage,
  files,
  selectedTag,
  orbisTag,
  orbisFiles,
  orbis,
  setPdl,
  setCheckInSignature,
  lat,
  lng
) {
  e.preventDefault();
  try {
    setLoading(true);
    if (!wallet.publicKey) {
      alert('Wallet Not Connected');
      setLoading(false);
      return;
    }

    const usersResponse = await axios({
      method: 'get',
      url: `${baseUrl}/users`,
      params: { wallet_address: wallet.publicKey.toString() },
    });

    if (usersResponse.data.length) {
      const orbisCheckinResponse = await orbis.createPost({
        body: checkInMessage,
        data: {
          latitude: lat,
          longitude: lng,
        },
        tags: orbisTag,
        files: orbisFiles,
      });
      console.log(orbisCheckinResponse);

      const checkinResponse = await axios({
        method: 'post',
        url: `${baseUrl}/checkins`,
        data: {
          user_wallet_address: wallet.publicKey.toString(),
          message: checkInMessage,
          latitude: lat,
          longitude: lng,
          ...(files && { files }),
          tag: selectedTag,
        },
      });
      console.log(checkinResponse);
      if (checkinResponse.data) {
        await CheckInTransaction(
          checkinResponse.data._id,
          lat,
          lng,
          checkInMessage,
          setPdl,
          setcheckIn,
          setCheckInSignature
        );
        setcheckIn(checkinResponse);
        setLoading(false);
        setSuccess(true);
      }
    } else {
      await axios({
        method: 'post',
        url: `${baseUrl}/users`,
        data: {
          wallet_address: wallet.publicKey.toString(),
        },
      });
      const orbisCheckinResponse = await orbis.createPost({
        body: checkInMessage,
        data: {
          latitude: lat,
          longitude: lng,
        },
        tags: orbisTag,
        files: orbisFiles,
      });
      console.log(orbisCheckinResponse);

      const checkinResponse = await axios({
        method: 'post',
        url: `${baseUrl}/checkins`,
        data: {
          user_wallet_address: wallet.publicKey.toString(),
          message: checkInMessage,
          latitude: lat,
          longitude: lng,
          ...(files && { files }),
          tag: selectedTag,
        },
      });
      await CheckInTransaction(
        checkinResponse.data._id,
        lat,
        lng,
        checkInMessage,
        setPdl,
        setcheckIn,
        setCheckInSignature
      );
      setcheckIn(checkinResponse.data);
      setLoading(false);
      setSuccess(true);
    }
  } catch (error) {
    console.log(error);
    setLoading(false);
    setSuccess(false);
  }
}
