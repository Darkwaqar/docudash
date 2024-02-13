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

import axios from 'axios';
import Root from './Root';
import { selectAccessToken } from '@stores/slices/UserSlice';
export default function App({ navigation }) {
  const isLoadingComplete = useCachedResources();

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
