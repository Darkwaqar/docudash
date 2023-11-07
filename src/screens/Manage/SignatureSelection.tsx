import HomeHeader from '@components/HomeHeader';
import { useNavigation, useRoute } from '@react-navigation/native';
import { selectAccessToken } from '@stores/slices/UserSlice';
import {
  GenerateSignature,
  RootStackScreenProps,
  SignaturePreview,
  SignaturesListAPI,
} from '@type/index';
import { colors } from '@utils/Colors';
import axios from 'axios';
import React from 'react';
import { FlatList, Image, SafeAreaView, TouchableOpacity, View } from 'react-native';
import { Chip, Switch, RadioButton, Appbar, Text, Button, Checkbox } from 'react-native-paper';
import { useSelector } from 'react-redux';
import tw from 'twrnc';

export default function SignatureSelection() {
  const accessToken = useSelector(selectAccessToken);
  const [list, setList] = React.useState<SignaturePreview[]>();
  const [isFetching, setIsFetching] = React.useState(false);
  const navigation = useNavigation<RootStackScreenProps<'Signatures'>['navigation']>();
  const route = useRoute<RootStackScreenProps<'DocumentViewer'>['route']>();
  const [globalState, setGlobalState] = React.useState(0);
  const [setselectedItem, setSetselectedItem] = React.useState<SignaturePreview | undefined>();
  const envelope: GenerateSignature = route.params.Envelope;

  console.log('envelope', envelope);

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
  }, [route]);

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

  const RenderItem = ({ item, index }: { item: SignaturePreview; index: number }) => {
    const [isSwitchOn, setIsSwitchOn] = React.useState(item.status === 1 ? true : false);
    const [checked, setChecked] = React.useState(index === 0 ? true : false);

    const onToggleSwitch = () => {
      setIsSwitchOn(!isSwitchOn);
      StatusUpdate(item.id, !isSwitchOn ? 1 : 0);
      fetchList();
    };

    return (
      <View style={tw`flex-row gap-2 overflow-hidden items-center bg-white p-2 my-1 px-3  `}>
        <TouchableOpacity
          style={tw`flex-1`}
          onPress={() => {
            navigation.navigate('DocumentViewer', { Envelope: envelope, item: item });
          }}
        >
          <Checkbox status={globalState === index ? 'checked' : 'unchecked'} />

          <View style={tw`flex-1`}>
            <View>
              <View style={tw`flex-row flex-1 items-center justify-around`}>
                <View>
                  <Text style={tw`font-bold`}>Signed by</Text>
                  <Image
                    style={tw`w-35 h-20   `}
                    resizeMode="contain"
                    source={{
                      uri: item.signature,
                    }}
                  />
                </View>
                <View>
                  <Text style={tw`font-bold`}>Initials</Text>
                  <Image
                    style={tw`w-35 h-20 `}
                    resizeMode="contain"
                    source={{ uri: item.initial }}
                  />
                </View>
              </View>
            </View>
            <View style={tw`gap-4  flex-row`}>
              <Text style={tw`font-bold overflow-hidden`}>Signature Code</Text>
              <Text>{item.signature_code}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <>
      <Appbar.Header mode="center-aligned">
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content
          title={
            <View style={tw`items-center`}>
              <Text variant="titleSmall">Sign</Text>
              <Text variant="labelSmall">Subtitle</Text>
            </View>
          }
        />
        {/* <Button onPress={() => {}}>Save</Button> */}
      </Appbar.Header>
      <SafeAreaView style={tw`flex-1`}>
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
          contentContainerStyle={tw`pb-50`}
          renderItem={({ item, index }) => <RenderItem item={item} index={index} />}
        />
      </SafeAreaView>
    </>
  );
}
