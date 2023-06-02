import {
  View,
  Text,
  Touchable,
  TouchableOpacity,
  FlatList,
  Pressable,
  StyleSheet,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as DocumentPicker from "expo-document-picker";
import tw from "twrnc";
import FileItem from "../components/FileItem";
import * as FileSystem from "expo-file-system";
import AntDesign from "@expo/vector-icons/AntDesign";
const { width, height } = Dimensions.get("window");
export default function DocumentList() {
  const [documents, setDocuments] = useState<FileSystem.FileInfo[]>([]);
  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: false,
      type: "application/pdf",
    });
    copyFileToAppDirectory(result);
  };
  const copyFileToAppDirectory = async (
    result: DocumentPicker.DocumentResult
  ) => {
    try {
      // Get the source file URI
      // @ts-ignore
      const sourceUri = result.uri; // Replace with the actual file URI

      // Read the PDF file
      const fileInfo = await FileSystem.getInfoAsync(
        FileSystem.documentDirectory + "docudash"
      );
      const { exists, uri } = fileInfo;

      if (!exists) {
        await FileSystem.makeDirectoryAsync(
          FileSystem.documentDirectory + "docudash"
        );
      }
      //filename
      const decodedUri = decodeURIComponent(sourceUri);
      const fileName = decodedUri.substring(decodedUri.lastIndexOf("/") + 1);
      // Create a destination file URI in the application's document directory
      const destinationUri = encodeURI(
        FileSystem.documentDirectory + "docudash/" + fileName
      );
      console.log(sourceUri, destinationUri);
      // Copy the file to the application directory
      await FileSystem.copyAsync({
        from: sourceUri,
        to: destinationUri,
      });

      console.log(
        "PDF file copied to the application directory:",
        destinationUri
      );
      listItemsInDirectory();
    } catch (error) {
      console.log("Error copying file:", error);
    }
  };
  const listItemsInDirectory = async () => {
    setDocuments([]);
    const directoryUri = FileSystem.documentDirectory + "docudash";
    try {
      // Read the directory contents
      const dirInfo = await FileSystem.readDirectoryAsync(directoryUri);

      // Loop through the directory contents
      for (let i = 0; i < dirInfo.length; i++) {
        const itemUri = `${directoryUri}/${dirInfo[i]}`;

        // Read each item in the directory
        const itemInfo = await FileSystem.getInfoAsync(itemUri);

        if (!itemInfo.isDirectory) {
          setDocuments((prev) => [...prev, itemInfo]);
        }
        // Log the item name and type
        // console.log('Item:', dirInfo[i]);
        // console.log('Type:', itemInfo.isDirectory ? 'Directory' : 'File');
      }
    } catch (error) {
      console.log("Error listing directory:", error);
    }
  };
  useEffect(() => {
    listItemsInDirectory();
  }, []);

  return (
    <View style={tw`flex-1 bg-white items-center justify-center`}>
      <TouchableOpacity onPress={pickDocument}>
        <Text
          style={tw` p-4 mt-2 border rounded-lg overflow-hidden  bg-[#6FAC46] border-gray-300`}
        >
          Add a document
        </Text>
      </TouchableOpacity>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 15,
          justifyContent: "center",
          backgroundColor: "white",
        }}
      >
        <View style={styles.box}>
          <Text style={[styles.box_text, { fontSize: 25 }]}>
            {documents.length}
          </Text>
          <Text style={styles.box_text}>Documents uploaded</Text>
        </View>
        <View style={styles.box}>
          <Text style={[styles.box_text, { fontSize: 25 }]}>0</Text>
          <Text style={styles.box_text}>Documents Signed</Text>
        </View>
      </View>

      {/* <View
        style={{
          flex: 1,
          justifyContent: "center",
          backgroundColor: "white",
          alignItems: "center",
        }}
      >
        {documents.length > 0 ? (
          <FlatList
            data={documents}
            renderItem={({ item }) => <FileItem item={item}></FileItem>}
          />
        ) : (
          <Pressable style={{ alignItems: "center" }} onPress={pickDocument}>
            <AntDesign name="pluscircleo" size={50} color="gray" />
            <Text
              style={{
                marginTop: 10,
                color: "gray",
                fontSize: 16,
              }}
            >
              Add a document
            </Text>
          </Pressable>
        )}
      </View> */}
      <FlatList
        data={documents}
        renderItem={({ item }) => <FileItem item={item}></FileItem>}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  menu_text: {
    fontSize: 18,
    marginTop: 2,
    padding: 5,
    color: "black",
  },
  box: {
    borderWidth: 1,
    width: width / 2 - 25,
    padding: 5,
    alignItems: "center",
    marginHorizontal: 10,
    height: 120,
    justifyContent: "center",
    borderColor: "gray",
    borderRadius: 10,
  },
  box_text: {
    textAlign: "center",
    marginTop: 5,
    color: "black",
  },
});
