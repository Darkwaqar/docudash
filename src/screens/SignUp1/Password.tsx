import GreenButton from '@components/GreenButton';
import Input from '@components/Input';
import { useNavigation, useRoute } from '@react-navigation/native';
import { setAccessToken } from '@stores/Slices';
import { SignUpStackScreenProps } from '@type/index';
import { storeTokenGlobal } from '@utils/AsyncGlobal';
import axios from 'axios';
import React, { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Appbar, Button } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import tw from 'twrnc';

const PasswordScreen = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const navigation = useNavigation<SignUpStackScreenProps<'Step5'>['navigation']>();
  const route = useRoute<SignUpStackScreenProps<'Step5'>['route']>();
  const { token, email } = route.params;

  const [password, setPassword] = useState<string>('');

  const dispatch = useDispatch();
  const LoginButton = async () => {
    setLoading(true);
    await axios
      .post('https://docudash.net/api/log-in/' + token, {
        email: email,
        password: password,
      })
      .then((response) => {
        const { token, success, message }: { token: string; success: boolean; message: any } =
          response.data;
        console.log(response.data);
        setLoading(false);
        if (success) {
          console.log('token', token);
          storeTokenGlobal(token);
          dispatch(setAccessToken(token));
        } else {
          Alert.alert(message);
        }
      })
      .catch((error) => {
        Alert.alert('Error', error.message);
        setLoading(false);
        console.log(error);
        Alert.alert(error.message);
      });
  };
  return (
    <>
      <ScrollView contentContainerStyle={tw`h-full`}>
        <View style={tw`flex-1 bg-white gap-2 px-10 justify-center`}>
          <View style={tw`flex-row items-center`}>
            <Button
              onPress={() => navigation.goBack()}
              mode="outlined"
              icon={'arrow-left-thick'}
              style={tw``}
              children={''}
            ></Button>
            <Image
              style={tw`w-50 h-10 rounded-sm self-center`}
              source={require('@assets/docudash_pow_logo.png')}
            />
          </View>
          <Input
            state={password}
            secureTextEntry
            setState={setPassword}
            placeholder={'Enter password'}
            style={{}}
          />
          <GreenButton loading={loading} text={'Login'} onPress={LoginButton} styles={{}} />
        </View>
      </ScrollView>
    </>
  );
};

export default PasswordScreen;

const styles = StyleSheet.create({});
