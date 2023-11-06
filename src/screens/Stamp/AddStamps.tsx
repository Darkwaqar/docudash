import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { Alert, Image, StyleSheet, Text, View } from 'react-native';
import { Appbar, Avatar, Badge, Button, TextInput } from 'react-native-paper';
import tw from 'twrnc';

import { useNavigation, useRoute } from '@react-navigation/native';
import { selectAccessToken, selectProfileData } from '@stores/slices/UserSlice';
import { RootStackScreenProps, StampPreview } from '@type/index';
import FormData from 'form-data';
import { useSelector } from 'react-redux';

const AddStamp = () => {
  const user = useSelector(selectProfileData);
  const accessToken = useSelector(selectAccessToken);
  const navigation = useNavigation<RootStackScreenProps<'AddStamp'>['navigation']>();
  const route = useRoute<RootStackScreenProps<'AddStamp'>['route']>();
  const StampPreview = route.params.Stamp as StampPreview;
  const [base64, setBase64] = useState('');
  const [name, setName] = useState('');
  const [stampId, setStampId] = useState('0');
  const [loading, setLoading] = useState(false);

  const [image, setImage] = useState<{
    uri: string;
    name: string;
    type: 'image' | 'video' | undefined;
  }>();

  useEffect(() => {
    if (StampPreview) {
      setBase64(StampPreview.image_base64.replace('data:image/png;base64,', ''));
      setStampId(String(StampPreview.id));
      setName(StampPreview.title);
      console.log(StampPreview.id);
    }
  }, []);

  const uploadStamp = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        selectionLimit: 1,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        base64: true,
      });

      if (!result.canceled) {
        const image = result.assets[0];
        const imageToUpload = {
          uri: image.uri,
          name: image.fileName || image.uri,
          type: image.type,
        };
        setImage(imageToUpload);
        if (image.base64) {
          setBase64(image.base64);
        }
      }
    } catch (err) {
      console.log('err', err);
    }
  };

  const create = () => {
    if (name.length < 0 || name.length > 20) {
      Alert.alert('Name length should be between 0 and 20');
      return;
    }
    let formData = new FormData();
    if (image == undefined) {
      Alert.alert('Please select an image');
      return;
    }

    formData.append('updateID', stampId);
    formData.append('title', name);
    formData.append('imageName', image.name);
    formData.append('stampCroppedImg', 'data:image/png;base64,' + base64);
    let headers = {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'multipart/form-data',
    };
    setLoading(true);

    axios
      .post('https://docudash.net/api/stamps/create', formData, { headers })
      .then((response) => {
        const { status, message }: { status: boolean; message: string } = response.data;
        if (status) {
          navigation.goBack();
          // navigation.navigate('Stamps', {});
        } else {
          // @ts-ignore
          if (message.stamp_photo) {
            // @ts-ignore
            Alert.alert(message.stamp_photo[0]);
          } else {
            Alert.alert(message);
          }
        }
        console.log(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  return (
    <View style={tw`h-full`}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={StampPreview ? 'Edit Stamp' : 'Add Stamp'} />
      </Appbar.Header>
      {/* Create sign button */}
      <View style={tw`flex-1 items-center justify-center p-5 gap-4`}>
        {base64 ? (
          <View style={tw`items-center w-full gap-2`}>
            <View>
              <Badge
                style={tw`absolute z-1 right-1`}
                onPress={() => {
                  setBase64('');
                }}
              >
                X
              </Badge>
              <Avatar.Image size={100} source={{ uri: 'data:image/png;base64,' + base64 }} />
            </View>
            <TextInput
              mode="outlined"
              label="Stamp Name"
              style={tw`w-full`}
              value={name}
              onChangeText={(text) => setName(text)}
            />
          </View>
        ) : (
          <View style={tw`items-center gap-5 py-5 `}>
            <Image style={tw`h-15 w-15 `} source={require('@assets/Stamp-drop-icon.png')} />
            <Text style={tw`font-bold text-4 text-center`}>
              Drag & drop your stamp image or stamp data file here, or hit browse.
            </Text>
            <Text style={tw`font-bold text-4 text-center`}>
              Formats supported:{' '}
              <Text style={tw`font-normal`}>
                jpg, jpeg, gif, png, bmp, x-ms-bmp, x-bmp, ipx Note: Stamp image must be no larger
                than 200KB.
              </Text>
            </Text>
          </View>
        )}
        <View style={tw`flex-row items-center gap-2`}>
          <Button loading={loading} onPress={base64 ? create : uploadStamp} mode="contained">
            {base64 ? 'Upload' : 'Browse'}
          </Button>
        </View>
      </View>
    </View>
  );
};

export default AddStamp;

const styles = StyleSheet.create({
  h2: tw`font-bold text-4`,
});
