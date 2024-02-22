import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import { Avatar } from 'react-native-paper';
import tw from 'twrnc';
import axios from 'axios';
import { selectAccessToken, setNotification } from '@stores/slices/UserSlice';
import { useDispatch, useSelector } from 'react-redux';
const NotificationCard = ({ item }) => {
  const navigation = useNavigation();
  const accessToken = useSelector(selectAccessToken);
  const dispatch = useDispatch();
  const readNotification = (id: number) => {
    axios
      .post(
        'https://docudash.net/api/get-notifications',
        {
          id: id,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      .then((response) => {
        const { status } = response.data;
        if (status) {
          dispatch(setNotification(response.data));
        }
      })
      .catch((err) => {
        console.log('error', err);
      });
  };
  return (
    <TouchableOpacity
      onPress={() => {
        if (item.link_redirect_app === 'https://docudash.net/api/dashboard') {
          readNotification(item.id);
          navigation.navigate('HomeScreen');
        } else {
          readNotification(item.id);
          navigation.navigate('DocumentViewer', { LinkToView: item.link_redirect_app });
        }
      }}
      style={[
        tw`flex-row items-center gap-2 justify-between px-4 border-b-2 border-b-gray-100 p-4`,
        { width: '100%' },
      ]}
    >
      <View style={[tw`flex-row items-center gap-2`, { width: '70%' }]}>
        <Avatar.Image
          source={{
            uri: item?.user_image
              ? item?.user_image
              : 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
          }}
          size={40}
        />
        <View style={tw`gap-1`}>
          <Text numberOfLines={1} style={{ width: '80%' }}>
            {item.title}
          </Text>
          <Text>{item.body}</Text>
        </View>
      </View>
      <Text>{moment(item.created_at).format('MMM Do YY')}</Text>
    </TouchableOpacity>
  );
};

export default NotificationCard;
