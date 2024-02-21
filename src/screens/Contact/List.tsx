import DrawerScreenContainer from '@components/DrawerScreenContainer';
import HomeHeader from '@components/HomeHeader';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { useGetContactsQuery } from '@services/contact';
import { selectAccessToken } from '@stores/slices/UserSlice';
import { Contact, RootStackScreenProps } from '@type/index';
import { colors } from '@utils/Colors';
import SkeletonLoader from 'expo-skeleton-loader';
import React from 'react';
import { FlatList, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { Divider, List as RN_LIST } from 'react-native-paper';
import { useSelector } from 'react-redux';
import tw from 'twrnc';

export default function List() {
  const navigation = useNavigation<RootStackScreenProps<'Contacts'>['navigation']>();
  const route = useRoute<RootStackScreenProps<'Contacts'>['route']>();
  const From = route.params?.From;

  const { data, isLoading: loading, refetch } = useGetContactsQuery();

  const onRefresh = () => {
    refetch();
  };

  return (
    <DrawerScreenContainer>
      <SafeAreaView style={tw`flex-1`}>
        <HomeHeader heading={'CONTACTS'} />
        <View style={tw`m-4 gap-1 `}>
          <Text style={tw`text-black text-5 font-bold `}>Contacts</Text>
          <Text style={tw`text-[${colors.gray}] text-3`}>Add or update your contacts.</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('AddContact', {})}
            style={tw`bg-[${colors.green}] justify-center items-center w-35 h-10 rounded-md self-end m-4`}
          >
            <Text style={tw`text-white`}>Add Contact</Text>
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
              <Text style={tw`text-center text-gray-500`}>No Contacts Found</Text>
            </View>
          }
          //   keyExtractor={(item) => item.id + '_'}
          renderItem={({ item }: { item: Contact }) =>
            loading ? (
              <Skeleton />
            ) : (
              <RN_LIST.Item
                onPress={() => {
                  From
                    ? navigation.navigate('AddRecipient', { Contact: item })
                    : navigation.navigate('AddContact', { Contact: item });
                }}
                title={item.name}
                titleStyle={tw`text-black font-semibold`}
                description={item.email}
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
