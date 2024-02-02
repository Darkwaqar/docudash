import React, { useEffect } from 'react';
import StackNavigator from '@navigation/StackNavigator';
import { selectAccessToken } from '@stores/slices/UserSlice';
import { useSelector } from 'react-redux';
import messaging from '@react-native-firebase/messaging';
import axios from 'axios';
const Root = () => {
  const accessToken = useSelector(selectAccessToken);
  useEffect(() => {
    console.log('accessToken', accessToken);
    if (accessToken) {
      store_token();
    }
  }, [accessToken]);
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
