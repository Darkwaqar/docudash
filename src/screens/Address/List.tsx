import DrawerScreenContainer from '@components/DrawerScreenContainer';
import HomeHeader from '@components/HomeHeader';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useGetAddressesQuery } from '@services/address';
import { RootStackScreenProps } from '@type/index';
import { colors } from '@utils/Colors';
import SkeletonLoader from 'expo-skeleton-loader';
import React from 'react';
import { FlatList, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { Divider, List as RN_LIST } from 'react-native-paper';
import { Addresses } from 'src/types/AddressList';
import tw from 'twrnc';

export default function List() {
  const { data, refetch, isFetching, isLoading } = useGetAddressesQuery();
  const navigation = useNavigation<RootStackScreenProps<'Addresses'>['navigation']>();
  const route = useRoute<RootStackScreenProps<'Addresses'>['route']>();

  const From = route.params?.From;

  const onRefresh = () => {
    refetch();
  };

  return (
    <DrawerScreenContainer>
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
          data={isLoading ? new Array(7).fill({}) : data}
          onRefresh={onRefresh}
          refreshing={isLoading}
          ItemSeparatorComponent={Divider}
          contentContainerStyle={[tw`pb-25 py-5`, { alignSelf: 'stretch' }]}
          ListEmptyComponent={
            <View>
              <Text style={tw`text-center text-gray-500`}>No address Found</Text>
            </View>
          }
          //   keyExtractor={(item) => item.id + '_'}
          renderItem={({ item }: { item: Addresses }) =>
            isLoading ? (
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
    </DrawerScreenContainer>
  );
}

const Skeleton = () => {
  return (
    <SkeletonLoader boneColor={'#D3D3D3'}>
      <SkeletonLoader.Container style={tw`my-2`}>
        <SkeletonLoader.Container style={tw`flex-row overflow-hidden gap-2 items-center px-2 `}>
          {/*  @ts-ignore */}
          <SkeletonLoader.Item style={tw`w-8 h-8 rounded-full`} />
          <SkeletonLoader.Container style={tw`overflow-hidden flex-1 gap-1`}>
            {/*  @ts-ignore */}
            <SkeletonLoader.Item style={tw`w-full h-5 mb-1`} />
            {/*  @ts-ignore */}
            <SkeletonLoader.Item style={tw`w-full h-3`} />
            <SkeletonLoader.Item style={tw`w-full h-3`} />
          </SkeletonLoader.Container>
        </SkeletonLoader.Container>
        {/*  @ts-ignore */}
        <SkeletonLoader.Item style={tw`w-full h-0.5 self-center mt-5`} />
      </SkeletonLoader.Container>
    </SkeletonLoader>
  );
};
