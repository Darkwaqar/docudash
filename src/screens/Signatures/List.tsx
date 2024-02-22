import DrawerScreenContainer from '@components/DrawerScreenContainer';
import HomeHeader from '@components/HomeHeader';
import { useNavigation } from '@react-navigation/native';
import {
  useDeleteSignatureMutation,
  useGetSignaturesQuery,
  useUpdateStatusMutation,
} from '@services/signature';
import { RootStackScreenProps, SignaturePreview } from '@type/index';
import { colors } from '@utils/Colors';
import React from 'react';
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
import tw from 'twrnc';

export default function List() {
  const navigation = useNavigation<RootStackScreenProps<'Signatures'>['navigation']>();
  const [deleteSignature] = useDeleteSignatureMutation();
  const [updateStatus, { isLoading }] = useUpdateStatusMutation();
  const { data: list, refetch, isFetching } = useGetSignaturesQuery();
  const Delete = async (id: number) => {
    try {
      await deleteSignature(id).unwrap();
    } catch (error) {}
    // axios.post(
    //   'https://docudash.net/api/signatures/delete',
    //   {
    //     deleteId: id,
    //   },
    //   {
    //     headers: {
    //       Authorization: `Bearer ${accessToken}`,
    //     },
    //   }
    // );
  };
  const StatusUpdate = async (id: number, status: number | boolean) => {
    try {
      console.log('StatusUpdate');

      await updateStatus({
        id: id,
        status: status,
      });
    } catch (error) {}
  };
  console.log('render signature', list);

  const RenderItem: ListRenderItem<SignaturePreview> = ({ item }) => {
    const onToggleSwitch = (value) => {
      StatusUpdate(item.id, value ? 1 : 0);
      // fetchList();
    };

    return (
      <View style={tw` bg-white p-2 my-1 gap-4 px-3 shadow-md rounded-lg m-2`}>
        <View style={tw`flex-row items-center gap-2`}>
          <Text style={tw`font-medium w-20`}>Signed by</Text>
          <Image
            style={tw`flex-1 h-10`}
            resizeMode="stretch"
            source={{
              uri: item.signature_img,
            }}
          />
        </View>
        <View style={tw`flex-row items-center gap-2`}>
          <Text style={tw`font-medium w-20`}>Initials</Text>
          <Image style={tw`flex-1 h-10`} resizeMode="contain" source={{ uri: item.initial_img }} />
        </View>
        <View style={tw`flex-row items-center gap-2`}>
          <Text style={tw`font-medium overflow-hidden w-30`}>Signature Code</Text>
          <Text style={tw`flex-1`}>{item.signature_code}</Text>
        </View>
        <View style={tw`flex-1 flex-row justify-between`}>
          <View style={tw`gap-2 flex-row items-center`}>
            <Text style={tw`font-medium`}>Enabled:</Text>
            <Switch value={item?.status == 1 ? true : false} onValueChange={onToggleSwitch} />
          </View>
          <View style={tw`flex-row items-center gap-1`}>
            <Chip
              selectedColor={colors.blue}
              onPress={() => {
                navigation.navigate('AddSignature', { SignaturePreview: item });
              }}
            >
              Edit
            </Chip>
            <Chip onPress={() => Delete(item.id)}>Delete</Chip>
          </View>
        </View>
      </View>
    );
  };

  return (
    <DrawerScreenContainer>
      <SafeAreaView style={tw`flex-1`}>
        <HomeHeader heading={'SIGNATURES'} />
        <View style={tw`m-4 gap-1 `}>
          <Text style={tw`text-black text-5 font-bold `}>Signatures</Text>
          <Text style={tw`text-[${colors.gray}] text-3`}>
            Add or update your name and signature styles.
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('AddSignature', {})}
            style={tw`bg-[${colors.green}] justify-center items-center w-35 h-10 rounded-md self-end m-4`}
          >
            <Text style={tw`text-white`}>Add Signature</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={list}
          keyExtractor={(item) => item.id + '_'}
          onRefresh={refetch}
          refreshing={isFetching || isLoading}
          ItemSeparatorComponent={Divider}
          contentContainerStyle={tw`pb-50`}
          renderItem={(props) => <RenderItem {...props} />}
        />
      </SafeAreaView>
    </DrawerScreenContainer>
  );
}
