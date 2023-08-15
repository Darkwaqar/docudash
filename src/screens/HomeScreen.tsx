import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
  Dimensions,
  SafeAreaView,
  View,
  Image,
  TextInput,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import COLORS from '../constants/colors';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import pets from '../constants/pets';
import Animated from 'react-native-reanimated';
import { useNavigation, useRoute } from '@react-navigation/native';
const { height } = Dimensions.get('window');
import { LogBox } from 'react-native';
import { HomeDrawerScreenProps, RootStackScreenProps, pet, User, DashboardAPI } from '@type/index';
import { ActivityIndicator, Avatar, Button, Checkbox } from 'react-native-paper';
import axios from 'axios';
import { selectAccessToken, setProfileData, setRouteName } from '@stores/Slices';
import { useDispatch, useSelector } from 'react-redux';
import GettingStarted from '@components/GettingStarted';
import tw from 'twrnc';
import { colors } from '@utils/Colors';
import UploadView from '@components/UploadView';
import * as ImagePicker from 'expo-image-picker';
import HomeHeader from '@components/HomeHeader';

interface uploadType {
  uri: string;
  name: string;
  type: 'image' | 'video' | undefined | string;
}
const HomeScreen = () => {
  const navigation = useNavigation<HomeDrawerScreenProps<'HomeScreen'>['navigation']>();
  const route = useRoute<HomeDrawerScreenProps<'HomeScreen'>['route']>();
  const [documents, setDocuments] = useState<uploadType[]>(new Array());
  const [imagesUpload, setImagesUpload] = useState<uploadType[]>(new Array());
  const dispatch = useDispatch();
  const [dashNumber, setDashNumber] = useState({
    actionRequired: 0,
    waitingForOthers: 0,
    expiringSoon: 0,
    completed: 0,
  });
  const [userData, setUserData] = useState<User>();
  const [loading, setLoading] = useState(false);
  const [signature, setSignature] = useState<any>();
  const accessToken = useSelector(selectAccessToken);

  const fetchDashData = () => {
    axios
      .get('https://docudash.net/api/dashboard', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        const data: DashboardAPI = response.data;
        // console.log('DashboardAPI', data);
        setDashNumber({
          ...dashNumber,
          waitingForOthers: data.WaitingForOthers,
          completed: data.CompletedEmails,
        });
        dispatch(setProfileData(data.user));
        setUserData(data.user);
        if (data.signature?.signature) {
          setSignature(data.signature);
        } else {
          setSignature('');
        }
      });
  };
  const Box = ({ text, num }: box) => {
    return (
      <View style={tw`border-2 border-white p-2  rounded-lg w-[40%] h-22`}>
        <Text style={tw`text-10 text-white`}>{num}</Text>
        <Text style={tw`text-white text-4`} numberOfLines={1}>
          {text}
        </Text>
      </View>
    );
  };

  useEffect(() => {
    fetchDashData();
    console.log('Change name Home');
    dispatch(setRouteName('Home'));
  }, [route]);

  const pickImage = async () => {
    if (loading) return;

    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      selectionLimit: 1,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);
    setLoading(true);
    if (!result.canceled) {
      const image = result.assets[0];
      let formData = new FormData();
      const imageToUpload = {
        uri: image.uri,
        name: image.fileName || image.uri,
        type: image.type,
      };
      // @ts-ignore
      formData.append('photo', imageToUpload);
      let headers = {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'multipart/form-data',
      };
      axios
        .post('https://docudash.net/api/upload-image', formData, { headers })
        .then((response) => {
          setLoading(false);
          const {
            success,
            message,
          }: {
            success: false;
            message: {
              photo: string[];
            };
          } = response.data;
          if (success) {
            // @ts-ignore
            Alert.alert(message);
            fetchDashData();
          } else {
            if (message.photo) {
              message.photo.map((x) => Alert.alert(x));
            }
          }
        })
        .catch((error) => {
          setLoading(false);
          console.log('error', error);
        });
      // setImage(result.assets[0].uri);
    } else {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <HomeHeader heading={'DASHBOARD'} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={style.mainContainer}>
          <GettingStarted />
          <View style={tw`-mx-5 items-center mt-10 bg-[${colors.green}] py-10 gap-2`}>
            <View style={tw`flex-row items-center h-25`}>
              {loading ? (
                <ActivityIndicator size={100} animating={true} />
              ) : (
                <TouchableOpacity onPress={pickImage}>
                  <Avatar.Image
                    size={100}
                    style={tw`m-2`}
                    source={{ uri: userData?.profile_photo }}
                  />
                </TouchableOpacity>
              )}

              <Image
                style={tw`w-2.1 h-24 rounded-full mt-5 top--2 mx-2`}
                source={require('@assets/WhiteLine.png')}
              />
              <View style={tw`h-full justify-between  px-1  items-start `}>
                <Text style={tw`font-semibold text-white text-4 w-50`}>Signed by:</Text>

                {signature ? (
                  <>
                    <Image
                      style={[tw`h-12 w-full`, { tintColor: 'white' }]}
                      source={{
                        uri: signature?.signature.replace(/(\r\n|\n|\r)/gm, ''),
                      }}
                      resizeMode="contain"
                    />

                    <Text style={tw`text-white text-4 w-50`}>{signature.signature_code}</Text>
                  </>
                ) : (
                  <>
                    <Text style={tw`text-white text-4 w-50`}>Needs to sign</Text>
                    <Text style={tw`text-white text-4 w-50`}>
                      Sign id will generate after signature
                    </Text>
                  </>
                )}
              </View>
            </View>
            <View
              style={tw`flex-row  p-4 bg-[${colors.green}] flex-wrap justify-center items-center gap-6`}
            >
              <Box text={'Action Required'} num={0} />
              <Box text={'Waiting for Others'} num={dashNumber.waitingForOthers} />
              <Box text={'Expiring Soon'} num={0} />
              <Box text={'Completed'} num={dashNumber.completed} />
            </View>
          </View>

          <UploadView
            documents={documents}
            setDocuments={setDocuments}
            imagesUpload={imagesUpload}
            setImagesUpload={setImagesUpload}
          />
          {[...documents, ...imagesUpload].length > 0 ? (
            <Button
              mode="contained"
              onPress={() =>
                navigation.navigate('ManageDrawer', {
                  screen: 'Edit',
                  params: { files: documents, images: imagesUpload },
                })
              }
            >
              Start Now
            </Button>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  header: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.light,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 40,
    minHeight: height,
  },
  searchInputContainer: {
    height: 50,
    backgroundColor: COLORS.white,
    borderRadius: 7,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryBtn: {
    height: 50,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  categoryBtnName: {
    color: COLORS.dark,
    fontSize: 10,
    marginTop: 5,
    fontWeight: 'bold',
  },
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardDetailsContainer: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    height: 120,
    backgroundColor: COLORS.white,
    flex: 1,
    borderTopRightRadius: 18,
    borderBottomRightRadius: 18,
    padding: 20,
    justifyContent: 'center',
    // borderRadius: 18,
  },
  cardImageContainer: {
    height: 150,
    width: 140,
    backgroundColor: COLORS.background,
    borderRadius: 20,
    overflow: 'hidden',
  },
});
export default HomeScreen;