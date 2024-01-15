global.Buffer = global.Buffer || require('buffer').Buffer;
import COLORS from '@constants/colors';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { selectDestination, selectOrigin, setDestination, setOrigin } from '@stores/NavSlice';
import { selectAccessToken, selectProfileData } from '@stores/slices/UserSlice';
import { DraggedElArr, RootStackScreenProps } from '@type/index';
import { colors } from '@utils/Colors';
import { reasons } from '@utils/requestReason';
import { time } from '@utils/requestTime';
import { requestType } from '@utils/requestType';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import Geocoder from 'react-native-geocoding';
import { Button, Divider, IconButton, Menu, Text } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import * as Location from 'expo-location';
import {
  NotaryRequests,
  NotaryRequestsDetail,
  NotaryRequestsDetailsDocument,
  RequestDetailsPage,
} from 'src/types/RequestDetails';
import tw from 'twrnc';

interface IButton {
  text: string;
  onPress: () => void;
  pressed: boolean;
}

const Details = () => {
  const accessToken = useSelector(selectAccessToken);
  const dispatch = useDispatch();
  const navigation = useNavigation<RootStackScreenProps<'RequestDetails'>['navigation']>();
  const route = useRoute<RootStackScreenProps<'RequestDetails'>['route']>();
  const id: number = route.params?.id;
  const [visible, setVisible] = React.useState(false);
  const openMenu = () => setVisible(true);
  const [draggedElArr, setDraggedElArr] = useState<DraggedElArr>({
    signature: [],
    initial: [],
    stamp: [],
    date: [],
    name: [],
    email: [],
    company: [],
    title: [],
  });

  const closeMenu = () => setVisible(false);
  const user = useSelector(selectProfileData);
  const [visibleMore, setVisibleMore] = React.useState(false);
  const [details, setDetails] = useState<NotaryRequests>();
  const [visibleMoreHeader, setVisibleMoreHeader] = React.useState(false);
  const [documentDetails, setDocumentDetails] = useState<NotaryRequestsDetailsDocument[]>([]);
  const openMenuMoreHeader = () => setVisibleMoreHeader(true);
  const closeMenuMoreHeader = () => setVisibleMoreHeader(false);
  const [acceptLoading, setAcceptLoading] = useState(false);
  const [denyLoading, setDenyLoading] = useState(false);
  const [doneLoading, setDoneLoading] = useState(false);
  const [recipients, setRecipients] = useState<NotaryRequestsDetail[]>([]);
  const [generateSignature, setGenerateSignature] = useState();
  const origin = useSelector(selectOrigin);
  const destination = useSelector(selectDestination);
  // console.log('origin', details);
  const GetCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      // console.log('Permission to access location was denied');
      return;
    }

    const option: Location.LocationOptions = {
      accuracy: Location.Accuracy.Highest,
      timeInterval: 10000,
    };
    Location.getCurrentPositionAsync(option).then(
      (position: any) => {
        // console.log('position', position);
        const region = {
          lat: parseFloat(position.coords.latitude),
          lng: parseFloat(position.coords.longitude),
        };
        dispatch(setOrigin(region));
        navigation.navigate('Map', { details: details });
      },
      (error) => {
        // console.log(error.code, error.message);
      }
    );
  };
  // useEffect(() => {
  //   if (destination) {
  //     navigation.navigate('Map');
  //   }
  // }, [destination]);

  const Accept = () => navigation.navigate('ApproveRequest', { id: id });
  const Done = () => {
    setDoneLoading(true);
    axios
      .post(
        'https://docudash.net/api/notary/DoneRequest',
        {
          id: id,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then((response) => {
        // console.log('Done', response.data);
        setDoneLoading(false);
        navigation.goBack();
      })
      .catch((err) => {
        setDoneLoading(false);
      });
  };
  const Deny = () => {
    setDenyLoading(true);
    axios
      .post(
        'https://docudash.net/api/notary/DenyRequest',
        {
          id: id,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then((response) => {
        // console.log(response.data);
        setDenyLoading(false);
        navigation.goBack();
      })
      .catch((err) => {
        setDenyLoading(false);
      });
  };

  const fetchData = () => {
    const url = 'https://docudash.net/api/notary/request-detail/';

    axios
      .get(url + id, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        const {
          status,
          message,
          NotaryRequests,
          NotaryRequestsDetails,
          NotaryRequestsDetailsDocuments,
          generateSignature,
        }: RequestDetailsPage = response.data;
        console.log('NotaryRequests', generateSignature);
        setGenerateSignature(generateSignature);
        setDetails(NotaryRequests);
        setRecipients(NotaryRequestsDetails);
        setDocumentDetails(NotaryRequestsDetailsDocuments);
      })
      .catch((error) => {
        console.log('Error----', error);
      });
  };
  useEffect(() => {
    fetchData();
  }, []);
  ``;
  if (details)
    //  console.log('Hello', details);
    return (
      <SafeAreaView style={tw`h-full`}>
        <View style={styles.header}>
          <Icon name="arrow-left" size={28} onPress={() => navigation.goBack()} />
          <Text style={{ color: COLORS.primary, fontWeight: 'bold', fontSize: 16 }}>
            {'Request Detail'}
          </Text>
          {user.user_type === 7 ? (
            <Menu
              anchorPosition="bottom"
              visible={visibleMoreHeader}
              onDismiss={closeMenuMoreHeader}
              anchor={
                <IconButton icon="dots-vertical" onPress={(_) => openMenuMoreHeader()}></IconButton>
              }
            >
              <Menu.Item onPress={Accept} title="Accept" />
              {/* <VoidEnvelopeModel inbox={inbox} navigation={navigation} /> */}
              <Divider />
              <Menu.Item onPress={Deny} title="Deny" />
              {/* <Menu.Item onPress={DeleteEnvelope} title="Delete" /> */}
              <Divider />
              <Menu.Item onPress={Done} title="Done" />
              <Divider />

              {/* <Menu.Item onPress={ResendEmail} title="Resend Email" /> */}
            </Menu>
          ) : (
            <View></View>
          )}
        </View>
        <ScrollView>
          <View style={tw`p-4 gap-3 py-10 pt-3`}>
            <View style={tw`  gap-3 flex-row items-center`}>
              <Text style={[styles.heading, { width: '80%' }]} numberOfLines={2}>
                {reasons.find((x) => x.value == details?.reasonOfRequest.toString())?.label}
              </Text>
              <Menu
                style={tw`w-70`}
                visible={visible}
                onDismiss={closeMenu}
                anchor={<IconButton icon="information" onPress={openMenu} />}
              >
                <Menu.Item onPress={() => {}} title="Details" />
                <Menu.Item
                  onPress={() => {}}
                  title={
                    <Text style={tw`text-black`}>
                      <Text style={tw`font-bold text-black`}>Created At: </Text>
                      {new Date(details?.created_at).toUTCString().slice(0, 17)}
                    </Text>
                  }
                />
                <Menu.Item
                  onPress={() => {}}
                  title={
                    <Text style={tw`text-black`}>
                      <Text style={tw`font-bold text-black`}>Modified At: </Text>
                      {new Date(details?.updated_at).toUTCString().slice(0, 17)}
                    </Text>
                  }
                />
                <Menu.Item
                  onPress={() => {}}
                  title={
                    <Text style={tw`text-black`}>
                      <Text style={tw`font-bold text-black`}>User: </Text>
                      {details?.individual_details.first_name}
                    </Text>
                  }
                />
                <Menu.Item
                  onPress={() => {}}
                  title={
                    <Text style={tw`text-black`}>
                      <Text style={tw`font-bold text-black`}>Notary: </Text>
                      {details?.notary_details.first_name}
                    </Text>
                  }
                />
              </Menu>
            </View>

            <View style={tw`gap-2`}>
              <Text variant="labelLarge">
                Reason of the request:{' '}
                <Text style={tw`text-[#6FAC46]`}>
                  {reasons.find((x) => x.value == details?.reasonOfRequest.toString())?.label}
                </Text>
              </Text>
              <Text variant="labelLarge">
                Availability Date: <Text style={tw`text-[#6FAC46]`}> {details?.requestDate}</Text>
              </Text>
              <Text variant="labelLarge">
                Availability Time:{' '}
                <Text style={tw`text-[#6FAC46]`}>
                  {time.find((x) => x.value == details?.requestTime.toString())?.label}
                </Text>
              </Text>
              <Text variant="labelLarge">
                Number of User To Sign:{' '}
                <Text style={tw`text-[#6FAC46]`}>{details?.numOfRecipients}</Text>
              </Text>
              <Text variant="labelLarge">
                Number of Pages Uploaded:{' '}
                <Text style={tw`text-[#6FAC46]`}>{details?.reasonOfRequest}</Text>
              </Text>
              <Text variant="labelLarge">
                Create Date:{' '}
                <Text style={tw`text-[#6FAC46]`}>
                  {new Date(details?.created_at).toUTCString().slice(0, 17)}
                </Text>
              </Text>
              <Text variant="labelLarge">
                Create By:{' '}
                <Text style={tw`text-[#6FAC46]`}>{details?.individual_details.first_name}</Text>
              </Text>
              <Text variant="labelLarge">
                Address:{' '}
                <Text style={tw`text-[#6FAC46]`}>
                  {details?.individual_details.address1 || 'NO ADDRESS AVAILABLE'}
                </Text>
              </Text>
              {details?.amount != null && (
                <Text variant="labelLarge">
                  Amount: <Text style={tw`text-[#6FAC46]`}>{`$${details?.amount}`}</Text>
                </Text>
              )}
              {requestType.find((x) => x.value == details?.notary_request_status.toString())
                ?.label === 'Accepted' && (
                <Button
                  style={tw`w-40`}
                  mode="contained"
                  loading={acceptLoading}
                  disabled={acceptLoading}
                  // onPress={Accept}
                  onPress={() => {
                    dispatch(setDestination(details.request_location_list));
                    if (destination == null) {
                      GetCurrentLocation();
                    } else {
                      GetCurrentLocation();
                    }
                  }}
                >
                  {user.user_type === 7 ? 'Navigate' : 'View Your Notary Location'}
                </Button>
              )}
            </View>

            {/* Buttons */}
            {user.user_type === 7 ? (
              <View style={tw`flex-row items-center  gap-3 py-5`}>
                {details?.notary_request_status === 1 ? (
                  <>
                    <View style={tw` items-center gap-5 py-2 justify-center`}>
                      <Button
                        mode="contained"
                        loading={acceptLoading}
                        disabled={acceptLoading}
                        onPress={Accept}
                      >
                        Accept
                      </Button>
                    </View>

                    <View style={tw`flex-row items-center gap-5 py-2 justify-center`}>
                      <Button
                        loading={denyLoading}
                        disabled={denyLoading}
                        onPress={Deny}
                        mode="outlined"
                      >
                        Deny
                      </Button>
                    </View>
                  </>
                ) : (
                  <>
                    <View style={tw` items-center gap-5 py-2 justify-center`}>
                      <Button
                        mode="contained"
                        loading={doneLoading}
                        disabled={doneLoading}
                        onPress={() =>
                          navigation.navigate('DocumentViewer', {
                            Envelope: details,
                            generateSignature: generateSignature,
                          })
                        }
                      >
                        View Document Completed
                      </Button>
                    </View>
                  </>
                )}
              </View>
            ) : (
              <Text variant="labelLarge">
                Request Status:{' '}
                <Text style={tw`text-[#6FAC46]`}>
                  {
                    requestType.find((x) => x.value == details?.notary_request_status.toString())
                      ?.label
                  }
                </Text>
              </Text>
            )}
            <View style={tw`py-10 gap-4`}>
              <Text style={styles.heading}>Uploaded Documents</Text>
              <View>
                {documentDetails?.map((e, i) => (
                  <View style={tw` mt-2 border-2 border-[${colors.green}] rounded-lg p-3  gap-1`}>
                    <Text style={tw`text-black text-4 font-semibold`}>{e.document}</Text>
                    <Text style={tw`text-gray-400`}> {new Date(e?.created_at).toUTCString()}</Text>
                  </View>
                ))}
              </View>
            </View>
            <View style={tw`py-5`}>
              <View style={tw`flex-row items-center justify-between`}>
                <Text style={styles.heading}>Recipients</Text>
              </View>
              {recipients.map((item, index) => (
                <View id={String(index)} style={tw` mt-5 py-3 flex-row items-center  `}>
                  <View style={tw`flex-1`}>
                    <View style={tw`flex-row items-center justify-between`}>
                      <Text style={styles.h2} numberOfLines={2}>
                        {item.recName}
                      </Text>
                    </View>
                    <Text style={tw`font-thin text-black`}>{item.recEmail}</Text>
                    <Text style={tw` text-black`}>
                      Status: {item.complete_incomplete === 0 ? 'pending' : 'Completed'}
                    </Text>
                  </View>
                  <View style={tw`flex-row items-center flex-0.6 `}>
                    <Image style={tw`w-5 h-5 mx-2`} source={require('@assets/NeedToSign.png')} />
                    <View>
                      <Text style={tw`text-3 font-bold overflow-hidden w-full`}>
                        {item.sign_type == 1
                          ? 'Need to Sign'
                          : item.sign_type == 2
                          ? 'In Person Signer'
                          : item.sign_type === 3
                          ? 'Receives a Copy'
                          : 'Needs to View'}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
            <View style={tw`py-2`}>
              <Text style={styles.heading}>Message</Text>
              <View style={tw`m-3 mt-5`}>
                <Text style={tw`font-thin`}>{details?.requestMessage}</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
};

export default Details;

const styles = StyleSheet.create({
  heading: tw`font-bold text-5`,
  h2: tw`text-3 w-[50%]`,
  menu_block: tw`p-3 font-bold`,
  header: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
