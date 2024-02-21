import { View, Image, SafeAreaView, ScrollView, Alert } from 'react-native';
import React, { useState } from 'react';
import { Chip, Text } from 'react-native-paper';
import tw from 'twrnc';
import colors from '@constants/colors';
import UploadView from '@components/UploadView';
import GreenButton from '@components/GreenButton';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { selectSignupToken } from '@stores/slices/UserSlice';
import { useNavigation } from '@react-navigation/native';
import { SignUpStackScreenProps } from '@type/*';
import Input from '@components/Input';
const LicenseDocument = () => {
  const navigation = useNavigation<any>();
  const token = useSelector(selectSignupToken);
  const [loading, setLoading] = useState<boolean>(false);
  const [documents, setDocuments] = useState<uploadType[]>(new Array());
  const [verifyDocument, setVerifyDocument] = useState<uploadType[]>(new Array());
  const [inputVal, setInputVal] = useState<number>();
  const fetchData = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('govt_notary_id', inputVal);
    formData.append('LicenseDocument', documents[0]);
    formData.append('VerifyIdentityDocument', verifyDocument[0]);

    axios
      .post('https://docudash.net/api/notary-sign-up-3/' + token, formData, {})
      .then((response) => {
        // console.log('optScreen-', response.data);
        const { success = true, data, message, next }: NotarySignUpStep5 = response.data;

        if (success) {
          setLoading(false);
          // Alert.alert(message);
          navigation.replace('NotaryLoginStackNavigator', {
            screen: ('Step' + data.steps) as any,
            params: {
              api: next,
            },
          });
          setLoading(false);
          //   dispatch(setNotaryStep(0));
          //   dispatch(setAccessToken(token));
        } else {
          if (message) Object.values(message).map((x) => Alert.alert('Failed', x.toString()));
          setLoading(false);
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
              {/* <Text variant="labelLarge">{`4/7`}</Text> */}
              <Text variant="labelLarge">{`4/7`}</Text>
            </Chip>
          </View>
          <Image
            style={tw`w-65 self-center mt-20`}
            resizeMode="contain"
            source={require('@assets/logo.png')}
          />
          <View>
            <Text
              style={[
                {
                  fontFamily: 'nunito-SemiBold',
                  color: colors.blue,
                  fontSize: 25,
                  alignSelf: 'center',
                },
              ]}
            >
              Notary Id
            </Text>
            <Input
              keyboardType="number-pad"
              state={inputVal ?? 0}
              setState={setInputVal}
              placeholder="Notary Id"
            />
          </View>
          <Text
            style={{
              fontFamily: 'nunito-SemiBold',
              color: colors.blue,
              fontSize: 25,
              alignSelf: 'center',
            }}
          >
            License Document
          </Text>
          {/* <Text
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
          </Text> */}
          <UploadView documents={documents} setDocuments={setDocuments} />
          <Text
            style={{
              fontFamily: 'nunito-SemiBold',
              color: colors.blue,
              fontSize: 25,
              alignSelf: 'center',
            }}
          >
            VerifyIdentity Document
          </Text>
          <UploadView documents={verifyDocument} setDocuments={setVerifyDocument} />
          <GreenButton loading={loading} text={'Next'} onPress={fetchData} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LicenseDocument;
