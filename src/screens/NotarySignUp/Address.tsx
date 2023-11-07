import GreenButton from '@components/GreenButton';
import Input from '@components/Input';
import { useNavigation } from '@react-navigation/native';
import { NotraySignUpAPI, SignUpStackScreenProps } from '@type/index';
import { colors } from '@utils/Colors';
import axios from 'axios';
import React, { useRef, useState } from 'react';

import Icon from '@expo/vector-icons/AntDesign';
import { placeTypeToDelta } from '@utils/placeTypeToDelta';
import { usaStates } from '@utils/states';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView, { Marker, Region } from 'react-native-maps';
import { Chip, Divider, Menu, Text } from 'react-native-paper';
import tw from 'twrnc';
import { useDispatch, useSelector } from 'react-redux';
import { selectAccessToken, setNotaryStep } from '@stores/slices/UserSlice';
const Address = () => {
  const navigation = useNavigation<SignUpStackScreenProps<'Step2'>['navigation']>();
  const [loading, setLoading] = useState<boolean>(false);
  const [showDropDown, setShowDropDown] = useState(false);
  const [showDropDownState, setShowDropDownState] = useState(false);
  const token = useSelector(selectAccessToken);
  const map = useRef<MapView>(null);
  const dispatch = useDispatch();
  const [address, setAddress] = useState<{
    address1: string;
    address2: string;
    country: string;
    city: string;
    state: string;
    lat: string;
    long: string;
    zip_code: string;
  }>({
    address1: '',
    address2: '',
    country: 'United States',
    city: '',
    state: 'Texas',
    lat: '0',
    long: '0',
    zip_code: '',
  });
  const fetchData = async () => {
    if (address.lat == '0' && address.long == '0') return Alert.alert('Please search Address');
    if (address.zip_code == '') return Alert.alert('Please Provide zip Code / Postal Code');
    setLoading(true);

    console.log({
      address1: address.address1,
      address2: address.address2,
      country: address.country,
      city: address.city,
      state: address.state,
      lat: address.lat,
      long: address.long,
      zip_code: address.zip_code,
    });
    axios
      .post('https://docudash.net/api/notary-sign-up-4/' + token, {
        address1: address.address1,
        address2: address.address2,
        country: address.country,
        state: address.state,
        city: address.city,
        lat: address.lat,
        long: address.long,
        zip_code: address.zip_code,
      })
      .then((response) => {
        const { success, data, message }: NotraySignUpAPI = response.data;
        console.log('optScreen-', response.data);

        if (success) {
          console.log(data.steps);

          setLoading(false),
            //@ts-ignore
            navigation.replace('NotaryLoginStackNavigator', {
              screen: ('Step' + data.steps) as any,
              params: {
                api: response.data.next,
              },
            }),
            dispatch(setNotaryStep(data.steps));
        } else {
          if (message) Object.values(message).map((x) => Alert.alert('Failed', x.toString()));
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const closeMenu = () => {
    setShowDropDown(false);
  };
  const openMenu = () => {
    setShowDropDown(true);
  };
  const closeMenuState = () => {
    setShowDropDownState(false);
  };
  const openMenuState = () => {
    setShowDropDownState(true);
  };

  return (
    <SafeAreaView style={tw`h-full`}>
      <KeyboardAvoidingView behavior="height" enabled style={tw`flex-1`}>
        <ScrollView contentContainerStyle={tw`bg-white`}>
          <View style={tw`flex-1 gap-2 justify-center px-10`}>
            <View style={tw`absolute top-10 left-5`}>
              <Chip>
                <Text variant="labelLarge">{`5/6`}</Text>
              </Chip>
            </View>
            <Image
              style={tw`w-65 self-center`}
              resizeMode="contain"
              source={require('@assets/logo.png')}
            />
            <Text
              style={{
                fontFamily: 'nunito-SemiBold',
                color: colors.blue,
                fontSize: 25,
                alignSelf: 'center',
              }}
            >
              Address
            </Text>
            <Text
              style={[
                { fontFamily: 'nunito-SemiBold' },
                tw`text-center text-[${colors.blue}] text-base`,
              ]}
            >
              Enter your address below
            </Text>

            <GooglePlacesAutocomplete
              styles={{
                predefinedPlacesDescription: {
                  color: 'blue',
                },
                textInput: {
                  borderWidth: 1,
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
                  console.log(val.types);

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
                  address1: String(data.description),
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
                latitude: 35.6657425,
                longitude: -116.9306027,
                latitudeDelta: 5,
                longitudeDelta: 5,
              }}
            >
              <Marker
                coordinate={{
                  latitude: parseFloat(address.lat),
                  longitude: parseFloat(address.long),
                }}
              />
            </MapView>

            <Input
              state={address.address1}
              setState={(text) => setAddress((prev) => ({ ...prev, address1: text }))}
              placeholder={'Address 1'}
              style={tw`text-center`}
              keyboardType={'ascii-capable'}
            />

            <Input
              state={address.address2}
              setState={(text) => setAddress((prev) => ({ ...prev, address2: text }))}
              placeholder={'Address 2'}
              style={tw`text-center`}
              keyboardType={'ascii-capable'}
            />
            <Input
              state={address.city}
              setState={(text) => setAddress((prev) => ({ ...prev, city: text }))}
              placeholder={'City'}
              style={tw`text-center`}
              keyboardType={'ascii-capable'}
            />
            <Input
              state={address.zip_code}
              setState={(text) => setAddress((prev) => ({ ...prev, zip_code: text }))}
              placeholder={'Zip Code / Postal Code'}
              style={tw`text-center`}
              keyboardType={'ascii-capable'}
            />
            <Menu
              style={tw`w-[70%]`}
              onDismiss={closeMenu}
              anchorPosition="bottom"
              anchor={
                <Pressable onPress={openMenu} style={styles.drop_down_style}>
                  <Text style={tw`self-center`}>{address.country}</Text>
                  <View style={tw`absolute right-10`}>
                    <Icon name="down" size={15} color={'black'} />
                  </View>
                </Pressable>
              }
              visible={showDropDown}
            >
              <Divider />
              <Menu.Item
                style={tw`w-full`}
                title="United States"
                onPress={() => {
                  setAddress((prev) => ({ ...prev, country: 'United States' }));
                  closeMenu();
                }}
              />
            </Menu>
            {/* State */}
            <Menu
              style={tw`w-[70%]`}
              onDismiss={closeMenuState}
              anchorPosition="bottom"
              anchor={
                <Pressable onPress={openMenuState} style={styles.drop_down_style}>
                  <Text>{address.state}</Text>
                  <View style={tw`absolute right-10`}>
                    <Icon name="down" size={15} color={'black'} />
                  </View>
                </Pressable>
              }
              visible={showDropDownState}
            >
              {usaStates.map((x) => (
                <>
                  <Menu.Item
                    key={x}
                    style={tw`w-full`}
                    title={x}
                    onPress={() => {
                      setAddress((prev) => ({ ...prev, state: x }));
                      closeMenuState();
                    }}
                  />
                  <Divider />
                </>
              ))}
            </Menu>

            <GreenButton loading={loading} text={'Next'} onPress={fetchData} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Address;

const styles = StyleSheet.create({
  drop_down_style: tw`border-2 h-14 justify-center items-center border-gray-400 rounded-full mt-3`,
});
