import HomeHeader from '@components/HomeHeader';
import RequestMessage from '@components/RequestMessage';
import RequestReason from '@components/RequestReason';
import RequestRecipient from '@components/RequestRecipient';
import UploadView from '@components/UploadView';
import { useNavigation, useRoute } from '@react-navigation/native';
import { selectAccessToken } from '@stores/slices/UserSlice';
import { useStripe } from '@stripe/stripe-react-native';
import { RootStackScreenProps } from '@type/index';
import { colors } from '@utils/Colors';
import axios from 'axios';
import FormData from 'form-data';
import React, { useEffect, useState } from 'react';
import { Alert, Image, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Dialog, Portal, ProgressBar, Text } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { IRequest } from 'src/types/request';
import tw from 'twrnc';

interface uploadType {
  uri: string;
  name: string;
  type: 'image' | 'video' | undefined | string;
}
const CreateARequest = () => {
  const accessToken = useSelector(selectAccessToken);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const navigation = useNavigation<RootStackScreenProps<'CreateARequest'>['navigation']>();
  const route = useRoute<RootStackScreenProps<'CreateARequest'>['route']>();
  const From = route.params?.From;
  const notaryName = route.params?.Notary;
  const [documents, setDocuments] = useState<uploadType[]>(new Array());
  const [progress, setProgress] = useState(0.2);
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  const [value, setValue] = React.useState('Reason');
  const [previousDisabled, setPreviousDisabled] = useState(true);
  const [nextDisabled, setNextDisabled] = useState(false);
  const [visible, setVisible] = React.useState(false);
  const showDialog = () => setVisible(true);

  const hideDialog = () => {
    setVisible(false);
    navigation.navigate('Home');
  };

  const [data, setData] = useState<IRequest>({
    notary_id: '',
    reasonOfRequest: '1',
    requestDate: '',
    requestTime: '1',
    requestLocation: '1',
    requestMessage: 'Message Demo',
    numOfRecipients: 0,
    Recipients: [],
  });

  useEffect(() => {
    if (From === 'Address') {
      setProgress(0.8);
      setValue('Message');
      setNextDisabled(true);
      setPreviousDisabled(false);
    }
    if (notaryName) {
      setData((prev) => ({ ...prev, notary_id: notaryName }));
    }
  }, []);
  const sendData = () => {
    setLoading(true);
    let formData = new FormData();
    formData.append('notary_id', data.notary_id);
    formData.append('reasonOfRequest', data.reasonOfRequest);
    formData.append('requestDate', data.requestDate);
    formData.append('requestTime', data.requestTime);
    formData.append('requestLocation', data.requestLocation);
    formData.append('requestMessage', data.requestMessage);
    formData.append('numOfRecipients', data.numOfRecipients);

    data.Recipients.forEach((item, index) => {
      {
        formData.append('recipients_update_id[' + index + ']', item.recipients_update_id);
        formData.append('recName[' + index + ']', item.recName);
        formData.append('recEmail[' + index + ']', item.recEmail);
        formData.append('sign_type[' + index + ']', item.sign_type);
        formData.append('hostName[' + index + ']', item.hostName);
        formData.append('hostEmail[' + index + ']', item.hostEmail);
        formData.append('access_code[' + index + ']', item.access_code);
        formData.append('private_message[' + index + ']', item.private_message);
        formData.append('signingOrderInput[' + index + ']', item.id);
      }
    });

    [...documents].forEach((image, index) => {
      // formData.append('photosID[' + index + ']', '0');
      formData.append('documents[]', image, `image${index + 1}.png`);
    });

    let headers = {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'multipart/form-data',
    };

    axios
      .post('https://docudash.net/api/create-request', formData, { headers })
      .then((response) => {
        setLoading(false);
        const {
          status,
          message,
          NotaryRequestsReturnID,
          amount,
        }: {
          status: boolean;
          NotaryRequestsReturnID: string;
          amount: number;
          message: {
            emailSubject: string[];
            emailMessage: string[];
            'recName.0': string[];
            'photos.0': string[];
          };
        } = response.data;
        console.log(response.data);

        if (status) {
          createRequestPayment(NotaryRequestsReturnID, amount);
          // showDialog();
          // navigation.replace('DocumentEditor', {
          //   Envelope: generateSignature,
          // });
        } else {
          for (const [key, value] of Object.entries(message)) {
            alert(value);
          }
          console.log(JSON.stringify(response.data));
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log('error', error);
      });
  };
  const initializePaymentSheet = async (data) => {
    console.log('initializePaymentSheet', data);

    setLoading(true);
    // const { paymentIntent, ephemeralKey, customer } = await fetchPaymentSheetParams();

    const { error } = await initPaymentSheet({
      merchantDisplayName: 'Docudash, Inc.',
      customerId: data.detailsArr.customer,
      customerEphemeralKeySecret: data.detailsArr.phemeralKey,
      paymentIntentClientSecret: data.detailsArr.paymentIntent,
      // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
      //methods that complete payment after a delay, like SEPA Debit and Sofort.
      allowsDelayedPaymentMethods: true,
      defaultBillingDetails: {
        name: 'Jane Doe',
      },
    });
    openPaymentSheet();
    if (!error) {
      setLoading(true);
      //have to implement cancel logic here/ ask sufe
    }
  };
  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      Alert.alert('Success', 'Your order is confirmed!');
      navigation.goBack();
    }
  };
  const createRequestPayment = (NotaryRequestsReturnID: string, amount: number) => {
    let formData = new FormData();
    formData.append('NotaryRequestsReturnID', NotaryRequestsReturnID);
    formData.append('amount', amount);
    let headers = {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'multipart/form-data',
    };
    axios
      .post('https://docudash.net/api/create-request-payment', formData, { headers })
      .then((response) => {
        setLoading(false);
        console.log('response', response);
        if (response.data.status) {
          console.log(' create-request-payment response', response);
          initializePaymentSheet(response.data);
        }
        // const {
        //   status,
        //   message,
        // }: {
        //   status: boolean;
        //   message: {
        //     emailSubject: string[];
        //     emailMessage: string[];
        //     'recName.0': string[];
        //     'photos.0': string[];
        //   };
        // } = response.data;
        // console.log(response.data);
        // if (status) {
        //   showDialog();
        //   // navigation.replace('DocumentEditor', {
        //   //   Envelope: generateSignature,
        //   // });
        // } else {
        //   for (const [key, value] of Object.entries(message)) {
        //     alert(value);
        //   }
        //   console.log(JSON.stringify(response.data));
        // }
      })
      .catch((error) => {
        setLoading(false);
        console.log('error', error);
      });
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-[${colors.white}]`}>
      <HomeHeader heading={'Create a Request'} />
      <ScrollView>
        <View style={tw`flex gap-3 justify-center items-center`}>
          <Image
            style={tw`w-70 h-30 self-center`}
            resizeMode="contain"
            source={require('@assets/logo.png')}
          />
          <Text variant="titleLarge">Create A Request</Text>
          <Text variant="titleMedium">{value}</Text>
        </View>

        <View style={tw`flex-1 gap-2`}>
          {value === 'Reason' && <RequestReason data={data} setData={setData} />}
          {value === 'Recipient' && <RequestRecipient data={data} setData={setData} />}
          {value === 'Documents' && (
            <UploadView documents={documents} setDocuments={setDocuments} />
          )}
          {value === 'Message' && <RequestMessage data={data} setData={setData} />}
        </View>
      </ScrollView>
      <ProgressBar progress={progress}></ProgressBar>
      <View style={tw`flex-row gap-4 my-4 justify-center`}>
        <Button
          mode="contained"
          disabled={previousDisabled}
          onPress={() => {
            if (value === 'Reason') {
              setProgress(0.2);
            } else if (value === 'Recipient') {
              setPreviousDisabled(true);
              setNextDisabled(false);
              setProgress(0.2);
              setValue('Reason');
            } else if (value === 'Documents') {
              setProgress(0.4);
              setValue('Recipient');
              setNextDisabled(false);
            } else if (value === 'Message') {
              setProgress(0.6);
              setValue('Documents');
              setNextDisabled(false);
            } else {
              setValue('Message');
              // console.log(input);
              navigation.goBack();
            }
          }}
        >
          Previous
        </Button>

        {nextDisabled ? (
          <Button mode="contained" onPress={sendData} disabled={loading} loading={loading}>
            Create Request
          </Button>
        ) : (
          <Button
            mode="contained"
            disabled={nextDisabled}
            onPress={() => {
              if (value === 'Reason') {
                setProgress(0.4);
                setValue('Recipient');
                setNextDisabled(false);
                setPreviousDisabled(false);
              } else if (value === 'Recipient') {
                setProgress(0.6);
                setValue('Documents');
                setNextDisabled(false);
                setPreviousDisabled(false);
              } else if (value === 'Documents') {
                setProgress(0.8);
                setValue('Message');
                setNextDisabled(true);
                setPreviousDisabled(false);
              } else if (value === 'Message') {
                setProgress(0.8);
              } else {
                // console.log(input);
              }
            }}
          >
            Next
          </Button>
        )}
      </View>
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Request Send</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">Request Submitted Soon We Will Contact</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Done</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
};

export default CreateARequest;

const styles = StyleSheet.create({
  heading: tw`text-4 font-bold`,
});
