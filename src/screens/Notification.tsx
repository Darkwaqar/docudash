import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import useGetRequest from '../hooks/useGetRequest';
import { selectAccessToken } from '@stores/slices/UserSlice';
import { useSelector } from 'react-redux';
import tw from 'twrnc';
import { Avatar } from 'react-native-paper';
import HomeHeader from '@components/HomeHeader';
import { useNavigation } from '@react-navigation/native';

const Notification = () => {
  const accessToken = useSelector(selectAccessToken);
  const navigation = useNavigation();
  const { data, loading, error } = useGetRequest({
    url: 'https://docudash.net/api/get-notifications',
    token: accessToken,
  });
  // console.log('Notification', data);

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
        data={data?.NotificationsArr}
        contentContainerStyle={tw`gap-5`}
        renderItem={({ item, i }) => {
          return (
            <TouchableOpacity
              onPress={() => navigation.navigate('DocumentViewer', { LinkToView: item.LinkToView })}
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
                  <Text>{item.message}</Text>
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
