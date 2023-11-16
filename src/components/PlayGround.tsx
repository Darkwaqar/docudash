import { View, Text, Dimensions, Image, ScrollView, TouchableOpacity } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import AutoHeightImage from 'react-native-auto-height-image';
import tw from 'twrnc';
import { AnimatedImage } from 'react-native-ui-lib';
import { ActivityIndicator, IconButton } from 'react-native-paper';
import Draggable from 'react-native-draggable';
import { DraggedElArr, DraggedElement } from '@type/*';
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
export default function PlayGround({
  image,
  draggedElArr,
  setDraggedElArr,
  selectedRecipient,
  index,
  recipients,
  setDeleteModal,
  setLoadingImg,
  loadingImg,
  onLoadEnd,
}: {
  image: string;
  draggedElArr: DraggedElArr;
  setDraggedElArr: React.MutableRefObject<DraggedElArr>;
  selectedRecipient: number;
  index: number;
  recipients;
  setDeleteModal;
  setLoadingImg: any;
  loadingImg: any;
  onLoadEnd: any;
}) {
  const [scroll, setScroll] = useState(true);
  // const [loading, setLoading] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [openModalDelete, setOpenModalDelete] = useState({
    active: false,
    type: '',
  });
  const [imageRealSize, setImageRealSize] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
    pageX: number;
    pageY: number;
  }>(null);
  const ref = useRef<View>(null);
  console.log('Render');
  const handleScroll = (event) => {
    const positionX = event.nativeEvent.contentOffset.x;
    const positionY = event.nativeEvent.contentOffset.y;
    setScrollY(positionY);
    console.log(positionY);
  };

  //   useEffect(() => {
  //     setLoading(true);
  //     Image.getSize(
  //       image:number,
  //       (width, height) => {
  //         setLoading(false);
  //         setImageRealSize({ width, height });
  //       },
  //       (error) => {
  //         console.log(error);
  //         setLoading(false);
  //       }
  //     );
  //   }, [image]);

  //   if (loading) return <ActivityIndicator />;
  // console.log('setLoading', setLoading);

  return (
    <ScrollView scrollEnabled={scroll} onScroll={handleScroll}>
      <View ref={ref}>
        <AnimatedImage
          height={imageRealSize?.height || width}
          width={imageRealSize?.width < width ? width : imageRealSize?.width}
          source={{
            uri: image,
          }}
          // onLoadStart={() => setLoadingImg(true)}
          onLoadEnd={onLoadEnd}
          style={tw`border `}
          loader={<ActivityIndicator />}
          onLoad={({
            nativeEvent: {
              source: { width, height },
            },
          }) => {
            if (ref.current) {
              ref.current.measure((x, y, w, h, pageX, pageY) => {
                console.log({ x, y, width, height, pageX, pageY });
                setImageRealSize({ x, y, width, height, pageX, pageY });
              });
            }
          }}
        />

        {imageRealSize &&
          Object.values(draggedElArr)
            .flat(1)
            ?.filter(
              (x) =>
                x.element_container_id == `canvasInner-${index}` &&
                x.selected_user_id == String(recipients?.[selectedRecipient].id)
            )
            .map((item: DraggedElement, elementIndex) => {
              //   const { x, y, width, height, pageX, pageY } = markerDimensions;
              //   console.log('y', y);

              // console.log('markerDimensions', markerDimensions);
              // console.log('left in percent', item.left, 'top in percent', item.top);
              // console.log(
              //   'left in pixel',
              //   (Number.parseInt(item.left) / 100) * width,
              //   'top in pixel',
              //   (Number.parseInt(item.top) / 100) * height
              // );
              const left = parseInt((parseInt(item.left) / 100) * width + '');
              const top = parseInt((parseInt(item.top) / 100) * imageRealSize.height + '');
              // console.log('left', left, item.left, 'top', top, item.top);
              return (
                <Draggable
                  x={left}
                  y={top}
                  key={elementIndex + item.type}
                  onDragRelease={(event, gestureState, bounds) => {
                    const nativeEvent = event.nativeEvent;
                    let top = nativeEvent.pageY - imageRealSize.pageY + scrollY;

                    const newLeft = parseInt((nativeEvent.pageX / width) * 100 + '');
                    var newTop = parseInt((top / imageRealSize.height) * 100 + '');
                    if (newTop < 0) newTop = 0;
                    if (newTop > 100) newTop = 100;

                    const topinpercent = newTop + '%';
                    const leftinpercent = newLeft + '%';

                    console.log('left', leftinpercent);
                    console.log('top', topinpercent);

                    const newItem = {
                      ...item,
                      left: leftinpercent,
                      top: topinpercent,
                    };
                    // console.log(item);
                    // console.log(newItem);
                    console.log(item.type);
                    if (item.type == 'signature') {
                      setDraggedElArr.current = {
                        ...draggedElArr,
                        signature: draggedElArr.signature.map((sig) =>
                          sig.uuid == item.uuid ? newItem : sig
                        ),
                      };
                    }
                    if (item.type == 'initial') {
                      setDraggedElArr.current = {
                        ...draggedElArr,
                        initial: draggedElArr.initial.map((sig) =>
                          sig.uuid == item.uuid ? newItem : sig
                        ),
                      };
                    }
                    if (item.type == 'stamp') {
                      setDraggedElArr.current = {
                        ...draggedElArr,
                        stamp: draggedElArr.stamp.map((sig) =>
                          sig.uuid == item.uuid ? newItem : sig
                        ),
                      };
                    }
                    if (item.type == 'date') {
                      setDraggedElArr.current = {
                        ...draggedElArr,
                        date: draggedElArr.date.map((sig) =>
                          sig.uuid == item.uuid ? newItem : sig
                        ),
                      };
                    }
                    if (item.type == 'name') {
                      setDraggedElArr.current = {
                        ...draggedElArr,
                        name: draggedElArr.name.map((sig) =>
                          sig.uuid == item.uuid ? newItem : sig
                        ),
                      };
                    }
                    if (item.type == 'email') {
                      setDraggedElArr.current = {
                        ...draggedElArr,
                        email: draggedElArr.email.map((sig) =>
                          sig.uuid == item.uuid ? newItem : sig
                        ),
                      };
                    }
                    if (item.type == 'company') {
                      setDraggedElArr.current = {
                        ...draggedElArr,
                        company: draggedElArr.company.map((sig) =>
                          sig.uuid == item.uuid ? newItem : sig
                        ),
                      };
                    }
                    if (item.type == 'title') {
                      setDraggedElArr.current = {
                        ...draggedElArr,
                        title: draggedElArr.title.map((sig) =>
                          sig.uuid == item.uuid ? newItem : sig
                        ),
                      };
                    }
                  }}
                  minX={0}
                  maxX={0 + width}
                  minY={0}
                  maxY={imageRealSize.height - 12}
                  // renderColor="red"
                  renderText={item.type}
                >
                  <TouchableOpacity
                    onPressIn={() => {
                      setScroll(false); // important step to disable scroll when long press this button
                    }}
                    onPressOut={() => {
                      setScroll(true); // important step to enable scroll when release or stop drag
                    }}
                    onLongPress={() =>
                      setDeleteModal((prev) => ({
                        ...prev,
                        active: true,
                        type: item.type,
                        uudid: item.uuid,
                      }))
                    }
                    style={tw`w-15 h-10  border border-[${color[selectedRecipient].border}] rounded-lg items-center bg-[${color[selectedRecipient].background}]`}
                  >
                    <IconButton size={10} style={tw`m-0 `} icon={icons[item.type]}></IconButton>
                    <Text style={tw`text-[10px] `}>{item.type}</Text>
                    {/* <Text style={tw`text-[10px] `}>left :{item.left}</Text>
                    <Text style={tw`text-[10px] `}>top:{item.top}</Text>
                    <Text style={tw`text-[10px] `}>left:{left}</Text>
                    <Text style={tw`text-[10px] `}>top:{top}</Text> */}
                  </TouchableOpacity>
                </Draggable>
              );
            })}
      </View>
    </ScrollView>
  );
}
