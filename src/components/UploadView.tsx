import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import { RootStackScreenProps } from '@type/*';
import { colors } from '@utils/Colors';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import mime from 'mime';
import React, { useCallback, useMemo, useRef } from 'react';
import { FlatList, Image, Platform, Pressable, Text, View } from 'react-native';
import { Badge, Divider, List } from 'react-native-paper';
import tw from 'twrnc';

interface uploadType {
  uri: string;
  name: string;
  type: 'image' | 'video' | undefined | string;
}

export default function UploadView({ documents, setDocuments }) {
  const navigation = useNavigation<RootStackScreenProps<'Home'>['navigation']>();
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['35%', '45%'], []);
  const handleSheetChanges = useCallback((index: number) => {}, []);
  const handlePresentModalPress = useCallback(() => {
    // @ts-ignore
    bottomSheetRef.current?.present();
  }, []);
  const uploadFile = async () => {
    // @ts-ignore
    bottomSheetRef.current?.close();
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'], // You can specify the file types here (e.g., 'image/*', 'application/pdf', etc.)
      });
      if (result.type !== 'cancel') {
        const fileToUpload = {
          uri: result.uri,
          name: result.name || result.uri,
          type: result.mimeType || result.type,
        };
        setDocuments((prev) => [...prev, fileToUpload]);
      }
    } catch (err) {
      console.log('err', err);
    }
  };
  const uploadImage = async () => {
    // @ts-ignore
    bottomSheetRef.current?.close();
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      // aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      const image = result.assets[0];
      if (Platform.OS === 'android') {
        const newImageUri = 'file:///' + image.uri.split('file:/').join('');

        const imageToUpload = {
          uri: newImageUri,
          name: image.fileName ?? image.uri.split('/').pop(),
          type: mime.getType(newImageUri),
        };
        setDocuments((prev) => [...prev, imageToUpload]);
      } else {
        const imageToUpload = {
          uri: image.uri,
          name: image.fileName ?? image.uri.split('/').pop(),
          type: image.type,
        };
        setDocuments((prev) => [...prev, imageToUpload]);
      }
    }
  };
  return (
    <View style={tw`bg-white px-8 py-8 gap-4`}>
      <Pressable
        onPress={handlePresentModalPress}
        style={tw`border-2 py-10  rounded-xl border-dashed border-[${colors.blue}] justify-center items-center`}
      >
        <View style={tw`p-1`}>
          <Image style={tw`h-10 w-10 self-center`} source={require('@assets/Upload.png')} />
          <Text style={tw`text-[${colors.blue}] mt-2`}>Let's Go - Drop it like it's hot!</Text>
        </View>
      </Pressable>

      <View style={tw`py-5 my-2`}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={[...documents]}
          renderItem={({ item, index }) => (
            <View
              style={tw`items-center w-30 h-30 mx-2 border border-gray-300 rounded-lg`}
              id={index + '_'}
            >
              <Badge
                style={tw`absolute z-1 top-1 right-1`}
                onPress={() => setDocuments((prev) => prev.filter((_, i) => i !== index))}
              >
                X
              </Badge>
              {item.type === 'image' || item.type === 'image/png' || item.type === 'image/jpeg' ? (
                <Image
                  source={{ uri: item.uri }}
                  style={tw`w-full h-full`}
                  resizeMode="contain"
                ></Image>
              ) : (
                <>
                  <MaterialCommunityIcons
                    name={
                      item.type === 'application/pdf'
                        ? 'file-pdf-box'
                        : item.type === 'image/png'
                        ? 'file-image'
                        : 'file-question-outline'
                    }
                    size={40}
                  />
                  <Text style={tw`w-25 text-center`} numberOfLines={2}>
                    {item.name}
                  </Text>
                </>
              )}
            </View>
          )}
        />
      </View>

      <BottomSheetModal
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        enablePanDownToClose
        onChange={handleSheetChanges}
      >
        <View style={tw`flex-1 bg-white`}>
          <List.Item
            onPress={uploadFile}
            title="Upload Document"
            description="Sign document files like pdf"
            left={(props) => <List.Icon {...props} icon="folder" />}
          />
          <Divider />
          <List.Item
            onPress={uploadImage}
            title="Upload Image"
            description="Sign images like png/jpg"
            left={(props) => <List.Icon {...props} icon="folder" />}
          />
          <Divider />
          <List.Item
            onPress={() => {
              // @ts-ignore
              bottomSheetRef.current?.close();
            }}
            title="Cancel"
            left={(props) => <List.Icon {...props} icon="close" />}
          />
        </View>
      </BottomSheetModal>
    </View>
  );
}
