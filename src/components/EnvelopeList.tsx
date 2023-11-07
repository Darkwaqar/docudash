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
export default function EnvelopeList({ heading }: { heading: string }) {
  const navigation = useNavigation();
  const focused = useIsFocused();
  const accessToken = useSelector(selectAccessToken);
  const [data, setData] = useState<Array<Envelope>>();
  const [loading, setLoading] = useState(false);
  function filter(name: string | undefined) {
    if (name) {
      const filtered = data.filter((x) => x.emailSubject.includes(name));
      return filtered;
    }
  }
  const [Name, setName] = useState<string | undefined>();
  const fetchData = async () => {
    setLoading(true);
    const h = heading.toLowerCase();
    const url = 'https://docudash.net/api/generate-signature/';
    console.log(url + h);
    await axios
      .get(url + h, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        setLoading(false);
        const data: InboxApiResponse = response.data;
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
  }, [heading, focused]);
  const onRefresh = () => {
    fetchData();
  };
  return (
    <FlatList
      data={loading ? new Array(7).fill({}) : filter(Name) ? filter(Name) : data}
      ListHeaderComponent={
        <View style={tw`flex-row items-center justify-between px-5 mb-5 `}>
          <Text style={tw`font-bold text-6  tracking-wider`} numberOfLines={1}>
            {heading.toUpperCase()}
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
          <Text style={tw`text-center text-gray-500`}>No {heading} items Found</Text>
        </View>
      }
      //   keyExtractor={(item) => item.id + '_'}
      renderItem={({ item }) =>
        loading ? <Skeleton /> : <EnvelopeListItem item={item} heading={heading} />
      }
    />
  );
}

const Skeleton = () => {
  return (
    <SkeletonLoader boneColor={'#D3D3D3'}>
      <SkeletonLoader.Container style={tw`my-2`}>
        <SkeletonLoader.Container style={tw`flex-row overflow-hidden gap-2 items-center px-5 `}>
          {/*  @ts-ignore */}
          <SkeletonLoader.Item style={tw`w-10 h-10 rounded-full`} />
          <SkeletonLoader.Container style={tw`overflow-hidden w-70`}>
            {/*  @ts-ignore */}
            <SkeletonLoader.Item style={tw`flex-1 h-5 my-1`} />
            {/*  @ts-ignore */}
            <SkeletonLoader.Item style={tw`w-100 h-2`} />
          </SkeletonLoader.Container>
        </SkeletonLoader.Container>
        {/*  @ts-ignore */}
        <SkeletonLoader.Item style={tw`w-80 h-5 self-center mt-5`} />
      </SkeletonLoader.Container>
    </SkeletonLoader>
  );
};
