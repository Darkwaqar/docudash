import BioEditModal from '@components/BioEditModal';
import HomeHeader from '@components/HomeHeader';
import InfoEditModal from '@components/InfoEditModel';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import NameEditModal from '@components/NameEditModel';
import ProofEmployees from '@components/ProofEmpoyees';
import ShortDescriptionModal from '@components/ShortDescriptionModal';
import { selectAccessToken, selectProfileData, setProfileData } from '@stores/slices/UserSlice';
import { DashboardAPI } from '@type/index';
import { colors } from '@utils/Colors';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import FormData from 'form-data';
import React, { useEffect, useState } from 'react';
import { RefreshControl, SafeAreaView, ScrollView, View, Image, Alert } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Avatar, Button, Divider, Text, TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import tw from 'twrnc';
import UploadView from '@components/UploadView';
import DrawerScreenContainer from '@components/DrawerScreenContainer';

const Profile = () => {
  const user = useSelector(selectProfileData);

  const accessToken = useSelector(selectAccessToken);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [shortDescriptionModalVisible, setShortDescriptionModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [firstName, setFirstName] = useState<null | string>(user.ProofOfEmployes.toString());
  const [documents, setDocuments] = useState([]);
  // console.log(documents);

  const onSave = () => {
    const formData = new FormData();
    formData.append('action_type', 'ProofOfEmployes');
    formData.append('ProofOfEmployes', firstName);
    [...documents].forEach((element, i) => {
      formData.append('ProofOfEmployesDoc', element, element.name);
    });

    axios
      .post('https://docudash.net/api/profiles', formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        const { status, message }: { status: boolean; message: string } = response.data;
        // console.log('status', status);

        if (status) {
          dispatch(
            setProfileData({
              ...user,
              ProofEmployees: firstName,
            })
          );
          setModalVisible(false);
          setDocuments([]);
          fetchDashData();
        } else Alert.alert(Object.values(message).toString());
      })
      .catch((err) => {
        console.log('err', err);
      });
  };
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      selectionLimit: 1,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    setLoading(true);
    if (!result.canceled) {
      const image = result.assets[0];
      let formData = new FormData();
      const imageToUpload = {
        uri: image.uri,
        name: image.fileName || image.uri,
        type: image.type,
      };

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
            // navigation.navigate('Home');
            alert(message);
            fetchDashData();
          } else {
            message.photo.map((x) => alert(x));
          }
        })
        .catch((error) => {
          setLoading(false);
          console.log('error', error);
        });
      // setImage(result.assets[0].uri);
    }
  };
  const bannerImageUpload = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      selectionLimit: 1,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      const image = result.assets[0];
      let data = new FormData();
      const imageToUpload = {
        uri: image.uri,
        name: image.fileName || image.uri,
        type: image.type,
      };

      data.append('BannerImage', imageToUpload);
      data.append('action_type', 'BannerImage');

      axios
        .post('https://docudash.net/api/profiles', data, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => {
          // console.log(response.data);
          fetchDashData();
        });
    }
  };
  useEffect(() => {});
  let fetchDashData = () => {
    axios
      .get('https://docudash.net/api/dashboard', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        const data: DashboardAPI = response.data;
        // console.log('DashboardAPI', data);
        dispatch(setProfileData(data.user));
        onRefresh();
      });
  };

  return (
    <DrawerScreenContainer>
      <SafeAreaView style={tw`flex-1`}>
        <HomeHeader heading={'PROFILE'} />
        <ScrollView
          contentContainerStyle={tw`pb-20`}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <View style={tw`m-4 gap-1 `}>
            <Text style={tw`text-black text-5 font-bold `}>Profile</Text>
            <Text style={tw`text-[${colors.gray}] text-3`}>
              Manage your personal profile information to control what details are shared with other
              Docudash users.
            </Text>
          </View>
          <View style={tw`border border-gray-300 m-4 p-4 rounded-lg `}>
            <View style={tw`flex-row justify-between`}>
              <Text variant="titleMedium">Profile Image</Text>
              <Button mode="contained" style={tw`rounded-lg`} onPress={pickImage}>
                Update
              </Button>
            </View>

            <Avatar.Image size={60} style={tw`m-2`} source={{ uri: user.profile_photo }} />
          </View>
          <View style={tw`border border-gray-300 m-4 p-4 rounded-lg `}>
            <View style={tw`flex-row justify-between`}>
              <Text variant="titleMedium">Name</Text>
              <NameEditModal />
            </View>
            <Text>
              {user.first_name} {user.last_name}
            </Text>
          </View>
          <View style={tw`border border-gray-300 m-4 p-4 rounded-lg `}>
            <View style={tw`flex-row justify-between`}>
              <Text variant="titleMedium">Email address</Text>
              <Button
                mode="contained"
                style={tw`rounded-lg`}
                onPress={() => {
                  alert('You Cannot Change Your Email');
                }}
              >
                Update
              </Button>
            </View>
            <Text>{user.email}</Text>
          </View>
          <View style={tw`border border-gray-300 m-4 p-4 rounded-lg `}>
            <View style={tw`flex-row justify-between`}>
              <Text variant="titleMedium">Contact Information</Text>
              <InfoEditModal />
            </View>
            <View style={tw`gap-2`}>
              <View style={tw`flex-row gap-2 items-center`}>
                <Text variant="titleSmall">Phone:</Text>
                <Text>{user.phone}</Text>
              </View>
              <View style={tw`flex-row gap-2 items-center`}>
                <Text>Company:</Text>
                <Text>{user.company}</Text>
              </View>
              <View style={tw`flex-row gap-2 items-center`}>
                <Text>Address:</Text>
                <Text>{user.address1}</Text>
              </View>
            </View>
          </View>
          <View style={tw`border border-gray-300 m-4 p-4 rounded-lg `}>
            <View style={tw`flex-row justify-between`}>
              <Text variant="titleMedium">Date Created:</Text>
              <Button
                mode="contained"
                style={tw`rounded-lg`}
                onPress={() => {
                  alert('You Cannot Change Your Email');
                }}
              >
                Update
              </Button>
            </View>

            <Text>{new Date(user.created_at).toUTCString().slice(0, 17)}</Text>
          </View>
          {user.user_type === 7 ? (
            <>
              <View style={tw`border border-gray-300 m-4 p-4 rounded-lg `}>
                <View style={tw`flex-row justify-between`}>
                  <Text variant="titleMedium">Banner</Text>
                  <Button mode="contained" style={tw`rounded-lg`} onPress={bannerImageUpload}>
                    Update
                  </Button>
                </View>
                <Image
                  source={{
                    uri:
                      'https://docudash.net/public/uploads/NotaryRequestBanner/' + user.BannerImage,
                  }}
                  style={tw`w-full h-14`}
                  resizeMode={'contain'}
                ></Image>
              </View>
              <View style={tw`border border-gray-300 m-4 p-4 rounded-lg `}>
                <View style={tw`flex-row justify-between`}>
                  <Text variant="titleMedium">Bio description:</Text>
                  <BioEditModal />
                </View>
                <Text>{user.BioDescription}</Text>
              </View>
              <View style={tw`border border-gray-300 m-4 p-4 rounded-lg `}>
                <View style={tw`flex-row justify-between`}>
                  <Text variant="titleMedium">Short Description:</Text>
                  <ShortDescriptionModal />
                </View>
                <Text>{user.ShortDescription}</Text>
              </View>
              <View style={tw`border border-gray-300 m-4 p-4 rounded-lg gap-4 `}>
                <View style={tw`flex-row justify-between`}>
                  <Text variant="titleMedium">Verification Status:</Text>
                </View>
                <Text>{user?.verification_status === 1 ? 'Verified' : 'Not Verified'}</Text>
              </View>
              <View style={tw`border border-gray-300 m-4 p-4 rounded-lg `}>
                <View style={tw`flex-row justify-between`}>
                  <Text variant="titleMedium">Upload Proof of Employees:</Text>
                  <Button
                    mode="contained"
                    style={tw`rounded-lg`}
                    onPress={() => {
                      setModalVisible(true);
                    }}
                  >
                    Update
                  </Button>
                </View>
                <View style={tw`gap-2`}>
                  <Text>Proof of Employees: {user.ProofOfEmployes}</Text>
                  <TouchableOpacity>
                    <Text style={tw`text-green-500 text-4`}>Click to View</Text>
                  </TouchableOpacity>
                  {modalVisible ? (
                    <View style={tw`flex-1 justify-center items-center  `}>
                      <View style={tw`bg-white m-2 p-2 gap-2 w-72 rounded-lg`}>
                        <View style={tw`flex-row items-center justify-between`}>
                          <Text style={tw`text-xl`}>Update Number of Employees</Text>
                        </View>
                        <Divider></Divider>
                        <View style={tw`gap-2`}>
                          <TextInput
                            label="Enter Number of Employees"
                            value={firstName}
                            keyboardType="number-pad"
                            onChangeText={(text) => setFirstName(text)}
                            style={tw`h-20`}
                          />
                          <UploadView documents={documents} setDocuments={setDocuments} />
                        </View>

                        <Divider></Divider>
                        <View style={tw`flex-row items-center gap-4 justify-between`}>
                          <Button style={tw`rounded-lg`} mode="contained" onPress={onSave}>
                            Update
                          </Button>
                          <Button
                            style={tw`rounded-lg`}
                            mode="outlined"
                            onPress={() => setModalVisible(false)}
                          >
                            Cancel
                          </Button>
                        </View>
                      </View>
                    </View>
                  ) : null}
                </View>
              </View>
            </>
          ) : null}
        </ScrollView>
      </SafeAreaView>
    </DrawerScreenContainer>
  );
};

export default Profile;
