import DrawerScreenContainer from '@components/DrawerScreenContainer';
import HomeHeader from '@components/HomeHeader';
import NotFound from '@components/NotFound';
import NotificationCard from '@components/NotificationCard';
import { useNavigation } from '@react-navigation/native';
import { selectAccessToken, selectNotification, setNotification } from '@stores/slices/UserSlice';
import { colors } from '@utils/Colors';
import axios, { AxiosResponse } from 'axios';
import React, { useRef, useState } from 'react';
import { ActivityIndicator, FlatList, SafeAreaView, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import tw from 'twrnc';
const Notification = () => {
  const accessToken = useSelector(selectAccessToken);
  const Notification = useSelector(selectNotification);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  let onEndReachedCalledDuringMomentum = useRef(true);

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
      if (response?.data?.NotificationsDetailsList?.data?.length > 0) {
        dispatch(
          setNotification({
            ...Notification,
            NotificationsDetailsList: {
              ...Notification.NotificationsDetailsList,
              current_page: response?.data?.NotificationsDetailsList?.current_page,
              data: [
                ...Notification.NotificationsDetailsList.data,
                ...response?.data?.NotificationsDetailsList?.data,
              ],
              next_page_url: response?.data?.NotificationsDetailsList?.next_page_url,
              prev_page_url: response?.data?.NotificationsDetailsList?.prev_page_url,
              last_page: response?.data?.NotificationsDetailsList?.last_page,
              from: response?.data?.NotificationsDetailsList?.from,
              per_page: response?.data?.NotificationsDetailsList?.per_page,
              to: response?.data?.NotificationsDetailsList?.to,
              total: response?.data?.NotificationsDetailsList?.total,
            },
          })
        );
        console.log('response', response?.data?.NotificationsDetailsList?.next_page_url);
        console.log('noti', Notification);
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
            return <NotificationCard item={item} />;
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
          onEndReachedThreshold={0.2}
        />
      </SafeAreaView>
    </DrawerScreenContainer>
  );
};
export default Notification;
