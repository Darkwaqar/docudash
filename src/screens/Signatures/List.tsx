import HomeHeader from '@components/HomeHeader';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { selectAccessToken } from '@stores/slices/UserSlice';
import { RootStackScreenProps, SignaturePreview, SignaturesListAPI } from '@type/index';
import { colors } from '@utils/Colors';
import axios from 'axios';
import React from 'react';
import { FlatList, Image, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { Chip, Switch, RadioButton, Divider } from 'react-native-paper';
import { useSelector } from 'react-redux';
import tw from 'twrnc';

export default function List() {
  const accessToken = useSelector(selectAccessToken);
  const [list, setList] = React.useState<SignaturePreview[]>();
  const [isFetching, setIsFetching] = React.useState(false);
  const navigation = useNavigation<RootStackScreenProps<'Signatures'>['navigation']>();
  const focused = useIsFocused();
  const route = useRoute();

  const fetchList = () => {
    setIsFetching(true);
    axios
      .get('https://docudash.net/api/signatures/list', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        const data: SignaturesListAPI = response.data;

        const changeData = data.data.map((x) => {
          return {
            ...x,
            signature: x.signature.replace(/(\r\n|\n|\r)/gm, ''),
            initial: x.initial.replace(/(\r\n|\n|\r)/gm, ''),
          };
        });

        setList(changeData);
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
        'https://docudash.net/api/signatures/delete',
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
        console.log(data);
      });
  };
  const StatusUpdate = (id: number, status: number | boolean) => {
    axios
      .post(
        'https://docudash.net/api/signatures/statusUpdate',
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
        console.log(data);
      });
  };

  const RenderItem = ({ item }: { item: SignaturePreview }) => {
    const [isSwitchOn, setIsSwitchOn] = React.useState(item.status === 1 ? true : false);
    const [checked, setChecked] = React.useState(item.status === 1 ? true : false);

    const onToggleSwitch = () => {
      setIsSwitchOn(!isSwitchOn);
      StatusUpdate(item.id, !isSwitchOn ? 1 : 0);
      fetchList();
    };

    return (
      <View style={tw` bg-white p-2 my-1 gap-2 px-3`}>
        <View style={tw`flex-row gap-2 overflow-hidden items-center`}>
          <View style={tw`flex-1`}>
            <View>
              <Text style={tw`font-medium`}>Signed by</Text>
              <Image
                style={tw`w-full h-20  `}
                resizeMode="contain"
                source={{
                  uri: item.signature,
                }}
              />
            </View>
            <View>
              <Text style={tw`font-medium`}>Initials</Text>
              <Image style={tw`w-full h-20`} resizeMode="contain" source={{ uri: item.initial }} />
            </View>
            <View style={tw`gap-4  `}>
              <Text style={tw`font-medium overflow-hidden`}>Signature Code</Text>
              <Text>{item.signature_code}</Text>
            </View>
          </View>
          <View style={tw` p-2 justify-between h-50`}>
            <View style={tw`gap-2`}>
              <Text style={tw`font-medium`}>Status:</Text>
              <Switch value={isSwitchOn} onValueChange={onToggleSwitch} />
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
      </View>
    );
  };

  return (
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
        onRefresh={fetchList}
        refreshing={isFetching}
        ItemSeparatorComponent={Divider}
        contentContainerStyle={tw`pb-50`}
        renderItem={({ item }) => <RenderItem item={item} />}
      />
    </SafeAreaView>
  );
}
