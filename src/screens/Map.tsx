import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useRef } from 'react';
import MapView, { Marker } from 'react-native-maps';
import tw from 'twrnc';
import { useDispatch, useSelector } from 'react-redux';
import { selectDestination, selectOrigin, setTravelTimeInformation } from '../stores/NavSlice';
import MapViewDirections from 'react-native-maps-directions';

const Map = () => {
  const GOOGLE_MAPS_APIKEY = 'AIzaSyCSEEKrvzM3-vFcLEoOUf256gzLG7tyWWc';
  const origin = useSelector(selectOrigin);
  const destination = useSelector(selectDestination);
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
          console.log(
            '',
            `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${
              origin.lat + ',' + origin.lng
            }&destinations=${destination.lat + ',' + destination.long}&key=${GOOGLE_MAPS_APIKEY}`
          );

          dispatch(setTravelTimeInformation(data.rows[0].elements[0]));
        })
        .catch((error) => {
          console.error(error);
        });
    };
    getTravelTime();
  }, [origin, destination, GOOGLE_MAPS_APIKEY]);
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
        <Marker
          coordinate={{
            latitude: parseFloat(origin.lat),
            longitude: parseFloat(origin.lng),
          }}
          title="Origin"
          // description={origin.description}
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
