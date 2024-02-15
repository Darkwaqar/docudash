import CustomLogoMarker from '../components/CustomLogoMarker';
import { selectAccessToken, selectProfileData } from '../stores/slices/UserSlice';
import * as Location from 'expo-location';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, StyleSheet, View, Text, SafeAreaView, TouchableOpacity, Image } from 'react-native';
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
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import moment from 'moment';
import { log } from 'react-native-reanimated';

const Map = ({ route }) => {
  const { notary_id, id } = route?.params?.details;
  const user = useSelector(selectProfileData);
  const type = user?.user_type;
  const GOOGLE_MAPS_APIKEY = 'AIzaSyCSEEKrvzM3-vFcLEoOUf256gzLG7tyWWc';
  const origin = useSelector(selectOrigin);
  const destination = useSelector(selectDestination);
  const accessToken = useSelector(selectAccessToken);
  const navigation = useNavigation();
  const [notaryDetail, setNotaryDetail] = useState([]);
  const dispatch = useDispatch();
  const snapPoints = useMemo(() => ['30', '80'], []);
  const mapRef = useRef<MapView>(null);
  const panelRef = useRef(null);
  console.log('notaryDetail ==>>><', notaryDetail);
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
  console.log('notaryDetail?.NotaryRequests?.amoun', notaryDetail);
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
          console.log('data', JSON.stringify(data));
          dispatch(setTravelTimeInformation(data.rows[0].elements[0]));
        })
        .catch((error) => {
          console.error(error);
        });
    };
    getTravelTime();
  }, [origin, destination, GOOGLE_MAPS_APIKEY]);
  useEffect(() => {
    console.log('User Detail', user);

    // if (type === 7)
    GetCurrentLocation();
  }, []);
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
    console.log('obj', {
      NotaryRequestsReturnID: id,
      long: region.lng,
      lat: region.lat,
      accessToken,
    });

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
        const data = response.data;
        setNotaryDetail(response.data);
        console.log('PostCurrentLocation', data);
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
      {console.log('notaryDetail?.NotaryRequests', notaryDetail?.NotaryRequests)}
      {/* {console.log('type ==><><', type)} */}
      <BottomSheet
        // animateOnMount={false}
        ref={panelRef}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
      >
        <View style={[tw`gap-2`, { paddingHorizontal: 10 }]}>
          <Text style={tw`text-lg text-center mb-2 mt-2 font-bold`}>{`See All Detail`}</Text>
          <View style={tw`flex-row items-center gap-2`}>
            <Text style={{ fontSize: 16, color: 'black', fontWeight: 'bold' }}>Notary:</Text>
            <Text style={{ fontSize: 18, color: 'black' }}>
              {notaryDetail?.NotaryRequests?.notary_details?.first_name}
            </Text>
          </View>
          <View style={tw`flex-row items-center gap-2`}>
            <Text style={{ fontSize: 16, color: 'black', fontWeight: 'bold' }}>Amount:</Text>
            <Text style={{ fontSize: 18, color: 'black' }}>
              {`$${notaryDetail?.NotaryRequests?.amount}`}
            </Text>
          </View>
          <View style={tw`flex-row items-center gap-2`}>
            <Text style={{ fontSize: 16, color: 'black', fontWeight: 'bold' }}>Create Date:</Text>
            <Text style={{ fontSize: 18, color: 'black' }}>
              {moment(notaryDetail?.NotaryRequests?.created_at).format('MMM Do YY')}
            </Text>
          </View>
          <View style={tw`flex-row items-center `}>
            <Text style={{ fontSize: 16, color: 'black', fontWeight: 'bold' }}>Create Date:</Text>
            <Text style={{ fontSize: 18, color: 'black' }}>
              {notaryDetail?.NotaryRequests?.notary_details?.address1 +
                ',' +
                notaryDetail?.NotaryRequests?.notary_details?.city +
                ',' +
                notaryDetail?.NotaryRequests?.notary_details?.state}
            </Text>
          </View>
          <View style={tw`flex-row items-center `}>
            <Text style={{ fontSize: 16, color: 'black', fontWeight: 'bold' }}>
              Request Location:
            </Text>
            <Text style={{ fontSize: 18, color: 'black' }}>
              {notaryDetail?.NotaryRequests?.reasonOfRequest}
            </Text>
          </View>
          <View style={tw`flex-row items-center gap-2`}>
            <Text style={{ fontSize: 16, color: 'black', fontWeight: 'bold' }}>
              Number of User To sign:
            </Text>
            <Text style={{ fontSize: 18, color: 'black' }}>
              {notaryDetail?.NotaryRequests?.numOfRecipients}
            </Text>
          </View>
          <View style={tw`flex-row items-center gap-2`}>
            <Text style={{ fontSize: 16, color: 'black', fontWeight: 'bold' }}>
              Reason of the request:
            </Text>
            <Text style={{ fontSize: 18, color: 'black' }}>
              {notaryDetail?.NotaryRequests?.numOfRecipients === 1
                ? 'Notary Document (legal Document)'
                : 'Hello'}
            </Text>
          </View>
          <View style={tw`flex-row items-center gap-2`}>
            <Text style={{ fontSize: 16, color: 'black', fontWeight: 'bold' }}>User:</Text>
            <Text style={{ fontSize: 18, color: 'black' }}>
              {notaryDetail?.NotaryRequests?.individual_details?.first_name}
            </Text>
          </View>
          <View style={tw`flex-row items-center gap-2`}>
            <Text style={{ fontSize: 16, color: 'black', fontWeight: 'bold' }}>
              Availability Date:
            </Text>
            <Text style={{ fontSize: 18, color: 'black' }}>
              {notaryDetail?.NotaryRequests?.requestDate}
            </Text>
          </View>
          <View style={tw`flex-row items-center gap-2`}>
            <Text style={{ fontSize: 16, color: 'black', fontWeight: 'bold' }}>
              Number of Documents:
            </Text>
            <Text style={{ fontSize: 18, color: 'black' }}>
              {notaryDetail?.NotaryRequestsDetailsDocuments?.length}
            </Text>
          </View>
          <View style={tw`flex-row items-center gap-2`}>
            <Text style={{ fontSize: 16, color: 'black', fontWeight: 'bold' }}>Employees:</Text>
            <Text style={{ fontSize: 18, color: 'black' }}>
              {notaryDetail?.NotaryRequests?.notary_details?.ProofOfEmployes}
            </Text>
          </View>
          <View style={tw`flex-row items-center gap-2`}>
            <Text style={{ fontSize: 16, color: 'black', fontWeight: 'bold' }}>About:</Text>
            <Text style={{ fontSize: 18, color: 'black' }}>
              {notaryDetail?.NotaryRequests?.individual_details?.about_notary ?? 'null'}
            </Text>
          </View>
          <View style={tw`flex-row items-center gap-2`}>
            <Text style={{ fontSize: 16, color: 'black', fontWeight: 'bold' }}>Reviews:</Text>
            <Text style={{ fontSize: 18, color: 'black' }}>{notaryDetail?.NotaryReviewCount}</Text>
          </View>
          <View style={tw`flex-row items-center gap-2`}>
            <Text style={{ fontSize: 16, color: 'black', fontWeight: 'bold' }}>Hired times:</Text>
            <Text style={{ fontSize: 18, color: 'black' }}>
              {notaryDetail?.NotaryRequests?.individual_details?.hired_time === null
                ? 0
                : notaryDetail?.NotaryRequests?.individual_details?.hired_time}
            </Text>
          </View>
          <View style={tw`flex-row items-center gap-2`}>
            <Text style={{ fontSize: 16, color: 'black', fontWeight: 'bold' }}>Verified:</Text>
            <Image
              source={require('@assets/verified-notary-badge.png')}
              style={{ width: 30, height: 30 }}
            />
          </View>
        </View>
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
