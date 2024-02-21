import DrawerScreenContainer from '@components/DrawerScreenContainer';
import HomeHeader from '@components/HomeHeader';
import NotFound from '@components/NotFound';
import { useNavigation } from '@react-navigation/native';
import { selectAccessToken, selectNotification, setNotification } from '@stores/slices/UserSlice';
import { colors } from '@utils/Colors';
import axios, { AxiosResponse } from 'axios';
import moment from 'moment';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Avatar } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import tw from 'twrnc';
const Notification = () => {
  const accessToken = useSelector(selectAccessToken);
  const Notification = useSelector(selectNotification);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  // console.log('Notification test', Notification);
  let onEndReachedCalledDuringMomentum = useRef(true);
  // console.log('id id id id ', Notification.NotificationsDetailsList);
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
  const loadMore = async () => {
    try {
      setLoading(true);
      const response: AxiosResponse = await axios.get(
        `${Notification?.NotificationsDetailsList?.next_page_url}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json; charset=utf-8',
          },
        }
      );
      // console.log('response', response.data);
      if (response?.data?.NotificationsDetailsList?.data?.length > 0) {
        dispatch(setNotification(...Notification?.NotificationsDetailsList?.data));
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.log('error', error);
      setLoading(false);
    }
  };
  const renderFooter = () => {
    if (loading)
      return (
        <View
          style={{
            padding: 10,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ActivityIndicator size={'small'} color={colors.green} />
        </View>
      );
  };

  return (
    <DrawerScreenContainer>
      <SafeAreaView style={tw`flex-1 `}>
        <HomeHeader heading={'Notification'} />
        <FlatList
          ListFooterComponent={renderFooter}
          contentContainerStyle={tw`flex-grow gap-5`}
          ListEmptyComponent={<NotFound onPress={() => console.log('Hello')} />}
          data={Notification.NotificationsDetailsList?.data}
          // contentContainerStyle={tw`gap-5`}
          renderItem={({ item }) => {
            // console.log('link_redirect_app', item?.user_image);

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
          }}
          onMomentumScrollBegin={() => (onEndReachedCalledDuringMomentum.current = false)}
          onEndReached={() => {
            if (
              !onEndReachedCalledDuringMomentum.current &&
              Notification?.NotificationsDetailsList?.next_page_url != null
            ) {
              loadMore();
              onEndReachedCalledDuringMomentum.current = true;
            }
          }}
          onEndReachedThreshold={0.1}
        />
      </SafeAreaView>
    </DrawerScreenContainer>
  );
};
export default Notification;
