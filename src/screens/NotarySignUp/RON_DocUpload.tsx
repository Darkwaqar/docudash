import GreenButton from '@components/GreenButton';
import UploadView from '@components/UploadView';
import { useNavigation, useRoute } from '@react-navigation/native';
import { selectSignupToken, setAccessToken, setNotaryStep } from '@stores/slices/UserSlice';
import { SignUpStackScreenProps } from '@type/index';
import { colors } from '@utils/Colors';
import axios from 'axios';
import FormData from 'form-data';
import React, { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, View } from 'react-native';
import { Chip, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { NotarySignUpStep5 } from 'src/types/NotarySignUpStep5';
import tw from 'twrnc';

interface uploadType {
  uri: string;
  name: string;
  type: 'image' | 'video' | undefined | string;
}
const RON_DocUpload = () => {
  const token = useSelector(selectSignupToken);
  const dispatch = useDispatch();

  const navigation = useNavigation<SignUpStackScreenProps<'Step2'>['navigation']>();
  const route = useRoute<SignUpStackScreenProps<'Step2'>['route']>();
  const [otp, setOtp] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [documents, setDocuments] = useState<uploadType[]>(new Array());

  useEffect(() => {
    if (documents.length > 0) {
      setNotary_document_status(true);
    } else setNotary_document_status(false);
  }, [documents]);

  const [notary_document_status, setNotary_document_status] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('notary_document_status', notary_document_status ? 1 : 0);
    documents.forEach((element) => {
      formData.append('notary_document', element);
    });

    axios
      .post('https://docudash.net/api/notary-sign-up-5/' + token, formData, {})
      .then((response) => {
        const { success = true, data, message }: NotarySignUpStep5 = response.data;
        // console.log('optScreen-', response.data);

        if (success) {
          setLoading(false);
          Alert.alert(message);
          dispatch(setNotaryStep(0));
          dispatch(setAccessToken(token));
        } else {
          if (message) Object.values(message).map((x) => Alert.alert('Failed', x.toString()));
          setOtp(''), setLoading(false);
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  return (
    <SafeAreaView style={tw`h-full bg-white`}>
      <ScrollView contentContainerStyle={tw`bg-white`}>
        <View style={tw`flex-1 gap-3 justify-center px-10`}>
          <View style={tw`absolute top-10 left-5`}>
            <Chip>
              <Text variant="labelLarge">{`7/7`}</Text>
            </Chip>
          </View>
          <Image
            style={tw`w-65 self-center`}
            resizeMode="contain"
            source={require('@assets/logo.png')}
          />
          <Text
            style={{
              fontFamily: 'nunito-SemiBold',
              color: colors.blue,
              fontSize: 25,
              alignSelf: 'center',
            }}
          >
            Documents Upload
          </Text>
          <Text
            style={[
              { fontFamily: 'nunito-SemiBold' },
              tw`text-center text-[${colors.blue}] text-base`,
            ]}
          >
            Upload your Remote Online Notary Certificate for verification purposes. If you’re not an
            R.O.N, please proceed to next step by clicking Next{' '}
            <Text variant="labelLarge" style={tw`font-bold underline`}>
              Next
            </Text>
            tab
          </Text>
          <UploadView documents={documents} setDocuments={setDocuments} />
          <GreenButton loading={loading} text={'Next'} onPress={fetchData} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RON_DocUpload;

const styles = StyleSheet.create({
  drop_down_style: tw`border-2 h-14 justify-center items-center border-gray-400 rounded-full mt-3`,
});
