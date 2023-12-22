import { useNavigation, useRoute } from '@react-navigation/native';
import { RootStackScreenProps } from '@type/index';
import React, { useEffect } from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import tw from 'twrnc';
// import EmailBar from '@components/EmailBar';
import EnvelopeList from '@components/EnvelopeList';
import HomeHeader from '@components/HomeHeader';
import { useDispatch } from 'react-redux';
import { SegmentedButtons } from 'react-native-paper';
import { View } from 'react-native-ui-lib';
import RequestEnvelopeList from '@components/RequestEnvelopeList';

const List = () => {
  const navigation = useNavigation<RootStackScreenProps<'RequestList'>['navigation']>();
  const route = useRoute<RootStackScreenProps<'RequestList'>['route']>();
  const heading = route.params?.heading || 'RequestList';
  const [value, setValue] = React.useState(heading);

  const dispatch = useDispatch();
  useEffect(() => {
    // console.log('Change name', value);
    // dispatch(setRouteName('Manage'));
  }, [navigation]);
  // console.log('Change name', value);
  return (
    <SafeAreaView style={tw`flex-1`}>
      <HomeHeader heading={'Requests'} />
      <View style={tw`px-2`}>
        <SegmentedButtons
          value={value}
          onValueChange={setValue}
          buttons={[
            {
              value: 'RequestList',
              label: 'Request',
            },
            {
              value: 'AcceptedList',
              label: 'Accepted',
            },
            { value: 'DoneList', label: 'Done' },

            { value: 'RejectedList', label: 'Rejected' },
          ]}
        />
      </View>
      <RequestEnvelopeList heading={value} />
    </SafeAreaView>
  );
};

export default List;
