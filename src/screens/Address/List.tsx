import HomeHeader from '@components/HomeHeader';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { selectAccessToken } from '@stores/slices/UserSlice';
import {
  Contact,
  ContactList,
  RootStackScreenProps,
  SignaturePreview,
  SignaturesListAPI,
} from '@type/index';
import { colors } from '@utils/Colors';
import axios from 'axios';
import SkeletonLoader from 'expo-skeleton-loader';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { Chip, Switch, RadioButton, Divider } from 'react-native-paper';
import { useSelector } from 'react-redux';
import tw from 'twrnc';
import { List as RN_LIST } from 'react-native-paper';
import { AddressList, Addresses } from 'src/types/AddressList';

export default function List() {
  const accessToken = useSelector(selectAccessToken);
  const [data, setData] = useState<Addresses[]>();
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<RootStackScreenProps<'Addresses'>['navigation']>();
  const focused = useIsFocused();
  const route = useRoute<RootStackScreenProps<'Addresses'>['route']>();

  const From = route.params?.From;
  const fetchData = async () => {
    setLoading(true);
    await axios
      .get('https://docudash.net/api/Address', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        setLoading(false);
        const { data }: AddressList = response.data;
        // console.log(data);

        setData(data);
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
    <SafeAreaView style={tw`flex-1`}>
      <HomeHeader heading={'ADDRESSES'} />
      <View style={tw`m-4 gap-1 `}>
        <Text style={tw`text-black text-5 font-bold `}>ADDRESSES</Text>
        <Text style={tw`text-[${colors.gray}] text-3`}>Add or update your address.</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('AddAddress', {})}
          style={tw`bg-[${colors.green}] justify-center items-center w-35 h-10 rounded-md self-end m-4`}
        >
          <Text style={tw`text-white`}>Add Address</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={loading ? new Array(7).fill({}) : data}
        onRefresh={onRefresh}
        refreshing={loading}
        ItemSeparatorComponent={Divider}
        contentContainerStyle={[tw`pb-25 py-5`, { alignSelf: 'stretch' }]}
        ListEmptyComponent={
          <View>
            <Text style={tw`text-center text-gray-500`}>No address Found</Text>
          </View>
        }
        //   keyExtractor={(item) => item.id + '_'}
        renderItem={({ item }: { item: Addresses }) =>
          loading ? (
            <Skeleton />
          ) : (
            <RN_LIST.Item
              onPress={() => {
                From
                  ? navigation.navigate('AddAddress', { Address: item })
                  : navigation.navigate('AddAddress', { Address: item });
              }}
              title={item.name}
              titleStyle={tw`text-black font-semibold`}
              description={item.address}
              descriptionStyle={tw`text-[${colors.gray}] font-thin`}
              left={(props) => <RN_LIST.Icon {...props} icon="face-man" />}
            />
          )
        }
      />
    </SafeAreaView>
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
