import { useNavigation, useRoute } from '@react-navigation/native';
import { IRequestItem, RootStackScreenProps } from '@type/index';
import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import tw from 'twrnc';
import { Text } from 'react-native-paper';
import { reasons } from '@utils/requestReason';
import { time } from '@utils/requestTime';
import { requestType } from '@utils/requestType';
interface IEnvelopeListItem {
  item: IRequestItem;
}
export default function UserRequestListItem({ item }: IEnvelopeListItem) {
  const navigation = useNavigation<RootStackScreenProps<'Inbox'>['navigation']>();
  const route = useRoute<RootStackScreenProps<'Inbox'>['route']>();
  console.log('item ===><><', item);

  return (
    <TouchableOpacity onPress={() => navigation.navigate('RequestDetails', { id: item.id })}>
      <View style={tw` mx-2 gap-2 rounded-lg p-4 justify-between bg-white my-2 shadow-lg`}>
        <Text variant="bodyMedium" numberOfLines={2}>
          Request: {''}
          {reasons.find((x) => x.value == item.reasonOfRequest.toString()).label}
        </Text>
        <Text variant="labelLarge" numberOfLines={2}>
          Message: {''}
          <Text style={tw`font-thin`}>{item.requestMessage}</Text>
        </Text>
        <Text variant="labelLarge">
          Request Location: {''}
          <Text style={tw`font-thin`}>{item.request_location_list.name}</Text>
        </Text>
        <Text variant="labelLarge">
          Request Time: {''}
          <Text style={tw`font-thin`}>
            {' '}
            {time.find((x) => x.value == item.requestTime.toString()).label}
          </Text>
        </Text>
        <Text variant="labelLarge">
          From User:{' '}
          <Text style={tw`font-thin`}>
            {item.notary_details.name + ' ' + item.notary_details.last_name}
          </Text>
        </Text>
        <Text variant="labelLarge">
          Request Status:{' '}
          <Text style={tw`text-[#6FAC46]`}>
            {requestType.find((x) => x.value == item?.notary_request_status.toString())?.label}
          </Text>
        </Text>
      </View>
    </TouchableOpacity>
  );
}
