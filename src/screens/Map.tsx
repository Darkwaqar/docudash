import CustomLogoMarker from '@components/CustomLogoMarker';
import { selectAccessToken } from '@stores/slices/UserSlice';
import * as Location from 'expo-location';
import React, { useEffect, useRef } from 'react';
import { Alert, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { useDispatch, useSelector } from 'react-redux';
import tw from 'twrnc';
import { selectDestination, selectOrigin, setTravelTimeInformation } from '../stores/NavSlice';
import axios from 'axios';

const Map = ({ route }) => {
  const { notary_id } = route.params.details;
  console.log('Notary', notary_id);

  const GOOGLE_MAPS_APIKEY = 'AIzaSyCSEEKrvzM3-vFcLEoOUf256gzLG7tyWWc';
  const origin = useSelector(selectOrigin);
  const destination = useSelector(selectDestination);
  const accessToken = useSelector(selectAccessToken);
  console.log('origin ==><>', origin);
  console.log('destination ==><>', destination);

  const dispatch = useDispatch();

  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    if (!origin || !destination) return;

    // Zoom  @ fit to markers
    setTimeout(() => {
      mapRef.current.fitToSuppliedMarkers(['origin', 'destination'], {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
      });
    }, 5000);
  }, [origin, destination]);

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
    setInterval(() => {
      GetCurrentLocation();
    }, 3000);
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
        PostCurrentLocation(region);
        console.log('location', loc);
      });
    } catch (error) {
      console.log(error);
    }
  };
  const PostCurrentLocation = (region: any) => {
    console.log(region);
    axios
      .post(
        'https://docudash.net/api/create-request-locations-update',
        {
          NotaryRequestsReturnID: notary_id,
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
    <MapView
      ref={mapRef}
      style={tw`flex-1`}
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
  );
};

export default Map;

const styles = StyleSheet.create({});
// function setLoading(arg0: boolean) {
//   throw new Error('Function not implemented.');
// }
