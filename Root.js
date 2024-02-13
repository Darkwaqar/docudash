import React, { useEffect } from 'react';
import StackNavigator from '@navigation/StackNavigator';
import { selectAccessToken, setNotification } from '@stores/slices/UserSlice';
import { useDispatch, useSelector } from 'react-redux';
import useGetRequest from './src/hooks/useGetRequest';
import messaging from '@react-native-firebase/messaging';
import axios from 'axios';
const Root = () => {
  const accessToken = useSelector(selectAccessToken);
  const dispatch = useDispatch();
  useEffect(() => {
    console.log('accessToken', accessToken);
    if (accessToken) {
      store_token();
    }
  }, [accessToken]);
  const { data, loading, error } = useGetRequest({
    url: 'https://docudash.net/api/get-notifications',
    token: accessToken,
  });
  if (data?.status) {
    dispatch(setNotification(data));
  }
  const store_token = async () => {
    const token = await messaging().getToken();
    // alert('store_token');
    console.log('token ==><><', token);
    const obj = {
      token: token,
    };
    axios
      .post('https://docudash.net/api/store-token', obj, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        console.log('store_token', response.data);
      })
      .catch((error) => {
        console.log('Error----', error);
      });
  };
  return <StackNavigator />;
};
export default Root;
