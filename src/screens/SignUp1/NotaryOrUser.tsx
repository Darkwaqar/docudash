import GreenButton from '@components/GreenButton';
import Icon from '@expo/vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import { setUserStep, setUserType } from '@stores/slices/UserSlice';
import { SignUpStackScreenProps } from '@type/*';
import React, { useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Divider, Menu, Text } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import tw from 'twrnc';

const NotaryOrUser = () => {
  const dispatch = useDispatch();
  const [showDropDown, setShowDropDown] = useState(false);
  const [dropDownVal, setDropDownVal] = useState<'User' | 'Notary'>('User');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<SignUpStackScreenProps<'NotaryOrUser'>['navigation']>();
  dispatch(setUserStep(0));

  const closeMenu = () => {
    setShowDropDown(false);
  };
  const openMenu = () => {
    setShowDropDown(true);
  };

  return (
    <View style={tw`flex-1 justify-center items-center`}>
      <View style={tw`w-50 gap-4 `}>
        <Image style={tw`w-40 h-30 self-center`} source={require('@assets/adaptive-icon.png')} />
        {/* <Text variant="titleMedium" style={tw`font-bold text-center`}>
          How do you want to proceed?
        </Text> */}
        {/* <Menu
          style={tw`w-50`}
          visible={showDropDown}
          anchorPosition="bottom"
          onDismiss={closeMenu}
          anchor={
            <TouchableOpacity
              style={tw`flex-row items-center w-full bg-white justify-between  px-4 border rounded-xl h-12 border-gray-500`}
              onPress={openMenu}
            >
              <Text variant="labelLarge" style={tw``}>
                {dropDownVal}
              </Text>
              <View style={tw`bottom-0`}>
                <Icon name="down" size={15} color={'black'} />
              </View>
            </TouchableOpacity>
          }
        >
          <Menu.Item
            title="User"
            style={tw`w-full self-center`}
            onPress={() => {
              setDropDownVal('User');
              closeMenu();
            }}
          />
          <Divider />
          <Menu.Item
            style={tw`w-full`}
            title="Notary"
            onPress={() => {
              setDropDownVal('Notary');
              closeMenu();
            }}
          />
        </Menu> */}
        <GreenButton
          loading={loading}
          text={'Get Started'}
          onPress={() => {
            navigation.navigate('SignUpIndex');
          }}
        />
      </View>
    </View>
  );
};

export default NotaryOrUser;
