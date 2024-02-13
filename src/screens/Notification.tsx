import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import useGetRequest from '../hooks/useGetRequest';
import { selectAccessToken, selectNotification } from '@stores/slices/UserSlice';
import { useSelector } from 'react-redux';
import tw from 'twrnc';
import { Avatar } from 'react-native-paper';
import HomeHeader from '@components/HomeHeader';
import { useNavigation } from '@react-navigation/native';
import NotFound from '@components/NotFound';

const Notification = () => {
  const accessToken = useSelector(selectAccessToken);
  const Notification = useSelector(selectNotification);
  const navigation = useNavigation();
  const { data, loading, error } = useGetRequest({
    url: 'https://docudash.net/api/get-notifications',
    token: accessToken,
  });
  console.log('Dataa', Notification);

  return (
    <SafeAreaView style={tw`flex-1 `}>
      <HomeHeader heading={'Notification'} />
      {loading && (
        <View
          style={{
            flex: 1,
            height: '100%',
            width: '100%',
            position: 'absolute',
            zIndex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              paddingHorizontal: 30,
              paddingVertical: 30,
              borderRadius: 10,
              backgroundColor: 'black',
            }}
          >
            <ActivityIndicator size="large" color={'white'} />
          </View>
        </View>
      )}
      <FlatList
        contentContainerStyle={tw`flex-grow gap-5`}
        ListEmptyComponent={<NotFound onPress={() => console.log('Hello')} />}
        data={Notification?.NotificationsDetailsList}
        // contentContainerStyle={tw`gap-5`}
        renderItem={({ item, i }) => {
          console.log('link_redirect_app', item);

          return (
            <TouchableOpacity
              onPress={() =>
                item.link_redirect_app === 'https://docudash.net/api/dashboard'
                  ? navigation.navigate('HomeScreen')
                  : navigation.navigate('DocumentViewer', { LinkToView: item.link_redirect_app })
              }
              style={tw`flex-row items-center gap-2 justify-between px-4 border-b-2 border-b-gray-100 p-4`}
            >
              <View style={tw`flex-row items-center gap-2`}>
                <Avatar.Image
                  source={{
                    uri: item.ProfileImage
                      ? item.ProfileImage
                      : 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
                  }}
                  size={40}
                />
                <View style={tw`gap-1`}>
                  <Text>{item.title}</Text>
                  <Text>{item.body}</Text>
                </View>
              </View>
              <Text>{item.date}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
};

export default Notification;
