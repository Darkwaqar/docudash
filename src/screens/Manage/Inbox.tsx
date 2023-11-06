import { useNavigation, useRoute } from '@react-navigation/native';
import { RootStackScreenProps } from '@type/index';
import React from 'react';
import { SafeAreaView } from 'react-native';
import tw from 'twrnc';
// import EmailBar from '@components/EmailBar';
import EnvelopeList from '@components/EnvelopeList';
import HomeHeader from '@components/HomeHeader';
import { SegmentedButtons } from 'react-native-paper';
import { View } from 'react-native-ui-lib';
import { useDispatch } from 'react-redux';

const Inbox = () => {
  const navigation = useNavigation<RootStackScreenProps<'Inbox'>['navigation']>();
  const route = useRoute<RootStackScreenProps<'Inbox'>['route']>();
  const heading = route.params?.heading || 'Inbox';
  const [value, setValue] = React.useState(heading);

  const dispatch = useDispatch();

  return (
    <SafeAreaView style={tw`flex-1`}>
      <HomeHeader heading={heading} />
      <View style={tw`px-4`}>
        <SegmentedButtons
          value={value}
          onValueChange={setValue}
          buttons={[
            {
              value: 'Inbox',
              label: 'Inbox',
            },
            {
              value: 'Draft',
              label: 'Draft',
            },
            { value: 'Sent', label: 'Sent' },

            { value: 'Trash', label: 'Trash' },
          ]}
        />
      </View>
      <EnvelopeList heading={value} />
    </SafeAreaView>
  );
};

export default Inbox;
