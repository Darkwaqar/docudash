import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import StackNavigator from '@navigation/StackNavigator';
import { useMaterial3Theme } from '@pchmn/expo-material3-theme';
import { NavigationContainer } from '@react-navigation/native';
import { persistor, store } from '@stores/index';
import { darkColors, lightColors } from '@utils/index';
import React, { useEffect, useState } from 'react';
import { StyleSheet, useColorScheme } from 'react-native';
import 'react-native-gesture-handler';
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from 'react-native-paper';
import { Provider, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import useCachedResources from './src/hooks/useCachedResources';
import LicenseDocument from '@screens/NotarySignUp/LicenseDocument';
import CreatePDF from '@screens/CreatePDF';
import Call from '@screens/Call';
import Calling from '@screens/Calling';
import IncomingCall from '@screens/IncomingCall';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import axios from 'axios';
import Root from './Root'
import { selectAccessToken } from '@stores/slices/UserSlice';
export default function App({ navigation }) {
  const isLoadingComplete = useCachedResources();
  const [notifi, setNotifi] = useState('');
  const onMessageReceived = async (message: any) => {
    // const {type, timestamp} = message.data;
    // Request permissions (required for iOS)
    setNotifi(message);
    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
    });

    // if (message !== null) {

    notifee.displayNotification({
      title: message.notification.title,
      body: message.notification.body,
      android: {
        channelId,
        importance: AndroidImportance.HIGH,
      },
    });
    // }
  };
  messaging().onMessage(onMessageReceived);
  notifee.onForegroundEvent(({ type, detail }) => {
    if (type === EventType.PRESS) {
      console.log('message.data', detail);
      navigation.navigate('DocumentViewer', { LinkToView: detail.LinkToView });
    }
  });
  // messaging().setBackgroundMessageHandler(onMessageReceived);
  async function onAppBootstrap() {
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

  const colorScheme = useColorScheme();
  const { theme } = useMaterial3Theme();

  const paperTheme =
    colorScheme === 'dark'
      ? { ...MD3DarkTheme, colors: darkColors.colors }
      : { ...MD3LightTheme, colors: lightColors.colors };

  if (!isLoadingComplete) {
    return null;
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PaperProvider theme={paperTheme}>
          <BottomSheetModalProvider>
            <NavigationContainer>
              <Root />
              {/* <Calling /> */}
              {/* <CreatePDF /> */}
              {/* <LicenseDocument /> */}
            </NavigationContainer>
          </BottomSheetModalProvider>
        </PaperProvider>
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
