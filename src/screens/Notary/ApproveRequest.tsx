import { useNavigation, useRoute } from '@react-navigation/native';
import { selectAccessToken } from '@stores/slices/UserSlice';
import {
  DraggedElArr,
  DraggedElement,
  GenerateSignature,
  GenerateSignatureDetail,
  GenerateSignatureDetails,
  HtmlEditorAPI,
  RootStackScreenProps,
} from '@type/index';
import axios from 'axios';
import FormData from 'form-data';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewToken,
  Modal,
  ActivityIndicator,
} from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';
import Draggable from 'react-native-draggable';
import {
  Appbar,
  Avatar,
  Badge,
  Button,
  Chip,
  Divider,
  IconButton,
  Menu,
  Text,
} from 'react-native-paper';
import { Carousel } from 'react-native-ui-lib';
import { useSelector } from 'react-redux';
import tw from 'twrnc';
import * as Crypto from 'expo-crypto';
import PlayGround from '@components/PlayGround';
import { colors } from '@utils/Colors';
const { width } = Dimensions.get('window');

const icons = {
  company: 'office-building',
  date: 'calendar',
  email: 'email',
  initial: 'signature-text',
  name: 'face-man',
  signature: 'draw',
  stamp: 'stamper',
  title: 'briefcase',
};

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
const ApproveRequest = () => {
  const accessToken = useSelector(selectAccessToken);
  const navigation = useNavigation<RootStackScreenProps<'DocumentEditor'>['navigation']>();
  const route = useRoute<RootStackScreenProps<'ApproveRequest'>['route']>();
  const id = route?.params?.id;
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
  const [loadingImg, setLoadingImg] = useState(true);
  const [images, setImages] = useState<string[]>();
  const [deleteModal, setDeleteModal] = useState({
    active: false,
    type: '',
    uudid: '',
  });
  const envelope = route.params?.Envelope;
  // const envelope: GenerateSignature = {
  //   uniqid: 'd4e421647a894ba55dd90f9857e76b50',
  //   signature_id: 41,
  // };
  const [index, setIndex] = useState(0);
  // console.log('deleteModal', deleteModal);

  const [visible, setVisible] = React.useState(false);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);
  // console.log('markerDiment', markerDimensions);

  const carousel = useRef<typeof Carousel>();
  // console.log(draggedElArr);

  const fetchData = async () => {
    setLoadingImg(true);
    console.log('hello', `https://docudash.net/api/notary/request-detail-accept/${id}`);

    // const url = 'https://docudash.net/api/generate-signature/html-editor/';
    // const testurl = url + 'a9b8ff85878e5d36920543b2b3d4aa69' + '/' + 407;
    // // console.log(url + envelope.uniqid + '/' + envelope.signature_id);

    // axios
    //   .get(url + envelope.uniqid + '/' + envelope.signature_id, {
    //     headers: {
    //       Authorization: `Bearer ${accessToken}`,
    //     },
    //   })
    //   .then((response) => {
    //     setLoading(false);
    //     console.log('html-editor', response.data);
    //     const {
    //       status,
    //       message,
    //       generateSignatureDetailsFinalise,
    //       generateSignatureDetails,
    //       generateSignatureDetailsImages,
    //     }: HtmlEditorAPI = response.data;

    //     if (status) {
    //       if (generateSignatureDetailsFinalise && generateSignatureDetailsFinalise.draggedElArr) {
    //         const draggable = {
    //           signature: generateSignatureDetailsFinalise.draggedElArr.signature ?? [],
    //           initial: generateSignatureDetailsFinalise.draggedElArr.initial ?? [],
    //           stamp: generateSignatureDetailsFinalise.draggedElArr.stamp ?? [],
    //           date: generateSignatureDetailsFinalise.draggedElArr.date ?? [],
    //           name: generateSignatureDetailsFinalise.draggedElArr.name ?? [],
    //           email: generateSignatureDetailsFinalise.draggedElArr.email ?? [],
    //           company: generateSignatureDetailsFinalise.draggedElArr.company ?? [],
    //           title: generateSignatureDetailsFinalise.draggedElArr.title ?? [],
    //         };
    //         setDraggedElArr(draggable);
    //         refDraggedElArr.current = draggable;
    //         console.log('draggedElArr', draggedElArr);
    //       }
    //       setRecipients(generateSignatureDetails);
    //       setImages(generateSignatureDetailsImages.map((x) => x.filesArr).flat());
    //     } else {
    //       alert(message);
    //     }
    //   })
    //   .catch((error) => {
    //     setLoading(false);
    //     console.log('Error----', error);
    //   });
    axios
      .post(
        'https://docudash.net/api/notary/ApproveRequest',
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
        // console.log('ApproveRequest ===><><>', response.data);
        console.log('response.data', response.data);
        if (!response.data.status) {
          alert(response.data.message);
          navigation.goBack();
        }
        const { NotaryRequests, NotaryRequestsDetails, NotaryRequestsDetailsDocuments, status } =
          response.data.data;
        //     if (status) {
        // console.log(
        //   'NotaryRequestsDetailsDocuments.map((x) => x.docs).flat()',
        //   NotaryRequestsDetailsDocuments.map((x) => x.docs).flat()
        // );
        // console.log('NotaryRequestsDetails', NotaryRequestsDetails);
        if (NotaryRequests && NotaryRequests.draggedElArr) {
          const draggable = {
            signature: NotaryRequests.draggedElArr.signature ?? [],
            initial: NotaryRequests.draggedElArr.initial ?? [],
            stamp: NotaryRequests.draggedElArr.stamp ?? [],
            date: NotaryRequests.draggedElArr.date ?? [],
            name: NotaryRequests.draggedElArr.name ?? [],
            email: NotaryRequests.draggedElArr.email ?? [],
            company: NotaryRequests.draggedElArr.company ?? [],
            title: NotaryRequests.draggedElArr.title ?? [],
          };

          setDraggedElArr(draggable);
        }
        console.log(
          'NotaryRequestsDetailsDocuments?.map((x) => x.docs).flat()',
          NotaryRequestsDetailsDocuments
        );

        setImages(NotaryRequestsDetailsDocuments?.map((x) => x.docs).flat());
        setRecipients(NotaryRequestsDetails);
        console.log('recipients =><><=', NotaryRequestsDetails);

        setLoadingImg(false);
      })
      .catch((err) => {
        setLoadingImg(false);
        console.log('err ===><><>', err);
      });
  };
  useEffect(() => {
    // if (envelope) {
    fetchData();
    // }
  }, []);

  const save = (type: number) => {
    console.log('refDraggedElArr', JSON.stringify(draggedElArr));

    const updatedObject = {};

    Object.entries(draggedElArr).forEach(([key, value]) => {
      // Check if the value is an array before applying the map function
      if (Array.isArray(value)) {
        // Function to update 'left' and 'top' properties based on 'leftMobile' and 'topMobile'
        const updateLeftTopProperties = (item) => ({
          ...item,
          left: item.leftMobile,
          top: item.topMobile,
        });

        // Apply the function using map on each array and save in the new object
        updatedObject[key] = value.map(updateLeftTopProperties);
      } else {
        // Copy non-array values directly to the new object
        updatedObject[key] = value;
      }
    });

    const url = `https://docudash.net/api/notary/request-detail-accept/${id}`;
    // console.log(`Bearer ${accessToken}`);
    console.log('url', url);

    const data = new FormData();
    data.append('draggedElArr', JSON.stringify(updatedObject));
    // save for 0 send for 1
    data.append('save_type', type);

    // console.log('data', refDraggedElArr.current);

    axios
      .post(url, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        const { status, message }: { status: boolean; message: string } = response.data;
        console.log('save', response.data);

        if (status) {
          alert(message);
          navigation.navigate('Home');
        } else {
          alert(message);
        }
      })
      .catch((err) => {
        console.log('error ==>', err);
      });
  };
  const DeleteEnvelope = () => {
    var url = 'https://docudash.net/api/generate-signature/deleteDraftEmail';
    axios
      .post(
        url,
        { id: envelope.id },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then((response) => {
        const { status, message }: { status: boolean; message: string } = response.data;
        // console.log(response.data);
        if (status) navigation.navigate('Home');
        else {
          alert(message);
        }
      })
      .catch((error) => {
        console.log('Error----', error);
      });
  };

  return (
    <View style={tw`h-full `}>
      <Modal visible={deleteModal.active} transparent={true} animationType="none">
        <View
          style={{
            flex: 1,

            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View style={tw`p-5 bg-[${colors.green}] items-center gap-4 rounded-lg py-6`}>
            <Text style={tw`font-semibold text-4 text-white`}>
              Do you want to delete this {deleteModal.type}?
            </Text>
            <View style={tw`flex-row items-center`}>
              <TouchableOpacity
                style={styles.yesno_button}
                onPress={() => {
                  const type = deleteModal.type;
                  const arr: DraggedElement[] = draggedElArr[type];
                  const filtered = arr.filter((x) => x.uuid != deleteModal.uudid);
                  setDraggedElArr((prev) => ({ ...prev, [type]: filtered }));
                  setDeleteModal({
                    active: false,
                    type: '',
                    uudid: '',
                  });
                }}
              >
                <Text style={styles.yesno_text}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.yesno_button}
                onPress={() => setDeleteModal((prev) => ({ ...prev, active: false, type: '' }))}
              >
                <Text style={styles.yesno_text}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Appbar.Header mode="center-aligned">
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content
          title={
            <View style={tw`items-center`}>
              <Text variant="titleSmall">Editing Document</Text>
              <Text variant="labelSmall">subtitle</Text>
            </View>
          }
        />
        <Button
          onPress={() => {
            save(1);
          }}
        >
          Send
        </Button>
      </Appbar.Header>

      <View style={tw` bg-white `}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {/* draw */}
          {recipients
            // ?.filter((x) => x.sign_type == '1' || x.sign_type == '2')
            // .slice(0, 5)
            ?.map((item, index) => (
              <View
                key={index + '$'}
                style={[
                  styles.botton_view_buttons,
                  tw`${item.sign_type == '1' || item.sign_type == '2' ? 'block' : 'hidden'}`,
                ]}
              >
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
                {/* <Text style={styles.yellow_round_text}>{item.id}</Text>
                <Text style={styles.yellow_round_text}>{item.generateSignatureDetailsID}</Text> */}
                <Text style={styles.yellow_round_text}>{item.recName}</Text>
              </View>
            ))}
        </ScrollView>
      </View>
      {/* {loadingImg ? (
        <View style={[tw` flex-1 items-center justify-center`]}>
          <ActivityIndicator />
        </View>
      ) : ( */}

      <View style={tw`flex-1`}>
        {images && (
          <PlayGround
            setDeleteModal={setDeleteModal}
            image={images[index]}
            draggedElArr={draggedElArr}
            setDraggedElArr={setDraggedElArr}
            index={index}
          />
        )}
        {loadingImg && (
          <View
            style={[
              tw` flex-1 items-center justify-center `,
              {
                position: 'absolute',
                // top: 100,
                left: 0,
                height: '100%',
                // backgroundColor: 'red',
                width: '100%',
                flex: 1,
              },
            ]}
          >
            <ActivityIndicator color="black" />
          </View>
        )}
        <Chip style={tw`absolute top-1 right-1 `}>
          <Text variant="labelLarge">{` ${index + 1} / ${images?.length} `}</Text>
        </Chip>
      </View>
      {/* )} */}
      <View style={tw` bg-white bottom-0 `}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {/* draw */}
          <View style={styles.botton_view_buttons}>
            <View style={[styles.yellow_round, tw`bg-[${color[selectedRecipient].background}]`]}>
              <IconButton
                icon="draw"
                onPress={() => {
                  const newData: DraggedElement = {
                    type: 'signature',
                    element_container_id: `canvasInner-${index}`,
                    left: '10%',
                    top: '10%',
                    icon: 'fa fa-user-circle-o',
                    name: 'Signature',
                    uuid: Crypto.randomUUID(),
                    selected_user_id: String(
                      recipients?.find((x, i) => i == selectedRecipient)?.id
                    ),
                    selected_user_id_1: String(
                      recipients?.find((x, i) => i == selectedRecipient)?.generateSignatureDetailsID
                    ),
                    colors: color[selectedRecipient],
                    leftMobile: '10%',
                    topMobile: '10%',
                  };

                  setDraggedElArr((prev) => ({
                    ...prev,
                    signature: [...prev?.signature, newData],
                  }));
                }}
              ></IconButton>
            </View>
            <Text style={styles.yellow_round_text}>Signature</Text>
          </View>
          {/* Initials */}
          <View style={styles.botton_view_buttons}>
            <View style={[styles.yellow_round, tw`bg-[${color[selectedRecipient].background}]`]}>
              <IconButton
                icon="signature-text"
                onPress={() => {
                  const newData: DraggedElement = {
                    type: 'initial',
                    element_container_id: `canvasInner-${index}`,
                    left: '20%',
                    top: '20%',
                    icon: 'fa fa-user-circle-o',
                    name: 'initial',
                    uuid: Crypto.randomUUID(),
                    selected_user_id: String(
                      recipients?.find((x, i) => i == selectedRecipient)?.id
                    ),
                    colors: color[selectedRecipient],
                    leftMobile: '20%',
                    topMobile: '20%',
                    selected_user_id_1: String(
                      recipients?.find((x, i) => i == selectedRecipient)?.generateSignatureDetailsID
                    ),
                  };
                  setDraggedElArr((prev) => ({
                    ...prev,
                    initial: [...prev?.initial, newData],
                  }));
                }}
              ></IconButton>
            </View>
            <Text style={styles.yellow_round_text}>Initials</Text>
          </View>
          <View style={styles.botton_view_buttons}>
            <View style={[styles.yellow_round, tw`bg-[${color[selectedRecipient].background}]`]}>
              <IconButton
                icon="stamper"
                onPress={() => {
                  const newData: DraggedElement = {
                    type: 'stamp',
                    element_container_id: `canvasInner-${index}`,
                    left: '30%',
                    top: '30%',
                    icon: 'fa fa-user-circle-o',
                    name: 'stamp',
                    uuid: Crypto.randomUUID(),
                    selected_user_id: String(
                      recipients?.find((x, i) => i == selectedRecipient)?.id
                    ),
                    colors: color[selectedRecipient],
                    leftMobile: '30%',
                    topMobile: '30%',
                    selected_user_id_1: String(
                      recipients?.find((x, i) => i == selectedRecipient)?.generateSignatureDetailsID
                    ),
                  };
                  setDraggedElArr((prev) => ({
                    ...prev,
                    stamp: [...prev?.stamp, newData],
                  }));
                }}
              ></IconButton>
            </View>
            <Text style={styles.yellow_round_text}>Stamp</Text>
          </View>
          {/* Date */}
          <View style={styles.botton_view_buttons}>
            <View style={[styles.yellow_round, tw`bg-[${color[selectedRecipient].background}]`]}>
              <IconButton
                icon="calendar"
                onPress={() => {
                  const newData: DraggedElement = {
                    type: 'date',
                    element_container_id: `canvasInner-${index}`,
                    left: '40%',
                    top: '40%',
                    icon: 'fa fa-user-circle-o',
                    name: 'date',
                    uuid: Crypto.randomUUID(),
                    selected_user_id: String(
                      recipients?.find((x, i) => i == selectedRecipient)?.id
                    ),
                    colors: color[selectedRecipient],
                    leftMobile: '40%',
                    topMobile: '40%',
                    selected_user_id_1: String(
                      recipients?.find((x, i) => i == selectedRecipient)?.generateSignatureDetailsID
                    ),
                  };
                  setDraggedElArr((prev) => ({
                    ...prev,
                    date: [...prev?.date, newData],
                  }));
                }}
              ></IconButton>
            </View>
            <Text style={styles.yellow_round_text}>Date</Text>
          </View>
          <View style={styles.botton_view_buttons}>
            <View style={[styles.yellow_round, tw`bg-[${color[selectedRecipient].background}]`]}>
              <IconButton
                icon="face-man"
                onPress={() => {
                  const newData: DraggedElement = {
                    type: 'name',
                    element_container_id: `canvasInner-${index}`,
                    left: '50%',
                    top: '50%',
                    icon: 'fa fa-user-circle-o',
                    name: 'name',
                    uuid: Crypto.randomUUID(),
                    selected_user_id: String(
                      recipients?.find((x, i) => i == selectedRecipient)?.id
                    ),
                    colors: color[selectedRecipient],
                    leftMobile: '50%',
                    topMobile: '50%',
                    selected_user_id_1: String(
                      recipients?.find((x, i) => i == selectedRecipient)?.generateSignatureDetailsID
                    ),
                  };
                  setDraggedElArr((prev) => ({
                    ...prev,
                    name: [...prev?.name, newData],
                  }));
                }}
              ></IconButton>
            </View>
            <Text style={styles.yellow_round_text}>Name</Text>
          </View>
          {/* Text box */}
          <View style={styles.botton_view_buttons}>
            <View style={[styles.yellow_round, tw`bg-[${color[selectedRecipient].background}]`]}>
              <IconButton
                icon="email"
                onPress={() => {
                  const newData: DraggedElement = {
                    type: 'email',
                    element_container_id: `canvasInner-${index}`,
                    leftMobile: '60%',
                    topMobile: '60%',
                    icon: 'fa fa-user-circle-o',
                    name: 'email',
                    uuid: Crypto.randomUUID(),
                    selected_user_id: String(
                      recipients?.find((x, i) => i == selectedRecipient)?.id
                    ),
                    colors: color[selectedRecipient],
                    left: '60%',
                    top: '60%',
                    selected_user_id_1: String(
                      recipients?.find((x, i) => i == selectedRecipient)?.generateSignatureDetailsID
                    ),
                  };
                  setDraggedElArr((prev) => ({
                    ...prev,
                    email: [...prev?.email, newData],
                  }));
                }}
              ></IconButton>
            </View>
            <Text style={styles.yellow_round_text}>Email</Text>
          </View>
          {/* Name */}
          <View style={styles.botton_view_buttons}>
            <View style={[styles.yellow_round, tw`bg-[${color[selectedRecipient].background}]`]}>
              <IconButton
                icon="office-building"
                onPress={() => {
                  const newData: DraggedElement = {
                    type: 'company',
                    element_container_id: `canvasInner-${index}`,
                    left: '70%',
                    top: '70%',
                    icon: 'fa fa-user-circle-o',
                    name: 'company',
                    uuid: Crypto.randomUUID(),
                    selected_user_id: String(
                      recipients?.find((x, i) => i == selectedRecipient)?.id
                    ),
                    colors: color[selectedRecipient],
                    leftMobile: '70%',
                    topMobile: '70%',
                    selected_user_id_1: String(
                      recipients?.find((x, i) => i == selectedRecipient)?.generateSignatureDetailsID
                    ),
                  };
                  setDraggedElArr((prev) => ({
                    ...prev,
                    company: [...prev?.company, newData],
                  }));
                }}
              ></IconButton>
            </View>
            <Text style={styles.yellow_round_text}>Company</Text>
          </View>
          <View style={styles.botton_view_buttons}>
            <View style={[styles.yellow_round, tw`bg-[${color[selectedRecipient].background}]`]}>
              <IconButton
                icon="briefcase"
                onPress={() => {
                  const newData: DraggedElement = {
                    type: 'title',
                    element_container_id: `canvasInner-${index}`,
                    left: '80%',
                    top: '80%',
                    icon: 'fa fa-user-circle-o',
                    name: 'title',
                    uuid: Crypto.randomUUID(),
                    selected_user_id: String(
                      recipients?.find((x, i) => i == selectedRecipient)?.id
                    ),
                    colors: color[selectedRecipient],
                    leftMobile: '80%',
                    topMobile: '80%',
                    selected_user_id_1: String(
                      recipients?.find((x, i) => i == selectedRecipient)?.generateSignatureDetailsID
                    ),
                  };
                  setDraggedElArr((prev) => ({
                    ...prev,
                    title: [...prev?.title, newData],
                  }));
                }}
              ></IconButton>
            </View>
            <Text style={styles.yellow_round_text}>Title</Text>
          </View>
        </ScrollView>
      </View>
      <View style={tw`flex-row  bg-white items-center justify-between`}>
        <View style={tw`flex-row items-center`}>
          <IconButton
            icon="chevron-down"
            onPress={() => {
              if (index < images?.length - 1) setIndex(index + 1);
            }}
          ></IconButton>

          <IconButton
            icon="chevron-up"
            onPress={() => {
              // console.log(index, images.length);
              if (index > 0) setIndex(index - 1);
            }}
          ></IconButton>
          <Text variant="labelLarge">{` ${index + 1} / ${images?.length} documents`}</Text>
        </View>
        <View style={tw`flex-row `}>
          <IconButton icon="magnify" onPress={() => {}}></IconButton>
          <Menu
            // anchorPosition="top"
            visible={visible}
            onDismiss={closeMenu}
            anchor={<IconButton icon="dots-horizontal" onPress={openMenu}></IconButton>}
          >
            <Menu.Item
              onPress={() => {
                closeMenu();
                save(0);
              }}
              title="Save and close"
            />
            <Menu.Item
              onPress={() => {
                closeMenu();
                save(1);
              }}
              title="Send and close"
            />
            <Divider />
            <Menu.Item
              onPress={() => {
                closeMenu();
              }}
              title="Discard"
            />
            <Divider />
            <Menu.Item
              onPress={() => {
                closeMenu();
                navigation.push('Edit', { activeIndex: 0 });
              }}
              title="Edit Recipient"
            />
            <Menu.Item
              onPress={() => {
                closeMenu();
                navigation.push('Edit', { activeIndex: 1 });
              }}
              title="Edit message"
            />
            <Divider />
            <Divider />
            <Menu.Item
              onPress={() => {
                closeMenu();
                navigation.push('Edit', { activeIndex: 2 });
              }}
              // onPress={() => {
              //   closeMenu();
              // }}
              title="Edit document"
            />
          </Menu>
        </View>
      </View>
      <SafeAreaView style={tw` bg-white `}></SafeAreaView>
    </View>
  );
};

export default ApproveRequest;

const styles = StyleSheet.create({
  botton_view_buttons: tw`items-center mx-2 w-20 h-20 gap-1 justify-center`,
  yellow_round: tw`h-12 w-12 rounded-full bg-yellow-200 justify-center items-center`,
  yellow_round_text: tw``,
  yesno_button: {
    padding: 4,
    marginHorizontal: 6,
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  yesno_text: { fontSize: 16 },
});
