import CustomMarker from '@components/CustomMarker';
import PostCarouselItem from '@components/PostCarouselItem';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ViewabilityConfigCallbackPairs,
  useWindowDimensions,
  TextInput,
  Modal,
  Alert,
  StyleSheet,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import Entypo from '@expo/vector-icons/Entypo';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import tw from 'twrnc';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { colors } from '@utils/Colors';
import DropDown from 'react-native-paper-dropdown';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { selectAccessToken } from '@stores/slices/UserSlice';
import { Notaries, NotaryList, locationNotary } from 'src/types/NoraryList';
import { Searchbar, Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GreenButton from '@components/GreenButton';
import DrawerScreenContainer from '@components/DrawerScreenContainer';

const { width, height } = Dimensions.get('window');
const types = [
  {
    label: 'All',
    value: 'all',
  },
  {
    label: 'In Person',
    value: 'in person',
  },
  {
    label: 'RON',
    value: 'ron',
  },
];
const Map = () => {
  const isFocused = useIsFocused();
  const [modalVisible, setModalVisible] = useState(true);
  const insets = useSafeAreaInsets();
  const accessToken = useSelector(selectAccessToken);
  const navigation = useNavigation();
  const panelRef = useRef(null);
  const [heart, setHeart] = useState<number>();
  const [data, setData] = useState<Notaries[]>();
  const [searchQuery, setSearchQuery] = React.useState('');
  useEffect(() => {
    if (isFocused) {
      setModalVisible(true);
    }
  }, [isFocused]);

  const onChangeSearch = (query) => setSearchQuery(query);
  const fetchData = (type: number) => {
    console.log('fetch');
    axios
      .post('https://docudash.net/api/notarize-map', {
        notary_document_staus: type,

        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        const { Notary, status }: NotaryList = response.data;
        if (status) {
          const notaryList = Notary.data.map((x) => ({
            ...x,
            // @ts-ignore
            location_sign_up: JSON.parse(x.location_sign_up) as locationNotary,
          }));
          setData(notaryList.filter((x) => x.location_sign_in != null));
          setModalVisible(false);
          // if (notaryList.length > 0) {
          //   const selectedPlace = notaryList[0];
          //   const region: Region = {
          //     latitude: Number(selectedPlace.location_sign_up.latitude),
          //     longitude: Number(selectedPlace.location_sign_up.longitude),
          //     latitudeDelta: 0.5,
          //     longitudeDelta: 0.5,
          //   };
          //   map.current.animateToRegion(region);
          // }
        }
      });
  };
  // useEffect(() => {
  //   fetchData();
  // }, []);
  const snapPoints = useMemo(() => ['10', '90'], []);
  const [showDropDownType, setShowDropDownType] = useState(false);
  const [typeValue, setTypeValue] = useState('');

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    // console.log('handleSheetChanges', index);
  }, []);
  const [selectedPlaceId, setSelectedPlaceId] = useState<number>(0);

  const flatList = useRef<FlatList>(null);
  const map = useRef<MapView>(null);

  const viewConfig = useRef({
    // minimumViewTime: 500,
    itemVisiblePercentThreshold: 70,
  });

  const onViewableItemsChanged = useCallback(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      const selectedPlace = viewableItems[0].item;
      setSelectedPlaceId(selectedPlace.id);
    }
  }, []);

  const viewabilityConfigCallbackPairs = useRef<ViewabilityConfigCallbackPairs>([
    {
      viewabilityConfig: viewConfig.current,
      onViewableItemsChanged: onViewableItemsChanged,
    },
  ]);

  useEffect(() => {
    if (!selectedPlaceId || !flatList.current) {
      return;
    }
    const index = data.findIndex((place) => place.id === selectedPlaceId);
    // flatList.current.scrollToIndex({ index });

    const selectedPlace = data[index];

    const region: Region = {
      latitude: Number(selectedPlace.lat),
      longitude: Number(selectedPlace.long),
      latitudeDelta: 0.9,
      longitudeDelta: 0.9,
    };
    map.current?.animateToRegion(region);
  }, [selectedPlaceId]);
  return (
    <DrawerScreenContainer>
      <SafeAreaView style={tw`h-full bg-white`}>
        <View style={{ flex: 1, backgroundColor: 'white' }}>
          <View
            style={{
              paddingHorizontal: 10,
              paddingVertical: 10,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                marginRight: 5,
              }}
            >
              <EvilIcons name={'chevron-left'} size={30} color="black" />
            </TouchableOpacity>
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
              placeholder="Search for Notary"
              debounce={400}
              GooglePlacesDetailsQuery={{ fields: 'geometry' }}
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
              onPress={async (data, details = null) => {
                map.current.animateToRegion(
                  {
                    latitude: details?.geometry?.location.lat,
                    longitude: details?.geometry?.location.lng,
                    latitudeDelta: 0.95,
                    longitudeDelta: 0.21,
                  },
                  2500
                );
                // 'details' is provided when fetchDetails = true
              }}
            />
          </View>
          <MapView
            ref={map}
            style={{ flex: 1 }}
            // provider={PROVIDER_GOOGLE}
            initialRegion={{
              latitude: 35.6657425,
              longitude: -116.9306027,
              latitudeDelta: 0.1,
              longitudeDelta: 0.1,
            }}
          >
            {data?.map((place) => {
              return (
                <CustomMarker
                  coordinate={{
                    latitude: parseFloat(place.lat),
                    longitude: parseFloat(place.long),
                  }}
                  name={place.first_name}
                  key={place.id}
                  isSelected={place.id === selectedPlaceId}
                  onPress={() => setSelectedPlaceId(place.id)}
                ></CustomMarker>
              );
            })}
          </MapView>

          <View style={{ position: 'absolute', bottom: insets.bottom + 20 }}>
            <FlatList
              ref={flatList}
              data={data}
              keyExtractor={(item) => item.id}
              renderItem={({ item }: any) => <PostCarouselItem post={item} key={item.id} />}
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={width - 60}
              snapToAlignment={'center'}
              decelerationRate={'fast'}
              viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
              // viewabilityConfig={viewConfig.current}
              // onViewableItemsChanged={onViewChanged.current}
            />
          </View>
          <BottomSheet
            // animateOnMount={false}
            ref={panelRef}
            index={0}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}
          >
            <Text variant="labelLarge" style={tw`text-lg text-center mb-2 mt-2 font-bold`}>
              {`See All ${data?.length} Notary`}
            </Text>

            <BottomSheetFlatList
              ListHeaderComponent={
                <View>
                  <View style={tw`flex-row gap-4 px-2 items-center`}>
                    <Searchbar
                      mode="bar"
                      style={tw`flex-1`}
                      placeholder="Search"
                      onChangeText={onChangeSearch}
                      value={searchQuery}
                    />
                    <View style={tw`w-40`}>
                      <DropDown
                        label={'Select Type'}
                        mode={'outlined'}
                        visible={showDropDownType}
                        showDropDown={() => setShowDropDownType(true)}
                        onDismiss={() => setShowDropDownType(false)}
                        value={typeValue}
                        // setValue={setTypeValue}
                        setValue={(val) => {
                          if (val == 'in person') {
                            setTypeValue(val);
                            fetchData(0);
                          } else {
                            setTypeValue(val);
                            fetchData(1);
                          }
                        }}
                        list={types}
                      />
                    </View>
                  </View>
                </View>
              }
              data={data}
              renderItem={({ item }: { item: Notaries }) => {
                return (
                  <TouchableOpacity
                    onPress={() => navigation.navigate('NotaryProfile', { item: item })}
                  >
                    <View style={tw`m-2 flex justify-center bg-white shadow-md rounded-lg`}>
                      <Image
                        source={{
                          uri:
                            'https://docudash.net/public/uploads/NotaryRequestBanner/' +
                            item.BannerImage,
                        }}
                        resizeMode="contain"
                        style={tw`w-full bg-[${colors.green}] h-16`}
                      ></Image>
                      <Image
                        style={{
                          width: 60,
                          marginHorizontal: 20,
                          borderRadius: 50,
                          height: 60,
                          bottom: 40,
                        }}
                        source={{
                          uri: 'https://docudash.net/public/uploads/profile-pics/' + item.image,
                        }}
                        resizeMode="cover"
                      />
                      <View
                        style={{
                          width: '100%',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          marginTop: 10,
                          paddingHorizontal: 20,
                          bottom: 50,
                        }}
                      >
                        <View>
                          <Text style={{ fontSize: 20, color: 'black' }}>{item?.first_name}</Text>
                          <Text style={{ fontSize: 15, fontWeight: '200' }}>{item?.email} </Text>
                        </View>
                      </View>
                      <View style={{ position: 'absolute', top: 20, right: 20 }}>
                        <TouchableOpacity>
                          <Entypo
                            name={heart === item?.id ? 'heart' : 'heart-outlined'}
                            size={20}
                            color={heart === item?.id ? 'red' : 'white'}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
            {/* </View> */}
            {/* </View> */}
          </BottomSheet>
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setModalVisible(!modalVisible);
          }}
        >
          <View style={style.centeredView}>
            <View style={style.modalView}>
              <Text style={style.modalText}>Select the type of services your looking.</Text>
              <View
                style={[
                  tw`flex-row items-center justify-between w-full `,
                  { paddingHorizontal: 10 },
                ]}
              >
                <GreenButton
                  text={'RON'}
                  onPress={() => {
                    fetchData(1);
                  }}
                  styles={{ width: 150 }}
                />
                <GreenButton
                  text={'inperson'}
                  onPress={() => {
                    fetchData(0);
                  }}
                  // onPress={() => setModalVisible(false)}
                  styles={{ width: 150 }}
                />
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </DrawerScreenContainer>
  );
};
export default Map;
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
    height: 150,
    // justifyContent: 'center',
    justifyContent: 'space-around',
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
    fontWeight: 'bold',
    textAlign: 'center',
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryBtn: {
    height: 50,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
});
