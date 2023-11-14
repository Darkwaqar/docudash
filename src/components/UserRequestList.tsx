import FilterModal from '@components/FilterModal';
import { selectAccessToken } from '@stores/slices/UserSlice';
import { Envelope, InboxApiResponse } from '@type/index';
import axios from 'axios';
import SkeletonLoader from 'expo-skeleton-loader';
import React, { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { Divider } from 'react-native-paper';
import { useSelector } from 'react-redux';
import tw from 'twrnc';
import EnvelopeListItem from './EnvelopeListItem';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import UserRequestListItem from './UserRequestListItem';
export default function UserRequestList() {
  const navigation = useNavigation();
  const focused = useIsFocused();
  const accessToken = useSelector(selectAccessToken);
  const [data, setData] = useState<Array<UserRequestListT>>();
  const [loading, setLoading] = useState(false);
  console.log(accessToken);

  function filter(name: string | undefined) {
    if (name) {
      const filtered = data.filter((x) => x.requestMessage.includes(name));
      return filtered;
    }
  }
  const [Name, setName] = useState<string | undefined>();
  const fetchData = async () => {
    setLoading(true);
    const url = 'https://docudash.net/api/individuals/RequestsList';
    await axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        setLoading(false);
        const data = response.data;
        console.log('request data', data);
        setData(data.data);
      })
      .catch((error) => {
        setLoading(false);
        console.log('Error----', error);
        setData([]);
      });
  };

  useEffect(() => {
    fetchData();
  }, [focused]);
  const onRefresh = () => {
    fetchData();
  };
  return (
    <FlatList
      data={loading ? new Array(7).fill({}) : filter(Name) ? filter(Name) : data}
      ListHeaderComponent={
        <View style={tw`flex-row items-center justify-between px-5 mb-5 `}>
          <Text style={tw`font-bold text-6  tracking-wider`} numberOfLines={1}>
            Requests
          </Text>
          <FilterModal
            onPress={(item: React.SetStateAction<string | undefined>) => setName(item)}
          />
        </View>
      }
      onRefresh={onRefresh}
      refreshing={loading}
      ItemSeparatorComponent={Divider}
      contentContainerStyle={[tw`pb-25 py-5`, { alignSelf: 'stretch' }]}
      ListEmptyComponent={
        <View>
          <Text style={tw`text-center text-gray-500`}>No Request items Found</Text>
        </View>
      }
      //   keyExtractor={(item) => item.id + '_'}
      renderItem={({ item }) => (loading ? <Skeleton /> : <UserRequestListItem item={item} />)}
    />
  );
}

const Skeleton = () => {
  return (
    <SkeletonLoader boneColor={'#D3D3D3'}>
      <SkeletonLoader.Container style={tw`my-2`}>
        <SkeletonLoader.Container style={tw` overflow-hidden gap-4 items-center p-5`}>
          {/*  @ts-ignore */}
          <SkeletonLoader.Item style={tw`w-full h-2 self-center`} />
          <SkeletonLoader.Item style={tw`w-full h-2 self-center`} />
          <SkeletonLoader.Item style={tw`w-full h-2 self-center`} />
          <SkeletonLoader.Item style={tw`w-full h-2 self-center`} />
          <SkeletonLoader.Item style={tw`w-full h-2 self-center`} />
        </SkeletonLoader.Container>
      </SkeletonLoader.Container>
    </SkeletonLoader>
  );
};
