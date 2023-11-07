import GreenButton from '@components/GreenButton';
import Input from '@components/Input';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SignUpAPI, SignUpStackScreenProps } from '@type/index';
import { colors } from '@utils/Colors';
import axios from 'axios';
import React, { useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, ScrollView, StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Chip, Text } from 'react-native-paper';
import tw from 'twrnc';
import { useSelector } from 'react-redux';
import { selectSignupToken, setUserStep } from '@stores/slices/UserSlice';
import { useDispatch } from 'react-redux';

const OptScreen = () => {
  const navigation = useNavigation<SignUpStackScreenProps<'Step2'>['navigation']>();
  const route = useRoute<SignUpStackScreenProps<'Step2'>['route']>();
  const [otp, setOtp] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  const token = useSelector(selectSignupToken);

  const fetchData = async () => {
    setLoading(true);
    axios
      .post('https://docudash.net/api/sign-up-2/' + token, {
        verification_code: otp,
      })
      .then((response) => {
        const { success = true, data }: SignUpAPI = response.data;
        console.log('optScreen-', response.data);

        if (success) {
          setLoading(false),
            //@ts-ignore
            navigation.replace('SignUpIndex', {
              screen: ('Step' + data.steps) as any,
              params: {
                api: response.data.next,
              },
            }),
            dispatch(setUserStep(data.steps));
        } else {
          Alert.alert('Failed', 'Wrong code Please try again or resend code'),
            setOtp(''),
            setLoading(false);
        }
      })
      .catch((err) => {
        setLoading(false);
      });
  };
  const ResendCode = async () => {
    axios
      .get('https://docudash.net/api/sendCodeAgain/' + token)
      .then((response) => {
        const data = response.data;
        console.log('resend code ', data);
        if (data.success) {
          Alert.alert('Code sent to ' + data.data.email);
        } else {
          Alert.alert('Please try again');
        }
      })
      .catch((err) => {
        console.log('error', err);
      });
  };

  return (
    <ScrollView contentContainerStyle={tw`h-full bg-white`}>
      <View style={tw`flex-1 gap-2 justify-center px-10`}>
        <KeyboardAvoidingView keyboardVerticalOffset={150} behavior={'position'}>
          <View style={tw`absolute top--10 left-5`}>
            <Chip>
              <Text variant="labelLarge">{`2/4`}</Text>
            </Chip>
          </View>
          <Image
            style={tw`w-65 self-center`}
            resizeMode="contain"
            source={require('@assets/logo.png')}
          />
          <Text
            style={{
              fontFamily: 'nunito-SemiBold',
              color: colors.blue,
              fontSize: 25,
              alignSelf: 'center',
            }}
          >
            Check your email
          </Text>
          <Text
            style={[
              { fontFamily: 'nunito-SemiBold' },
              tw`text-center text-[${colors.blue}] text-base`,
            ]}
          >
            A temporary confirmation code was sent to your email
          </Text>

          <Input
            state={otp}
            setState={(text) => setOtp(text)}
            placeholder={'6 digit verification code'}
            style={tw`text-center`}
            keyboardType={'number-pad'}
          />
          <GreenButton loading={loading} text={'Next'} onPress={fetchData} />
          <TouchableOpacity style={tw`p-5`} onPress={ResendCode}>
            <Text style={tw`text-blue-700 text-center`}>Resend code</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
    </ScrollView>
  );
};

export default OptScreen;

const styles = StyleSheet.create({});
