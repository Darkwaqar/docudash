import DrawerScreenContainer from '@components/DrawerScreenContainer';
import HomeHeader from '@components/HomeHeader';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { useGetStampsQuery, useUpdateStampStatusMutation } from '@services/stamp';
import { selectAccessToken } from '@stores/slices/UserSlice';
import { RootStackScreenProps, StampListAPI, StampPreview } from '@type/index';
import { colors } from '@utils/Colors';
import axios from 'axios';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Image,
  ListRenderItem,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Chip, Divider, Switch } from 'react-native-paper';
import { useSelector } from 'react-redux';
import tw from 'twrnc';

export default function List() {
  const accessToken = useSelector(selectAccessToken);
  const navigation = useNavigation<RootStackScreenProps<'Stamps'>['navigation']>();
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching, refetch } = useGetStampsQuery(page);
  const [updateStampStatus, { isLoading: loading }] = useUpdateStampStatusMutation();
  const loadMore = () => {
    if (data && data.next_page_url != null && !isFetching) {
      setPage(data?.next_page_url?.split('page=')[1]);
    }
  };

  const Delete = (id: number) => {
    axios
      .post(
        'https://docudash.net/api/stamps/delete',
        {
          deleteId: id,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then((response) => {
        const data = response.data;
        // console.log(data);
      });
  };
  const RenderItem: ListRenderItem<StampPreview> = ({ item }) => {
    console.log('render');

    return (
      <View style={tw` bg-white p-2 my-1 gap-2 px-3`} key={item.id}>
        <View style={tw`flex-row gap-2 overflow-hidden`}>
          <View style={tw`flex-1 gap-3 p-2 items-start overflow-hidden `}>
            <Image
              style={tw`w-20 h-20 rounded-full overflow-hidden `}
              resizeMode="contain"
              source={{
                uri: item.image_base64,
              }}
            />

            <Text style={tw`font-medium`}>{item.title}</Text>

            <Text style={tw`font-medium overflow-hidden`}>{item.stamp_code}</Text>
          </View>
          <View style={tw` p-2 justify-between`}>
            <View style={tw`gap-2`}>
              <Text style={tw`font-medium`}>Status:</Text>
              <Switch
                value={item.status == 1}
                onValueChange={(val) => {
                  updateStampStatus({
                    id: item.id,
                    status: val ? 1 : 0,
                  });
                }}
              />
            </View>
            <View>
              <View style={tw`flex-row items-center gap-1`}>
                <Chip
                  selectedColor={colors.blue}
                  onPress={() => {
                    navigation.navigate('AddStamp', { Stamp: item });
                  }}
                >
                  Edit
                </Chip>
                <Chip onPress={() => Delete(item.id)}>Delete</Chip>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };
  // if (isLoading) return <Text>Loading...</Text>;
  // if (!data) return <Text>Missing post!</Text>;

  return (
    <DrawerScreenContainer>
      <SafeAreaView style={tw`flex-1`}>
        <HomeHeader heading={'STAMPS'} />
        <View style={tw`m-4 gap-1 `}>
          <Text style={tw`text-black text-5 font-bold `}>Stamps</Text>
          <Text style={tw`text-[${colors.gray}] text-3`}>Add or update your name and stamps.</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('AddStamp', {})}
            style={tw`bg-[${colors.green}] justify-center items-center w-35 h-10 rounded-md self-end m-4`}
          >
            <Text style={tw`text-white`}>Add Stamp</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={data?.data}
          keyExtractor={(item) => item.id + '_'}
          onRefresh={() => {
            setPage(1);
          }}
          refreshing={isFetching}
          ItemSeparatorComponent={Divider}
          contentContainerStyle={tw`pb-50`}
          onEndReached={loadMore}
          onEndReachedThreshold={0.1}
          renderItem={RenderItem}
        />
      </SafeAreaView>
    </DrawerScreenContainer>
  );
}
