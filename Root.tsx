import React, { useEffect, useState } from 'react';
import StackNavigator from '@navigation/StackNavigator';
import { selectAccessToken, setNotification } from '@stores/slices/UserSlice';
import { useDispatch, useSelector } from 'react-redux';
import useGetRequest from './src/hooks/useGetRequest';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
const Root = () => {
  const accessToken = useSelector(selectAccessToken);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [notifi, setNotifi] = useState('');
  const onMessageReceived = async (message: any) => {
    // const {type, timestamp} = message.data;
    // Request permissions (required for iOS)
    console.log('message ===><><', message);
    setNotifi(message);
    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
    });

    if (message !== null) {
      notifee.displayNotification({
        title: message.notification.title,
        body: message.notification.body,
        android: {
          channelId,
          importance: AndroidImportance.HIGH,
        },
      });
    }
  };
  messaging().onMessage(onMessageReceived);

  // messaging().setBackgroundMessageHandler(onMessageReceived);
  async function onAppBootstrap() {
    dispatch(setNotification(data));
    // Register the device with FCM
    await notifee.requestPermission();
    if (!messaging().isDeviceRegisteredForRemoteMessages) {
      await messaging().registerDeviceForRemoteMessages();
    }
    // Get the token

    // Save the token
    // await postToApi('/users/1234/tokens', { token });
  }
  useEffect(() => {
    onAppBootstrap();
  }, []);
  notifee.onForegroundEvent(({ type, detail }) => {
    if (type === EventType.PRESS) {
      console.log('message.data', detail, type);
      // navigation.navigate('DocumentViewer', { LinkToView: detail.LinkToView });
      // navigation?.navigate('Home');
    }
  });
  notifee.onBackgroundEvent(async ({ type, detail }) => {
    const { notification, pressAction } = detail;
    console.log('message.data', detail, type);
    // Check if the user pressed the "Mark as read" action
    if (type === EventType.ACTION_PRESS && pressAction.id === 'mark-as-read') {
      // Update external API
      // await fetch(`https://my-api.com/chat/${notification.data.chatId}/read`, {
      //   method: 'POST',
      // });
      navigation?.navigate('Home');

      // Remove the notification
      await notifee.cancelNotification(notification.id);
    }
  });
  const { data, loading, error } = useGetRequest({
    url: 'https://docudash.net/api/get-notifications',
    token: accessToken,
  });
  useEffect(() => {
    if (data?.status) {
      dispatch(setNotification(data));
    }
  }, []);
  useEffect(() => {
    console.log('accessToken', accessToken);

    if (accessToken) {
      store_token();
    }
  }, [accessToken]);

  console.log('data', data);

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
