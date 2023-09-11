import { useNavigation, useRoute } from '@react-navigation/native';
import { selectAccessToken, selectProfileData } from '@stores/Slices';
import {
  DraggedElArr,
  DraggedElement,
  GenerateSignature,
  GenerateSignatureDetail,
  GenerateSignatureDetails,
  HtmlEditorAPI,
  RootStackScreenProps,
  SignaturePreview,
} from '@type/index';
import axios from 'axios';
import FormData from 'form-data';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  FlatList,
} from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';
import Draggable from 'react-native-draggable';
import { Appbar, Avatar, Badge, Button, IconButton, Text, TextInput } from 'react-native-paper';
import { Carousel } from 'react-native-ui-lib';
import { useSelector } from 'react-redux';
import tw from 'twrnc';

const { width, height } = Dimensions.get('window');

const color = [
  {
    primary: 'rgb(9, 131, 55)',
    bg: 'rgba(180, 255, 175, 0.88)',
    border: '#098337',
    background: '#b4ffafe0',
  },
  {
    primary: 'rgb(83 107 158)',
    bg: 'rgb(210 223 255 / 92%)',
    border: '#536b9e',
    background: '#d2e9ffeb',
  },
  {
    primary: 'rgb(167 108 0)',
    bg: 'rgb(255 237 161 / 92%)',
    border: '#a76c00',
    background: '#ffeda1eb',
  },
  {
    primary: 'rgb(161 67 178)',
    bg: 'rgb(255 183 247 / 92%)',
    border: '#974b4b',
    background: '#ffb7f7eb',
  },
  {
    primary: 'rgb(151 75 75)',
    bg: 'rgb(255 188 188 / 92%)',
    border: '#974b4b',
    background: '#ffbcbceb',
  },
  {
    primary: 'rgb(151 75 75)',
    bg: 'rgb(255 188 188 / 92%)',
    border: '#974b4b',
    background: '#ffbcbceb',
  },
  {
    primary: 'rgb(151 75 75)',
    bg: 'rgb(255 188 188 / 92%)',
    border: '#974b4b',
    background: '#ffbcbceb',
  },
];
const DocumentViewer = () => {
  const accessToken = useSelector(selectAccessToken);
  const profileData = useSelector(selectProfileData);

  const navigation = useNavigation<RootStackScreenProps<'DocumentViewer'>['navigation']>();
  const route = useRoute<RootStackScreenProps<'DocumentViewer'>['route']>();
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
  const [recipients, setRecipients] = useState<GenerateSignatureDetail[]>();
  const [selectedRecipient, setSelectedRecipient] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>();
  const envelope: GenerateSignature = route.params.Envelope;
  const signItem: SignaturePreview = route.params?.item || undefined;
  const stampItem = route.params?.stamp || undefined;
  const [imageSizes, setImageSizes] = useState<{ width: number; height: number }[]>(new Array());
  console.log('Imagesizes', imageSizes);
  useEffect(() => {
    if (signItem != undefined) {
      let _newIni = draggedElArr.initial.map((element) => ({
        ...element,
        background: signItem.initial,
      }));
      let _newSign = draggedElArr.signature.map((element) => ({
        ...element,
        background: signItem.signature,
      }));
      setDraggedElArr({ ...draggedElArr, initial: _newIni, signature: _newSign });
    }
    if (stampItem != undefined) {
      let _newStamp = draggedElArr.stamp.map((element) => ({
        ...element,
        background: stampItem.image_base64,
      }));
      setDraggedElArr({ ...draggedElArr, stamp: _newStamp });
    }
  }, [route, navigation]);
  draggedElArr.initial.forEach((element, index) => {
    console.log('element', element);
  });

  const date = new Date();
  const cureentDate = date.getMonth() + '/' + date.getDate() + '/' + date.getFullYear();

  const fetchData = async () => {
    setLoading(true);
    const url = 'https://docudash.net/api/generate-signature/html-editor/';
    console.log(url + envelope.uniqid + '/' + envelope.signature_id);

    axios
      .get(url + envelope.uniqid + '/' + envelope.signature_id, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        setLoading(false);
        console.log('html-editor', response.data);
        const {
          status,
          message,
          generateSignatureDetailsFinalise,
          generateSignatureDetails,
          generateSignatureDetailsImages,
        }: HtmlEditorAPI = response.data;

        if (status) {
          if (
            generateSignatureDetails.length > 0 &&
            generateSignatureDetails[0].view_final_response != undefined
          ) {
            const abayYAKiyahy = JSON.parse(generateSignatureDetails[0].view_final_response);

            console.log('draggable', abayYAKiyahy);
            setDraggedElArr(abayYAKiyahy);
          } else if (
            generateSignatureDetailsFinalise &&
            generateSignatureDetailsFinalise.draggedElArr
          ) {
            const draggable = {
              signature: generateSignatureDetailsFinalise.draggedElArr.signature ?? [],
              initial: generateSignatureDetailsFinalise.draggedElArr.initial ?? [],
              stamp: generateSignatureDetailsFinalise.draggedElArr.stamp ?? [],
              date: generateSignatureDetailsFinalise.draggedElArr.date ?? [],
              name: generateSignatureDetailsFinalise.draggedElArr.name ?? [],
              email: generateSignatureDetailsFinalise.draggedElArr.email ?? [],
              company: generateSignatureDetailsFinalise.draggedElArr.company ?? [],
              title: generateSignatureDetailsFinalise.draggedElArr.title ?? [],
            };
            console.log('draggable', draggable);
            setDraggedElArr(draggable);
          }
          setRecipients(generateSignatureDetails);
          setImages(generateSignatureDetailsImages.map((x) => x.filesArr).flat());
        } else {
          alert(message);
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log('Error----', error);
      });
  };
  useEffect(() => {
    if (envelope) {
      fetchData();
    }
  }, []);

  const save = () => {
    const url = 'https://docudash.net/api/updateClientResponse/';
    // console.log('draggedElArr', draggedElArr);
    console.log('post', url + envelope.signature_id);
    console.log('selected recipient', recipients[selectedRecipient].id);
    console.log('viewFinalResponseArr', draggedElArr);

    const data = new FormData();
    data.append('id', recipients[selectedRecipient].id);
    // data.append('signature_id', envelope.signature_id);
    data.append('viewFinalResponseArr', JSON.stringify(draggedElArr));
    // data.append('save_type', '0');

    axios
      .post(url + envelope.signature_id, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        const { status, message }: { status: boolean; message: string } = response.data;
        if (status) {
          alert(message);

          navigation.navigate('Home');
        } else {
          alert(message);
        }
      })
      .catch((err) => {
        console.log('error', err);
      });
  };

  const _onViewableItemsChanged = useCallback(({ viewableItems, changed }) => {
    console.log('Visible items are', viewableItems);
    // console.log('Changed in this iteration', changed);
  }, []);
  return (
    <View style={tw`h-full `}>
      <Appbar.Header mode="center-aligned">
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content
          title={
            <View style={tw`items-center`}>
              <Text variant="titleSmall">Viewing Document</Text>
              <Text variant="labelSmall">Subtitle</Text>
            </View>
          }
        />
        <Button onPress={save}>Save</Button>
      </Appbar.Header>
      <SafeAreaView style={tw`flex-1 `}>
        <View style={tw` bg-white bottom-0 `}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {/* draw */}
            {recipients
              ?.filter(
                (item) => item.recEmail.toLowerCase() == profileData.email.toLowerCase()
                // && item.complete_incomplete === 0
              )
              ?.slice(0, 5)
              ?.map((item, index) => (
                <View style={[styles.botton_view_buttons]}>
                  {index == selectedRecipient ? (
                    <Badge style={tw`absolute top-0 right-2 z-1`}>✓</Badge>
                  ) : null}
                  <View style={styles.yellow_round}>
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedRecipient(index);
                      }}
                    >
                      <Avatar.Text
                        size={48}
                        style={tw`bg-[${color[index].background}]`}
                        // color={color[index].background}
                        label={item.recName
                          .replace(/\b(\w)\w+/g, '$1.')
                          .replace(/\s/g, '')
                          .replace(/\.$/, '')
                          .toUpperCase()}
                      />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.yellow_round_text}>{item.recName}</Text>
                </View>
              ))}
          </ScrollView>
        </View>
        <View style={tw`flex-1`}>
          <FlatList
            data={images}
            // onViewableItemsChanged={_onViewableItemsChanged}
            // viewabilityConfig={{
            //   itemVisiblePercentThreshold: 50,
            // }}
            renderItem={({ item, index }) => {
              return (
                <View id={index + '_'} style={tw`my-2 `}>
                  <AutoHeightImage
                    onLoad={({
                      nativeEvent: {
                        source: { width, height },
                      },
                    }) => setImageSizes((prev) => [...prev, { width, height }])}
                    width={width}
                    source={{
                      uri: item,
                    }}
                  />
                  {draggedElArr?.company
                    ?.filter(
                      (x) =>
                        x.element_container_id == `canvasInner-${index}` &&
                        x.selected_user_id == String(recipients?.[selectedRecipient].id)
                    )
                    .map((item, index) => {
                      console.log(Number.parseFloat(item.left), item.top);
                      return (
                        <View
                          style={tw`absolute top-[${item.top}] left-[${item.left}]`}
                          // renderColor="red"
                        >
                          {item.content == undefined ? (
                            <TouchableOpacity
                              onPress={() =>
                                setDraggedElArr((prev) => ({
                                  ...prev,
                                  date: prev.date.map((x) => ({
                                    ...x,
                                    content: profileData.company,
                                  })),
                                }))
                              }
                              style={tw`w-15 h-10  border border-[${color[selectedRecipient].border}] rounded-lg items-center bg-[${color[selectedRecipient].background}]`}
                            >
                              <IconButton
                                size={10}
                                style={tw`m-0 `}
                                icon="office-building"
                              ></IconButton>
                              <Text style={tw`text-[10px] `}>Company</Text>
                            </TouchableOpacity>
                          ) : (
                            <View
                              style={tw`absolute top-[${item.top}] left-[${item.left}]`}
                              // renderColor="red"
                            >
                              <Text style={tw`text-4 text-black font-medium`}>{item.content}</Text>
                            </View>
                          )}
                        </View>
                      );
                    })}
                  {draggedElArr?.date
                    ?.filter(
                      (x) =>
                        x.element_container_id == `canvasInner-${index}` &&
                        x.selected_user_id == String(recipients?.[selectedRecipient].id)
                    )
                    .map((item, index) => {
                      return (
                        <View
                          style={tw`absolute top-[${item.top}] left-[${item.left}]`}
                          // renderColor="red"
                        >
                          {item.content == undefined ? (
                            <TouchableOpacity
                              onPress={() =>
                                setDraggedElArr((prev) => ({
                                  ...prev,
                                  date: prev.date.map((x) => ({ ...x, content: cureentDate })),
                                }))
                              }
                              style={tw`w-15 h-10  border border-[${color[selectedRecipient].border}] rounded-lg items-center bg-[${color[selectedRecipient].background}]`}
                            >
                              <IconButton size={10} style={tw`m-0 `} icon="calendar"></IconButton>
                              <Text style={tw`text-[10px] `}>Date</Text>
                            </TouchableOpacity>
                          ) : (
                            <View
                              style={tw`absolute top-[${item.top}] left-[${item.left}]`}
                              // renderColor="red"
                            >
                              <Text style={tw`text-4 text-black font-medium`}>{item.content}</Text>
                            </View>
                          )}
                        </View>
                      );
                    })}
                  {draggedElArr?.email
                    ?.filter(
                      (x) =>
                        x.element_container_id == `canvasInner-${index}` &&
                        x.selected_user_id == String(recipients?.[selectedRecipient].id)
                    )
                    .map((item, index) => {
                      // console.log(
                      //   ((Number.parseInt(item.left) * 100) / width) * 15,
                      //   ((Number.parseInt(item.top) * 100) / width) * 15
                      // );
                      console.log(Number.parseFloat(item.left), item.top);

                      return (
                        <View
                          style={tw`absolute top-[${item.top}] left-[${item.left}]`}
                          // renderColor="red"
                        >
                          {item.content == undefined ? (
                            <TouchableOpacity
                              onPress={() =>
                                setDraggedElArr((prev) => ({
                                  ...prev,
                                  date: prev.date.map((x) => ({
                                    ...x,
                                    content: profileData.email,
                                  })),
                                }))
                              }
                              style={tw`w-15 h-10  border border-[${color[selectedRecipient].border}] rounded-lg items-center bg-[${color[selectedRecipient].background}]`}
                            >
                              <IconButton size={10} style={tw`m-0 `} icon="email"></IconButton>
                              <Text style={tw`text-[10px] `}>Email</Text>
                            </TouchableOpacity>
                          ) : (
                            <View
                              style={tw`absolute top-[${item.top}] left-[${item.left}]`}
                              // renderColor="red"
                            >
                              <Text style={tw`text-4 text-black font-medium`}>{item.content}</Text>
                            </View>
                          )}
                        </View>
                      );
                    })}

                  {draggedElArr?.initial
                    ?.filter(
                      (x) =>
                        x.element_container_id == `canvasInner-${index}` &&
                        x.selected_user_id == String(recipients?.[selectedRecipient].id)
                    )
                    .map((item, index) => {
                      // console.log(
                      //   ((Number.parseInt(item.left) * 100) / width) * 15,
                      //   ((Number.parseInt(item.top) * 100) / width) * 15
                      // );
                      console.log(Number.parseFloat(item.left), item.top);

                      return (
                        <>
                          {item.background ? (
                            <View
                              style={tw`absolute top-[${item.top}] left-[${item.left}]`}
                              // renderColor="red"
                            >
                              <Image
                                resizeMode="contain"
                                style={[tw`w-14 h-8 bg-grey-500`, { zIndex: 999 }]}
                                source={{ uri: item.background }}
                              />
                            </View>
                          ) : (
                            <View
                              style={tw`absolute top-[${item.top}] left-[${item.left}]`}
                              // renderColor="red"
                            >
                              <View
                                style={tw`w-15 h-10  border border-[${color[selectedRecipient].border}] rounded-lg items-center bg-[${color[selectedRecipient].background}]`}
                              >
                                <IconButton
                                  size={10}
                                  style={tw`m-0 `}
                                  icon="signature-text"
                                  onPress={() =>
                                    navigation.navigate('SignatureSelection', {
                                      Envelope: envelope,
                                    })
                                  }
                                ></IconButton>
                                <Text style={tw`text-[10px] `}>Initial</Text>
                              </View>
                            </View>
                          )}
                        </>
                      );
                    })}
                  {draggedElArr?.name
                    ?.filter(
                      (x) =>
                        x.element_container_id == `canvasInner-${index}` &&
                        x.selected_user_id == String(recipients?.[selectedRecipient].id)
                    )
                    .map((item, index) => {
                      // console.log(
                      //   ((Number.parseInt(item.left) * 100) / width) * 15,
                      //   ((Number.parseInt(item.top) * 100) / width) * 15
                      // );
                      console.log(Number.parseFloat(item.left), item.top);

                      return (
                        <View
                          style={tw`absolute top-[${item.top}] left-[${item.left}]`}
                          // renderColor="red"
                        >
                          {item.content == undefined ? (
                            <TouchableOpacity
                              onPress={() =>
                                setDraggedElArr((prev) => ({
                                  ...prev,
                                  name: prev.name.map((x) => ({
                                    ...x,
                                    content: profileData.first_name + ' ' + profileData.last_name,
                                  })),
                                }))
                              }
                              style={tw`w-15 h-10  border border-[${color[selectedRecipient].border}] rounded-lg items-center bg-[${color[selectedRecipient].background}]`}
                            >
                              <IconButton size={10} style={tw`m-0 `} icon="face-man"></IconButton>
                              <Text style={tw`text-[10px] `}>Name</Text>
                            </TouchableOpacity>
                          ) : (
                            <View
                              style={tw`absolute top-[${item.top}] left-[${item.left}]`}
                              // renderColor="red"
                            >
                              <Text style={tw`text-4 text-black font-medium`}>{item.content}</Text>
                            </View>
                          )}
                        </View>
                      );
                    })}
                  {draggedElArr?.signature
                    ?.filter(
                      (x) =>
                        x.element_container_id == `canvasInner-${index}` &&
                        x.selected_user_id == String(recipients?.[selectedRecipient].id)
                    )
                    .map((item) => {
                      // console.log(
                      //   ((Number.parseInt(item.left) * 100) / width) * 15,
                      //   ((Number.parseInt(item.top) * 100) / width) * 15
                      // );
                      // console.log('rerender', `bg-[${color[index].bg}]`);
                      console.log(item.left, item.top);
                      return (
                        <>
                          {item.background ? (
                            <View
                              style={tw`absolute top-[${item.top}] left-[${item.left}]`}
                              // renderColor="red"
                            >
                              <Image
                                resizeMode="contain"
                                style={[tw`w-14 h-8 bg-grey-500`, { zIndex: 999 }]}
                                source={{ uri: item.background }}
                              />
                            </View>
                          ) : (
                            <TouchableOpacity
                              onPress={() =>
                                navigation.navigate('SignatureSelection', {
                                  Envelope: envelope,
                                })
                              }
                              style={tw`absolute  top-[${item.top}] left-[${item.left}]`}
                              // renderColor="red"
                            >
                              <View
                                style={tw`w-15 h-10  border border-[${color[selectedRecipient].border}] rounded-lg items-center bg-[${color[selectedRecipient].background}]`}
                              >
                                <IconButton size={10} style={tw`m-0 `} icon="draw"></IconButton>
                                <Text style={tw`text-[10px] `}>Signature</Text>
                              </View>
                            </TouchableOpacity>
                          )}
                        </>
                      );
                    })}
                  {draggedElArr?.stamp
                    ?.filter(
                      (x) =>
                        x.element_container_id == `canvasInner-${index}` &&
                        x.selected_user_id == String(recipients?.[selectedRecipient].id)
                    )
                    .map((item) => {
                      // console.log(
                      //   ((Number.parseInt(item.left) * 100) / width) * 15,
                      //   ((Number.parseInt(item.top) * 100) / width) * 15
                      // );
                      console.log(Number.parseFloat(item.left), item.top);

                      return (
                        <>
                          {item.background ? (
                            <View
                              style={tw`absolute top-[${item.top}] left-[${item.left}]`}
                              // renderColor="red"
                            >
                              <Image
                                resizeMode="cover"
                                style={[tw`w-8 h-8 rounded-full bg-grey-500`, { zIndex: 999 }]}
                                source={{ uri: item.background }}
                              />
                            </View>
                          ) : (
                            <View
                              style={tw`absolute top-[${item.top}] left-[${item.left}]`}
                              // renderColor="red"
                            >
                              <View
                                style={tw`w-15 h-10  border border-[${color[selectedRecipient].border}] rounded-lg items-center bg-[${color[selectedRecipient].background}]`}
                              >
                                <IconButton
                                  size={10}
                                  style={tw`m-0 `}
                                  icon="stamper"
                                  onPress={() =>
                                    navigation.navigate('StampSelection', { Envelope: envelope })
                                  }
                                ></IconButton>
                                <Text style={tw`text-[10px] `}>Stamp</Text>
                              </View>
                            </View>
                          )}
                        </>
                      );
                    })}
                  {draggedElArr?.title
                    ?.filter(
                      (x) =>
                        x.element_container_id == `canvasInner-${index}` &&
                        x.selected_user_id == String(recipients?.[selectedRecipient].id)
                    )
                    .map((item) => {
                      console.log(Number.parseFloat(item.left), item.top);
                      return (
                        <View
                          style={tw`absolute top-[${item.top}] left-[${item.left}]`}
                          // renderColor="red"
                        >
                          {item.content == undefined ? (
                            <TouchableOpacity
                              onPress={() =>
                                setDraggedElArr((prev) => ({
                                  ...prev,
                                  date: prev.date.map((x) => ({
                                    ...x,
                                    content: profileData.first_name,
                                  })),
                                }))
                              }
                              style={tw`w-15 h-10  border border-[${color[selectedRecipient].border}] rounded-lg items-center bg-[${color[selectedRecipient].background}]`}
                            >
                              <IconButton size={10} style={tw`m-0 `} icon="briefcase"></IconButton>
                              <Text style={tw`text-[10px] `}>Title</Text>
                            </TouchableOpacity>
                          ) : (
                            <View
                              style={tw`absolute top-[${item.top}] left-[${item.left}]`}
                              // renderColor="red"
                            >
                              <Text style={tw`text-4 text-black font-medium`}>{item.content}</Text>
                            </View>
                          )}
                        </View>
                      );
                    })}
                </View>
              );
            }}
          />
          {/* <ScrollView>
            {images?.map((item) => {
              let imageUrl = '';
              if (item.image?.includes('pdf') || item.image?.includes('docx')) {
                item.image.split('.')[0] + '-1.jpg';
                imageUrl =
                  'https://docudash.net/public/uploads/generateSignature/photos/converted/' +
                  item.image.split('.')[0] +
                  '-1.jpg';
              } else {
                imageUrl =
                  'https://docudash.net/public/uploads/generateSignature/photos/' + item.image;
              }

              console.log(imageUrl);
              return (
                <View id={index + '_'}>
                  <AutoHeightImage
                    onLoad={({
                      nativeEvent: {
                        source: { width, height },
                      },
                    }) => setImageSizes((prev) => [...prev, { width, height }])}
                    width={width}
                    source={{
                      uri: imageUrl,
                    }}
                  />
                  {draggedElArr?.company
                    ?.filter(
                      (x) =>
                        x.element_container_id == `canvasInner-${index}` &&
                        x.selected_user_id == String(recipients?.[selectedRecipient].id)
                    )
                    .map((item, index) => {
                      console.log(Number.parseFloat(item.left), item.top);

                      return companyActivated ? (
                        <View
                          style={tw`absolute top-[${item.top}] left-[${item.left}]`}
                          // renderColor="red"
                        >
                          <TextInput style={tw`w-30 h-10`} />
                        </View>
                      ) : (
                        <View
                          style={tw`absolute top-[${item.top}] left-[${item.left}]`}
                          // renderColor="red"
                        >
                          <View
                            style={tw`w-15 h-10  border border-[${color[selectedRecipient].border}] rounded-lg items-center bg-[${color[selectedRecipient].background}]`}
                          >
                            <IconButton
                              size={10}
                              style={tw`m-0 `}
                              icon="office-building"
                              onPress={() => setCompanyActivated(true)}
                            ></IconButton>
                            <Text style={tw`text-[10px] `}>Company</Text>
                          </View>
                        </View>
                      );
                    })}
                  {draggedElArr?.date
                    ?.filter(
                      (x) =>
                        x.element_container_id == `canvasInner-${index}` &&
                        x.selected_user_id == String(recipients?.[selectedRecipient].id)
                    )
                    .map((item, index) => {
                      // console.log(
                      //   ((Number.parseInt(item.left) * 100) / width) * 15,
                      //   ((Number.parseInt(item.top) * 100) / width) * 15
                      // );
                      console.log(Number.parseFloat(item.left), item.top);

                      return dateActiveted ? (
                        <View
                          style={tw`absolute top-[${item.top}] left-[${item.left}]`}
                          // renderColor="red"
                        >
                          <Text style={tw`text-4 text-black font-medium`}>{cureentDate}</Text>
                        </View>
                      ) : (
                        <View
                          style={tw`absolute top-[${item.top}] left-[${item.left}]`}
                          // renderColor="red"
                        >
                          <View
                            style={tw`w-15 h-10  border border-[${color[selectedRecipient].border}] rounded-lg items-center bg-[${color[selectedRecipient].background}]`}
                          >
                            <IconButton
                              size={10}
                              style={tw`m-0 `}
                              icon="calendar"
                              onPress={() => setDateActivated(true)}
                            ></IconButton>
                            <Text style={tw`text-[10px] `}>Date</Text>
                          </View>
                        </View>
                      );
                    })}
                  {draggedElArr?.email
                    ?.filter(
                      (x) =>
                        x.element_container_id == `canvasInner-${index}` &&
                        x.selected_user_id == String(recipients?.[selectedRecipient].id)
                    )
                    .map((item, index) => {
                      // console.log(
                      //   ((Number.parseInt(item.left) * 100) / width) * 15,
                      //   ((Number.parseInt(item.top) * 100) / width) * 15
                      // );
                      console.log(Number.parseFloat(item.left), item.top);

                      return emailActivated ? (
                        <View
                          style={tw`absolute top-[${item.top}] left-[${item.left}]`}
                          // renderColor="red"
                        >
                          <Text style={tw`text-4 text-black font-medium`}>{profileData.email}</Text>
                        </View>
                      ) : (
                        <View
                          style={tw`absolute top-[${item.top}] left-[${item.left}]`}
                          // renderColor="red"
                        >
                          <View
                            style={tw`w-15 h-10  border border-[${color[selectedRecipient].border}] rounded-lg items-center bg-[${color[selectedRecipient].background}]`}
                          >
                            <IconButton
                              size={10}
                              style={tw`m-0 `}
                              icon="email"
                              onPress={() => setEmailActivated(true)}
                            ></IconButton>
                            <Text style={tw`text-[10px] `}>Email</Text>
                          </View>
                        </View>
                      );
                    })}
                  {draggedElArr?.initial
                    ?.filter(
                      (x) =>
                        x.element_container_id == `canvasInner-${index}` &&
                        x.selected_user_id == String(recipients?.[selectedRecipient].id)
                    )
                    .map((item, index) => {
                      // console.log(
                      //   ((Number.parseInt(item.left) * 100) / width) * 15,
                      //   ((Number.parseInt(item.top) * 100) / width) * 15
                      // );
                      console.log(Number.parseFloat(item.left), item.top);

                      return (
                        <>
                          {signState ? (
                            <View
                              style={tw`absolute top-[${item.top}] left-[${item.left}]`}
                              // renderColor="red"
                            >
                              <Image
                                resizeMode="contain"
                                style={[
                                  tw`w-14 h-8 bg-black`,
                                  { tintColor: 'white', zIndex: 999, borderWidth: 2 },
                                ]}
                                source={{ uri: signState.initial }}
                              />
                            </View>
                          ) : (
                            <View
                              style={tw`absolute top-[${item.top}] left-[${item.left}]`}
                              // renderColor="red"
                            >
                              <View
                                style={tw`w-15 h-10  border border-[${color[selectedRecipient].border}] rounded-lg items-center bg-[${color[selectedRecipient].background}]`}
                              >
                                <IconButton
                                  size={10}
                                  style={tw`m-0 `}
                                  icon="signature-text"
                                  onPress={() =>
                                    navigation.navigate('SignatureSelection', {
                                      Envelope: envelope,
                                    })
                                  }
                                ></IconButton>
                                <Text style={tw`text-[10px] `}>Initial</Text>
                              </View>
                            </View>
                          )}
                        </>
                      );
                    })}
                  {draggedElArr?.name
                    ?.filter(
                      (x) =>
                        x.element_container_id == `canvasInner-${index}` &&
                        x.selected_user_id == String(recipients?.[selectedRecipient].id)
                    )
                    .map((item, index) => {
                      // console.log(
                      //   ((Number.parseInt(item.left) * 100) / width) * 15,
                      //   ((Number.parseInt(item.top) * 100) / width) * 15
                      // );
                      console.log(Number.parseFloat(item.left), item.top);

                      return nameActivated ? (
                        <View
                          style={tw`absolute top-[${item.top}] left-[${item.left}]`}
                          // renderColor="red"
                        >
                          <Text style={tw`text-4 text-black font-medium`}>
                            {profileData.first_name + ' ' + profileData.last_name}
                          </Text>
                        </View>
                      ) : (
                        <View
                          style={tw`absolute top-[${item.top}] left-[${item.left}]`}
                          // renderColor="red"
                        >
                          <View
                            style={tw`w-15 h-10  border border-[${color[selectedRecipient].border}] rounded-lg items-center bg-[${color[selectedRecipient].background}]`}
                          >
                            <IconButton
                              size={10}
                              style={tw`m-0 `}
                              icon="face-man"
                              onPress={() => setNameActivated(true)}
                            ></IconButton>
                            <Text style={tw`text-[10px] `}>Name</Text>
                          </View>
                        </View>
                      );
                    })}
                  {draggedElArr?.signature
                    ?.filter(
                      (x) =>
                        x.element_container_id == `canvasInner-${index}` &&
                        x.selected_user_id == String(recipients?.[selectedRecipient].id)
                    )
                    .map((item) => {
                      // console.log(
                      //   ((Number.parseInt(item.left) * 100) / width) * 15,
                      //   ((Number.parseInt(item.top) * 100) / width) * 15
                      // );
                      console.log('rerender', `bg-[${color[index].bg}]`);

                      return (
                        <>
                          {signState ? (
                            <View
                              style={tw`absolute top-[${item.top}] left-[${item.left}]`}
                              // renderColor="red"
                            >
                              <Image
                                resizeMode="contain"
                                style={[
                                  tw`w-14 h-8 bg-black`,
                                  { tintColor: 'white', zIndex: 999, borderWidth: 2 },
                                ]}
                                source={{ uri: signState.signature }}
                              />
                            </View>
                          ) : (
                            <View
                              style={tw`absolute top-[${item.top}] left-[${item.left}]`}
                              // renderColor="red"
                            >
                              <View
                                style={tw`w-15 h-10  border border-[${color[selectedRecipient].border}] rounded-lg items-center bg-[${color[selectedRecipient].background}]`}
                              >
                                <IconButton
                                  size={10}
                                  style={tw`m-0 `}
                                  icon="draw"
                                  onPress={() =>
                                    navigation.navigate('SignatureSelection', {
                                      Envelope: envelope,
                                    })
                                  }
                                ></IconButton>
                                <Text style={tw`text-[10px] `}>Signature</Text>
                              </View>
                            </View>
                          )}
                        </>
                      );
                    })}
                  {draggedElArr?.stamp
                    ?.filter(
                      (x) =>
                        x.element_container_id == `canvasInner-${index}` &&
                        x.selected_user_id == String(recipients?.[selectedRecipient].id)
                    )
                    .map((item) => {
                      // console.log(
                      //   ((Number.parseInt(item.left) * 100) / width) * 15,
                      //   ((Number.parseInt(item.top) * 100) / width) * 15
                      // );
                      console.log(Number.parseFloat(item.left), item.top);

                      return (
                        <>
                          {stampState ? (
                            <View
                              style={tw`absolute top-[${item.top}] left-[${item.left}]`}
                              // renderColor="red"
                            >
                              <Image
                                resizeMode="contain"
                                style={[tw`w-14 h-8 bg-black`, { zIndex: 999, borderWidth: 2 }]}
                                source={{ uri: stampState.image_base64 }}
                              />
                            </View>
                          ) : (
                            <View
                              style={tw`absolute top-[${item.top}] left-[${item.left}]`}
                              // renderColor="red"
                            >
                              <View
                                style={tw`w-15 h-10  border border-[${color[selectedRecipient].border}] rounded-lg items-center bg-[${color[selectedRecipient].background}]`}
                              >
                                <IconButton
                                  size={10}
                                  style={tw`m-0 `}
                                  icon="stamper"
                                  onPress={() =>
                                    navigation.navigate('StampSelection', { Envelope: envelope })
                                  }
                                ></IconButton>
                                <Text style={tw`text-[10px] `}>Stamp</Text>
                              </View>
                            </View>
                          )}
                        </>
                      );
                    })}
                  {draggedElArr?.title
                    ?.filter(
                      (x) =>
                        x.element_container_id == `canvasInner-${index}` &&
                        x.selected_user_id == String(recipients?.[selectedRecipient].id)
                    )
                    .map((item) => {
                      // console.log(
                      //   ((Number.parseInt(item.left) * 100) / width) * 15,
                      //   ((Number.parseInt(item.top) * 100) / width) * 15
                      // );
                      console.log(Number.parseFloat(item.left), item.top);

                      return titleActivated ? (
                        <View
                          style={tw`absolute top-[${item.top}] left-[${item.left}]`}
                          // renderColor="red"
                        >
                          <TextInput style={tw`w-30 h-10`} />
                        </View>
                      ) : (
                        <View
                          style={tw`absolute top-[${item.top}] left-[${item.left}]`}
                          // renderColor="red"
                        >
                          <View
                            style={tw`w-15 h-10  border border-[${color[selectedRecipient].border}] rounded-lg items-center bg-[${color[selectedRecipient].background}]`}
                          >
                            <IconButton
                              size={10}
                              style={tw`m-0 `}
                              icon="briefcase"
                              onPress={() => setTitleActivated(true)}
                            ></IconButton>
                            <Text style={tw`text-[10px] `}>Title</Text>
                          </View>
                        </View>
                      );
                    })}
                </View>
              );
            })}
          </ScrollView> */}
          {/* <FlatList
            data={images}
            renderItem={({ item, index }) => {
              let imageUrl = '';
              if (item.image?.includes('pdf')) {
                item.image.split('.')[0] + '-1.jpg';
                imageUrl =
                  'https://docudash.net/public/uploads/generateSignature/photos/converted/' +
                  item.image.split('.')[0] +
                  '-1.jpg';
              } else {
                imageUrl =
                  'https://docudash.net/public/uploads/generateSignature/photos/' + item.image;
              }
              console.log(imageUrl);
              return (
                <View id={index + '_'}>
                  <AutoHeightImage
                    width={width}
                    source={{
                      uri: imageUrl,
                    }}
                  />
                  {draggedElArr?.company
                    ?.filter(
                      (x) =>
                        x.element_container_id == `canvasInner-${index}` &&
                        x.selected_user_id == String(recipients?.[selectedRecipient].id)
                    )
                    .map((item, index) => {
                      // console.log(
                      //   ((Number.parseInt(item.left) * 100) / width) * 15,
                      //   ((Number.parseInt(item.top) * 100) / width) * 15
                      // );
                      console.log(Number.parseFloat(item.left), item.top);

                      return (
                        <Draggable
                          x={((Number.parseInt(item.left) * 100) / width) * 15}
                          y={((Number.parseInt(item.top) * 100) / width) * 15}
                          // renderColor="red"
                          renderText={item.type}
                        >
                          <View
                            style={tw`w-15 h-10  border border-[${color[selectedRecipient].border}] rounded-lg items-center bg-[${color[selectedRecipient].background}]`}
                          >
                            <IconButton
                              size={10}
                              style={tw`m-0 `}
                              icon="office-building"
                              onPress={() => {}}
                            ></IconButton>
                            <Text style={tw`text-[10px] `}>Company</Text>
                          </View>
                        </Draggable>
                      );
                    })}
                  {draggedElArr?.date
                    ?.filter(
                      (x) =>
                        x.element_container_id == `canvasInner-${index}` &&
                        x.selected_user_id == String(recipients?.[selectedRecipient].id)
                    )
                    .map((item, index) => {
                      // console.log(
                      //   ((Number.parseInt(item.left) * 100) / width) * 15,
                      //   ((Number.parseInt(item.top) * 100) / width) * 15
                      // );
                      console.log(Number.parseFloat(item.left), item.top);

                      return (
                        <Draggable
                          x={((Number.parseInt(item.left) * 100) / width) * 15}
                          y={((Number.parseInt(item.top) * 100) / width) * 15}
                          // renderColor="red"
                          renderText={item.type}
                        >
                          <View
                            style={tw`w-15 h-10  border border-[${color[selectedRecipient].border}] rounded-lg items-center bg-[${color[selectedRecipient].background}]`}
                          >
                            <IconButton
                              size={10}
                              style={tw`m-0 `}
                              icon="calendar"
                              onPress={() => {}}
                            ></IconButton>
                            <Text style={tw`text-[10px] `}>Date</Text>
                          </View>
                        </Draggable>
                      );
                    })}
                  {draggedElArr?.email
                    ?.filter(
                      (x) =>
                        x.element_container_id == `canvasInner-${index}` &&
                        x.selected_user_id == String(recipients?.[selectedRecipient].id)
                    )
                    .map((item, index) => {
                      // console.log(
                      //   ((Number.parseInt(item.left) * 100) / width) * 15,
                      //   ((Number.parseInt(item.top) * 100) / width) * 15
                      // );
                      console.log(Number.parseFloat(item.left), item.top);

                      return (
                        <Draggable
                          x={((Number.parseInt(item.left) * 100) / width) * 15}
                          y={((Number.parseInt(item.top) * 100) / width) * 15}
                          // renderColor="red"
                          renderText={item.type}
                        >
                          <View
                            style={tw`w-15 h-10  border border-[${color[selectedRecipient].border}] rounded-lg items-center bg-[${color[selectedRecipient].background}]`}
                          >
                            <IconButton
                              size={10}
                              style={tw`m-0 `}
                              icon="email"
                              onPress={() => {}}
                            ></IconButton>
                            <Text style={tw`text-[10px] `}>Email</Text>
                          </View>
                        </Draggable>
                      );
                    })}
                  {draggedElArr?.initial
                    ?.filter(
                      (x) =>
                        x.element_container_id == `canvasInner-${index}` &&
                        x.selected_user_id == String(recipients?.[selectedRecipient].id)
                    )
                    .map((item, index) => {
                      // console.log(
                      //   ((Number.parseInt(item.left) * 100) / width) * 15,
                      //   ((Number.parseInt(item.top) * 100) / width) * 15
                      // );
                      console.log(Number.parseFloat(item.left), item.top);

                      return (
                        <Draggable
                          x={((Number.parseInt(item.left) * 100) / width) * 15}
                          y={((Number.parseInt(item.top) * 100) / width) * 15}
                          // renderColor="red"
                          renderText={item.type}
                        >
                          <View
                            style={tw`w-15 h-10  border border-[${color[selectedRecipient].border}] rounded-lg items-center bg-[${color[selectedRecipient].background}]`}
                          >
                            <IconButton
                              size={10}
                              style={tw`m-0 `}
                              icon="signature-text"
                              onPress={() => {}}
                            ></IconButton>
                            <Text style={tw`text-[10px] `}>Initial</Text>
                          </View>
                        </Draggable>
                      );
                    })}
                  {draggedElArr?.name
                    ?.filter(
                      (x) =>
                        x.element_container_id == `canvasInner-${index}` &&
                        x.selected_user_id == String(recipients?.[selectedRecipient].id)
                    )
                    .map((item, index) => {
                      // console.log(
                      //   ((Number.parseInt(item.left) * 100) / width) * 15,
                      //   ((Number.parseInt(item.top) * 100) / width) * 15
                      // );
                      console.log(Number.parseFloat(item.left), item.top);

                      return (
                        <Draggable
                          x={((Number.parseInt(item.left) * 100) / width) * 15}
                          y={((Number.parseInt(item.top) * 100) / width) * 15}
                          // renderColor="red"
                          renderText={item.type}
                        >
                          <View
                            style={tw`w-15 h-10  border border-[${color[selectedRecipient].border}] rounded-lg items-center bg-[${color[selectedRecipient].background}]`}
                          >
                            <IconButton
                              size={10}
                              style={tw`m-0 `}
                              icon="face-man"
                              onPress={() => {}}
                            ></IconButton>
                            <Text style={tw`text-[10px] `}>Name</Text>
                          </View>
                        </Draggable>
                      );
                    })}
                  {draggedElArr?.signature
                    ?.filter(
                      (x) =>
                        x.element_container_id == `canvasInner-${index}` &&
                        x.selected_user_id == String(recipients?.[selectedRecipient].id)
                    )
                    .map((item) => {
                      // console.log(
                      //   ((Number.parseInt(item.left) * 100) / width) * 15,
                      //   ((Number.parseInt(item.top) * 100) / width) * 15
                      // );
                      console.log('rerender', `bg-[${color[index].bg}]`);

                      return (
                        <Draggable
                          x={((Number.parseInt(item.left) * 100) / width) * 15}
                          y={((Number.parseInt(item.top) * 100) / width) * 15}
                          // renderColor="red"
                          renderText={item.type}
                        >
                          <View
                            style={tw`w-15 h-10  border border-[${color[selectedRecipient].border}] rounded-lg items-center bg-[${color[selectedRecipient].background}]`}
                          >
                            <IconButton
                              size={10}
                              style={tw`m-0 `}
                              icon="draw"
                              onPress={() => {}}
                            ></IconButton>
                            <Text style={tw`text-[10px] `}>Signature</Text>
                          </View>
                        </Draggable>
                      );
                    })}
                  {draggedElArr?.stamp
                    ?.filter(
                      (x) =>
                        x.element_container_id == `canvasInner-${index}` &&
                        x.selected_user_id == String(recipients?.[selectedRecipient].id)
                    )
                    .map((item) => {
                      // console.log(
                      //   ((Number.parseInt(item.left) * 100) / width) * 15,
                      //   ((Number.parseInt(item.top) * 100) / width) * 15
                      // );
                      console.log(Number.parseFloat(item.left), item.top);

                      return (
                        <Draggable
                          x={((Number.parseInt(item.left) * 100) / width) * 15}
                          y={((Number.parseInt(item.top) * 100) / width) * 15}
                          // renderColor="red"
                          renderText={item.type}
                        >
                          <View
                            style={tw`w-15 h-10  border border-[${color[selectedRecipient].border}] rounded-lg items-center bg-[${color[selectedRecipient].background}]`}
                          >
                            <IconButton
                              size={10}
                              style={tw`m-0 `}
                              icon="stamper"
                              onPress={() => {}}
                            ></IconButton>
                            <Text style={tw`text-[10px] `}>Stamp</Text>
                          </View>
                        </Draggable>
                      );
                    })}
                  {draggedElArr?.title
                    ?.filter(
                      (x) =>
                        x.element_container_id == `canvasInner-${index}` &&
                        x.selected_user_id == String(recipients?.[selectedRecipient].id)
                    )
                    .map((item) => {
                      // console.log(
                      //   ((Number.parseInt(item.left) * 100) / width) * 15,
                      //   ((Number.parseInt(item.top) * 100) / width) * 15
                      // );
                      console.log(Number.parseFloat(item.left), item.top);

                      return (
                        <Draggable
                          x={((Number.parseInt(item.left) * 100) / width) * 15}
                          y={((Number.parseInt(item.top) * 100) / width) * 15}
                          // renderColor="red"
                          renderText={item.type}
                        >
                          <View
                            style={tw`w-15 h-10  border border-[${color[selectedRecipient].border}] rounded-lg items-center bg-[${color[selectedRecipient].background}]`}
                          >
                            <IconButton
                              size={10}
                              style={tw`m-0 `}
                              icon="briefcase"
                              onPress={() => {}}
                            ></IconButton>
                            <Text style={tw`text-[10px] `}>Title</Text>
                          </View>
                        </Draggable>
                      );
                    })}
                </View>
              );
            }}
          /> */}
        </View>
      </SafeAreaView>
    </View>
  );
};

export default DocumentViewer;

const styles = StyleSheet.create({
  botton_view_buttons: tw`items-center mx-2 w-20 h-20 gap-1 justify-center`,
  yellow_round: tw`h-12 w-12 rounded-full bg-yellow-200 justify-center items-center`,
  yellow_round_text: tw`text-center`,
});
