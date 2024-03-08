import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import { RootStackScreenProps } from '@type/*';
import { colors } from '@utils/Colors';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import mime from 'mime';
import React, { useCallback, useMemo, useRef } from 'react';
import {
  Alert,
  FlatList,
  Image,
  PermissionsAndroid,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { Badge, Divider, List } from 'react-native-paper';
import DocumentScanner from 'react-native-document-scanner-plugin';
import tw from 'twrnc';
import { useSelector } from 'react-redux';
import { selectProfileData, selectUser, selectUserData } from '@stores/slices/UserSlice';

interface uploadType {
  uri: string;
  name: string;
  type: 'image' | 'video' | undefined | string;
}

export default function UploadView({ documents, setDocuments, Home }) {
  const user = useSelector(selectProfileData);
  const userData = useSelector(selectUserData);
  const type = user?.user_type;
  const navigation = useNavigation<RootStackScreenProps<'Home'>['navigation']>();
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => [300], []);
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
  const scanDocument = async () => {
    // prompt user to accept camera permission request if they haven't already
    if (
      Platform.OS === 'android' &&
      (await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA)) !==
        PermissionsAndroid.RESULTS.GRANTED
    ) {
      Alert.alert('Error', 'User must grant camera permissions to use document scanner.');
      return;
    }

    // start the document scanner
    const { scannedImages } = await DocumentScanner.scanDocument();
    // console.log('scannedImages', scannedImages);

    // get back an array with scanned image file paths
    if (scannedImages.length > 0) {
      scannedImages.map((x) => {
        if (Platform.OS === 'android') {
          const newImageUri = 'file:///' + x.split('file:/').join('');

          const imageToUpload = {
            uri: newImageUri,
            name: x.split('/').pop(),
            type: mime.getType(newImageUri),
          };
          setDocuments((prev) => [...prev, imageToUpload]);
        } else {
          const imageToUpload = {
            uri: x,
            name: x.split('/').pop(),
            type: mime.getType(x),
          };
          setDocuments((prev) => [...prev, imageToUpload]);
        }
      });
      bottomSheetRef.current?.close();
      // set the img src, so we can view the first scanned image
      // setDocuments((prev) => [...prev, scannedImages[0]]);
      // setScannedImage(scannedImages[0]);
    }
  };
  return (
    <View style={tw`bg-white px-8 py-8 gap-4`}>
      <Pressable
        onPress={() => {
          console.log('user.UserPackagesRemains', userData.UserPackagesRemains);
          if (Home) {
            if (userData.UserPackagesRemains == 0 || userData.UserPackagesRemains <= 0) {
              navigation.navigate('Pricing');
            } else {
              handlePresentModalPress();
            }
          } else {
            handlePresentModalPress();
          }
        }}
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
        <BottomSheetScrollView>
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
            {/* {type === 7 && (
              <> */}
            <List.Item
              onPress={scanDocument}
              title="Scan Upload "
              description="Sign images like png/jpg"
              left={(props) => <List.Icon {...props} icon="folder" />}
            />
            <Divider />
            {/* </>
            )} */}
            <List.Item
              onPress={() => {
                // @ts-ignore
                bottomSheetRef.current?.close();
              }}
              title="Cancel"
              left={(props) => <List.Icon {...props} icon="close" />}
            />
          </View>
        </BottomSheetScrollView>
      </BottomSheetModal>
    </View>
  );
}
