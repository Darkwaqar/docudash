import HomeHeader from '@components/HomeHeader';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { selectAccessToken } from '@stores/slices/UserSlice';
import { RootStackScreenProps, StampListAPI, StampPreview } from '@type/index';
import { colors } from '@utils/Colors';
import axios from 'axios';
import React from 'react';
import { FlatList, Image, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { Chip, Divider, Switch } from 'react-native-paper';
import { useSelector } from 'react-redux';
import tw from 'twrnc';

export default function List() {
  const accessToken = useSelector(selectAccessToken);
  const [list, setList] = React.useState<StampPreview[]>();
  const [isFetching, setIsFetching] = React.useState(false);
  const navigation = useNavigation<RootStackScreenProps<'Stamps'>['navigation']>();
  const route = useRoute<RootStackScreenProps<'Stamps'>['route']>();
  const focused = useIsFocused();

  const fetchList = () => {
    setIsFetching(true);
    axios
      .get('https://docudash.net/api/stamps', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        const { data, message, status } = response.data as StampListAPI;
        console.log('status', status);
        console.log('response.data', response.data);

        if (status) {
          setList(data.data);
        } else {
          alert(message);
        }
        setIsFetching(false);
      })
      .catch((err) => {
        setIsFetching(false);
      });
  };
  React.useEffect(() => {
    fetchList();
  }, [focused]);

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
        fetchList();
        const data = response.data;
        // console.log(data);
      });
  };
  const StatusUpdate = (id: number, status: number | boolean) => {
    // console.log(id, status);

    axios
      .post(
        'https://docudash.net/api/stamps/statusUpdate',
        {
          id: id,
          status: status,
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

  const RenderItem = ({ item }: { item: StampPreview }) => {
    const [more, setMore] = React.useState(false);
    const [isSwitchOn, setIsSwitchOn] = React.useState(item.status === 1 ? true : false);
    const onToggleSwitch = () => {
      setIsSwitchOn(!isSwitchOn);

      StatusUpdate(item.id, !isSwitchOn ? 1 : 0);
      fetchList();
    };

    return (
      <View style={tw` bg-white p-2 my-1 gap-2 px-3`}>
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
              <Switch value={isSwitchOn} onValueChange={onToggleSwitch} />
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

  return (
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
        data={list}
        keyExtractor={(item) => item.id + '_'}
        onRefresh={fetchList}
        refreshing={isFetching}
        ItemSeparatorComponent={Divider}
        contentContainerStyle={tw`pb-50`}
        renderItem={({ item }) => <RenderItem item={item} />}
      />
    </SafeAreaView>
  );
}
