import {
  View,
  Text,
  Dimensions,
  Image,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import AutoHeightImage from 'react-native-auto-height-image';
import tw from 'twrnc';
import { AnimatedImage } from 'react-native-ui-lib';
import { ActivityIndicator, IconButton } from 'react-native-paper';
import Draggable from 'react-native-draggable';
import { DraggedElArr, DraggedElement } from '@type/*';
const { width, height } = Dimensions.get('window');

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
  index,
  setDeleteModal,
}: {
  image: string;
  draggedElArr: DraggedElArr;
  setDraggedElArr: React.Dispatch<React.SetStateAction<DraggedElArr>>;
  index: number;
  setDeleteModal;
}) {
  const [scroll, setScroll] = useState(true);
  const [scrollY, setScrollY] = useState(0);

  const [imageRealSize, setImageRealSize] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
    pageX: number;
    pageY: number;
  }>(null);
  const ref = useRef<View>(null);
  // console.log('Render');
  const handleScroll = (event) => {
    const positionY = event.nativeEvent.contentOffset.y;
    setScrollY(positionY);
  };

  return (
    <ScrollView scrollEnabled={scroll} onScroll={handleScroll} contentContainerStyle={tw`flex-1`}>
      <View style={tw` flex-1 border`} ref={ref}>
        <Image
          source={{
            uri: image,
          }}
          style={[tw` flex-1 `, { flex: 1, width: null, height: null, resizeMode: 'contain' }]}
          onLoad={({
            nativeEvent: {
              source: { width, height },
            },
          }) => {
            if (ref.current) {
              ref.current.measure((x, y, w, h, pageX, pageY) => {
                // console.log({ x, y, width, height, pageX, pageY });
                setImageRealSize({ x, y, width, height, pageX, pageY });
              });
            }
          }}
        />

        {imageRealSize &&
          Object.values(draggedElArr)
            .flat(1)
            // ?.filter((x) => x.element_container_id == `canvasInner-${index}`)
            .map((item: DraggedElement, elementIndex) => {
              const left = parseFloat((parseFloat(item.left) / 100) * imageRealSize.width + '');
              const top = parseFloat((parseFloat(item.top) / 100) * imageRealSize.height + '');
              console.log('drawleft', left);
              console.log('drawtop', top);
              // console.log('left', left, item.left, 'top', top, item.top);
              return (
                <Draggable
                  x={left}
                  y={top}
                  key={item.uuid}
                  onDragRelease={(event, gestureState, bounds) => {
                    console.log('Release', gestureState);
                    const nativeEvent = event.nativeEvent;
                    let top = nativeEvent.pageY - imageRealSize.pageY + scrollY;
                    const newLeft = parseFloat(
                      (nativeEvent.pageX / (imageRealSize.width + 280)) * 100 + ''
                    );
                    var newTop = parseFloat((top / (imageRealSize.height + 100)) * 100 + '');
                    if (newTop < 0) newTop = 0;
                    if (newTop > 100) newTop = 100;

                    const topinpercent = newTop + '%';
                    const leftinpercent = newLeft + '%';

                    // console.log('left', leftinpercent);
                    // console.log('top', topinpercent);
                    const newItem = {
                      ...item,
                      left: leftinpercent,
                      top: topinpercent,
                    };
                    // console.log(item);
                    // console.log(newItem);

                    //left 11.58
                    // top:31.53

                    console.log('top', top / imageRealSize.height);
                    console.log('left', nativeEvent.pageX / imageRealSize.width);

                    setDraggedElArr((prev) => ({
                      ...prev,
                      [item.type]: draggedElArr[item.type].map((sig: DraggedElement) =>
                        sig.uuid == item.uuid
                          ? {
                              ...sig,
                              leftMobile: leftinpercent,
                              topMobile: topinpercent,
                            }
                          : sig
                      ),
                    }));
                  }}
                  minX={0}
                  maxX={0 + width}
                  minY={0}
                  maxY={imageRealSize.height - 12}
                  // renderColor="red"
                  renderText={item.type}
                >
                  <Pressable
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
                    style={tw`w-15 h-10 ${
                      item.element_container_id != `canvasInner-${index}` ? 'hidden' : 'block'
                    }  border border-[${item.colors.border}] rounded-lg items-center bg-[${
                      item.colors.background
                    }]`}
                  >
                    <IconButton size={10} style={tw`m-0 `} icon={icons[item.type]}></IconButton>
                    <Text style={tw`text-[10px] `}>{item.type}</Text>
                    {/* <Text style={tw`text-[10px] `}>left :{item.selected_user_id}</Text>
                    <Text style={tw`text-[10px] `}>top:{item.selected_user_id_1}</Text> */}
                  </Pressable>
                </Draggable>
              );
            })}
      </View>
    </ScrollView>
  );
}
