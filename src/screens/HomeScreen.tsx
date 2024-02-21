import DrawerScreenContainer from '@components/DrawerScreenContainer';
import GettingStarted from '@components/GettingStarted';
import HomeHeader from '@components/HomeHeader';
import UploadView from '@components/UploadView';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import {
  logoutUser,
  selectAccessToken,
  selectProfileData,
  setProfileData,
} from '@stores/slices/UserSlice';
import { DashboardAPI, HomeDrawerScreenProps, User } from '@type/index';
import { colors } from '@utils/Colors';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import _ from 'lodash';
import mime from 'mime';
import React, { useEffect, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  Alert,
  Dimensions,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  findNodeHandle,
} from 'react-native';
import { ActivityIndicator, Avatar, Button } from 'react-native-paper';
import { Colors, FeatureHighlight, Text, Typography, View } from 'react-native-ui-lib';
import { useDispatch, useSelector } from 'react-redux';
import tw from 'twrnc';
import COLORS from '../constants/colors';

const { height } = Dimensions.get('window');

interface uploadType {
  uri: string;
  name: string;
  type: 'image' | 'video' | undefined | string;
}

const titles = [
  'Get Notified',
  'Help is here',
  'Show More',
  'Your Profile Photo is here',
  // 'Title number five',
  // 'Welcome to Uilib demo!',
];
const messages = [
  'Side Menu is where all the important things are from manage to find notary click here to see the menu',
  'You can Find help here  ',
  'Click here and see your progress here',
  'Press this to upload you image',
  // 'Short message with information about the below highlighted feature',
  // 'Here is where you can view demos of all Uilib components',
];
const HomeScreen = () => {
  const navigation = useNavigation<HomeDrawerScreenProps<'HomeScreen'>['navigation']>();
  const [documents, setDocuments] = useState<uploadType[]>(new Array());
  const dispatch = useDispatch();
  const [dashNumber, setDashNumber] = useState({
    actionRequired: 0,
    waitingForOthers: 0,
    expiringSoon: 0,
    completed: 0,
    Requests: 0,
    AcceptedList: 0,
    Rejected: 0,
    Done: 0,
  });
  const user = useSelector(selectProfileData);
  const type = user?.user_type;
  const [userData, setUserData] = useState<User>();
  const [loading, setLoading] = useState(false);
  const [signature, setSignature] = useState<any>();
  const accessToken = useSelector(selectAccessToken);

  const viewRef = useRef(null);
  const [targets, setTargets] = useState<{ [key: string]: any }>({});
  const [state, setState] = useState({
    showFTE: false,
    currentTargetIndex: 0,
  });
  const closeHighlight = () => {
    setState((prev) => ({ ...prev, showFTE: false }));
    () => {
      if (viewRef.current) {
        const reactTag = findNodeHandle(viewRef.current);
        reactTag && AccessibilityInfo.setAccessibilityFocus(reactTag);
      }
    };
  };

  const showHighlight = () => {
    setState((prev) => ({ ...prev, showFTE: true }));
  };

  const addTarget = (ref: any, id: string) => {
    if (ref && !targets[id]) {
      targets[id] = ref;
    }
  };
  const moveNext = () => {
    const { currentTargetIndex } = state;
    const newTargetIndex = currentTargetIndex + 1;

    moveToPage(newTargetIndex);
  };

  const moveToPage = (index: number) => {
    if (index < _.size(targets)) {
      setState((prev) => ({ ...prev, currentTargetIndex: index }));
    } else {
      closeHighlight();
    }
  };

  const getPageControlProps = () => {
    return {
      numOfPages: titles.length,
      currentPage: state.currentTargetIndex,
      onPagePress: onPagePress,
      color: Colors.grey30,
      inactiveColor: Colors.grey80,
      size: 8,
    };
  };

  const onPagePress = (index: number) => {
    moveToPage(index);
  };

  const renderHighlighterOverlay = () => {
    const { showFTE, currentTargetIndex } = state;
    const lastPage = titles.length - 1;

    return (
      <FeatureHighlight
        visible={showFTE}
        title={titles[currentTargetIndex]}
        message={messages[currentTargetIndex]}
        titleStyle={currentTargetIndex === lastPage ? { ...Typography.text70 } : undefined}
        messageStyle={
          currentTargetIndex === lastPage
            ? { ...Typography.text60, fontWeight: '900', lineHeight: 28 }
            : undefined
        }
        confirmButtonProps={{ label: 'Got It', onPress: moveNext }}
        onBackgroundPress={closeHighlight}
        getTarget={() => targets[currentTargetIndex]}
        borderRadius={_.includes([1, 2, 3, 4], currentTargetIndex) ? 4 : undefined}
        pageControlProps={currentTargetIndex < lastPage ? getPageControlProps() : undefined}
      />
    );
  };

  const fetchDashData = () => {
    axios
      .get('https://docudash.net/api/dashboard', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        const data: DashboardAPI = response.data;
        // console.log('data =>><><>', data);

        // console.log('DashboardAPI', data);
        setDashNumber({
          ...dashNumber,
          waitingForOthers: data.WaitingForOthers,
          completed: data.CompletedEmails,
          expiringSoon: data.expiredEmails,
          Requests: data.Requests,
          AcceptedList: data.AcceptedList,
          Rejected: data.Rejected,
          Done: data.Done,
        });
        dispatch(setProfileData(data.user));
        setUserData(data.user);
        if (data.signature?.signature) {
          setSignature(data.signature);
        } else {
          setSignature('');
        }
      })
      .catch((err) => {
        setLoading(false);
        if (err.response.status === 401) {
          Alert.alert('Session Expired', 'Please login again');
          dispatch(logoutUser());
        }
      });
  };
  const Box = ({ text, num }: { text: string; num: number }) => {
    return (
      <View style={tw`border-2 border-white p-2  rounded-lg w-[40%] h-22`}>
        <Text style={tw`text-10 text-white`}>{num}</Text>
        <Text style={tw`text-white text-4`} numberOfLines={1}>
          {text}
        </Text>
      </View>
    );
  };
  const isFocused = useIsFocused();
  useEffect(() => {
    setDocuments(new Array());
    fetchDashData();
    // console.log('Change name Home', isFocused);
  }, [navigation, isFocused]);

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

    // console.log(result);
    setLoading(true);
    if (!result.canceled) {
      const image = result.assets[0];
      var imageToUpload = {
        uri: '',
        name: '',
        type: '',
      };
      let formData = new FormData();
      if (Platform.OS === 'android') {
        const newImageUri = 'file:///' + image.uri.split('file:/').join('');
        imageToUpload = {
          uri: newImageUri,
          name: image.fileName ?? image.uri.split('/').pop(),
          type: mime.getType(newImageUri),
        };
      } else {
        imageToUpload = {
          uri: image.uri,
          name: image.fileName ?? image.uri.split('/').pop(),
          type: image.type,
        };
      }

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
    // <DrawerScreenContainer>
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <HomeHeader heading={'DASHBOARD'} addTarget={addTarget} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={style.mainContainer}>
          <GettingStarted addTarget={addTarget} />
          <View style={tw`-mx-5 items-center mt-10 bg-[${colors.green}] py-10 gap-2`}>
            <View style={tw`flex-row items-center h-25`}>
              {loading ? (
                <ActivityIndicator size={100} animating={true} />
              ) : (
                <TouchableOpacity onPress={pickImage} ref={(r) => addTarget(r, '3')}>
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
              <View style={tw`h-full flex-1 justify-between items-start px-1 `}>
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
              <Box text={'Expiring Soon'} num={dashNumber.expiringSoon} />
              <Box text={'Completed'} num={dashNumber.completed} />
              {type === 7 && (
                <>
                  <Box text={'Requests'} num={dashNumber.Requests} />
                  <Box text={'Accepted List'} num={dashNumber.AcceptedList} />
                  <Box text={'Rejected'} num={dashNumber.Rejected} />
                  <Box text={'Done'} num={dashNumber.Done} />
                </>
              )}
            </View>
          </View>

          <UploadView documents={documents} setDocuments={setDocuments} />
          {[...documents].length > 0 ? (
            <Button
              mode="contained"
              onPress={() => {
                if (signature?.signature) {
                  navigation.navigate('Edit', { files: documents });
                } else {
                  alert('Please Add Your Signature');
                }
              }}
            >
              Start Now
            </Button>
          ) : null}
        </View>
      </ScrollView>
      {/* <View center padding-25>
        <View ref={viewRef}>
          <Text marginT-20>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
            has been the industry&apos;s standard dummy text ever since the 1500s, when an unknown
            printer took a galley of type and scrambled it to make a type specimen book. It has
            survived not only five centuries, but also the leap into electronic typesetting,{' '}
            <Text>remaining</Text> essentially unchanged.
          </Text>
        </View>
        <View marginT-20 testID={'5'} ref={(r) => addTarget(r, '5')}>
          <Button onPress={showHighlight}>Show Overlay</Button>
        </View>
      </View> */}
      {renderHighlighterOverlay()}
    </SafeAreaView>
    // </DrawerScreenContainer>
  );
};

const style = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    padding: 20,
    backgroundColor: ' rgba(52, 52, 52, 0.8)',
  },
  modalView: {
    // margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    // padding: 35,
    width: '100%',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    // marginBottom: 15,
    fontSize: 20,
    textAlign: 'center',
  },
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
