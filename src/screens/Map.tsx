import CustomLogoMarker from '../components/CustomLogoMarker';
import { selectAccessToken, selectProfileData } from '../stores/slices/UserSlice';
import * as Location from 'expo-location';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import tw from 'twrnc';
import {
  selectDestination,
  selectOrigin,
  setOrigin,
  setTravelTimeInformation,
} from '../stores/NavSlice';
import axios from 'axios';
import COLORS from '../constants/colors';
import { useNavigation } from '@react-navigation/native';
import BottomSheet, { BottomSheetFlatList, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import moment from 'moment';
import { log } from 'react-native-reanimated';
import { Button } from 'react-native-paper';
import { LocationUpdateResponse } from 'src/types/Location';

const Map = ({ route }) => {
  const { notary_id, id } = route?.params?.details;
  const user = useSelector(selectProfileData);
  const type = user?.user_type;
  const GOOGLE_MAPS_APIKEY = 'AIzaSyCSEEKrvzM3-vFcLEoOUf256gzLG7tyWWc';
  const origin = useSelector(selectOrigin);
  const destination = useSelector(selectDestination);
  const accessToken = useSelector(selectAccessToken);
  const navigation = useNavigation();
  const [notaryDetail, setNotaryDetail] = useState<LocationUpdateResponse>();
  const dispatch = useDispatch();
  const snapPoints = useMemo(() => ['35', '80'], []);
  const mapRef = useRef<MapView>(null);
  const panelRef = useRef(null);
  const [loader, setLoader] = useState(false);
  // console.log('notaryDetail ==>>><', notaryDetail);
  const handleSheetChanges = useCallback((index: number) => {
    // console.log('handleSheetChanges', index);
  }, []);
  useEffect(() => {
    if (!origin || !destination) return;

    // Zoom  @ fit to markers
    setTimeout(() => {
      mapRef?.current?.fitToSuppliedMarkers(['origin', 'destination'], {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
      });
    }, 5000);
  }, [origin, destination]);
  // console.log('notaryDetail?.NotaryRequests?.amount', notaryDetail);
  useEffect(() => {
    if (!origin || !destination) return;

    const getTravelTime = async () => {
      fetch(
        `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${
          origin.lat + ',' + origin.lng
        }&destinations=${destination.lat + ',' + destination.long}&key=${GOOGLE_MAPS_APIKEY}`
      )
        .then((res) => res.json())
        .then((data) => {
          // console.log('data', JSON.stringify(data));
          dispatch(setTravelTimeInformation(data.rows[0].elements[0]));
        })
        .catch((error) => {
          console.error(error);
        });
    };
    getTravelTime();
  }, [origin, destination, GOOGLE_MAPS_APIKEY]);
  // useEffect(() => {
  //   // console.log('User Detail', user);

  //   // if (type === 7)
  //   GetCurrentLocation();
  // }, []);
  const GetCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return;
    }
    try {
      await Location.watchPositionAsync({ accuracy: Location.Accuracy.High }, (loc) => {
        const region = {
          lat: loc.coords.latitude,
          lng: loc.coords.longitude,
        };
        // console.log('location', loc);
        dispatch(setOrigin(region));
        PostCurrentLocation(region);
      });
    } catch (error) {
      console.log(error);
    }
  };
  const PostCurrentLocation = (region: any) => {
    // console.log(region);
    setLoader(true);
    // console.log('obj', {
    //   NotaryRequestsReturnID: id,
    //   long: region.lng,
    //   lat: region.lat,
    //   accessToken,
    // });

    axios
      .post(
        'https://docudash.net/api/create-request-locations-update',
        {
          NotaryRequestsReturnID: id,
          long: region.lng,
          lat: region.lat,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then((response) => {
        setLoader(false);
        const data = response.data;
        setNotaryDetail(response.data);
        // console.log('PostCurrentLocation', data);
      })
      .catch((err) => {
        false;
        console.log('Err PostCurrentLocation', err);
        // if (err.response.status === 401) {
        //   Alert.alert('Session Expired', 'Please login again');
        //   dispatch(logoutUser());
        //   clearToken();
        // }
      });
  };
  // if (destination === null || origin === null || notaryDetail == undefined) return;
  if (destination === null || origin === null) return;
  return (
    <SafeAreaView style={tw`bg-white flex-1`}>
      <View
        style={{
          padding: 15,
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: 'white',
        }}
      >
        <Icon name="arrow-left" size={28} onPress={() => navigation.goBack()} />
        <Text
          style={{
            color: COLORS.primary,
            fontWeight: 'bold',
            fontSize: 16,
            textAlign: 'center',
            flex: 1,
          }}
        >
          Notary
        </Text>
      </View>

      <MapView
        ref={mapRef}
        style={tw`flex-1 `}
        // mapType="mutedStandard"
        initialRegion={{
          // latitude: 36.70983349999999,
          // longitude: -81.9773482,
          latitude: parseFloat(origin.lat),
          longitude: parseFloat(origin.lng),
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
      >
        {origin && destination && (
          <MapViewDirections
            origin={{
              latitude: origin.lat,
              longitude: origin.lng,
            }}
            destination={{
              latitude: destination.lat,
              longitude: destination.long,
            }}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={3}
            strokeColor="black"
          />
        )}
        {origin && (
          // <Marker
          //   coordinate={{
          //     latitude: parseFloat(origin.lat),
          //     longitude: parseFloat(origin.lng),
          //   }}
          //   title="Origin"
          //   // description={origin.description}
          //   identifier="origin"
          // />
          <CustomLogoMarker
            LogoMarker
            coordinate={{
              latitude: parseFloat(origin.lat),
              longitude: parseFloat(origin.lng),
            }}
            title="Origin"
            identifier="origin"
          />
        )}
        {destination && (
          <Marker
            coordinate={{
              latitude: parseFloat(destination.lat),
              longitude: parseFloat(destination.long),
            }}
            title="destination"
            // description={destination.description}
            identifier="destination"
          />
        )}
      </MapView>

      {/* {console.log('type ==><><', type)} */}
      <BottomSheet
        // animateOnMount={false}
        ref={panelRef}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
      >
        <BottomSheetScrollView showsVerticalScrollIndicator={false}>
          <View style={[tw`gap-2`, { paddingHorizontal: 10 }]}>
            <Text style={tw`text-lg text-center mb-2 mt-2 font-bold`}>{`See All Detail`}</Text>
            <View style={tw`flex-row gap-3 mb-3 justify-between items-center `}>
              <View style={tw`gap-4 flex-row items-center justify-center`}>
                <Image
                  style={tw`w-14 h-14 rounded-full  `}
                  source={{
                    uri: `${
                      'https://ui-avatars.com/api/' +
                      notaryDetail?.NotaryRequests?.notary_details?.image
                    }`,
                  }}
                />
                <View style={tw`gap-2`}>
                  <View style={tw`flex-row gap-2 items-center`}>
                    <Text style={tw`text-[4] font-bold `}>
                      {notaryDetail?.NotaryRequests?.notary_details?.first_name}
                    </Text>
                    <Image
                      resizeMode="contain"
                      source={require('@assets/verified-notary-badge.png')}
                      style={{ width: 15, height: 15 }}
                    />
                  </View>

                  <Text style={tw`text-[3] `}>
                    {`+${notaryDetail?.NotaryRequests?.notary_details?.phone}`}
                  </Text>
                </View>
              </View>
              {/* <Button
                  style={[
                    tw`  rounded-full items-center justify-center`,
                    { width: 50, height: 45, marginRight: 15 },
                  ]}
                  mode="contained"
                  // loading={acceptLoading}
                  // disabled={acceptLoading}
                  onPress={() => {
                    const callingUser: {
                      user_id: string;
                      user_name: string;
                      user_display_name: string;
                    } = {
                      user_id: '3',
                      user_name:
                        user.user_type == 7
                          ? notaryDetail?.NotaryRequests.individual_details.email
                          : notaryDetail?.NotaryRequests.notary_details?.email,
                      user_display_name:
                        user.user_type == 7
                          ? notaryDetail?.NotaryRequests.individual_details.name
                          : notaryDetail?.NotaryRequests.notary_details?.name,
                    };
                    // console.log('log', notaryDetail);

                    navigation.navigate('Calling', { user: callingUser });
                  }}
                >
                  <Icon name="phone" size={20} />
                </Button> */}
            </View>
            {/* <Text>{notaryDetail?.NotaryRequests?.notary_details?.profile_photo_url}</Text> */}
            <View style={tw`flex-row items-center gap-2`}>
              <Text style={{ color: 'black', fontWeight: 'bold' }}>Notary:</Text>
              <Text style={{ color: '#6FAC46' }}>
                {notaryDetail?.NotaryRequests?.notary_details?.first_name}
              </Text>
            </View>
            <View style={tw`flex-row items-center gap-2`}>
              <Text style={{ color: 'black', fontWeight: 'bold' }}>Amount:</Text>
              <Text style={{ color: '#6FAC46' }}>{`$${notaryDetail?.NotaryRequests?.amount}`}</Text>
            </View>
            <View style={tw`flex-row items-center gap-2`}>
              <Text style={{ color: 'black', fontWeight: 'bold' }}>Create Date:</Text>
              <Text style={{ color: '#6FAC46' }}>
                {moment(notaryDetail?.NotaryRequests?.created_at).format('MMM Do YY')}
              </Text>
            </View>
            <View style={tw`flex-row items-center `}>
              <Text style={{ color: 'black', fontWeight: 'bold' }}>Request Location:</Text>
              <Text style={{ color: '#6FAC46' }}>
                {notaryDetail?.NotaryRequests?.notary_details?.address1 +
                  ',' +
                  notaryDetail?.NotaryRequests?.notary_details?.city +
                  ',' +
                  notaryDetail?.NotaryRequests?.notary_details?.state}
              </Text>
            </View>
            {/* <View style={tw`flex-row items-center `}>
              <Text style={{ color: 'black', fontWeight: 'bold' }}>Number of Documents:</Text>
              <Text style={{  color: '#6FAC46' }}>
                {notaryDetail?.NotaryRequests?.reasonOfRequest}
              </Text>
            </View> */}
            <View style={tw`flex-row items-center gap-2`}>
              <Text style={{ color: 'black', fontWeight: 'bold' }}>Number of User To sign:</Text>
              <Text style={{ color: '#6FAC46' }}>
                {notaryDetail?.NotaryRequests?.numOfRecipients}
              </Text>
            </View>
            <View style={tw`flex-row items-center gap-2`}>
              <Text style={{ color: 'black', fontWeight: 'bold' }}>Reason of the request:</Text>
              <Text numberOfLines={1} style={{ color: '#6FAC46', width: '65%' }}>
                {notaryDetail?.NotaryRequests?.numOfRecipients === 1
                  ? 'Notary Document (legal Document)'
                  : 'Hello'}
              </Text>
            </View>
            <View style={tw`flex-row items-center gap-2`}>
              <Text style={{ color: 'black', fontWeight: 'bold' }}>User:</Text>
              <Text style={{ color: '#6FAC46' }}>
                {notaryDetail?.NotaryRequests?.individual_details?.first_name}
              </Text>
            </View>
            <View style={tw`flex-row items-center gap-2`}>
              <Text style={{ color: 'black', fontWeight: 'bold' }}>Availability Date:</Text>
              <Text style={{ color: '#6FAC46' }}>{notaryDetail?.NotaryRequests?.requestDate}</Text>
            </View>
            <View style={tw`flex-row items-center gap-2`}>
              <Text style={{ color: 'black', fontWeight: 'bold' }}>Number of Documents:</Text>
              <Text style={{ color: '#6FAC46' }}>
                {notaryDetail?.NotaryRequestsDetailsDocuments?.length}
              </Text>
            </View>
            <View style={tw`flex-row items-center gap-2`}>
              <Text style={{ color: 'black', fontWeight: 'bold' }}>Employees:</Text>
              <Text style={{ color: '#6FAC46' }}>
                {notaryDetail?.NotaryRequests?.notary_details?.ProofOfEmployes}
              </Text>
            </View>
            <View style={tw`flex-row items-center gap-2`}>
              <Text style={{ color: 'black', fontWeight: 'bold' }}>About:</Text>
              <Text style={{ color: '#6FAC46' }}>
                {notaryDetail?.NotaryRequests?.individual_details?.about_notary ?? 'null'}
              </Text>
            </View>
            <View style={tw`flex-row items-center gap-2`}>
              <Text style={{ color: 'black', fontWeight: 'bold' }}>Reviews:</Text>
              <Text style={{ color: '#6FAC46' }}>{notaryDetail?.NotaryReviewCount}</Text>
            </View>
            <View style={tw`flex-row items-center gap-2`}>
              <Text style={{ color: 'black', fontWeight: 'bold' }}>Hired times:</Text>
              <Text style={{ color: '#6FAC46' }}>
                {notaryDetail?.NotaryRequests?.individual_details?.hired_time === null
                  ? 0
                  : notaryDetail?.NotaryRequests?.individual_details?.hired_time}
              </Text>
            </View>
            <View style={tw`flex-row items-center gap-2`}>
              <Text style={{ color: 'black', fontWeight: 'bold' }}>Verified:</Text>
              <Image
                source={require('@assets/verified-notary-badge.png')}
                style={{ width: 20, height: 20 }}
              />
            </View>
          </View>
        </BottomSheetScrollView>
        {/* </View> */}
        {/* </View> */}
      </BottomSheet>
    </SafeAreaView>
  );
};

export default Map;

const styles = StyleSheet.create({});
// function setLoading(arg0: boolean) {
//   throw new Error('Function not implemented.');
// }
