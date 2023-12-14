import AddSignatureDraw from '@components/AddSignauteDraw';
import { colors } from '@utils/Colors';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Appbar, Button, SegmentedButtons, TextInput } from 'react-native-paper';
import tw from 'twrnc';

import ChooseSignatureItem from '@components/ChooseSignatureItem';
import { useNavigation, useRoute } from '@react-navigation/native';
import { selectAccessToken, selectProfileData } from '@stores/slices/UserSlice';
import { Contact, RootStackScreenProps, SignaturePreview } from '@type/index';
import { useSelector } from 'react-redux';
import { Addresses } from 'src/types/AddressList';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { placeTypeToDelta } from '@utils/placeTypeToDelta';

const AddAddress = () => {
  const user = useSelector(selectProfileData);
  const accessToken = useSelector(selectAccessToken);
  const [lngLat, setLngLat] = useState({
    lng: 0,
    lat: 0,
  });
  const map = useRef<MapView>(null);
  const [adress, setAddress] = React.useState<Addresses>({
    name: '',
    address: '',
    city: '',
    state: '',
    country: '',
    zip_code: '',
    lat: '0',
    long: '0',
  });
  const navigation = useNavigation<RootStackScreenProps<'AddAddress'>['navigation']>();
  const route = useRoute<RootStackScreenProps<'AddAddress'>['route']>();
  const Adress = route.params?.Address as Addresses;
  const From = route.params?.From as string;

  useEffect(() => {
    if (Adress) {
      setAddress(Adress);
    }
  }, []);

  const createOrUpdate = () => {
    if (adress.name.length == 0) {
      Alert.alert('Please add a name');
      return;
    }
    if (Adress) {
      // update
      // console.log('Update');

      axios
        .post(
          'https://docudash.net/api/Address/update/' + adress.id,
          {
            name: adress.name,
            address: adress.address,
            city: adress.city,
            state: adress.state,
            country: adress.country,
            zip_code: adress.zip_code,
            lat: adress.lat,
            long: adress.long,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        .then((response) => {
          const {
            message,
            success,
          }: {
            message: string;
            success: boolean;
          } = response.data;
          // console.log('response.data', response.data);
          if (success) {
            navigation.goBack();
            // navigation.navigate('Signatures', {});
          } else {
            Alert.alert(message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      // create
      // console.log('Create');

      axios
        .post(
          'https://docudash.net/api/Address/create',
          {
            name: adress.name,
            address: adress.address,
            city: adress.city,
            state: adress.state,
            country: adress.country,
            zip_code: adress.zip_code,
            lat: adress.lat,
            long: adress.long,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        .then((response) => {
          const {
            message,
            success,
          }: {
            message: string;
            success: boolean;
          } = response.data;
          // console.log(response.data);
          if (success) {
            if (From === 'create request') {
              navigation.navigate('CreateARequest', { From: 'Address' });
            } else navigation.goBack();
            // navigation.navigate('Signatures', {});
          } else {
            Alert.alert(message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const deleteContact = () => {
    if (adress.id == undefined) {
      alert('Local Id Cannot Be Deleted');
      return;
    }
    axios
      .post(
        'https://docudash.net/api/Address/delete',
        {
          deleteId: adress.id,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then((response) => {
        const {
          message,
          status,
        }: {
          message: string;
          status: boolean;
        } = response.data;
        // console.log(response.data);
        if (status) {
          navigation.goBack();
          // navigation.navigate('Signatures', {});
        } else {
          Alert.alert(message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <View style={tw`h-full `}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Add Address" />
        {Adress && <Appbar.Action icon="delete" onPress={deleteContact} />}
      </Appbar.Header>
      <View style={tw`flex-1`}>
        <ScrollView contentContainerStyle={tw`mx-2 gap-4`} keyboardShouldPersistTaps="handled">
          <TextInput
            mode="outlined"
            label="Name"
            // disabled
            value={adress.name}
            onChangeText={(text) => setAddress((prev) => ({ ...prev, name: text }))}
          />

          <GooglePlacesAutocomplete
            styles={{
              predefinedPlacesDescription: {
                color: 'blue',
              },
              textInput: {
                height: 38,
                color: colors.black,
                fontSize: 15,
              },
              listView: {
                backgroundColor: colors.green,
              },
            }}
            placeholder="Search your address"
            debounce={400}
            // GooglePlacesDetailsQuery={{ fields: 'geometry' }}
            fetchDetails={true}
            renderRow={(rowData) => {
              const title = rowData.structured_formatting.main_text;
              const address = rowData.structured_formatting.secondary_text;
              return (
                <View style={{ height: 18 }}>
                  <Text style={{ fontSize: 13, color: colors.black }}>
                    {title} {address}
                  </Text>
                </View>
              );
            }}
            query={{
              key: 'AIzaSyCSEEKrvzM3-vFcLEoOUf256gzLG7tyWWc',
              language: 'en',
              components: 'country:us',
            }}
            onPress={(data, details = null) => {
              let _state: any;
              // console.log('details.address_components[0]', details.adr_address);
              const state = details.address_components.find((component) =>
                component.types.includes('administrative_area_level_1')
              );
              _state = state.long_name;
              let _country: any;
              const country = details.address_components.find((component) =>
                component.types.includes('country')
              );
              _country = country.long_name;
              if (details == null) return;

              const placeType = details.types[0] || '';
              const { lat, lng } = details.geometry.location;
              // Get the latitudeDelta based on the PlaceType, or use a default value
              const latitudeDelta = placeTypeToDelta[placeType] || 0.01; // Default latitudeDelta
              const region = {
                latitude: lat,
                longitude: lng,
                latitudeDelta: latitudeDelta,
                longitudeDelta: 0.01,
              } as Region;
              map?.current?.animateToRegion(region);
              let zip_code: any;
              let re: any;
              let filtersResCity = details.address_components.filter((val: any) => {
                // console.log(val.types);

                if (val.types.includes('locality') || val.types.includes('sublocality')) {
                  setAddress((prev) => ({
                    ...prev,
                    city: val.long_name,
                    country: latitudeDelta.country,
                  }));

                  return val;
                }
                if (val.types.includes('postal_code')) {
                  let postalCode = val.long_name;
                  zip_code = postalCode;
                }
                return false;
              });
              setAddress((prev) => ({
                ...prev,
                long: String(lng),
                lat: String(lat),
                address: String(data.description),
                zip_code: zip_code,
                state: _state,
                country: _country,
              }));
            }}
          />

          <MapView
            ref={map}
            style={tw`h-50 my-2`}
            // provider={PROVIDER_GOOGLE}
            initialRegion={{
              latitude: 28.3279822,
              longitude: -16.5124847,
              latitudeDelta: 10,
              longitudeDelta: 10,
            }}
          >
            <Marker
              coordinate={{
                latitude: parseFloat(adress.lat),
                longitude: parseFloat(adress.long),
              }}
            />
          </MapView>

          <TextInput
            // keyboardType="number-pad"
            style={tw`py-5`}
            label="Address"
            mode="outlined"
            // disabled
            value={adress.address}
            onChangeText={(text) => setAddress((prev) => ({ ...prev, address: text }))}
          />
          <TextInput
            // keyboardType="number-pad"
            label="Zip code"
            mode="outlined"
            // disabled
            value={adress.zip_code}
            onChangeText={(text) => setAddress((prev) => ({ ...prev, zip_code: text }))}
          />
          <TextInput
            // keyboardType="number-pad"
            label="City"
            mode="outlined"
            // disabled
            value={adress.city}
            onChangeText={(text) => setAddress((prev) => ({ ...prev, city: text }))}
          />
          <TextInput
            // keyboardType="number-pad"
            label="State"
            mode="outlined"
            // disabled
            value={adress.state}
            onChangeText={(text) => setAddress((prev) => ({ ...prev, state: text }))}
          />
          <TextInput
            // keyboardType="number-pad"
            label="Country"
            mode="outlined"
            // disabled
            value={adress.country}
            onChangeText={(text) => setAddress((prev) => ({ ...prev, country: text }))}
          />
        </ScrollView>
      </View>
      <View style={tw`flex-row justify-end p-6 py-4`}>
        <Button mode="contained" onPress={createOrUpdate}>
          {Adress ? 'Update' : 'Add'}
        </Button>
      </View>
    </View>
  );
};

export default AddAddress;
