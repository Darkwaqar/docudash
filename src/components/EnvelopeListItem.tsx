import { useNavigation, useRoute } from '@react-navigation/native';
import { Envelope, RootStackScreenProps } from '@type/index';
import { colors } from '@utils/Colors';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import tw from 'twrnc';

interface IEnvelopeListItem {
  item: Envelope;
  heading: string;
}

export default function EnvelopeListItem({ item, heading }: IEnvelopeListItem) {
  const navigation = useNavigation<RootStackScreenProps<'Inbox'>['navigation']>();
  const route = useRoute<RootStackScreenProps<'Inbox'>['route']>();
  return (
    <TouchableOpacity
      delayPressIn={25}
      activeOpacity={0.5}
      style={tw`p-4 px-5 gap-3 bg-[${colors.white}]`}
      onPress={() =>
        heading == 'Inbox'
          ? navigation.navigate('Details', { Envelope: item })
          : navigation.navigate('Edit', { Envelope: item })
      }
    >
      <View style={tw`flex-row overflow-hidden gap-2 items-center h-16`}>
        <Image style={tw`w-10 h-10 rounded-full`} source={require('@assets/ProfilePic.png')} />
        <View>
          <Text style={tw`font-bold text-black`}>{item?.emailSubject}</Text>
          <Text style={tw`font-light text-3 w-50 text-gray-900`}>{item?.emailMessage}</Text>
        </View>
      </View>
      <View style={tw`flex-row items-center gap-3 overflow-hidden`}>
        <Image
          style={[tw`h-4 w-3.5 `, { tintColor: colors.gray }]}
          source={require('@assets/PaperClip.png')}
        />
        <Text style={tw`font-thin text-gray-900`}>From: {item?.created_by}</Text>
      </View>
    </TouchableOpacity>
  );
}
