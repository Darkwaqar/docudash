import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native';
import tw from 'twrnc';
import HomeHeader from '@components/HomeHeader';
import UserRequestList from '@components/UserRequestList';
import DrawerScreenContainer from '@components/DrawerScreenContainer';

const UserList = () => {
  return (
    <DrawerScreenContainer>
      <SafeAreaView style={tw`flex-1`}>
        <HomeHeader heading={'Requests'} />
        <UserRequestList />
      </SafeAreaView>
    </DrawerScreenContainer>
  );
};

export default UserList;
