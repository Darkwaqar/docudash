import AddSignatureDraw from '@components/AddSignauteDraw';
import { colors } from '@utils/Colors';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Appbar, Button, SegmentedButtons, TextInput } from 'react-native-paper';
import tw from 'twrnc';

import ChooseSignatureItem from '@components/ChooseSignatureItem';
import { useNavigation, useRoute } from '@react-navigation/native';
import { selectAccessToken, selectProfileData } from '@stores/slices/UserSlice';
import { RootStackScreenProps, SignaturePreview } from '@type/index';
import { useSelector } from 'react-redux';
import { useAddSignatureMutation } from '@services/signature';

const AddSignature = () => {
  const user = useSelector(selectProfileData);
  const accessToken = useSelector(selectAccessToken);
  const [fullName, setFullName] = React.useState(user.first_name + ' ' + user.last_name);

  const [initials, setInitials] = React.useState(
    fullName
      .replace(/\b(\w)\w+/g, '$1')
      .replace(/\s/g, '')
      .replace(/\.$/, '')
      .toUpperCase()
  );
  const [value, setValue] = React.useState('choose');
  const [list, setList] = React.useState<{ selected: boolean }[]>(
    new Array(6).fill({ selected: false })
  );
  const [selectedUri, setSelectedUri] = useState<string>('');
  const [selectedInitialUri, setSelectedInitialUri] = useState<string>('');
  const [sign, setSign] = useState<Array<{}> | undefined>();
  const [initial, setInitial] = useState<Array<{}> | undefined>();
  const navigation = useNavigation<RootStackScreenProps<'AddSignature'>['navigation']>();
  const route = useRoute<RootStackScreenProps<'AddSignature'>['route']>();
  const signaturePreview = route.params?.SignaturePreview as SignaturePreview;
  const [addSignature, { isLoading: addSignatureLoading }] = useAddSignatureMutation();

  useEffect(() => {
    if (signaturePreview) {
      setList((prev) =>
        prev.map((sign, i) =>
          i === signaturePreview.DT_RowIndex - 1
            ? { ...sign, selected: true }
            : { ...sign, selected: false }
        )
      );
    }
  }, []);

  const uploadSignature = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [1, 2],
        quality: 0.1,
        base64: true,
      });

      if (!result.canceled) {
        const image = result.assets[0];
        if (image && image.base64) {
          setSelectedUri(image.base64);
        }
      }
    } catch (err) {
      console.log('err', err);
    }
  };
  const uploadInitial = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [1, 2],
        quality: 0.1,
        base64: true,
      });

      if (!result.canceled) {
        const image = result.assets[0];
        if (image && image.base64) {
          setSelectedInitialUri(image.base64);
        }
      }
    } catch (err) {
      console.log('err', err);
    }
  };
  const create = async () => {
    if (selectedInitialUri.length == 0 && selectedUri.length == 0) {
      Alert.alert('Please add a signature');
      return;
    }
    // console.log(selectedInitialUri, selectedUri);
    try {
      await addSignature({
        signature: 'data:image/png;base64,' + selectedUri,
        initial: 'data:image/png;base64,' + selectedInitialUri,
      }).unwrap();
      navigation.goBack();
    } catch (error) {
      navigation.goBack();
    }

    // axios
    //   .post(
    //     'https://docudash.net/api/signatures/create',
    //     {
    //       signature: 'data:image/png;base64,' + selectedUri,
    //       initial: 'data:image/png;base64,' + selectedInitialUri,
    //     },
    //     {
    //       headers: {
    //         Authorization: `Bearer ${accessToken}`,
    //       },
    //     }
    //   )
    //   .then((response) => {
    //     const {
    //       message,
    //       success,
    //     }: {
    //       message: string;
    //       success: boolean;
    //     } = response.data;
    //     // console.log(response.data);
    //     if (success) {
    //       console.log(`data:image/png;base64 + ${selectedUri}`);
    //       console.log(`data:image/png;base64 + ${selectedInitialUri}`);

    //       navigation.goBack();
    //       // navigation.navigate('Signatures', {});
    //     } else {
    //       Alert.alert(message);
    //     }
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  };
  return (
    <View style={tw`h-full`}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Add Signature" />
      </Appbar.Header>
      <View style={tw`mx-2 gap-2 flex-1`}>
        <TextInput
          mode="outlined"
          label="Full Name"
          disabled
          value={fullName}
          onChangeText={(text) => setFullName(text)}
        />
        <TextInput
          label="Initials"
          mode="outlined"
          disabled
          value={initials}
          onChangeText={(text) => setInitials(text)}
        />
        <SegmentedButtons
          value={value}
          onValueChange={setValue}
          buttons={[
            {
              value: 'choose',
              label: 'Choose',
            },
            {
              value: 'draw',
              label: 'Draw',
            },
            { value: 'upload', label: 'Upload' },
          ]}
        />
        {value === 'choose' ? (
          <FlatList
            data={list}
            ItemSeparatorComponent={() => <View style={tw`flex-1 h-0.5 mx-2 bg-gray-200`}></View>}
            renderItem={({ item, index }) => (
              <ChooseSignatureItem
                item={item}
                id={index}
                setList={setList}
                fullName={fullName}
                initials={initials}
                setSelectedUri={setSelectedUri}
                setSelectedInitialUri={setSelectedInitialUri}
              />
            )}
          />
        ) : null}
        {value === 'draw' ? (
          <AddSignatureDraw
            setSelectedUri={setSelectedUri}
            setSelectedInitialUri={setSelectedInitialUri}
          />
        ) : null}
        {value === 'upload' ? (
          <ScrollView contentContainerStyle={tw`bg-white px-8 py-8 rounded-md gap-5`}>
            <View
              style={tw` border-2 py-10 rounded-xl border-dashed gap-5 border-[${colors.blue}] justify-center items-center`}
            >
              {sign && (
                <Image
                  style={tw`h-20 w-20 bg-red-300`}
                  source={{ uri: 'data:image/png;base64,' + selectedUri }}
                />
              )}
              <TouchableOpacity style={tw`p-1 `} onPress={uploadSignature}>
                <Image
                  style={tw`h-10 w-10 self-center`}
                  source={require('../../../assets/Upload.png')}
                />
                <Text style={tw`text-[${colors.blue}] mt-2`}>Upload your signature</Text>
              </TouchableOpacity>
            </View>
            <View
              style={tw` border-2 py-10 rounded-xl border-dashed gap-5 border-[${colors.blue}] justify-center items-center`}
            >
              {initial && (
                <Image
                  style={tw`h-20 w-20 bg-red-300`}
                  source={{
                    uri: 'data:image/png;base64,' + selectedInitialUri,
                  }}
                />
              )}
              <TouchableOpacity style={tw`p-1 `} onPress={uploadInitial}>
                <Image
                  style={tw`h-10 w-10 self-center`}
                  source={require('../../../assets/Upload.png')}
                />
                <Text style={tw`text-[${colors.blue}] mt-2`}>Upload your signature</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        ) : null}

        {/* Create sign button */}
        <Button disabled={addSignatureLoading} onPress={create} mode="contained" style={tw`my-4`}>
          Create
        </Button>
      </View>
    </View>
  );
};

export default AddSignature;

const styles = StyleSheet.create({
  h2: tw`font-bold text-4`,
});
