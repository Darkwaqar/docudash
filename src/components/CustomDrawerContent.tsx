import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { logoutUser } from '@stores/slices/UserSlice';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Drawer } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import tw from 'twrnc';
import DrawerProfileModal from './DrawerProfileModal';
import { useNavigation } from '@react-navigation/native';

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  return (
    <DrawerContentScrollView
      style={{
        paddingVertical: 30,
        paddingBottom: 100,
      }}
    >
      <View style={tw`flex-row items-center   mt-4 w-full justify-between px-5`}>
        <Image
          style={tw`w-44  bg-white rounded-xl`}
          resizeMode="contain"
          source={require('@assets/docudash_pow_logo.png')}
        />
      </View>
      <DrawerProfileModal />
      <DrawerItemList {...props} />
      <Drawer.Item
        active
        label="LOGOUT"
        style={tw`m-1 bg-transparent rounded-none mb-10`}
        icon="logout"
        onPress={() => {
          dispatch(logoutUser());
        }}
      />
    </DrawerContentScrollView>
  );
};

export default CustomDrawerContent;

const styles = StyleSheet.create({});
