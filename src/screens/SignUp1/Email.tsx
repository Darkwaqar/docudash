import GreenButton from '@components/GreenButton';
import Input from '@components/Input';
import { useNavigation } from '@react-navigation/native';
import { SignUpAPI, SignUpStackScreenProps } from '@type/index';
import { storeData, storeToken } from '@utils/AsyncFunc';
import axios from 'axios';
import React, { useState } from 'react';
import {
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Appbar, Avatar, Checkbox, Divider, Menu, Text } from 'react-native-paper';
import tw from 'twrnc';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import COLORS from '@constants/colors';

const EmailScreen = () => {
  const navigation = useNavigation<SignUpStackScreenProps<'Index'>['navigation']>();
  const route = useNavigation<SignUpStackScreenProps<'Index'>['route']>();
  const [inputVal, setInputVal] = useState<string>('');
  const [checked, setChecked] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [visible, setVisible] = React.useState(false);
  console.log(visible);

  const fetchData = () => {
    setLoading(true);
    axios
      .post('https://docudash.net/api/sign-up', {
        email: inputVal?.toLowerCase(),
        checkAgree: checked,
      })
      .then((response) => {
        const { data, success, next_access, message, next }: SignUpAPI = response.data;
        console.log('emailScreen', response.data);
        if (success) {
          if (data.steps === 5) {
            // @ts-ignore
            navigation.navigate('SignUpIndex', {
              screen: ('Step' + data.steps) as any,
              params: {
                api: next,
                email: data.email,
              },
            });
          } else {
            // @ts-ignore
            navigation.replace('SignUpIndex', {
              screen: ('Step' + data.steps) as any,
              params: {
                api: next,
                email: data.email,
              },
            });
          }
          storeToken(next_access);
          storeData('Step' + data.steps);
        } else {
          // @ts-ignore
          message.email ? Alert.alert(message.email[0]) : Alert.alert(JSON.stringify(message));
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };
  const closeMenu = () => setVisible(false);
  const openMenu = () => setVisible(true);
  return (
    <SafeAreaView style={tw`h-full bg-white`}>
      <View style={tw` items-end px-10 py-5`}>
        <Menu
          visible={visible}
          anchorPosition="bottom"
          onDismiss={closeMenu}
          anchor={
            <TouchableOpacity style={tw`flex-row gap-1 items-center`} onPress={openMenu}>
              <Text style={tw`text-4 font-semibold text-gray-600`}>Help</Text>
              <Icon name="arrow-down-drop-circle-outline" size={20} color={'gray'} />
            </TouchableOpacity>
          }
        >
          <Menu.Item
            title="Signing"
            onPress={() => {
              navigation.navigate('Browser', { url: 'Signing', heading: 'Signing' });
              closeMenu();
            }}
          />
          <Divider />
          <Menu.Item
            title="Support"
            onPress={() => {
              navigation.navigate('Browser', { url: 'Support', heading: 'Support' });
              closeMenu();
            }}
          />
          <Divider />
          <Menu.Item
            title="Get a Demo"
            onPress={() => {
              navigation.navigate('Browser', { url: 'Get a Demo', heading: 'Get a Demo' });
              closeMenu();
            }}
          />
        </Menu>
      </View>

      <ScrollView
        contentContainerStyle={tw`flex-1 items-center justify-center  bg-white`}
        keyboardShouldPersistTaps="handled"
      >
        {/* HEADER FINISHED  */}
        <View style={tw` px-14 `}>
          <Text
            style={{
              fontFamily: 'nunito-SemiBold',
              fontSize: 25,
            }}
          >
            Try Docudash free for 30 days
          </Text>
          <Text style={{ fontFamily: 'nunito-SemiBold', fontSize: 15 }}>
            No credit card required
          </Text>
          <Input state={inputVal} setState={setInputVal} placeholder="Email" />
          <View style={tw`flex-row mt-5 w-[${'100%'}] items-start`}>
            <View
              style={[
                tw`border-2 rounded-lg border-gray-400 mx-2 bg-[${'#F6F6F6'}]`,
                Platform.OS === 'android' ? tw`border-0` : null,
              ]}
            >
              <Checkbox
                status={checked ? 'checked' : 'unchecked'}
                onPress={() => {
                  setChecked(checked ? 0 : 1);
                }}
              />
            </View>
            <Text style={styles.soft_text}>
              I agree to receive marketing communications from Docudash and acknowledge that I can
              opt out at any time by visiting the Preference Centre.
            </Text>
          </View>
          <Text style={[styles.soft_text, tw`mt-5`]}>
            By clicking the Get Started button below, you agree to the Terms & Conditions and
            Privacy Policy.
          </Text>
          <GreenButton loading={loading} text={'Get Started'} onPress={fetchData} />
          <Text style={[styles.soft_text, tw`mt-5`]}>
            By clicking the Get Started button below, you agree to the
            <Text style={tw`text-blue-500`}> Terms & Conditions</Text> and{' '}
            <Text style={tw`text-blue-500`}>Privacy Policy.</Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EmailScreen;

const styles = StyleSheet.create({
  soft_text: tw` text-gray-500 `,
});
