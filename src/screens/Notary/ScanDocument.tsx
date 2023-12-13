import React, { useState, useEffect } from 'react';
import { Alert, Image, PermissionsAndroid, Platform, Text } from 'react-native';
import DocumentScanner from 'react-native-document-scanner-plugin';

const ScanDocument = () => {
  const [scannedImage, setScannedImage] = useState<string>();

  // const scanDocument = async () => {
  //   Alert.alert();
  //   // start the document scanner
  //   const { scannedImages } = await DocumentScanner.scanDocument();

  //   // get back an array with scanned image file paths
  //   if (scannedImages && scannedImages.length > 0) {
  //     // set the img src, so we can view the first scanned image
  //     console.log('scannedImages[0]', scannedImages[0]);

  //     setScannedImage(scannedImages[0]);
  //   }
  // };
  const scanDocument = async () => {
    // prompt user to accept camera permission request if they haven't already
    if (
      Platform.OS === 'android' &&
      (await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA)) !==
        PermissionsAndroid.RESULTS.GRANTED
    ) {
      Alert.alert('Error', 'User must grant camera permissions to use document scanner.');
      return;
    }

    // start the document scanner
    const { scannedImages } = await DocumentScanner.scanDocument();
    console.log('scannedImages', scannedImages);

    // get back an array with scanned image file paths
    if (scannedImages.length > 0) {
      // set the img src, so we can view the first scanned image
      setScannedImage(scannedImages[0]);
    }
  };
  useEffect(() => {
    // call scanDocument on load
    scanDocument();
  }, []);
  return (
    <>
      {scannedImage && (
        <Image
          resizeMode="contain"
          style={{ width: '100%', height: '100%' }}
          source={{ uri: scannedImage }}
        />
      )}
    </>
    // <Text>Hi</Text>
  );
};

export default ScanDocument;
