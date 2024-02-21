import { colors } from '@utils/Colors';
import { useFonts } from 'expo-font';
import React, { useRef } from 'react';
import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ViewShot from 'react-native-view-shot';
import tw from 'twrnc';

const ChooseSignatureItem = ({
  item,
  id,
  setList,
  fullName,
  initials,
  setSelectedUri,
  setSelectedInitialUri,
}: {
  item: { selected: boolean };
  id: number;
  setList: React.Dispatch<
    React.SetStateAction<
      {
        selected: boolean;
      }[]
    >
  >;
  fullName: string;
  initials: string;
  setSelectedUri: React.Dispatch<React.SetStateAction<string>>;
  setSelectedInitialUri: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [fontsLoaded] = useFonts({
    LongCang: require('@assets/Fonts/LongCang-Regular.ttf'),
    WalterTurncoat: require('@assets/Fonts/WalterTurncoat-Regular.ttf'),
    ShadowsIntoLight: require('@assets/Fonts/ShadowsIntoLight-Regular.ttf'),
    MonsieurLaDoulaise: require('@assets/Fonts/MonsieurLaDoulaise-Regular.ttf'),
    MrDafoe: require('@assets/Fonts/MrDafoe-Regular.ttf'),
    MrsSaintDelafield: require('@assets/Fonts/MrsSaintDelafield-Regular.ttf'),
    PatrickHand: require('@assets/Fonts/PatrickHand-Regular.ttf'),
    RockSalt: require('@assets/Fonts/RockSalt-Regular.ttf'),
    Sarina: require('@assets/Fonts/Sarina-Regular.ttf'),
  });
  const ref = useRef(null);
  const refInitial = useRef(null);
  const onCapture = () => {
    // @ts-ignore
    ref.current?.capture().then((uri) => {
      setList((prev) =>
        prev.map((sign, i) =>
          i === id ? { ...sign, selected: true } : { ...sign, selected: false }
        )
      );

      setSelectedUri(uri);
    });
    // @ts-ignore
    refInitial.current?.capture().then((uri) => {
      setSelectedInitialUri(uri);
    });
  };
  if (!fontsLoaded) return null;
  return (
    <TouchableOpacity onPress={onCapture} key={id}>
      <View style={tw`p-2 flex-row items-center gap-2 `}>
        <View
          style={[
            tw`border-2 h-5 w-5 rounded-full border-gray-400 justify-center items-center`,
            item.selected ? tw`bg-[${colors.black}]` : tw`bg-white`,
          ]}
        ></View>
        <View style={tw`flex-row items-center gap-2 h-25  flex-1`}>
          <Image
            style={[tw`h-25 w-3`, { tintColor: colors.green }]}
            resizeMode="contain"
            source={require('@assets/WhiteLine.png')}
          />
          <View style={tw`h-full justify-between  flex-1`}>
            <Text style={styles.h2}>signature</Text>
            <ViewShot
              ref={ref}
              options={{
                fileName: 'Your-Signature',
                format: 'png',
                quality: 0.9,
                result: 'base64',
              }}
            >
              <Text
                style={[
                  id === 0
                    ? { fontFamily: 'LongCang' }
                    : id === 1
                    ? { fontFamily: 'WalterTurncoat' }
                    : id === 2
                    ? { fontFamily: 'ShadowsIntoLight' }
                    : id === 3
                    ? { fontFamily: 'MonsieurLaDoulaise' }
                    : id === 4
                    ? {
                        fontFamily: 'MrDafoe',
                      }
                    : id === 5
                    ? { fontFamily: 'MrsSaintDelafield' }
                    : id === 6
                    ? {
                        fontFamily: 'PatrickHand',
                      }
                    : id === 7
                    ? { fontFamily: 'RockSalt' }
                    : id === 9
                    ? { fontFamily: 'Sarina' }
                    : {},
                  tw`text-6`,
                ]}
              >
                {fullName}
              </Text>
            </ViewShot>
            <Text></Text>
          </View>
        </View>
        <View style={tw`flex-row items-center gap-2  h-25 w-[30%]`}>
          <Image
            style={[tw`h-25 w-3`, { tintColor: colors.green }]}
            resizeMode="contain"
            source={require('@assets/WhiteLine.png')}
          />
          <View style={tw`h-full justify-between flex-1`}>
            <Text style={styles.h2}>initial</Text>
            <ViewShot
              ref={refInitial}
              options={{
                fileName: 'Your-Signature',
                format: 'png',
                quality: 0.9,
                result: 'base64',
              }}
            >
              <Text
                style={[
                  id === 0
                    ? { fontFamily: 'LongCang' }
                    : id === 1
                    ? { fontFamily: 'WalterTurncoat' }
                    : id === 2
                    ? { fontFamily: 'ShadowsIntoLight' }
                    : id === 3
                    ? { fontFamily: 'MonsieurLaDoulaise' }
                    : id === 4
                    ? {
                        fontFamily: 'MrDafoe',
                      }
                    : id === 5
                    ? { fontFamily: 'MrsSaintDelafield' }
                    : id === 6
                    ? {
                        fontFamily: 'PatrickHand',
                      }
                    : id === 7
                    ? { fontFamily: 'RockSalt' }
                    : id === 9
                    ? { fontFamily: 'Sarina' }
                    : {},
                  tw`text-5`,
                ]}
              >
                {initials}
              </Text>
            </ViewShot>
            <Text></Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ChooseSignatureItem;

const styles = StyleSheet.create({
  h2: tw`font-semibold text-4 capitalize`,
});
