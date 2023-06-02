import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Image,
  SafeAreaView,
  TouchableHighlight,
  Text,
} from "react-native";
import { Appbar } from "react-native-paper";
import Pdf from "react-native-pdf";
import { DocumentNavigationProps, DocumentRouteProps } from "../types";
import { DragResizeBlock, DragResizeContainer } from "react-native-drag-resize";
const WIN_WIDTH = Dimensions.get("window").width;
const WIN_HEIGHT = Dimensions.get("window").height;

export default function PDFViewer() {
  const navigation = useNavigation<DocumentNavigationProps<"PDFViewer">>();
  const route = useRoute<DocumentRouteProps<"PDFViewer">>();
  const pdfPath = decodeURI(route.params?.path);
  const source = { uri: pdfPath };
  // const source = {
  //   uri: "http://samples.leanpub.com/thereactnativebook-sample.pdf",
  // };
  const pdf = useRef();
  const [state, setState] = useState({
    page: 1,
    scale: 1,
    numberOfPages: 0,
    horizontal: false,
    width: WIN_WIDTH,
  });
  // const pdfPath = route.params?.path; route.params?.path;

  const prePage = () => {
    let prePage = state.page > 1 ? state.page - 1 : 1;
    pdf.current.setPage(prePage);
    console.log(`prePage: ${prePage}`);
  };

  const nextPage = () => {
    let nextPage =
      state.page + 1 > state.numberOfPages
        ? state.numberOfPages
        : state.page + 1;
    pdf.current.setPage(nextPage);
    console.log(`nextPage: ${nextPage}`);
  };

  const zoomOut = () => {
    let scale = state.scale > 1 ? state.scale / 1.2 : 1;
    setState((prev) => ({ ...prev, scale: scale }));
    // setState({ ...state, scale: scale });
    console.log(`zoomOut scale: ${scale}`);
  };

  const zoomIn = () => {
    let scale = state.scale * 1.2;
    scale = scale > 3 ? 3 : scale;
    setState({ ...state, scale: scale });
    console.log(`zoomIn scale: ${scale}`);
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flexDirection: "row" }}>
        <TouchableHighlight
          disabled={state.page === 1}
          style={state.page === 1 ? styles.btnDisable : styles.btn}
          onPress={() => prePage()}
        >
          <Text style={styles.btnText}>{"-"}</Text>
        </TouchableHighlight>
        <View style={styles.btnText}>
          <Text style={styles.btnText}>Page</Text>
        </View>
        <TouchableHighlight
          disabled={state.page === state.numberOfPages}
          style={
            state.page === state.numberOfPages ? styles.btnDisable : styles.btn
          }
          testID="NextPage"
          onPress={() => nextPage()}
        >
          <Text style={styles.btnText}>{"+"}</Text>
        </TouchableHighlight>
        <TouchableHighlight
          disabled={state.scale === 1}
          style={state.scale === 1 ? styles.btnDisable : styles.btn}
          onPress={() => zoomOut()}
        >
          <Text style={styles.btnText}>{"-"}</Text>
        </TouchableHighlight>
        <View style={styles.btnText}>
          <Text style={styles.btnText}>Scale</Text>
        </View>
        <TouchableHighlight
          disabled={state.scale >= 3}
          style={state.scale >= 3 ? styles.btnDisable : styles.btn}
          onPress={() => zoomIn()}
        >
          <Text style={styles.btnText}>{"+"}</Text>
        </TouchableHighlight>
        <View style={styles.btnText}>
          <Text style={styles.btnText}>{"Horizontal:"}</Text>
        </View>
      </View>
      <View style={{ flex: 1, width: state.width, backgroundColor: "red" }}>
        <Pdf
          ref={pdf}
          source={source}
          scale={state.scale}
          // horizontal
          onLoadComplete={(
            numberOfPages,
            filePath,
            { width, height },
            tableContents
          ) => {
            setState({ ...state, numberOfPages: numberOfPages });
            console.log(`total page count: ${numberOfPages}`);
            console.log(`width: ${width}`);
            console.log(`height: ${height}`);
            console.log(tableContents);
          }}
          onPageChanged={(page, numberOfPages) => {
            setState({ ...state, page: page });
            console.log(`current page: ${page}`);
          }}
          onError={(error) => {
            console.log(error);
          }}
          style={{ flex: 1 }}
        />
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 25,
  },
  btn: {
    margin: 2,
    padding: 2,
    backgroundColor: "aqua",
  },
  btnDisable: {
    margin: 2,
    padding: 2,
    backgroundColor: "gray",
  },
  btnText: {
    margin: 2,
    padding: 2,
  },
});
