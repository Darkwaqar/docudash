import GreenButton from '@components/GreenButton';
import Input from '@components/Input';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SignUpAPI, SignUpStackScreenProps } from '@type/index';
import { colors } from '@utils/Colors';
import axios from 'axios';
import { useFonts } from 'expo-font';
import React, { useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, ScrollView, StyleSheet, View } from 'react-native';
import { Chip, Text } from 'react-native-paper';
import tw from 'twrnc';

import { selectSignupToken, setNotaryStep } from '@stores/slices/UserSlice';
import { useDispatch, useSelector } from 'react-redux';

interface form {
  first_Name: string;
  last_Name: string;
  phone: string;
}
const UserInfoScreen = () => {
  const token = useSelector(selectSignupToken);
  const dispatch = useDispatch();
  const navigation = useNavigation<SignUpStackScreenProps<'Step2'>['navigation']>();
  const route = useRoute<SignUpStackScreenProps<'Step2'>['route']>();
  const [fontsLoaded] = useFonts({
    Signature: require('@assets/Fonts/Creattion.otf'),
  });

  const [form, setForm] = useState<form>({
    first_Name: '',
    last_Name: '',
    phone: '',
  });

  const [loading, setLoading] = useState<boolean>(false);
  const fetchData = async () => {
    setLoading(true);
    console.log('token', token);

    axios
      .post('https://docudash.net/api/notary-sign-up-1/' + token, {
        first_name: form.first_Name,
        last_name: form.last_Name,
        phone: form.phone,
      })
      .then((response) => {
        const { data, success, next_access, message, next }: SignUpAPI = response.data;

        console.log('NameScreen', data);
        if (success) {
          setLoading(false),
            // @ts-ignore
            navigation.replace('NotaryLoginStackNavigator', {
              screen: ('Step' + data.steps) as any,
              params: {
                api: next,
              },
            }),
            dispatch(setNotaryStep(data.steps));
        } else {
          if (message.first_name) {
            Alert.alert(message.first_name[0]);
          } else if (message.last_name) {
            Alert.alert(message.last_name[0]);
          } else if (message.phone) {
            Alert.alert(message.phone[0]);
          }
          setLoading(false);
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log('err', err);
      });
  };
  if (!fontsLoaded) {
    return null;
  }

  return (
    <ScrollView contentContainerStyle={tw`h-full`} keyboardShouldPersistTaps="handled">
      <View style={tw`flex-1 gap-3 justify-center px-10 bg-white `}>
        <KeyboardAvoidingView
          keyboardVerticalOffset={150}
          // behavior={"position"}
        >
          <View style={tw`absolute top--10 left-5`}>
            <Chip>
              <Text variant="labelLarge">{`2/6`}</Text>
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
            Let's start!
          </Text>
          <Text
            style={{
              fontFamily: 'nunito-SemiBold',
              color: colors.blue,
              fontSize: 15,
              alignSelf: 'center',
            }}
          >
            Lets's get the basics. Enter your info below
          </Text>
          <View style={tw`flex-row  justify-between gap-2`}>
            <Input
              state={form.first_Name}
              setState={(text) => setForm({ ...form, first_Name: text })}
              placeholder={'First name'}
              keyboardType={'default'}
              style={{ flex: 1 }}
            />
            <Input
              state={form.last_Name}
              setState={(text) => setForm({ ...form, last_Name: text })}
              placeholder={'Last name'}
              keyboardType={'default'}
              style={{ flex: 1 }}
            />
          </View>
          <Input
            state={form.phone}
            setState={(text) => setForm({ ...form, phone: text })}
            placeholder={'Phone Number'}
            keyboardType={'number-pad'}
          />
          <View style={tw`flex-row justify-between items-center `}>
            <Image
              style={tw`w-30 self-center top-3`}
              resizeMode="contain"
              source={require('@assets/logo.png')}
            />
            <View style={tw`w-30  h-20 border-b-2  border-gray-400 justify-end py-3 items-center`}>
              <Text style={{ fontFamily: 'Signature', fontSize: 28 }}>
                {`${form.first_Name}${form.last_Name}`}
              </Text>
              <Text style={[tw`text-xs font-thin absolute bottom--5 left-0`]}>Signature</Text>
            </View>
          </View>
          <GreenButton loading={loading} text={'Next'} onPress={fetchData} styles={tw`px-8 mt-8`} />
        </KeyboardAvoidingView>
      </View>
    </ScrollView>
  );
};
export default UserInfoScreen;

const styles = StyleSheet.create({});
