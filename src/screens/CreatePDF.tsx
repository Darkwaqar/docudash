import { View, Text, TouchableHighlight, SafeAreaView, StyleSheet, Dimensions } from 'react-native';
import React, { useState } from 'react';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Pdf from 'react-native-pdf';
const CreatePDF = () => {
  const [pdf, setPdf] = useState('');
  const PdfResource = { uri: pdf, cache: true };
  const CreatePdf = async () => {
    let options = {
      html: '<h1>PDF TEST</h1>',
      fileName: 'test',
      directory: 'Documents',
    };

    let file = await RNHTMLtoPDF.convert(options);
    // console.log(file.filePath);
    // alert(file.filePath);
    setPdf(file.filePath);
    // console.log('file.filePath', file.filePath);
  };

  return (
    <SafeAreaView>
      {pdf ? (
        <Pdf
          trustAllCerts={false}
          source={PdfResource}
          style={styles.pdf}
          onLoadComplete={(numberOfPages, filePath) => {
            // console.log(`number of pages: ${numberOfPages}`);
          }}
        />
      ) : (
        <TouchableHighlight onPress={CreatePdf}>
          <Text>Create PDF</Text>
        </TouchableHighlight>
      )}
    </SafeAreaView>
  );
};

export default CreatePDF;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 25,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
