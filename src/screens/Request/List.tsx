import { useNavigation, useRoute } from '@react-navigation/native';
import { RootStackScreenProps } from '@type/index';
import React from 'react';
import { SafeAreaView } from 'react-native';
import tw from 'twrnc';
// import EmailBar from '@components/EmailBar';
import DrawerScreenContainer from '@components/DrawerScreenContainer';
import HomeHeader from '@components/HomeHeader';
import RequestEnvelopeList from '@components/RequestEnvelopeList';
import { SegmentedButtons } from 'react-native-paper';
import { View } from 'react-native-ui-lib';

const List = () => {
  const navigation = useNavigation<RootStackScreenProps<'RequestList'>['navigation']>();
  const route = useRoute<RootStackScreenProps<'RequestList'>['route']>();
  const heading = route.params?.heading || 'RequestList';
  const [value, setValue] = React.useState(heading);
  return (
    <DrawerScreenContainer>
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
    </DrawerScreenContainer>
  );
};

export default List;
